import { Request, Response } from 'express';
import { Photographer } from '../models/Photographer';


export const createPhotographer = async (req: Request, res: Response) => {
  try {
    const photographer = new Photographer(req.body);
    await photographer.save();
    res.status(201).json(photographer);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getAllPhotographers = async (req: Request, res: Response) => {
  try {
    const photographers = await Photographer.find({ isActive: true });
    res.status(200).json(photographers);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getPhotographerById = async (req: Request, res: Response) => {
  try {
    const photographer = await Photographer.findById(req.params.id);
    if (!photographer) {
      return res.status(404).json({ message: 'Photographer not found' });
    }
    res.status(200).json(photographer);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};


export const updatePhotographer = async (req: Request, res: Response) => {
  try {
    const photographer = await Photographer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!photographer) {
      return res.status(404).json({ message: 'Photographer not found' });
    }
    res.status(200).json(photographer);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};


export const deletePhotographer = async (req: Request, res: Response) => {
  try {
    const photographer = await Photographer.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    if (!photographer) {
      return res.status(404).json({ message: 'Photographer not found' });
    }
    res.status(200).json({ message: 'Photographer deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}; 