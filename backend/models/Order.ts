import mongoose, { Document, Schema } from 'mongoose';
import { type EventType } from '../constants/types';

export interface IServiceItem {
  serviceId: mongoose.Types.ObjectId; // Reference to the specific service (Venue, Food, etc.)
  clientDescription?: string; // Client-specific description for this service
  quantity?: number; // Quantity (useful for food, etc.)
  hours?: number; // Hours (useful for hourly services)
  paymentType?: 'full' | 'hourly'; // Payment type for this service
}

export interface IOrder extends Document {
  user: mongoose.Types.ObjectId; // Reference to the User who placed the order
  eventType: EventType; // Type of the event
  eventDate: Date; // Date of the event
  generalDescription?: string; // General description for the entire order
  // Separate arrays for each service category
  venues?: IServiceItem[];
  food?: IServiceItem[];
  animators?: IServiceItem[];
  vehicles?: IServiceItem[];
  music?: IServiceItem[];
  beverages?: IServiceItem[];
  photographers?: IServiceItem[];
  // Add other categories as needed
  createdAt: Date; // Date the order was created
  totalPrice: number; // Total price of the order (can calculate on demand or store)
}

const ServiceItemSchema: Schema = new Schema({
  serviceId: { type: mongoose.Types.ObjectId, required: true },
  clientDescription: { type: String },
  quantity: { type: Number },
  hours: { type: Number },
  paymentType: { type: String },
});

const OrderSchema: Schema = new Schema({
  user: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
  eventType: { type: String, required: true },
  eventDate: { type: Date, required: true },
  generalDescription: { type: String },
  // Separate arrays for each service category using the ServiceItemSchema
  venues: [ServiceItemSchema],
  food: [ServiceItemSchema],
  animators: [ServiceItemSchema],
  vehicles: [ServiceItemSchema],
  music: [ServiceItemSchema],
  beverages: [ServiceItemSchema],
  photographers: [ServiceItemSchema],
  // Add other categories as needed
  createdAt: { type: Date, default: Date.now },
  totalPrice: { type: Number, required: true },
});

const Order = mongoose.model<IOrder>('Order', OrderSchema);

export default Order; 