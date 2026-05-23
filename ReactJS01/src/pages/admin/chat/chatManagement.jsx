import { useState, useEffect, useRef } from 'react';
import { Badge, Input, Button, Spin, Avatar } from 'antd';
import { SendOutlined, UserOutlined } from '@ant-design/icons';
import { getAllChatsApi, getAdminChatApi, adminReplyApi } from '../../../util/api';

function ChatManagement() {
    const [conversations, setConversations] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [chat, setChat] = useState(null);
    const [inputText, setInputText] = useState('');
    const [sending, setSending] = useState(false);
    const [loadingList, setLoadingList] = useState(true);
    const [loadingChat, setLoadingChat] = useState(false);
    const bottomRef = useRef(null);
    const pollRef = useRef(null);

    const loadList = async () => {
        const res = await getAllChatsApi();
        if (res?.EC === 0) setConversations(res.data);
        setLoadingList(false);
    };

    const loadChat = async (userId) => {
        if (!userId) return;
        setLoadingChat(true);
        const res = await getAdminChatApi(userId);
        if (res?.EC === 0) setChat(res.data);
        setLoadingChat(false);
    };

    useEffect(() => {
        loadList();
        const interval = setInterval(loadList, 10000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (selectedUserId) {
            loadChat(selectedUserId);
            clearInterval(pollRef.current);
            pollRef.current = setInterval(() => loadChat(selectedUserId), 8000);
        }
        return () => clearInterval(pollRef.current);
    }, [selectedUserId]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chat]);

    const handleSelect = (userId) => {
        setSelectedUserId(userId);
        setInputText('');
        setConversations(prev => prev.map(c => c.user._id === userId ? { ...c, unreadByAdmin: 0 } : c));
    };

    const handleSend = async () => {
        const text = inputText.trim();
        if (!text || !selectedUserId || sending) return;
        setSending(true);
        setInputText('');
        const res = await adminReplyApi(selectedUserId, text);
        if (res?.EC === 0) setChat(res.data);
        setSending(false);
    };

    const formatTime = (d) => {
        if (!d) return '';
        const date = new Date(d);
        const now = new Date();
        const diffMs = now - date;
        if (diffMs < 60000) return 'Vừa xong';
        if (diffMs < 3600000) return `${Math.floor(diffMs / 60000)} phút trước`;
        if (diffMs < 86400000) return `${Math.floor(diffMs / 3600000)} giờ trước`;
        return date.toLocaleDateString('vi-VN');
    };

    return (
        <div>
            <h4 className="mb-4" style={{ color: '#3a2e28', fontWeight: 700 }}>Quản lý Chat</h4>
            <div style={{ display: 'flex', gap: 16, height: 'calc(100vh - 180px)', minHeight: 480 }}>
                {/* Sidebar - conversations */}
                <div style={{
                    width: 280,
                    flexShrink: 0,
                    background: '#fff',
                    borderRadius: 14,
                    overflow: 'hidden',
                    boxShadow: '0 1px 6px rgba(0,0,0,0.07)',
                    display: 'flex',
                    flexDirection: 'column',
                }}>
                    <div style={{ padding: '16px', borderBottom: '1px solid #f0e8df', fontWeight: 600, color: '#3a2e28', fontSize: '0.9rem' }}>
                        Cuộc trò chuyện ({conversations.length})
                    </div>
                    <div style={{ flex: 1, overflowY: 'auto' }}>
                        {loadingList ? (
                            <div style={{ padding: 24, textAlign: 'center' }}><Spin /></div>
                        ) : conversations.length === 0 ? (
                            <div style={{ padding: 24, textAlign: 'center', color: '#8a7060', fontSize: '0.85rem' }}>
                                Chưa có tin nhắn nào
                            </div>
                        ) : (
                            conversations.map(conv => {
                                const isSelected = selectedUserId === conv.user?._id;
                                return (
                                    <div
                                        key={conv._id}
                                        onClick={() => handleSelect(conv.user?._id)}
                                        style={{
                                            padding: '12px 16px',
                                            cursor: 'pointer',
                                            background: isSelected ? '#faf0e8' : 'transparent',
                                            borderLeft: isSelected ? '3px solid #ff6b35' : '3px solid transparent',
                                            transition: 'all 0.2s',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 10,
                                        }}
                                    >
                                        <Badge count={conv.unreadByAdmin} size="small">
                                            <Avatar icon={<UserOutlined />} style={{ background: '#DEAD6F', flexShrink: 0 }} size={38} />
                                        </Badge>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ fontWeight: conv.unreadByAdmin > 0 ? 700 : 500, fontSize: '0.88rem', color: '#3a2e28', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                {conv.user?.fullName || conv.user?.email || 'Khách hàng'}
                                            </div>
                                            <div style={{ fontSize: '0.78rem', color: '#8a7060', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                {conv.lastMessage?.text || 'Chưa có tin nhắn'}
                                            </div>
                                        </div>
                                        <div style={{ fontSize: '0.7rem', color: '#aaa', flexShrink: 0 }}>
                                            {formatTime(conv.lastMessageAt)}
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Chat area */}
                <div style={{
                    flex: 1,
                    background: '#fff',
                    borderRadius: 14,
                    overflow: 'hidden',
                    boxShadow: '0 1px 6px rgba(0,0,0,0.07)',
                    display: 'flex',
                    flexDirection: 'column',
                }}>
                    {!selectedUserId ? (
                        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8a7060', flexDirection: 'column', gap: 10 }}>
                            <iconify-icon icon="ph:chat-circle" style={{ fontSize: '3rem', color: '#ddd' }}></iconify-icon>
                            <span style={{ fontSize: '0.9rem' }}>Chọn một cuộc trò chuyện để bắt đầu</span>
                        </div>
                    ) : (
                        <>
                            {/* Chat header */}
                            {chat && (
                                <div style={{ padding: '14px 20px', borderBottom: '1px solid #f0e8df', display: 'flex', alignItems: 'center', gap: 12 }}>
                                    <Avatar icon={<UserOutlined />} style={{ background: '#DEAD6F' }} size={36} />
                                    <div>
                                        <div style={{ fontWeight: 600, color: '#3a2e28', fontSize: '0.92rem' }}>
                                            {chat.user?.fullName || chat.user?.email}
                                        </div>
                                        <div style={{ fontSize: '0.75rem', color: '#8a7060' }}>{chat.user?.email}</div>
                                    </div>
                                </div>
                            )}

                            {/* Messages */}
                            <div style={{
                                flex: 1,
                                overflowY: 'auto',
                                padding: '16px 20px',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 10,
                                background: '#faf6f0',
                            }}>
                                {loadingChat ? (
                                    <div style={{ textAlign: 'center', padding: 40 }}><Spin /></div>
                                ) : !chat || chat.messages?.length === 0 ? (
                                    <div style={{ textAlign: 'center', color: '#8a7060', fontSize: '0.85rem', marginTop: 20 }}>
                                        Chưa có tin nhắn nào
                                    </div>
                                ) : (
                                    chat.messages.map((msg, idx) => {
                                        const isAdmin = msg.sender === 'admin';
                                        return (
                                            <div key={idx} style={{ display: 'flex', justifyContent: isAdmin ? 'flex-end' : 'flex-start', gap: 8, alignItems: 'flex-end' }}>
                                                {!isAdmin && (
                                                    <Avatar icon={<UserOutlined />} size={28} style={{ background: '#DEAD6F', flexShrink: 0, marginBottom: 2 }} />
                                                )}
                                                <div style={{
                                                    maxWidth: '70%',
                                                    padding: '9px 14px',
                                                    borderRadius: isAdmin ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                                                    background: isAdmin ? '#ff6b35' : '#fff',
                                                    color: isAdmin ? '#fff' : '#3a2e28',
                                                    fontSize: '0.87rem',
                                                    lineHeight: 1.55,
                                                    boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                                                }}>
                                                    {msg.text}
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                                <div ref={bottomRef} />
                            </div>

                            {/* Input */}
                            <div style={{ padding: '12px 16px', borderTop: '1px solid #f0e8df', display: 'flex', gap: 10 }}>
                                <Input
                                    placeholder="Nhập tin nhắn trả lời..."
                                    value={inputText}
                                    onChange={e => setInputText(e.target.value)}
                                    onPressEnter={handleSend}
                                    style={{ borderRadius: 22 }}
                                />
                                <Button
                                    type="primary"
                                    icon={<SendOutlined />}
                                    onClick={handleSend}
                                    loading={sending}
                                    style={{ borderRadius: '50%', width: 40, height: 40, padding: 0, flexShrink: 0 }}
                                />
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ChatManagement;
