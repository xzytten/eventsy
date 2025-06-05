import { Request, Response } from 'express';
import Order, { IServiceItem } from '../models/Order';
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
  // Assuming user ID is available from authenticated request (e.g., req.user as any). You might need to adjust this based on your auth middleware.
  // Use req.user?._id after the protect middleware has potentially attached the user.
  const userId = (req as any).user?._id;

  if (!userId) {
    // The protect middleware should handle this, but adding a fallback check
    res.status(401).json({ message: 'User not authenticated or token invalid' });
    return; // Ensure explicit return after sending response
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

    res.status(201).json(savedOrder);
    return; // Ensure explicit return after sending response
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Failed to create order', error });
    return; // Ensure explicit return after sending response
  }
}; 