import { Request, Response } from 'express';
import Order, { IServiceItem } from '../models/Order';
import { User } from '../models/User';
import mongoose from 'mongoose';
import { NextFunction } from 'express';

// Helper to validate ObjectId strings
const isValidObjectId = (id: string): boolean => {
  return mongoose.Types.ObjectId.isValid(id);
};

// Helper to map incoming service data to IServiceItem schema, filtering invalid IDs first
const mapToServiceItems = (items: any[] | undefined): IServiceItem[] => {
  if (!items || !Array.isArray(items)) {
    return [];
  }

  // Filter items with valid string ObjectIds BEFORE mapping
  const validItems = items.filter(item => typeof item.serviceId === 'string' && isValidObjectId(item.serviceId as string));

  // Now map the filtered items to the desired structure
  return validItems.map(item => ({
    serviceId: new mongoose.Types.ObjectId(item.serviceId as string), // item.serviceId here is guaranteed to be a string
    clientDescription: item.clientDescription,
    quantity: item.quantity,
    hours: item.hours,
    paymentType: item.paymentType,
  }));
};

export const createOrder = async (req: Request, res: Response): Promise<void> => {
  const userId = (req as any).user?._id;

  if (!userId) {
    res.status(401).json({ message: 'User not authenticated or token invalid' });
    return;
  }

  const {
    eventType,
    eventDate,
    generalDescription,
    venues,
    food,
    animators,
    vehicles,
    music,
    beverages,
    photographers,
    totalPrice
  } = req.body;

  console.log(req.body)

//   // Basic validation
//   if (!eventType || !eventDate || !totalPrice || (!venues?.length && !food?.length && !animators?.length && !vehicles?.length && !music?.length && !beverages?.length && !photographers?.length)) {
//     res.status(400).json({ message: 'Missing required order fields or services' });
//     return; // Ensure explicit return after sending response
//   }

  try {
    const newOrder = new Order({
      user: userId,
      eventType,
      eventDate,
      generalDescription,
      venues: mapToServiceItems(venues),
      food: mapToServiceItems(food),
      animators: mapToServiceItems(animators),
      vehicles: mapToServiceItems(vehicles),
      music: mapToServiceItems(music),
      beverages: mapToServiceItems(beverages),
      photographers: mapToServiceItems(photographers),
      totalPrice,
    });

    const savedOrder = await newOrder.save();

    // Add order ID to user's orders array
    await User.findByIdAndUpdate(
      userId,
      { $push: { orders: savedOrder._id } },
      { new: true }
    );

    res.status(201).json(savedOrder);
    return;
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Failed to create order', error });
    return;
  }
};

// @desc    Get user orders
// @route   GET /api/orders/me
// @access  Private
export const getUserOrders = async (req: Request, res: Response): Promise<void> => {
  const userId = (req as any).user?._id;

  if (!userId) {
    res.status(401).json({ message: 'User not authenticated' });
    return;
  }

  try {
    // Get user and check if exists
    const user = await User.findById(userId);
    
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Get orders array from user
    const orderIds = user.orders;

    // If no orders, return empty array
    if (!orderIds || orderIds.length === 0) {
      res.status(200).json([]);
      return;
    }

    // Get orders by IDs from user's orders array
    const orders = await Order.find({
      _id: { $in: orderIds }
    }).select('eventType eventDate generalDescription totalPrice status createdAt')
      .sort('-createdAt');

    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({ message: 'Failed to fetch user orders' });
  }
};

export const getOrderDetails = async (req: Request, res: Response) => {
    try {
        const orderId = req.params.id;
        const userId = req.user?._id;

        if (!userId) {
            res.status(401).json({ message: 'User not authenticated' });
            return;
        }

        const order = await Order.findOne({ _id: orderId, user: userId })
            .populate('venues.serviceId')
            .populate('food.serviceId')
            .populate('animators.serviceId')
            .populate('vehicles.serviceId');

        if (!order) {
            res.status(404).json({ message: 'Order not found' });
            return;
        }

        res.status(200).json(order);
    } catch (error) {
        console.error('Error in getOrderDetails:', error);
        res.status(500).json({ message: 'Error fetching order details' });
    }
};

// @access  Private/Admin
export const getAllOrders = async (req: Request, res: Response): Promise<void> => {
    try {
        const orders = await Order.find({})
            .populate('user', 'name email'); // Populate user name and email
        res.status(200).json(orders);
    } catch (error) {
        console.error('Error fetching all orders:', error);
        res.status(500).json({ message: 'Failed to fetch all orders' });
    }
}; 