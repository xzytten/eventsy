import mongoose from 'mongoose';
import { IPhotographer } from '../types/photographer';
import { EVENT_TYPES } from '../constants/types';

const photographerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  experience: { type: Number, required: true },
  specialization: [{ type: String, required: true }],
  description: { type: String, required: true },
  pricePerHour: { type: Number, required: true },
  pricePerDay: { type: Number, required: true },
  eventTypes: [{
    type: String,
    enum: EVENT_TYPES,
    required: true
  }],
  images: [{ type: String }],
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export const Photographer = mongoose.model<IPhotographer>('Photographer', photographerSchema); 