import express from 'express';
import { createOrder, getOrderById, getOrdersByUserId } from '../controllers/orderController.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

router.post('/create', authMiddleware, createOrder);
router.get('/:orderId', authMiddleware, getOrderById);
router.get('/user/:userId', authMiddleware, getOrdersByUserId);

export default router;