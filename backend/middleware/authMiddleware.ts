import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User'; // Assuming your User model is here

// Extend the Request interface to include user property
declare global {
    namespace Express {
        interface Request {
            user?: any; // Or a more specific User type if you have one
        }
    }
}
export const protect = async (req: Request, res: Response, next: NextFunction) => {
    let token;
    console.log(req.body)
    console.log(req.headers)
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];

            const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
            console.log(decoded)
            req.user = await User.findById(decoded.userId).select('-password');

            if (!req.user) {
                res.status(401).json({ message: 'Not authorized, user not found' });
                return; // ⬅️ Add return here
            }

            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Not authorized, token failed' });
            return; // ⬅️ Add return here
        }
    } else {
        res.status(401).json({ message: 'Not authorized, no token' });
        return; // ⬅️ Add return here
    }
};
