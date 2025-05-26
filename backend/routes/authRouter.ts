import express, { RequestHandler } from 'express';
import { login, registerUser, verifyToken } from '../controllers/authController';

const router = express.Router();

router.post('/register', registerUser as RequestHandler);
router.post('/login', login as RequestHandler);
router.post('/verify', verifyToken as RequestHandler);

export default router; 