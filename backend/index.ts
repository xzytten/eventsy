import express from 'express';
import mongoose from 'mongoose';
import authRouter from './routes/authRouter'
import venueRouter from './routes/venueRoutes'
import cors from 'cors';
import dotenv from 'dotenv';
import vehicleRouter from './routes/vehicleRoutes';
import foodRouter from './routes/foodRoutes';
import animatorRouter from './routes/animatorRoutes';
import beverageRouter from './routes/beverageRoutes';
import orderRouter from './routes/orderRoutes';
import {createChatServer} from "./ws/websocket";
import * as http from "node:http";
import WebSocket from 'ws';
import photographerRouter from './routes/photographerRoutes';
import path from 'path';

dotenv.config();
console.log('DOTENV_CONFIG: Variables loaded:', Object.keys(process.env).length > 0 ? 'Yes' : 'No', '(Count:', Object.keys(process.env).length, ')');

const app = express();
const server = http.createServer(app);

const _PORT = process.env.PORT || 3003;
const _DBURL = process.env.MONGODB_URI || 'mongodb+srv://xzyttenadminKAHSJ12:!eventsy2205Pass2025asjk12@cluster0.ui72r1l.mongodb.net/';

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRouter);
app.use('/api/venues', venueRouter);
app.use('/api/vehicle', vehicleRouter);
app.use('/api/food', foodRouter);
app.use('/api/animator', animatorRouter);
app.use('/api/beverage', beverageRouter);
app.use('/api/orders', orderRouter);
app.use('/api/photographers', photographerRouter);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

async function connectDataBase() {
    try {
        await mongoose.connect(_DBURL);
        console.log('✅ MongoDB connected!');
    } catch (error) {
        console.error('❌ DB connection error:', error);
    }
}

async function startWsServer(server: http.Server) {
    const chatServer = createChatServer({
        server: server,
        maxMessageLength: 1000,
        maxUsernameLength: 20,
        heartbeatInterval: 30000,
        allowedOrigins: ['http://localhost:3000', 'http://localhost:5173'] // Your frontend URLs
    });

    return chatServer;
}

async function startServer() {
    await connectDataBase();
    const webSocketServer = await startWsServer(server);

    server.listen(_PORT, () => {
        console.log(`🚀 Server running on http://localhost:${_PORT}`);
        console.log(`🚀 Websocket Server running on ws://localhost:${_PORT}`);
        console.log(`🔐 JWT Secret is: ${process.env.JWT_SECRET}`);
    });
}

startServer();
