import express from 'express';
import { createVehicle, getAllVehicles } from '../controllers/vehicleController';

const vehicleRouter = express.Router();

vehicleRouter.post('/', createVehicle);
vehicleRouter.get('/', getAllVehicles);

export default vehicleRouter; 