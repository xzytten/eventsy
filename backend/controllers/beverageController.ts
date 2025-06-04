import { Request, Response } from 'express';
import { Beverage } from '../models/Beverage';

// Створення нового напою
export const createBeverage = async (req: Request, res: Response) => {
  try {
    const beverage = new Beverage(req.body);
    await beverage.save();
    res.status(201).json(beverage);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}; 