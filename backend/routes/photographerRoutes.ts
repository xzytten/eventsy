import express from 'express';
import { 
  createPhotographer, 
  getAllPhotographers, 
} from '../controllers/photographerController';

const router = express.Router();

// Public routes
router.get('/', getAllPhotographers);

router.post('/', createPhotographer);

export default router; 