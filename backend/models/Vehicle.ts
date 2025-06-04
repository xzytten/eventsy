import mongoose from 'mongoose';
import { IVehicle } from '../types/vehicle';
import { EVENT_TYPES } from '../constants/types';

const vehicleSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['LUXURY_CAR', 'LIMOUSINE', 'BUS', 'MINIVAN', 'SPECIAL_EVENT_VEHICLE'],
    required: true 
  },
  brand: { type: String, required: true },
  model: { type: String, required: true },
  year: { type: Number, required: true },
  capacity: { type: Number, required: true },
  description: { type: String, required: true },
  pricePerHour: { type: Number, required: true },
  pricePerDay: { type: Number, required: true },
  eventTypes: [{
    type: String,
    enum: EVENT_TYPES,
    required: true
  }],
  images: [{ type: String }],
  rating: { type: Number, default: 0 },
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export const Vehicle = mongoose.model<IVehicle>('Vehicle', vehicleSchema); 