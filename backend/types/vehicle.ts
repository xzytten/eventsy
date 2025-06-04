import { VehicleType, EventType } from '../constants/types';

export interface IVehicle {
  _id?: string;
  name: string;
  type: VehicleType;
  brand: string;
  model: string;
  year: number;
  capacity: number;
  description: string;
  pricePerHour: number;
  pricePerDay: number;
  eventTypes: EventType[];
  images: string[];
  rating: number;
  reviews: string[];
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
