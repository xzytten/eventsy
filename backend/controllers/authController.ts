import { Request, Response } from 'express';
import { User } from '../models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config(); // Обов’язково на самому початку

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables');
}

// ---------- Registration ----------
export const registerUser = async (req: Request, res: Response): Promise<void> => {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
        res.status(400).json({ message: 'Введіть email, пароль та ім\'я' });
        return;
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            res.status(409).json({ message: 'Користувач з таким email вже існує' });
            return;
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = await User.create({ email, password: hashedPassword, name });

        res.status(201).json({
            message: 'Користувач зареєстрований',
            user: {
                _id: newUser._id,
                email: newUser.email,
                name: newUser.name
            }
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ message: 'Помилка сервера при реєстрації' });
    }
};

// ---------- Login ----------
export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            res.status(401).json({ message: 'Неправильний email або пароль' });
            return;
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            res.status(401).json({ message: 'Неправильний email або пароль' });
            return;
        }

        const token = jwt.sign(
            { userId: user._id, email: user.email },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            token,
            user: {
                _id: user._id,
                email: user.email,
                name: user.name
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Помилка сервера під час входу' });
    }
};

// ---------- Token Verification ----------
export const verifyToken = async (req: Request, res: Response): Promise<void> => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({ message: 'Відсутній токен авторизації' });
            return;
        }

        const token = authHeader.split(' ')[1];

        let decodedToken: jwt.JwtPayload;
        try {
            decodedToken = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
        } catch (err) {
            console.error('JWT verification failed:', (err as Error).message);
            res.status(401).json({ message: 'Недійсний або прострочений токен' });
            return;
        }

        const userId = decodedToken.userId;
        const user = await User.findById(userId);

        if (!user) {
            res.status(401).json({ message: 'Користувача не знайдено' });
            return;
        }

        res.status(200).json({ user: { _id: user._id, email: user.email, name: user.name } });
    } catch (error) {
        console.error('Verify token error:', error);
        res.status(500).json({ message: 'Помилка сервера під час перевірки токена' });
    }
};
