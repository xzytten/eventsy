import { Router } from 'express';
import { createOrder } from '../controllers/orderController';
import { protect } from '../middleware/authMiddleware'; // Assuming you have an auth middleware

const router = Router();

// Protect this route to ensure only authenticated users can create orders
router.post('/', protect, createOrder);

export default router;