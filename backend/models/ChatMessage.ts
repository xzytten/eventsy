// models/Message.ts
import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
    chatId: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat', required: true },
    sender: {
        email: { type: String, required: true },
        username: { type: String, required: true }
    },
    text: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    viewedByAdmin: { type: Boolean, required: true, default: false },
});

export const Message = mongoose.model('Message', MessageSchema);
