import express from 'express';
import { createOrder, getUserOrders, getOrderDetails, getAllOrders, getOrderDetailsForAdmin, updateOrderStatus } from '../controllers/orderController';
import { protect } from '../middleware/authMiddleware'; // Assuming you have an auth middleware

const router = express.Router();


router.use(protect);

router.post('/', createOrder);

router.get('/me', getUserOrders);

router.get('/all', getAllOrders);

router.get('/admin/:id', getOrderDetailsForAdmin);

router.put('/admin/:id/status', updateOrderStatus);

router.get('/:id', getOrderDetails);

export default router;