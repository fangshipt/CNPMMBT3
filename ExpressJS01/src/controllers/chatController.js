import Chat from '../models/chat.js';

export const getUserChat = async (req, res) => {
    try {
        let chat = await Chat.findOne({ user: req.user._id });
        if (!chat) {
            chat = await Chat.create({ user: req.user._id, messages: [], lastMessageAt: new Date() });
        }
        // Mark admin messages as read when user opens chat
        let changed = false;
        chat.messages.forEach(m => {
            if (m.sender === 'admin' && !m.read) { m.read = true; changed = true; }
        });
        if (changed) await chat.save();
        return res.json({ EC: 0, data: chat });
    } catch (e) {
        return res.status(500).json({ EC: 1, EM: e.message });
    }
};

export const sendUserMessage = async (req, res) => {
    try {
        const { text } = req.body;
        if (!text?.trim()) return res.status(400).json({ EC: 1, EM: 'Nội dung không được trống' });
        let chat = await Chat.findOne({ user: req.user._id });
        if (!chat) chat = new Chat({ user: req.user._id, messages: [], unreadByAdmin: 0 });
        chat.messages.push({ sender: 'user', text: text.trim() });
        chat.unreadByAdmin = (chat.unreadByAdmin || 0) + 1;
        chat.lastMessageAt = new Date();
        await chat.save();
        return res.json({ EC: 0, data: chat });
    } catch (e) {
        return res.status(500).json({ EC: 1, EM: e.message });
    }
};

// Admin
export const getAllChats = async (req, res) => {
    try {
        const chats = await Chat.find()
            .populate('user', 'fullName email avatar')
            .sort({ lastMessageAt: -1 })
            .select('user unreadByAdmin lastMessageAt messages');
        // Return with last message preview
        const result = chats.map(c => ({
            _id: c._id,
            user: c.user,
            unreadByAdmin: c.unreadByAdmin,
            lastMessageAt: c.lastMessageAt,
            lastMessage: c.messages[c.messages.length - 1] || null,
            messageCount: c.messages.length,
        }));
        return res.json({ EC: 0, data: result });
    } catch (e) {
        return res.status(500).json({ EC: 1, EM: e.message });
    }
};

export const getAdminChatByUser = async (req, res) => {
    try {
        const chat = await Chat.findOne({ user: req.params.userId })
            .populate('user', 'fullName email avatar');
        if (!chat) return res.json({ EC: 0, data: null });
        // Mark user messages as read from admin side
        chat.unreadByAdmin = 0;
        await chat.save();
        return res.json({ EC: 0, data: chat });
    } catch (e) {
        return res.status(500).json({ EC: 1, EM: e.message });
    }
};

export const adminReply = async (req, res) => {
    try {
        const { text } = req.body;
        if (!text?.trim()) return res.status(400).json({ EC: 1, EM: 'Nội dung không được trống' });
        const chat = await Chat.findOne({ user: req.params.userId });
        if (!chat) return res.status(404).json({ EC: 1, EM: 'Không tìm thấy cuộc trò chuyện' });
        chat.messages.push({ sender: 'admin', text: text.trim() });
        chat.lastMessageAt = new Date();
        await chat.save();
        return res.json({ EC: 0, data: chat });
    } catch (e) {
        return res.status(500).json({ EC: 1, EM: e.message });
    }
};
