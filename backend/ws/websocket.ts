import WebSocket, {WebSocketServer} from 'ws';
import { createServer } from 'http';
import {Chat} from "../models/Chat";
import {Message} from "../models/ChatMessage";
import {IncomingMessage} from "node:http";
import {User} from "../models/User";
import jwt from "jsonwebtoken";
import {ChatHistory, ChatMessage, ChatServerConfig, ClientData, ServerStats} from "./types";
import {Document} from "mongoose";

const JWT_SECRET = process.env.JWT_SECRET || '';
const ADMIN_EMAILS = ['xzytten@gmail.com'];

interface WsAuthorizedUser {
    role: string;
    email: string;
    username: string;
}

interface IncomingMessageWithUser extends IncomingMessage {
    user: WsAuthorizedUser
}

// Configuration defaults
const DEFAULT_CONFIG: Required<Omit<ChatServerConfig, 'server'>> = {
    maxMessageLength: 1000,
    maxUsernameLength: 20,
    heartbeatInterval: 30000, // 30 seconds
    allowedOrigins: ['*'] // Allow all origins by default
};

export class StandaloneWebSocketChatServer {
    private wss: WebSocketServer;
    private server: ReturnType<typeof createServer>;
    private clients: Map<string, ClientData> = new Map();
    private config: Required<ChatServerConfig>;
    private statsInterval: NodeJS.Timeout | null = null;

    constructor(config: ChatServerConfig) {
        this.config = { ...DEFAULT_CONFIG, ...config };

        // Create HTTP server for WebSocket
        this.server = config.server;

        this.wss = new WebSocket.Server({server: this.server, verifyClient: this.verifyClient.bind(this)});

        this.setupWebSocketHandlers();
        this.setupServerHandlers();
        this.startStatsLogging();
        this.setupGracefulShutdown();
    }

    private async verifyClient(info: { origin: string; secure: boolean; req: any }, callback: any): Promise<boolean | void> {
        try {
            const { origin } = info;
            console.log(`WebSocket connection attempt from origin: ${origin}`);

            // Check allowed origins
            if (!this.config.allowedOrigins.includes('*') && !this.config.allowedOrigins.includes(origin)) {
                return false;
            }

            // Parse cookies from the request
            const cookies: Record<string, string> = {};
            const cookieHeader = info.req.headers.cookie;

            if (cookieHeader) {
                cookieHeader.split(';').forEach((cookie: string) => {
                    const [name, value] = cookie.trim().split('=');
                    if (name && value) {
                        cookies[name] = decodeURIComponent(value);
                    }
                });
            }

            const token = cookies.authToken;

            if (!token) {
                return callback(false, 401, 'Unauthorized: No auth cookie');
            }

            jwt.verify(token, JWT_SECRET, async (err, decoded) => {
                if (err || !decoded || typeof decoded === 'string') {
                    return callback(false, 401, 'Unauthorized: Invalid token');
                }

                const user = await User.findOne({email: decoded.email})

                if (!user) {
                    return callback(false, 401, 'Unauthorized: User not found');
                }

                info.req.user = {
                    role: user.role,
                    username: user.name,
                    email: user.email,
                };

                return callback(true);
            });
        } catch (error) {
            callback(false, 500, 'Internal Server Error');
        }
    }

    private setupWebSocketHandlers(): void {
        this.wss.on('connection', async (ws: WebSocket, request: IncomingMessageWithUser) => {
            const user = request.user;
            const url = new URL(request.url || '', 'http://localhost');
            const email = url.searchParams.get('email') || 'n/a';

            const clientId = email;
            console.log(`New WebSocket client connected: ${clientId}`);

            const savedUser = await User.findOne({ email });

            // Initialize client data
            const clientData: ClientData = {
                email: email,
                ws: ws,
                username: savedUser?.name || 'Guest',
                joinedAt: new Date(),
                isAlive: true,
                lastPing: Date.now(),
                role: user.role,
            };

            this.clients.set(clientId, clientData);

            // Set up client-specific handlers
            this.setupClientHandlers(ws, clientId);

            // Send welcome message
            this.sendToClient(clientId, {
                type: 'connection_established',
                clientId: clientId,
                timestamp: new Date().toISOString()
            });

            // Start heartbeat
            this.startHeartbeat(clientId);
        });

        this.wss.on('error', (error: Error) => {
            console.error('WebSocket Server Error:', error);
        });
    }

