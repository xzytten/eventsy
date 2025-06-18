import { Users, Camera, Car,  Utensils, MapPin, CupSoda } from 'lucide-react';
import { type ServiceCategory } from '@/types/services';

export const categories = [
    { id: 'all' as ServiceCategory, icon: null, label: 'Всі' },
    { id: 'food' as ServiceCategory, icon: <Utensils size={20} />, label: 'Їжа' },
    { id: 'animators' as ServiceCategory, icon: <Users size={20} />, label: 'Аніматори' },
    { id: 'photographers' as ServiceCategory, icon: <Camera size={20} />, label: 'Фотографи' },
    { id: 'beverage' as ServiceCategory, icon: <CupSoda size={20} />, label: 'Напої' },
    { id: 'vehicles' as ServiceCategory, icon: <Car size={20} />, label: 'Автомобілі' },
    { id: 'venues' as ServiceCategory, icon: <MapPin size={20} />, label: 'Локації' }
] as const; 