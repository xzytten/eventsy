import mongoose from 'mongoose';
import { IFood } from '../types/food';
import { EVENT_TYPES } from '../constants/types';

const foodSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['BREAKFAST', 'LUNCH', 'DINNER', 'BUFFET', 'CANAPES', 'DESSERTS', 'INDIVIDUAL_DISHES', 'FAST_FOOD'],
    required: true 
  },
  description: { type: String, required: true },
  // Для окремих страв
  weight: { type: Number }, // вага в грамах
  portion: { type: Number }, // кількість порцій
  price: { type: Number }, // ціна за вагу/порцію
  // Для наборів
  items: [{
    name: { type: String },
    quantity: { type: Number },
    price: { type: Number }
  }],
  totalPrice: { type: Number },
  servesPeople: { type: String, default: '' },
  eventTypes: [{
    type: String,
    enum: EVENT_TYPES,
    required: true
  }],
  isVegetarian: { type: Boolean, default: false },
  isVegan: { type: Boolean, default: false },
  allergens: [{ type: String }],
  images: [{ type: String }],
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export const Food = mongoose.model<IFood>('Food', foodSchema); 