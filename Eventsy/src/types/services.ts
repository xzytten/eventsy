export type ServiceCategory = 'animators' | 'photographers' | 'vehicles' | 'all' | 'venues' | 'food' | 'music';
export type EventType = 'WEDDING' | 'BIRTHDAY' | 'CORPORATE' | 'CONFERENCE' | 'GRADUATION' | 'BAPTISM' | 'ANNIVERSARY' | 'BANQUET' | 'BUFFET' | 'ANY_EVENT';

export interface IAgeRange {
    min: number;
    max: number;
}

export interface Service {
    id: string;
    title: string;
    description?: string;
    price?: number;
    hourlyPrice?: number;
    duration: string;
    location: string;
    image: string;
    eventTypes: EventType[];
    category: ServiceCategory;
    rating?: number;
    reviews?: any[];
    capacity?: number;
    ageRange?: IAgeRange;
    venue?: {
        name: string;
        address: string;
        capacity: number;
        price: number;
    };
    food?: {
        name: string;
        description: string;
        pricePerPerson: number;
        options: string[];
    };
}

export interface Venue {
    id: string;
    name: string;
    address: string;
    capacity: number;
    price: number;
    eventTypes: EventType[];
}

export interface Food {
    id: string;
    name: string;
    description: string;
    pricePerPerson: number;
    options: string[];
    eventTypes: EventType[];
} 