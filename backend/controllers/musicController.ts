import { Request, Response } from 'express';
import { MusicService } from '../models/MusicService';

// Створення нового музичного сервісу
export const createMusic = async (req: Request, res: Response) => {
  try {
    const music = new MusicService(req.body);
    await music.save();
    res.status(201).json(music);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}; 