    private setupServerHandlers(): void {
        this.server.on('error', (error: Error) => {
            console.error('HTTP Server Error:', error);
        });

        this.server.on('listening', () => {
            console.log(`WebSocket Chat Server running on address ${this.config.server.address()}`);
            // console.log(`WebSocket URL: ws://localhost:${this.config.port}`);
        });
    }

    private setupClientHandlers(ws: WebSocket, clientId: string): void {
        ws.on('message', (data: WebSocket.Data) => {
            try {
                this.handleMessage(clientId, data);
            } catch (error) {
                console.error(`Error handling message from ${clientId}:`, error);
                this.sendError(clientId, 'Invalid message format');
            }
        });

        ws.on('close', (code: number, reason: Buffer) => {
            console.log(`WebSocket client ${clientId} disconnected: ${code} - ${reason.toString()}`);
            this.handleClientDisconnect(clientId);
        });

        ws.on('error', (error: Error) => {
            console.error(`WebSocket client ${clientId} error:`, error);
            this.handleClientDisconnect(clientId);
        });

        ws.on('pong', () => {
            const client = this.clients.get(clientId);
            if (client) {
                client.isAlive = true;
                client.lastPing = Date.now();
            }
        });
    }

    private handleMessage(clientId: string, data: WebSocket.Data): void {
        const client = this.clients.get(clientId);
        if (!client) return;

        let message: ChatMessage;
        try {
            message = JSON.parse(data.toString()) as ChatMessage;
        } catch (error) {
            return this.sendError(clientId, 'Invalid JSON format');
        }

        console.log(`Message from ${clientId}:`, message);

        switch (message.type) {
            case 'join':
                this.handleJoin(clientId, message);
                break;
            case 'message':
                this.handleChatMessage(clientId, message);
                break;
            case 'leave':
                this.handleLeave(clientId, message);
                break;
            case 'ping':
                this.handlePing(clientId);
                break;
            case 'change_chat':
                this.handleChangeAdminChat(clientId, message)
                break;
            case 'chats_info':
                this.handleUpdateChatsInfo(clientId, message)
                break;
            default:
                this.sendError(clientId, `Unknown message type: ${message.type}`);
        }
    }

    private async findOrCreateChat(client: ClientData) {
        if (client.role === 'admin') return null;

        let chat = await Chat.findOne({participants: client.email});
        if (!chat) {
            chat = await Chat.create({ participants: client.email });
        }
        return chat;
    }

    private async getChatHistoryAndSendIt(chat: Document, clientId: string) {
        // Load previous messages
        const previousMessages = await Message.find({chatId: chat._id}).sort({timestamp: 1});

        // Send previous messages to user
        this.sendChatHistoryToClient(clientId, {
            messages: previousMessages.map(m => ({
                type: 'message',
                text: m.text,
                username: m.sender?.username,
                timestamp: m.timestamp.toISOString()
            }))
        });
    }

    private async handleJoin(clientId: string, message: ChatMessage): Promise<void> {
        const client = this.clients.get(clientId);
        if (!client) return;

        console.log(`Client ${clientId} joined as ${client.username}`);

        const chat = await this.findOrCreateChat(client);

        console.log(chat);

        if (client.role === 'admin') {
            this.sendAdminAllChatsInfo(clientId, null);
        } else {
            if (!chat) throw new Error('Chat not found');

            this.getChatHistoryAndSendIt(chat, clientId);
        }

        this.sendToClient(clientId, {
            type: 'join_success',
            username: client.username!,
            clientId: clientId,
            timestamp: new Date().toISOString()
        });

        this.broadcastUserCount();
    }

    private async handleChatMessage(clientId: string, message: ChatMessage): Promise<void> {
        const client = this.clients.get(clientId);
        if (!client || !client.username || !message.text) {
            return this.sendError(clientId, 'Missing required fields');
        }

        if (client.role === 'admin' && !message.chatId) {
            throw new Error('Chat is not selected');
        }

        const chat = client.role === 'admin' ? await Chat.findById(message.chatId) : await this.findOrCreateChat(client);

        // Save message to DB
        const savedMessage = await Message.create({
            chatId: chat,
            sender: {
                email: client.email,
                username: client.username,
            },
            text: message.text,
            timestamp: new Date().toISOString()
        });

        console.log('[saved message]', savedMessage);
        const realClient = chat?.participants[0];

        // Send message to all admins
        this.clients.forEach((c, id) => {
            if (c.role === 'admin' || c.email === realClient) {
                this.sendToClient(id, {
                    type: 'message',
                    text: savedMessage.text,
                    timestamp: savedMessage.timestamp.toISOString(),
                    username: savedMessage.sender?.username,
                });
            }
        });

    }

