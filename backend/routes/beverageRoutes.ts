import express from 'express';
import { createBeverage, getAllBeverages } from '../controllers/beverageController';

const beverageRouter = express.Router();

beverageRouter.post('/', createBeverage);
beverageRouter.get('/', getAllBeverages)
export default beverageRouter; 