import React, {useState} from 'react';
import Chat from "@/components/Chat/Chat.tsx";
import {type ChatItem, useWebSocket} from "@/hooks/Chat/useWebSocket.ts";

// interface ChatInfo {
//     userEmail: string;
//     username: string;
//     lastMessage: string;
// }
//
// const dummyChats: ChatInfo[] = [
//     {
//         userEmail: 'john@example.com',
//         username: 'John',
//         lastMessage: 'Can you help me with my order?',
//         timestamp: '2025-06-07T10:45:00Z',
//     },
//     {
//         userEmail: 'jane@example.com',
//         username: 'Jane',
//         lastMessage: 'Thanks for the support!',
//         timestamp: '2025-06-07T09:30:00Z',
//     },
// ];

interface ChatProps {
    onClick: () => void;
    isSelected: boolean;
    chat: ChatItem;
}

export const ChatListItem: React.FC<ChatProps> = ({ chat, onClick, isSelected }) => {
    return (
        <div
            onClick={onClick}
            className={`p-3 rounded-md cursor-pointer hover:bg-purple-600/20 ${
                isSelected ? 'bg-blue-200 font-semibold' : ''
            }`}
        >
            <div>{chat.username}</div>
            <div className="text-xs text-gray-500 truncate">{chat.lastMessage}</div>
        </div>
    );
};

const AdminChatWrapper = () => {
    const [adminChats, setAdminChats] = useState<ChatItem[]>([]);
    const [currentSelectedChat, setCurrentSelectedChat] = useState<string | null>(null);

    console.log('[admin chats]', adminChats)

    return (
        <div className="flex h-screen">
            {/* Left: Chat Picker */}
            <div className="w-72 border-r bg-black/20 p-4">
                <h2 className="text-lg font-bold mb-4">Active Chats</h2>
                <div className="h-[calc(100vh-5rem)]">
                    {adminChats.map((chat) => (
                        <ChatListItem
                            key={chat.userEmail}
                            chat={chat}
                            // onClick={() => setSelectedChat(chat)}
                            // isSelected={selectedChat?.userEmail === chat.userEmail}
                            onClick={() => setCurrentSelectedChat(chat.chatId)}
                            isSelected={false}
                        />
                    ))}
                </div>
            </div>

            {/* Right: Chat Component */}
            <div className="flex-1">
                    <Chat
                        selectedChatId={currentSelectedChat}
                        onUpdateAdminChats={(chats) => setAdminChats(chats)}
                    />
            </div>
        </div>
    );
};

export default AdminChatWrapper;