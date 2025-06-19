import { Request, Response } from 'express';
import { Venue } from '../models/Venue';


export const createVenue = async (req: Request, res: Response) => {
  try {
    console.log(req.body)
    const venue = new Venue(req.body);
    await venue.save();
    res.status(201).json(venue);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};


export const getAllVenues = async (req: Request, res: Response) => {
  try {
    const venues = await Venue.find({ isActive: true });
    res.json(venues);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};


export const getVenueById = async (req: Request, res: Response) => {
  try {
    const venue = await Venue.findById(req.params.id);
    if (!venue) {
      return res.status(404).json({ message: 'Місце не знайдено' });
    }
    res.json(venue);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};


export const updateVenue = async (req: Request, res: Response) => {
  try {
    const venue = await Venue.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!venue) {
      return res.status(404).json({ message: 'Місце не знайдено' });
    }
    res.json(venue);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};


export const deleteVenue = async (req: Request, res: Response) => {
  try {
    const venue = await Venue.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    if (!venue) {
      return res.status(404).json({ message: 'Місце не знайдено' });
    }
    res.json({ message: 'Місце успішно видалено' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};


export const getVenuesByEventType = async (req: Request, res: Response) => {
  try {
    const { eventType } = req.params;
    const venues = await Venue.find({
      eventTypes: eventType,
      isActive: true
    });
    res.json(venues);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}; 