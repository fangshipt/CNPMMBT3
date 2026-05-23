import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    sender: { type: String, enum: ['user', 'admin'], required: true },
    text: { type: String, required: true },
    read: { type: Boolean, default: false },
}, { timestamps: true });

const chatSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    messages: [messageSchema],
    unreadByAdmin: { type: Number, default: 0 },
    lastMessageAt: { type: Date },
}, { timestamps: true });

chatSchema.index({ lastMessageAt: -1 });

const Chat = mongoose.model('Chat', chatSchema);
export default Chat;
