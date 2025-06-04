import { Request, Response } from 'express';
import { Vehicle } from '../models/Vehicle';

// Створення нового транспортного засобу
export const createVehicle = async (req: Request, res: Response) => {
  try {
    const vehicle = new Vehicle(req.body);
    await vehicle.save();
    res.status(201).json(vehicle);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// Отримання всіх транспортних засобів
export const getAllVehicles = async (req: Request, res: Response) => {
  try {
    const vehicles = await Vehicle.find();
    res.json(vehicles);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}; 