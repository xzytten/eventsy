import { Request, Response } from 'express';
import { Beverage } from '../models/Beverage';

export const createBeverage = async (req: Request, res: Response) => {
  try {
    const beverage = new Beverage(req.body);
    await beverage.save();
    res.status(201).json(beverage);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}; 

export const getAllBeverages = async (req: Request, res: Response) => {
  try {
    const beverages = await Beverage.find();
    res.json(beverages);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};