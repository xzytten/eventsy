import { Users, Camera, Car, Music, Utensils } from 'lucide-react';
import { type ServiceCategory } from '@/types/services';

export const categories = [
    { id: 'all' as ServiceCategory, icon: null, label: 'Всі' },
    { id: 'food' as ServiceCategory, icon: <Utensils size={20} />, label: 'Їжа' },
    { id: 'animators' as ServiceCategory, icon: <Users size={20} />, label: 'Аніматори' },
    { id: 'photographers' as ServiceCategory, icon: <Camera size={20} />, label: 'Фотографи' },
    { id: 'music' as ServiceCategory, icon: <Music size={20} />, label: 'Музика' },
    { id: 'vehicles' as ServiceCategory, icon: <Car size={20} />, label: 'Автомобілі' },
    { id: 'venues' as ServiceCategory, icon: null, label: 'Локації' }
] as const; 