import { Request, Response } from 'express';
import { Animator } from '../models/Animator';

export const animatorController = {
  getAll: async (req: Request, res: Response) => {
    try {
      const animators = await Animator.find({ isActive: true });
      res.status(200).json(animators);
    } catch (error) {
      console.error('Error fetching animators:', error);
      res.status(500).json({ 
        message: 'Помилка при отриманні аніматорів',
        error: error instanceof Error ? error.message : 'Невідома помилка'
      });
    }
  },

  getById: async (req: Request, res: Response) => {
    try {
      const animator = await Animator.findOne({ 
        _id: req.params.id,
        isActive: true 
      });
      
      if (!animator) {
        return res.status(404).json({ message: 'Аніматор не знайдено' });
      }
      
      res.status(200).json(animator);
    } catch (error) {
      console.error('Error fetching animator:', error);
      res.status(500).json({ 
        message: 'Помилка при отриманні аніматора',
        error: error instanceof Error ? error.message : 'Невідома помилка'
      });
    }
  },

  create: async (req: Request, res: Response) => {
    try {
      const animator = new Animator({
        ...req.body,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      await animator.save();
      res.status(201).json(animator);
    } catch (error) {
      console.error('Error creating animator:', error);
      res.status(400).json({ 
        message: 'Помилка при створенні аніматора',
        error: error instanceof Error ? error.message : 'Невідома помилка'
      });
    }
  },

  update: async (req: Request, res: Response) => {
    try {
      const animator = await Animator.findOneAndUpdate(
        { 
          _id: req.params.id,
          isActive: true 
        },
        { 
          ...req.body,
          updatedAt: new Date()
        },
        { new: true }
      );

      if (!animator) {
        return res.status(404).json({ message: 'Аніматор не знайдено' });
      }

      res.status(200).json(animator);
    } catch (error) {
      console.error('Error updating animator:', error);
      res.status(400).json({ 
        message: 'Помилка при оновленні аніматора',
        error: error instanceof Error ? error.message : 'Невідома помилка'
      });
    }
  },

  delete: async (req: Request, res: Response) => {
    try {
      const animator = await Animator.findOneAndUpdate(
        { 
          _id: req.params.id,
          isActive: true 
        },
        { 
          isActive: false,
          updatedAt: new Date()
        },
        { new: true }
      );

      if (!animator) {
        return res.status(404).json({ message: 'Аніматор не знайдено' });
      }

      res.status(200).json({ message: 'Аніматор успішно видалено' });
    } catch (error) {
      console.error('Error deleting animator:', error);
      res.status(500).json({ 
        message: 'Помилка при видаленні аніматора',
        error: error instanceof Error ? error.message : 'Невідома помилка'
      });
    }
  }
};
