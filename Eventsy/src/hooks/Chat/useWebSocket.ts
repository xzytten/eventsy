import { useCallback, useRef, useState, useEffect } from 'react';
import {useUserStore} from "@/store/userStore.ts";

// Types
export interface WebSocketMessage {
    type: string;
    username?: string;
    text?: string;
    timestamp: string;
    onlineUsers?: number;
    count?: number;
    messages?: Array<{
        username: string;
        text: string;
        timestamp: string;
    }>;
    chats: Array<{
        client: {
            email: string;
            name: string;
        };
        id: string;
        lastMessage: string;
    }>;
}

export interface ChatMessage {
    id: string;
    username?: string;
    text: string;
    timestamp: string;
    isOwn?: boolean;
    type: 'message' | 'system';
}

export interface ChatItem {
    username: string;
    userEmail: string;
    chatId: string;
    lastMessage: string;
}

export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'reconnecting' | 'error';

export interface UseWebSocketOptions {
    url: string;
    userEmail: string | undefined;
    username?: string;
    isJoined: boolean;
    maxReconnectAttempts?: number;
    onMessage?: (data: WebSocketMessage) => void;
    onConnectionChange?: (status: ConnectionStatus) => void;
    onError?: (error: Event) => void;
    selectedChatId: string | null;
}

export interface UseWebSocketReturn {
    messages: ChatMessage[];
    onlineUsers: number;
    isConnected: boolean;
    connectionStatus: ConnectionStatus;
    connect: () => void;
    disconnect: () => void;
    sendMessage: (message: any) => void;
    clearMessages: () => void;
    setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
    adminChats: ChatItem[];
}

export interface UseWebSocketOptions {
    url: string;
    userEmail: string | undefined;
    username?: string;
    isJoined: boolean;
    maxReconnectAttempts?: number;
    onMessage?: (data: WebSocketMessage) => void;
    onConnectionChange?: (status: ConnectionStatus) => void;
    onError?: (error: Event) => void;
    selectedChatId: string | null;
    searchText: string;
}

