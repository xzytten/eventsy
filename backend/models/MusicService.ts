import mongoose from 'mongoose';
import { IMusic } from '../types/music';
import { EVENT_TYPES } from '../constants/types';

const musicSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['DJ', 'LIVE_BAND', 'SOLO_ARTIST', 'MUSIC_EQUIPMENT'],
    required: true 
  },
  description: { type: String, required: true },
  genres: [{ type: String }],
  pricePerHour: { type: Number, required: true },
  equipment: [{
    name: { type: String },
    description: { type: String },
    quantity: { type: Number }
  }],
  eventTypes: [{
    type: String,
    enum: EVENT_TYPES,
    required: true
  }],
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export const MusicService = mongoose.model<IMusic>('Music', musicSchema); 