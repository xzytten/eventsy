import express from 'express';
import { createMusic } from '../controllers/musicController';

const router = express.Router();

router.post('/', createMusic);

export default router; 