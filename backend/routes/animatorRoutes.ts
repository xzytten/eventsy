import { Router } from 'express';
import { animatorController } from '../controllers/animatorController';

const router = Router();

// GET /api/animators - отримати всіх аніматорів
router.get('/', animatorController.getAll as any);

// GET /api/animators/:id - отримати аніматора за ID
router.get('/:id', animatorController.getById as any);

// POST /api/animators - створити нового аніматора
router.post('/', animatorController.create as any);

// PUT /api/animators/:id - оновити аніматора
router.put('/:id', animatorController.update as any);

// DELETE /api/animators/:id - видалити аніматора
router.delete('/:id', animatorController.delete as any);

export default router; 