    private handleLeave(clientId: string, message: ChatMessage): void {
        const client = this.clients.get(clientId);
        if (!client || !client.username) return;

        const username = client.username;
        console.log(`Client ${clientId} (${username}) leaving chat`);

        // Broadcast user left message
        this.broadcast({
            type: 'user_left',
            username: username,
            onlineUsers: this.getOnlineUserCount() - 1,
            timestamp: new Date().toISOString()
        }, clientId);

        // Remove username but keep connection
        client.username = null;

        // Update user count
        this.broadcastUserCount();
    }

    private handlePing(clientId: string): void {
        const client = this.clients.get(clientId);
        if (client) {
            client.isAlive = true;
            client.lastPing = Date.now();
            this.sendToClient(clientId, {
                type: 'pong',
                timestamp: new Date().toISOString()
            });
        }
    }

    private async handleChangeAdminChat(clientId: string, message: ChatMessage) {
        const newChatId = message.text;

        const chat = await Chat.findById(newChatId);
        if (chat) {
            this.getChatHistoryAndSendIt(chat, clientId);
        } else throw new Error('Chat not found');
    }

    private handleUpdateChatsInfo(adminId: string, message: ChatMessage) {
        this.sendAdminAllChatsInfo(adminId, message.text ? message.text.toLowerCase() : null);
    }

    private handleClientDisconnect(clientId: string): void {
        const client = this.clients.get(clientId);
        if (!client) return;

        if (client.username) {
            // Broadcast user left message
            this.broadcast({
                type: 'user_left',
                username: client.username,
                onlineUsers: this.getOnlineUserCount() - 1,
                timestamp: new Date().toISOString()
            }, clientId);
        }

        this.clients.delete(clientId);
        this.broadcastUserCount();
    }

