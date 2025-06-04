import mongoose from 'mongoose';
import { IVenue } from '../types/venue';
import { EVENT_TYPES } from '../constants/types';

const venueSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  address: { type: String, required: true },
  capacity: { type: Number },
  pricePerHour: { type: Number },
  pricePerDay: {type: Number},
  eventTypes: [{
    type: String,
    enum: EVENT_TYPES,
    required: true
  }],
  contactInfo: {
    phone: { type: String },
    email: { type: String }
  },
  rating: { type: Number, default: 0 },
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export const Venue = mongoose.model<IVenue>('Venue', venueSchema); 