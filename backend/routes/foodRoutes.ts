import express from 'express';
import { createFood, getAllFood } from '../controllers/foodController';

const foodRouter = express.Router();

foodRouter.post('/', createFood);
foodRouter.get('/', getAllFood);

export default foodRouter; 