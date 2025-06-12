import React, {useMemo, useState} from 'react';
import Chat from "@/components/Chat/Chat.tsx";
import {type ChatItem} from "@/hooks/Chat/useWebSocket.ts";

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
                isSelected ? 'bg-blue-800/20 font-semibold' : ''
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
    const [searchText, setSearchText] = useState<string>('');

    const selectedChat = useMemo(() => {
        return adminChats.find(chat => chat.chatId === currentSelectedChat);
    }, [currentSelectedChat]) // do not add adminChats dependency here, because sometimes adminChats
    // may not have your current selected chat (when you search by name or email and chats are filtered)

    return (
        <div className="flex h-screen">
            {/* Left: Chat Picker */}
            <div className="w-72 border-r bg-black/20 p-4">
                <h2 className="text-lg font-bold mb-4">Chats with clients</h2>
                <input
                    type="text"
                    placeholder="Search by email or name"
                    className="w-full mb-4 px-3 py-2 rounded-md bg-gray-400/20 border-white/30 border-1 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-800 text-sm"
                    onChange={(e) => setSearchText(e.target.value)}
                />

                <div className="h-[calc(100vh-5rem)]">
                    {adminChats.map((chat) => (
                        <ChatListItem
                            key={chat.userEmail}
                            chat={chat}
                            // onClick={() => setSelectedChat(chat)}
                            isSelected={currentSelectedChat === chat.chatId}
                            onClick={() => setCurrentSelectedChat(chat.chatId)}
                        />
                    ))}
                </div>
            </div>

            {/* Right: Chat Component */}
            <div className="flex-1">
                    <Chat
                        selectedChatId={currentSelectedChat}
                        onUpdateAdminChats={(chats) => setAdminChats(chats)}
                        searchText={searchText}
                        currentSelectedChat={selectedChat}
                    />
            </div>
        </div>
    );
};

export default AdminChatWrapper;