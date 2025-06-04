import mongoose from 'mongoose';
import { IBeverage } from '../types/beverage';
import { EVENT_TYPES } from '../constants/types';

const beverageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['ALCOHOLIC', 'NON_ALCOHOLIC', 'HOT_DRINKS', 'COCKTAILS', 'PACKAGES', 'BAR'],
    required: true 
  },
  description: { type: String, required: true },
  isPackage: { type: Boolean, default: false },
  items: [{
    name: { type: String },
    type: { 
      type: String, 
      enum: ['ALCOHOLIC', 'NON_ALCOHOLIC', 'HOT_DRINKS', 'COCKTAILS'],
    },
    volume: { type: Number },
    quantity: { type: Number },
    price: { type: Number }
  }],
  volume: { type: Number },
  totalPrice: { type: Number, required: true },
  isAlcoholic: { type: Boolean, required: true },
  alcoholContent: { type: Number },
  ingredients: [{ type: String }],
  eventTypes: [{
    type: String,
    enum: EVENT_TYPES,
    required: true
  }],
  images: [{ type: String }],
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export const Beverage = mongoose.model<IBeverage>('Beverage', beverageSchema); 