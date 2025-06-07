// Types
import * as http from "node:http";
import WebSocket from 'ws';

export interface ClientData {
    email: string;
    ws: WebSocket;
    username: string | null;
    joinedAt: Date;
    isAlive: boolean;
    lastPing: number;
    role: string;
}

export interface ChatMessage {
    type: 'join' | 'message' | 'change_chat' | 'leave' | 'ping' | 'user_joined' | 'user_left' | 'user_count'
        | 'error' | 'connection_established' | 'join_success' | 'pong' | 'chats_info';
    username?: string;
    text?: string;
    clientId?: string;
    onlineUsers?: number;
    count?: number;
    message?: string;
    timestamp: string;
    chatId?: string;
}

export interface ChatHistory {
    messages: ChatMessage[];
}

export interface ServerStats {
    totalClients: number;
    onlineUsers: number;
    uptime: number;
    memoryUsage: NodeJS.MemoryUsage;
}

export interface ChatServerConfig {
    server: http.Server;
    maxMessageLength?: number;
    maxUsernameLength?: number;
    heartbeatInterval?: number;
    allowedOrigins?: string[];
}