import { type Service, type EventType } from '@/types/services';
import { animatorService } from './animatorService';



export type ServiceCategory = 'animators' | 'photographers' | 'food' | 'music' | 'venues' | 'all';

export const servicesService = {
    // Отримати всі послуги за категорією
    // Отримати всі послуги
    // getAllServices: async (): Promise<Service[]> => {
    //     await new Promise(resolve => setTimeout(resolve, 500));
        
    //     try {
    //         const animators = await animatorService.getAll();
    //         const animatorServices = animators.map(animator => ({
    //             id: animator._id,
    //             title: animator.name,
    //             price: animator.pricePerDay,
    //             hourlyPrice: animator.pricePerHour,
    //             duration: '1 день',
    //             location: 'Київ',
    //             image: animator.images[0] || '',
    //             eventTypes: animator.eventTypes as EventType[],
    //             category: 'animators' as ServiceCategory,
    //             description: animator.description,
    //             rating: animator.rating,
    //             reviews: animator.reviews,
    //             capacity: animator.capacity,
    //             ageRange: animator.ageRange
    //         }));

    //         const otherServices = Object.entries(mockServices)
    //             .filter(([category]) => category !== 'animators')
    //             .flatMap(([_, services]) => services);

    //         return [...animatorServices, ...otherServices];
    //     } catch (error) {
    //         console.error('Error fetching animators:', error);
    //         return Object.values(mockServices).flat();
    //     }
    // },

   
}; 