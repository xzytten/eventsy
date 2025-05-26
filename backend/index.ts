import express from 'express';
import mongoose from 'mongoose';
import authRouter from './routes/authRouter'
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
console.log('DOTENV_CONFIG: Variables loaded:', Object.keys(process.env).length > 0 ? 'Yes' : 'No', '(Count:', Object.keys(process.env).length, ')');

const app = express();
const _PORT = process.env.PORT || 3003;
const _DBURL = process.env.MONGODB_URI || 'mongodb+srv://xzyttenadminKAHSJ12:!eventsy2205Pass2025asjk12@cluster0.ui72r1l.mongodb.net/';

app.use(express.json());
app.use(cors());
app.use('/api/auth', authRouter);

async function connectDataBase() {
    try {
        await mongoose.connect(_DBURL);
        console.log('✅ MongoDB connected!');
    } catch (error) {
        console.error('❌ DB connection error:', error);
    }
}

async function startServer() {
    await connectDataBase();

    app.listen(_PORT, () => {
        console.log(`🚀 Server running on http://localhost:${_PORT}`);
        console.log(`🔐 JWT Secret is: ${process.env.JWT_SECRET}`);
    });
}

startServer();
