import express, { RequestHandler } from 'express';
import { login, registerUser, verifyToken } from '../controllers/authController';

const authRouter = express.Router();

authRouter.post('/register', registerUser as RequestHandler);
authRouter.post('/login', login as RequestHandler);
authRouter.post('/verify', verifyToken as RequestHandler);

// TEMPORARY: Route to create an admin user. REMOVE AFTER USE!
// authRouter.post('/create-admin', createAdminUser as RequestHandler);

export default authRouter; 