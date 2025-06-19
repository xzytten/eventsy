import { Router } from 'express';
import { animatorController } from '../controllers/animatorController';

const router = Router();

router.get('/', animatorController.getAll as any);

router.get('/:id', animatorController.getById as any);

router.post('/', animatorController.create as any);

router.put('/:id', animatorController.update as any);

router.delete('/:id', animatorController.delete as any);

export default router; 