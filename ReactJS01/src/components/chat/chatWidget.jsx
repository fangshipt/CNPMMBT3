import { useState, useEffect, useRef, useContext } from 'react';
import { Input, Button, Badge } from 'antd';
import { SendOutlined, CloseOutlined, MessageOutlined } from '@ant-design/icons';
import { AuthContext } from '../context/authContext';
import { getUserChatApi, sendUserMessageApi } from '../../util/api';

function ChatWidget() {
    const { auth } = useContext(AuthContext);
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const [sending, setSending] = useState(false);
    const [unread, setUnread] = useState(0);
    const bottomRef = useRef(null);
    const pollRef = useRef(null);

    const loadChat = async () => {
        const res = await getUserChatApi();
        if (res?.EC === 0 && res.data) {
            setMessages(res.data.messages || []);
            if (!open) {
                const newUnread = (res.data.messages || []).filter(m => m.sender === 'admin' && !m.read).length;
                setUnread(newUnread);
            }
        }
    };

    useEffect(() => {
        if (!auth.isAuthenticated || auth.user?.role === 'admin') return;
        loadChat();
        pollRef.current = setInterval(loadChat, 8000);
        return () => clearInterval(pollRef.current);
    }, [auth.isAuthenticated]);

    useEffect(() => {
        if (open) {
            setUnread(0);
            loadChat();
            bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [open]);

    useEffect(() => {
        if (open) bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async () => {
        const text = inputText.trim();
        if (!text || sending) return;
        setSending(true);
        setInputText('');
        const res = await sendUserMessageApi(text);
        if (res?.EC === 0 && res.data) {
            setMessages(res.data.messages || []);
        }
        setSending(false);
    };

    if (!auth.isAuthenticated || auth.user?.role === 'admin') return null;

    return (
        <>
            {/* Floating button */}
            <div
                style={{
                    position: 'fixed',
                    bottom: 28,
                    right: 28,
                    zIndex: 1000,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                    gap: 12,
                }}
            >
                {/* Chat window */}
                {open && (
                    <div style={{
                        width: 340,
                        maxHeight: 480,
                        background: '#fff',
                        borderRadius: 18,
                        boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden',
                        border: '1px solid #e8ddd5',
                    }}>
                        {/* Header */}
                        <div style={{
                            background: 'linear-gradient(135deg, #3D2B1F, #5a4a3f)',
                            padding: '14px 16px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#DEAD6F', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>
                                    🐾
                                </div>
                                <div>
                                    <div style={{ color: '#fff', fontWeight: 600, fontSize: '0.92rem' }}>FangShi Pet Shop</div>
                                    <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.73rem' }}>Hỗ trợ khách hàng</div>
                                </div>
                            </div>
                            <Button
                                type="text"
                                icon={<CloseOutlined />}
                                style={{ color: '#fff' }}
                                onClick={() => setOpen(false)}
                                size="small"
                            />
                        </div>

                        {/* Messages */}
                        <div style={{
                            flex: 1,
                            overflowY: 'auto',
                            padding: '12px 14px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 8,
                            minHeight: 280,
                            maxHeight: 320,
                            background: '#faf6f0',
                        }}>
                            {messages.length === 0 && (
                                <div style={{ textAlign: 'center', color: '#8a7060', fontSize: '0.85rem', marginTop: 20 }}>
                                    <div style={{ fontSize: '2rem', marginBottom: 8 }}>👋</div>
                                    Xin chào! Chúng tôi có thể giúp gì cho bạn?
                                </div>
                            )}
                            {messages.map((msg, idx) => {
                                const isUser = msg.sender === 'user';
                                return (
                                    <div key={idx} style={{ display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start' }}>
                                        <div style={{
                                            maxWidth: '78%',
                                            padding: '8px 13px',
                                            borderRadius: isUser ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                                            background: isUser ? '#ff6b35' : '#fff',
                                            color: isUser ? '#fff' : '#3a2e28',
                                            fontSize: '0.87rem',
                                            lineHeight: 1.5,
                                            boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                                        }}>
                                            {msg.text}
                                        </div>
                                    </div>
                                );
                            })}
                            <div ref={bottomRef} />
                        </div>

                        {/* Input */}
                        <div style={{ padding: '10px 12px', borderTop: '1px solid #f0e8df', display: 'flex', gap: 8 }}>
                            <Input
                                placeholder="Nhập tin nhắn..."
                                value={inputText}
                                onChange={e => setInputText(e.target.value)}
                                onPressEnter={handleSend}
                                style={{ borderRadius: 20 }}
                                size="middle"
                            />
                            <Button
                                type="primary"
                                icon={<SendOutlined />}
                                onClick={handleSend}
                                loading={sending}
                                style={{ borderRadius: '50%', width: 38, height: 38, padding: 0, flexShrink: 0 }}
                            />
                        </div>
                    </div>
                )}

                {/* Toggle button */}
                <Badge count={unread} offset={[-4, 4]}>
                    <button
                        onClick={() => setOpen(v => !v)}
                        style={{
                            width: 56,
                            height: 56,
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #ff6b35, #ff9a5c)',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 4px 16px rgba(255,107,53,0.45)',
                            transition: 'transform 0.2s',
                        }}
                        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
                        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        <MessageOutlined style={{ fontSize: '1.5rem', color: '#fff' }} />
                    </button>
                </Badge>
            </div>
        </>
    );
}

export default ChatWidget;
