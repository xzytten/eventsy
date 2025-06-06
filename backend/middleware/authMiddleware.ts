import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User'; // Assuming your User model is here
import { IUser } from '../types/user'; // Import IUser interface

// Extend the Request interface to include user property with IUser type
declare global {
    namespace Express {
        interface Request {
            user?: IUser; // Use IUser type here
        }
    }
}

export const protect = async (req: Request, res: Response, next: NextFunction) => {
    let token;
    //console.log(req.body) // Optional: keep or remove logging
    //console.log(req.headers) // Optional: keep or remove logging

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];

            const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
            //console.log('Decoded JWT:', decoded) // Optional: keep or remove logging

            // Fetch user from database - should include role
            const user = await User.findById(decoded.userId).select('-password');

            if (!user) {
                console.log('Auth middleware: User not found for token ID', decoded.userId);
                res.status(401).json({ message: 'Not authorized, user not found' });
                return;
            }

            // Attach the fetched user document to the request object
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
