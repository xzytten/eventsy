import express from 'express';
import { createOrder, getUserOrders, getOrderDetails, getAllOrders } from '../controllers/orderController';
import { protect } from '../middleware/authMiddleware'; // Assuming you have an auth middleware

const router = express.Router();

// Protect all order routes
router.use(protect);

// @route   POST /api/orders
// @desc    Create new order
// @access  Private
router.post('/', createOrder);

// @route   GET /api/orders/me
// @desc    Get logged in user orders
// @access  Private
router.get('/me', getUserOrders);

// @route   GET /api/orders/all
// @desc    Get all orders (Admin only)
// @access  Private/Admin
router.get('/all', getAllOrders);

// @route   GET /api/orders/:id
// @desc    Get order details
// @access  Private
router.get('/:id', getOrderDetails);

export default router;