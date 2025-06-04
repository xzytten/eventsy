import express from 'express';
import { createBeverage } from '../controllers/beverageController';

const beverageRouter = express.Router();

beverageRouter.post('/', createBeverage);

export default beverageRouter; 