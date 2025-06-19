import { Request, Response } from 'express';
import Order, { IServiceItem } from '../models/Order';
import { User } from '../models/User';
import mongoose from 'mongoose';
import { NextFunction } from 'express';

const isValidObjectId = (id: string): boolean => {
  return mongoose.Types.ObjectId.isValid(id);
};

const mapToServiceItems = (items: any[] | undefined): IServiceItem[] => {
  if (!items || !Array.isArray(items)) {
    return [];
  }

  const validItems = items.filter(item => typeof item.serviceId === 'string' && isValidObjectId(item.serviceId as string));

  return validItems.map(item => ({
    serviceId: new mongoose.Types.ObjectId(item.serviceId as string), 
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
    phoneNumber,
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
      phoneNumber,
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

export const getUserOrders = async (req: Request, res: Response): Promise<void> => {
  const userId = (req as any).user?._id;

  if (!userId) {
    res.status(401).json({ message: 'User not authenticated' });
    return;
  }

  try {
    const user = await User.findById(userId);
    
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const orderIds = user.orders;

    if (!orderIds || orderIds.length === 0) {
      res.status(200).json([]);
      return;
    }

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
        console.log('Запит деталей замовлення:', { orderId, userId });

        if (!userId) {
            res.status(401).json({ message: 'User not authenticated' });
            return;
        }

        const order = await Order.findOne({ _id: orderId, user: userId })
            .populate('venues.serviceId')
            .populate('food.serviceId')
            .populate('animators.serviceId')
            .populate('vehicles.serviceId')
            .populate('beverages.serviceId')
            .populate('photographers.serviceId');

        console.log('Знайдене замовлення:', order);

        if (!order) {
            res.status(404).json({ message: 'Order not found' });
            return;
        }

        const activeCategory = req.query.activeCategory as string;

        res.status(200).json(order);
    } catch (error) {
        console.error('Error in getOrderDetails:', error);
        res.status(500).json({ message: 'Error fetching order details', error: (error as any)?.message, stack: (error as any)?.stack });
    }
};

export const getOrderDetailsForAdmin = async (req: Request, res: Response) => {
    try {
        const orderId = req.params.id;
        console.log('Admin запит деталей замовлення:', { orderId });

        const order = await Order.findById(orderId)
            .populate('venues.serviceId')
            .populate('food.serviceId')
            .populate('animators.serviceId')
            .populate('vehicles.serviceId')
            .populate('beverages.serviceId')
            .populate('photographers.serviceId');


        console.log('Знайдене замовлення для адміна:', order);

        if (!order) {
            res.status(404).json({ message: 'Order not found' });
            return;
        }

        res.status(200).json(order);
    } catch (error) {
        console.error('Error in getOrderDetailsForAdmin:', error);
        res.status(500).json({ message: 'Error fetching order details', error: (error as any)?.message, stack: (error as any)?.stack });
    }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
    try {
        const orderId = req.params.id;
        const { status } = req.body;
        
        console.log('Admin оновлення статусу замовлення:', { orderId, status });

        const validStatuses = ['pending', 'confirmed', 'rejected', 'closed'];
        if (!validStatuses.includes(status)) {
            res.status(400).json({ message: 'Invalid status. Must be one of: pending, confirmed, rejected, closed' });
            return;
        }

        const order = await Order.findByIdAndUpdate(
            orderId,
            { status },
            { new: true }
        ).populate('user', 'name email', undefined, { strictPopulate: false });

        if (!order) {
            res.status(404).json({ message: 'Order not found' });
            return;
        }

        console.log('Статус замовлення оновлено:', { orderId, newStatus: status });

        res.status(200).json(order);
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({ message: 'Error updating order status', error: (error as any)?.message, stack: (error as any)?.stack });
    }
};

export const getAllOrders = async (req: Request, res: Response): Promise<void> => {
    try {
        const orders = await Order.find({})
            .populate('user', 'name email')
            .populate('venues.serviceId')
            .populate('food.serviceId')
            .populate('animators.serviceId')
            .populate('vehicles.serviceId')
            .populate('beverages.serviceId')
            .populate('photographers.serviceId');
        res.status(200).json(orders);
    } catch (error) {
        console.error('Error fetching all orders:', error);
        res.status(500).json({ message: 'Failed to fetch all orders' });
    }
}; 