export const useWebSocket = ({
                                 url,
                                 userEmail,
                                 username,
                                 maxReconnectAttempts = 5,
                                 onMessage,
                                 onConnectionChange,
                                 onError,
                                 selectedChatId,
                                 searchText
                             }: UseWebSocketOptions): UseWebSocketReturn => {
    // State
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [adminChats, setAdminChats] = useState<ChatItem[]>([]);
    const [onlineUsers, setOnlineUsers] = useState<number>(0);
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('disconnected');

    const { token } = useUserStore();

    // Refs
    const ws = useRef<WebSocket | null>(null);
    const reconnectAttempts = useRef<number>(0);
    const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const user = useUserStore((state) => state.user)

    // Clear reconnect timeout
    const clearReconnectTimeout = useCallback(() => {
        if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
            reconnectTimeoutRef.current = null;
        }
    }, []);

    // Update connection status with callback
    const updateConnectionStatus = useCallback((status: ConnectionStatus) => {
        setConnectionStatus(status);
        onConnectionChange?.(status);
    }, [onConnectionChange]);

    // Generate unique message ID
    const generateMessageId = useCallback(() => {
        return Date.now() + Math.random().toString();
    }, []);

    // Handle different message types
    const handleMessage = useCallback((data: WebSocketMessage) => {
        // Call custom message handler if provided
        onMessage?.(data);

        switch (data.type) {
            case 'message':
                setMessages(prev => [...prev, {
                    id: generateMessageId(),
                    username: data.username,
                    text: data.text || '',
                    timestamp: data.timestamp,
                    isOwn: data.username === username,
                    type: 'message'
                }]);
                break;

            case 'user_joined':
                setMessages(prev => [...prev, {
                    id: generateMessageId(),
                    type: 'system',
                    text: `${data.username} joined the chat`,
                    timestamp: data.timestamp
                }]);
                setOnlineUsers(data.onlineUsers || 0);
                break;

            case 'user_left':
                setMessages(prev => [...prev, {
                    id: generateMessageId(),
                    type: 'system',
                    text: `${data.username} left the chat`,
                    timestamp: data.timestamp
                }]);
                setOnlineUsers(data.onlineUsers || 0);
                break;

            case 'user_count':
                setOnlineUsers(data.count || 0);
                break;

            case 'chat_history':
                if (data.messages) {
                    setMessages(data.messages.map(m => ({
                        id: generateMessageId(),
                        username: m.username,
                        text: m.text || '',
                        timestamp: m.timestamp,
                        isOwn: m.username === username,
                        type: 'message'
                    })));
                } else {
                    setMessages([]);
                }
                break;
            case 'chats_info':
                if (data.chats) {
                    setAdminChats(data.chats.map(chat => ({
                        chatId: chat.id,
                        username: chat.client.name,
                        lastMessage: chat.lastMessage,
                        userEmail: chat.client.email
                    })))
                }
                break;
            default:
                console.log('Unknown message type:', data);
        }
    }, [username, onMessage, generateMessageId]);

    // Connect to WebSocket
    const connect = useCallback((): void => {
        // Don't connect if already connected
        if (ws.current?.readyState === WebSocket.OPEN) return;

        document.cookie = `authToken=${token}; path=/; secure; samesite=strict`;

        updateConnectionStatus('connecting');
        ws.current = new WebSocket(`${url}?email=${userEmail}`);

        ws.current.onopen = (): void => {
            console.log('WebSocket connected');
            setIsConnected(true);
            updateConnectionStatus('connected');
            reconnectAttempts.current = 0;

            const checkConnection = setInterval(() => {
                if (ws.current?.readyState === WebSocket.OPEN) {
                    ws.current.send(JSON.stringify({
                        type: 'join',
                        username: username,
                        timestamp: new Date().toISOString()
                    }));
                    clearInterval(checkConnection);
                }
            }, 100);
        };

        ws.current.onmessage = (event: MessageEvent): void => {
            try {
                const data: WebSocketMessage = JSON.parse(event.data);
                handleMessage(data);
            } catch (error) {
                console.error('Error parsing message:', error);
            }
        };

        ws.current.onclose = (event: CloseEvent): void => {
            console.log('WebSocket closed:', event.code, event.reason, event);
            setIsConnected(false);
            updateConnectionStatus('disconnected');

            // Auto-reconnect logic
            if (reconnectAttempts.current < maxReconnectAttempts) {
                const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 10000);
                reconnectAttempts.current++;
                updateConnectionStatus('reconnecting');

                reconnectTimeoutRef.current = setTimeout(() => {
                    connect();
                }, delay);
            }
        };

        ws.current.onerror = (error: Event): void => {
            console.error('WebSocket error:', error);
            updateConnectionStatus('error');
            onError?.(error);
        };
    }, [url, userEmail, username, maxReconnectAttempts, handleMessage, updateConnectionStatus, onError, token]);

    // Disconnect from WebSocket
    const disconnect = useCallback((): void => {
        clearReconnectTimeout();
        reconnectAttempts.current = 0;

        if (ws.current) {
            ws.current.close(1000, 'Manual disconnect');
            ws.current = null;
        }

        setIsConnected(false);
        updateConnectionStatus('disconnected');
    }, [clearReconnectTimeout, updateConnectionStatus]);

    // Send message through WebSocket
    const sendMessage = useCallback((message: any): boolean => {
        if (ws.current?.readyState === WebSocket.OPEN) {
            try {
                if (user?.role === 'admin') {
                    ws.current.send(JSON.stringify({...message, chatId: selectedChatId}));
                } else {
                    ws.current.send(JSON.stringify(message));
                }
                return true;
            } catch (error) {
                console.error('Error sending message:', error);
                return false;
            }
        }
        console.warn('WebSocket is not connected');
        return false;
    }, [selectedChatId, user]);

    // Clear all messages
    const clearMessages = useCallback(() => {
        setMessages([]);
    }, []);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            clearReconnectTimeout();
            if (ws.current) {
                ws.current.close();
            }
        };
    }, [clearReconnectTimeout]);


    // update chats for admin each 5 seconds automatically
    useEffect(() => {
        const updateChatsInfo = setInterval(() => {
            sendMessage({
                type: 'chats_info',
                message: searchText === '' ? null : searchText,
            });
        }, 5000)

        return () => {
            clearInterval(updateChatsInfo);
        }
    }, [user, searchText, sendMessage])


    // manually update if admins' search text changes
    useEffect(() => {
        sendMessage({
            type: 'chats_info',
            text: searchText === '' ? null : searchText,
        });
    }, [searchText, sendMessage]);

    return {
        messages,
        onlineUsers,
        isConnected,
        connectionStatus,
        connect,
        disconnect,
        sendMessage,
        clearMessages,
        setMessages,
        adminChats
    };
};

// Optional: Hook for simple WebSocket connection without chat logic
// export const useSimpleWebSocket = (url: string) => {
//     const [isConnected, setIsConnected] = useState(false);
//     const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('disconnected');
//     const ws = useRef<WebSocket | null>(null);
//
//     const connect = useCallback(() => {
//         if (ws.current?.readyState === WebSocket.OPEN) return;
//
//         setConnectionStatus('connecting');
//         ws.current = new WebSocket(url);
//
//         ws.current.onopen = () => {
//             setIsConnected(true);
//             setConnectionStatus('connected');
//         };
//
//         ws.current.onclose = () => {
//             setIsConnected(false);
//             setConnectionStatus('disconnected');
//         };
//
//         ws.current.onerror = () => {
//             setConnectionStatus('error');
//         };
//     }, [url]);
//
//     const disconnect = useCallback(() => {
//         if (ws.current) {
//             ws.current.close();
//             ws.current = null;
//         }
//     }, []);
//
//     const sendMessage = useCallback((message: any) => {
//         if (ws.current?.readyState === WebSocket.OPEN) {
//             ws.current.send(JSON.stringify(message));
//             return true;
//         }
//         return false;
//     }, []);
//
//     useEffect(() => {
//         return () => {
//             if (ws.current) {
//                 ws.current.close();
//             }
//         };
//     }, []);
//
//     return {
//         isConnected,
//         connectionStatus,
//         connect,
//         disconnect,
//         sendMessage,
//         ws: ws.current
//     };
// };