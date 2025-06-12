import React, { useState, useEffect, useRef} from 'react';
import { Wifi, WifiOff, Users, Send } from 'lucide-react';
import {useUserStore} from "@/store/userStore.ts";
import {type ChatItem, type ChatMessage, useWebSocket} from "@/hooks/Chat/useWebSocket.ts";

// Type definitions
interface Message {
    id: string;
    username?: string;
    text: string;
    timestamp: string;
    isOwn?: boolean;
    type?: 'system' | 'message';
}

interface WebSocketMessage {
    type: 'message' | 'join' | 'leave' | 'user_joined' | 'user_left' | 'user_count' | 'chat_history' | 'chats_info' | 'change_chat';
    username?: string;
    text?: string;
    timestamp: string;
    onlineUsers?: number;
    count?: number;
    messages?: Message[];
}
type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'reconnecting' | 'error';

interface ChatProps {
    onUpdateAdminChats?: (chats: ChatItem[]) => void;
    selectedChatId?: string | null;
    searchText?: string;
    currentSelectedChat?: ChatItem;
}
const Chat: React.FC<ChatProps> = ({onUpdateAdminChats, selectedChatId, searchText, currentSelectedChat}) => {
    const user = useUserStore((state) => state.user)

    const [inputMessage, setInputMessage] = useState<string>('');
    const [username, setUsername] = useState<string | undefined>('');
    const [userEmail, setUserEmail] = useState<string | undefined>('');

    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const reconnectAttempts = useRef<number>(0);

    const websocketUrl: string = 'ws://localhost:8087';
    const maxReconnectAttempts: number = 5;

    // Get email from storage on component mount
    useEffect(() => {
        const email = user?.email;
        const name = user?.name;
        setUsername(name);
        setUserEmail(encodeURIComponent(email));
    }, [user]);

    const scrollToBottom = (): void => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    console.log('selected chat]]]', selectedChatId);

    const {
        messages,
        onlineUsers,
        isConnected,
        connectionStatus,
        connect,
        disconnect,
        sendMessage: sendWebsocketMessage,
        clearMessages,
        adminChats,
    } = useWebSocket({
        url: websocketUrl,
        userEmail,
        username,
        maxReconnectAttempts: 5,
        onMessage: (data) => {
            // Custom message handler
            console.log('Received WebSocket message:', data);
        },
        onConnectionChange: (status: ConnectionStatus) => {
            // Handle connection status changes
            console.log('Connection status changed:', status);

            if (status === 'connected') {
                console.log('Successfully connected to chat!');
            } else if (status === 'error') {
                console.error('WebSocket connection error occurred');
            }
        },
        onError: (error) => {
            console.error('WebSocket error:', error);
        },
        selectedChatId,
        searchText
    });

    useEffect(() => {
        if (userEmail && !isConnected) {
            connect();
        }
        // return () => disconnect(); // TODO debug why infinite connect->disconnect->connect
    }, [username, userEmail, connect, isConnected, disconnect]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (onUpdateAdminChats) {
            onUpdateAdminChats(adminChats)
        }
    }, [adminChats, onUpdateAdminChats])

    useEffect(() => {
        sendWebsocketMessage({
            type: 'change_chat',
            text: selectedChatId,
        })
    }, [selectedChatId])

    // useEffect(() => {
    //     return () => {
    //         if (disconnect) disconnect();
    //     }
    // }, [disconnect])

    const sendMessage = (): void => {
        if (!inputMessage.trim() || !isConnected) return;

        const messageData: WebSocketMessage = {
            type: 'message',
            username: username,
            text: inputMessage.trim(),
            timestamp: new Date().toISOString()
        };

        sendWebsocketMessage(messageData);
        setInputMessage('');
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const getStatusColor = (): string => {
        switch (connectionStatus) {
            case 'connected': return 'text-green-500';
            case 'connecting':
            case 'reconnecting': return 'text-yellow-500';
            case 'error': return 'text-red-500';
            default: return 'text-gray-500';
        }
    };

    const getStatusText = (): string => {
        switch (connectionStatus) {
            case 'connected': return 'Connected';
            case 'connecting': return 'Connecting...';
            case 'reconnecting': return `Reconnecting... (${reconnectAttempts.current}/${maxReconnectAttempts})`;
            case 'error': return 'Connection Error';
            default: return 'Disconnected';
        }
    };

    return (
        <div className="max-h-screen min-h-screen flex flex-col">
            {/* Header */}
            <div className="bg-mainbg/80 rounded-t-[20px] shadow-sm border-b px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <h1 className="text-xl font-semibold text-gray-100">Eventsy Chat</h1>
                    <div className="flex items-center gap-2 text-sm">
                        {isConnected ? <Wifi className={getStatusColor()} size={16} /> : <WifiOff className={getStatusColor()} size={16} />}
                        <span className={getStatusColor()}>{getStatusText()}</span>
                    </div>
                    {
                        currentSelectedChat && (
                            <div>
                                {currentSelectedChat.userEmail}
                            </div>
                        )
                    }
                </div>

                <div className="flex items-center gap-4">
                    {
                        user?.role === 'admin' ? (
                            <div className="flex items-center gap-2 text-sm text-gray-200">
                                <Users size={16} />
                                <span>{onlineUsers} online</span>
                            </div>
                        ) : (
                            <div className="text-sm text-gray-300">
                                {username}
                            </div>
                        )
                    }
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-1/2">
                {messages && messages.length === 0 ? (
                    <div className="text-center text-gray-500 mt-8">
                        <p className="text-lg">Welcome to the chat, {username}!</p>
                        <p className="text-sm">Start a conversation by sending a message.</p>
                    </div>
                ) : (
                    messages.map((message: ChatMessage) => (
                        <div key={message.id} className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}>
                            {message.type === 'system' ? (
                                <div className="bg-gray-200 text-gray-600 px-3 py-1 rounded-full text-sm text-center">
                                    {message.text}
                                </div>
                            ) : (
                                <div className={`max-w-xs md:max-w-md px-4 py-2 rounded-lg ${
                                    message.isOwn
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-white/80 text-gray-800 shadow-sm border'
                                }`}>
                                    {!message.isOwn && (
                                        <div className="text-xs font-semibold text-gray-600 mb-1">
                                            {message.username}
                                        </div>
                                    )}
                                    <div className="break-words">{message.text}</div>
                                    <div className={`text-xs mt-1 ${
                                        message.isOwn ? 'text-blue-100' : 'text-gray-500'
                                    }`}>
                                        {new Date(message.timestamp).toLocaleTimeString([], {
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="bg-mainbg/20 shadow-md border-t p-4">
                <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder="Type a message..."
                        value={inputMessage}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        disabled={!isConnected || (user.role === 'admin' && !selectedChatId)}
                        className="flex-1 px-4 py-2 border border-gray-300 bg-gray-600/40 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:bg-gray-400 disabled:cursor-not-allowed text-white"
                    />
                    <button
                        onClick={sendMessage}
                        disabled={!inputMessage.trim() || !isConnected}
                        className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600/40 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center"
                    >
                        <Send size={18} />
                    </button>
                </div>

                {!isConnected && (
                    <div className="text-xs text-gray-500 mt-2 text-center">
                        Disconnected - attempting to reconnect...
                    </div>
                )}
            </div>
        </div>
    );
};

export default Chat;