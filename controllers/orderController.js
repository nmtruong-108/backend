import Order from '../models/orderModel.js';
import User from '../models/userModel.js';
import Food from '../models/foodModel.js';

// Create a new order
export const createOrder = async (req, res) => {
    const { userId, address, foods, totalPrice } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const order = new Order({
            user: userId,
            address,
            foods,
            totalPrice,
        });

        await order.save();
        res.status(201).json({ success: true, order });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ success: false, message: 'Error creating order' });
    }
};

// Get order by ID
export const getOrderById = async (req, res) => {
    const { orderId } = req.params;

    try {
        const order = await Order.findById(orderId).populate('user').populate('foods.product');
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        res.status(200).json({ success: true, order });
    } catch (error) {
        console.error('Error fetching order:', error);
        res.status(500).json({ success: false, message: 'Error fetching order' });
    }
};

// Get all orders for a user
export const getOrdersByUserId = async (req, res) => {
    const { userId } = req.params;

    try {
        const orders = await Order.find({ user: userId }).populate('foods.product');
        if (!orders) {
            return res.status(404).json({ success: false, message: 'No orders found for this user' });
        }

        res.status(200).json({ success: true, orders });
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ success: false, message: 'Error fetching orders' });
    }
};