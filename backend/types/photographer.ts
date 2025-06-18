import { EventType } from '../constants/types';

export interface IPhotographer {
  _id?: string;
  name: string;
  experienceYears: number;
  specialization: string[];
  description: string;
  pricePerHour: number;
  pricePerDay: number;
  eventTypes: EventType[];
  createdAt?: Date;
  updatedAt?: Date;

} 