    // Helper methods
    private generateClientId(): string {
        return `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    private sanitizeUsername(username?: string): string | null {
        if (!username || typeof username !== 'string') return null;
        const sanitized = username.trim().slice(0, this.config.maxUsernameLength);
        return sanitized.length > 0 ? sanitized : null;
    }

    private sanitizeMessage(text?: string): string | null {
        if (!text || typeof text !== 'string') return null;
        const sanitized = text.trim().slice(0, this.config.maxMessageLength);
        return sanitized.length > 0 ? sanitized : null;
    }

    private isUsernameTaken(username: string, excludeClientId?: string): boolean {
        for (const [clientId, client] of this.clients) {
            if (clientId !== excludeClientId && client.username === username) {
                return true;
            }
        }
        return false;
    }

    private getOnlineUserCount(): number {
        let count = 0;
        for (const client of this.clients.values()) {
            if (client.username) count++;
        }
        return count;
    }

    private sendToClient(clientId: string, message: ChatMessage): boolean {
        const client = this.clients.get(clientId);
        if (!client || client.ws.readyState !== WebSocket.OPEN) return false;

        try {
            client.ws.send(JSON.stringify(message));
            return true;
        } catch (error) {
            console.error(`Error sending message to ${clientId}:`, error);
            return false;
        }
    }

    private sendChatHistoryToClient(clientId: string, chatHistory: ChatHistory): boolean {
        const client = this.clients.get(clientId);
        if (!client || client.ws.readyState !== WebSocket.OPEN) return false;

        try {
            client.ws.send(JSON.stringify({messages: chatHistory.messages, type: 'chat_history'}));
            return true;
        } catch (error) {
            console.error(`Error sending message to ${clientId}:`, error);
            return false;
        }
    }

    private async sendAdminAllChatsInfo(adminId: string, searchString: string | null): Promise<boolean> {
        const admin = this.clients.get(adminId);
        if (!admin || admin.ws.readyState !== WebSocket.OPEN) return false;

        try {
            let chats;
            if (searchString) {
                const users = await User.find({
                    $or: [
                        { email: { $regex: searchString, $options: 'i' } },
                        { name: { $regex: searchString, $options: 'i' } }
                    ]
                });
                const userEmails = users.map(u => u.email);
                chats = await Chat.find({participants: { $in: userEmails }}).sort({ timestamp: -1 })
            } else chats = await Chat.find().sort({ timestamp: -1 });

            const chatWithLastMessages = await Promise.all(chats.map(async chat => {
                const client = await User.findOne({email: { $in: chat.participants }})
                const lastMessage = await Message.findOne({chatId: chat._id}).sort({ timestamp: -1 });
                return {
                    id: chat._id,
                    client: client,
                    lastMessage: lastMessage?.text
                }
            }));
            admin.ws.send(JSON.stringify({type: 'chats_info', chats: chatWithLastMessages}));
            return true;
        } catch (error) {
            console.error(`Error sending message to ${adminId}:`, error);
            return false;
        }

    }



    private sendError(clientId: string, errorMessage: string): void {
        this.sendToClient(clientId, {
            type: 'error',
            message: errorMessage,
            timestamp: new Date().toISOString()
        });
    }

    private broadcast(message: ChatMessage, excludeClientId?: string): void {
        const messageStr = JSON.stringify(message);
        let successCount = 0;
        let failCount = 0;

        for (const [clientId, client] of this.clients) {
            if (clientId === excludeClientId) continue;

            if (client.ws.readyState === WebSocket.OPEN) {
                try {
                    client.ws.send(messageStr);
                    successCount++;
                } catch (error) {
                    console.error(`Error broadcasting to ${clientId}:`, error);
                    failCount++;
                }
            }
        }

        console.log(`Broadcast sent to ${successCount} clients, ${failCount} failed`);
    }

    private broadcastUserCount(): void {
        this.broadcast({
            type: 'user_count',
            count: this.getOnlineUserCount(),
            timestamp: new Date().toISOString()
        });
    }

    private startHeartbeat(clientId: string): void {
        const client = this.clients.get(clientId);
        if (!client) return;

        const heartbeatInterval = setInterval(() => {
            const currentClient = this.clients.get(clientId);
            if (!currentClient) {
                clearInterval(heartbeatInterval);
                return;
            }

            if (currentClient.ws.readyState === WebSocket.OPEN) {
                if (!currentClient.isAlive) {
                    console.log(`Client ${clientId} failed heartbeat, terminating`);
                    // currentClient.ws.terminate();
                    clearInterval(heartbeatInterval);
                    return;
                }

                currentClient.isAlive = false;
                // currentClient.ws.ping();
            } else {
                clearInterval(heartbeatInterval);
            }
        }, this.config.heartbeatInterval);
    }

    private startStatsLogging(): void {
        this.statsInterval = setInterval(() => {
            this.logStats();
        }, 5 * 60 * 1000); // 5 minutes
    }

    private setupGracefulShutdown(): void {
        const shutdown = () => {
            console.log('Shutting down WebSocket server...');
            this.shutdown();
        };

        process.on('SIGTERM', shutdown);
        process.on('SIGINT', shutdown);
    }

    public getStats(): ServerStats {
        return {
            totalClients: this.clients.size,
            onlineUsers: this.getOnlineUserCount(),
            uptime: process.uptime(),
            memoryUsage: process.memoryUsage()
        };
    }

    public logStats(): void {
        const stats = this.getStats();
        console.log(`WebSocket Stats - Clients: ${stats.totalClients}, Online Users: ${stats.onlineUsers}, Uptime: ${Math.floor(stats.uptime)}s`);
    }

    public shutdown(): void {
        console.log('Shutting down WebSocket chat server...');

        // Clear stats interval
        if (this.statsInterval) {
            clearInterval(this.statsInterval);
        }

        // Close all client connections
        for (const [clientId, client] of this.clients) {
            client.ws.close(1001, 'Server shutting down');
        }

        // Close WebSocket server
        this.wss.close(() => {
            console.log('WebSocket server closed');
        });

        // Close HTTP server
        this.server.close(() => {
            console.log('HTTP server closed');
        });

        this.clients.clear();
    }

    // Getters
    public get clientCount(): number {
        return this.clients.size;
    }

    public get onlineUserCount(): number {
        return this.getOnlineUserCount();
    }

    public get port(): number {
        const address = this.server.address();
        return address && typeof address === 'object' ? address.port : 0;
    }
}

// Factory function for easy setup
export function createChatServer(config: ChatServerConfig): StandaloneWebSocketChatServer {
    return new StandaloneWebSocketChatServer(config);
}

export default StandaloneWebSocketChatServer;