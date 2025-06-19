import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User'; 
import { IUser } from '../types/user';

declare global {
    namespace Express {
        interface Request {
            user?: IUser;
        }
    }
}

export const protect = async (req: Request, res: Response, next: NextFunction) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];

            const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);

            const user = await User.findById(decoded.userId).select('-password');

            if (!user) {
                console.log('Auth middleware: User not found for token ID', decoded.userId);
                res.status(401).json({ message: 'Not authorized, user not found' });
                return;
            }

            req.user = user;
            console.log('Auth middleware: Attached user to req.user:', req.user);

            next();
        } catch (error) {
            console.error('Auth middleware error:', error);
            res.status(401).json({ message: 'Not authorized, token failed' });
            return;
        }
    } else {
        console.log('Auth middleware: No token provided');
        res.status(401).json({ message: 'Not authorized, no token' });
        return;
    }
};
