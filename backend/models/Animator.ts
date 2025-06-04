import mongoose from 'mongoose';
import { IAnimator } from '../types/animator';
import { EVENT_TYPES } from '../constants/types';

const animatorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  experience: { type: Number, required: true },
  pricePerHour: { type: Number, required: true },
  pricePerDay: { type: Number },
  rating: { type: Number, default: 0 },
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
  equipment: [{
    name: { type: String, required: true },
    description: { type: String },
    quantity: { type: Number, default: 1 }
  }],
  contactInfo: {
    phone: { type: String },
    email: { type: String }
  },
  images: [{ type: String }],
  eventTypes: [{
    type: String,
    enum: EVENT_TYPES,
    required: true
  }],
  ageRange: {
    min: { type: Number, required: true, min: 0 },
    max: { type: Number, required: true, min: 0 }
  },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export const Animator = mongoose.model<IAnimator>('Animator', animatorSchema); 