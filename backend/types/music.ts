import { MusicType, EventType } from '../constants/types';

export interface IMusic {
  _id?: string;
  name: string;
  type: MusicType;
  description: string;
  genres: string[];
  pricePerHour: number;
  equipment: Array<{
    name: string;
    description: string;
    quantity: number;
  }>;
  eventTypes: EventType[];
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
} 