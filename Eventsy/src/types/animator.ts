export interface IEquipment {
  name: string;
  description: string;
  quantity: number;
}

export interface IContactInfo {
  phone: string;
  email: string;
}

export interface IAgeRange {
  min: number;
  max: number;
}

export interface IAnimator {
  _id: string;
  name: string;
  description?: string;
  specialties: string[];
  eventTypes: string[];
  ageRange: {
    min: number;
    max: number;
  };
  pricePerDay?: number;
  pricePerHour?: number;
  images: string[];
  paymentType?: 'full' | 'hourly';
  hours?: number;
  experience: number;
  capacity: number;
  rating: number;
  reviews: any[]; // TODO: додати тип для відгуків
  equipment: IEquipment[];
  contactInfo: IContactInfo;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAnimatorDto {
  name: string;
  description?: string;
  specialties: string[];
  eventTypes: string[];
  ageRange: {
    min: number;
    max: number;
  };
  pricePerDay?: number;
  pricePerHour?: number;
  images: string[];
} 