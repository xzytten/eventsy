import mongoose, { Document, Schema } from 'mongoose';
import { type EventType } from '../constants/types';

export interface IServiceItem {
  serviceId: mongoose.Types.ObjectId;
  clientDescription?: string; 
  quantity?: number;
  hours?: number; 
  paymentType?: 'full' | 'hourly'; 
}

export interface IOrder extends Document {
  user: mongoose.Types.ObjectId;
  eventType: EventType; 
  eventDate: Date; 
  generalDescription?: string;
 
  phoneNumber: string,
  venues?: Array<{
    serviceId: mongoose.Types.ObjectId;
    clientDescription?: string;
    quantity?: number;
    hours?: number;
    paymentType?: 'full' | 'hourly';
  }>;
  food?: Array<{
    serviceId: mongoose.Types.ObjectId;
    clientDescription?: string;
    quantity?: number;
  }>;
  animators?: Array<{
    serviceId: mongoose.Types.ObjectId;
    clientDescription?: string;
    quantity?: number;
    hours?: number;
    paymentType?: 'full' | 'hourly';
  }>;
  vehicles?: Array<{
    serviceId: mongoose.Types.ObjectId;
    clientDescription?: string;
    quantity?: number;
    hours?: number;
    paymentType?: 'full' | 'hourly';
  }>;
  music?: Array<{
    serviceId: mongoose.Types.ObjectId;
    clientDescription?: string;
    quantity?: number;
  }>;
  beverages?: Array<{
    serviceId: mongoose.Types.ObjectId;
    clientDescription?: string;
    quantity?: number;
  }>;
  photographers?: Array<{
    serviceId: mongoose.Types.ObjectId;
    clientDescription?: string;
    quantity?: number;
  }>;

  createdAt: Date;
  totalPrice: number; 
  status: string;
}

const OrderSchema: Schema = new Schema({
  user: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
  eventType: { type: String, required: true },
  eventDate: { type: Date, required: true },
  generalDescription: { type: String },
  venues: [{
    serviceId: { type: mongoose.Types.ObjectId, ref: 'Venue', required: true },
    clientDescription: { type: String },
    quantity: { type: Number },
    hours: { type: Number },
    paymentType: { type: String },
  }],
  food: [{
    serviceId: { type: mongoose.Types.ObjectId, ref: 'Food', required: true },
    clientDescription: { type: String },
    quantity: { type: Number },
  }],
  animators: [{
    serviceId: { type: mongoose.Types.ObjectId, ref: 'Animator', required: true },
    clientDescription: { type: String },
    quantity: { type: Number },
    hours: { type: Number },
    paymentType: { type: String },
  }],
  vehicles: [{
    serviceId: { type: mongoose.Types.ObjectId, ref: 'Vehicle', required: true },
    clientDescription: { type: String },
    quantity: { type: Number },
    hours: { type: Number },
    paymentType: { type: String },
  }],
  music: [{
    serviceId: { type: mongoose.Types.ObjectId, ref: 'Music', required: true },
    clientDescription: { type: String },
    quantity: { type: Number },
  }],
  beverages: [{
    serviceId: { type: mongoose.Types.ObjectId, ref: 'Beverage', required: true },
    clientDescription: { type: String },
    quantity: { type: Number },
  }],
  photographers: [{
    serviceId: { type: mongoose.Types.ObjectId, ref: 'Photographer', required: true },
    clientDescription: { type: String },
    quantity: { type: Number },
  }],

  createdAt: { type: Date, default: Date.now },
  totalPrice: { type: Number, required: true },
  phoneNumber: { type: String },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'confirmed', 'rejected', 'closed'],
    default: 'pending',
  },
}, {
  timestamps: true,
});

const Order = mongoose.model<IOrder>('Order', OrderSchema);

export default Order; 