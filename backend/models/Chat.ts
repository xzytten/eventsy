// models/Chat.ts
import mongoose from 'mongoose';

const ChatSchema = new mongoose.Schema({
    participants: [{ type: String, required: true }],
    createdAt: { type: Date, default: Date.now }
});

export const Chat = mongoose.model('Chat', ChatSchema);