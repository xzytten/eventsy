import { Request, Response } from 'express';
import { Food } from '../models/Food';

// Створення нової страви/меню
export const createFood = async (req: Request, res: Response) => {
  try {
    const food = new Food(req.body);
    await food.save();
    res.status(201).json(food);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// Отримання всіх страв/меню
export const getAllFood = async (req: Request, res: Response) => {
  try {
    const food = await Food.find();
    res.json(food);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}; 