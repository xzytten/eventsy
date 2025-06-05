import { cartService } from '@/services/cartService';
import { useServiceStore } from '@/store/serviceStore';
import { useVenueStore } from '@/store/venueStore';
import useFoodStore from '@/store/foodStore';
import { useAnimatorStore } from '@/store/animatorStore';
import { useVehicleStore } from '@/store/vehicleStore';
import { type EventType } from '@/constants/types';

export const submitOrder = async (totalPrice: number) => {
    try {
        // Отримуємо дані зі сторів
        const serviceStore = useServiceStore.getState();
        const venueStore = useVenueStore.getState();
        const foodStore = useFoodStore.getState();
        const animatorStore = useAnimatorStore.getState();
        const vehicleStore = useVehicleStore.getState();
        console.log(serviceStore)
        const eventType = serviceStore.eventType || localStorage.getItem('eventsy_event_type');
        if (!eventType) {
            throw new Error('Event type is required');
        }

        // Підготовка даних замовлення
        const orderData = {
            eventType: eventType as EventType,
            eventDate: serviceStore.eventDate || new Date(localStorage.getItem('eventsy_event_date') || ''),
            generalDescription: serviceStore.generalDescription || localStorage.getItem('cart-description') || undefined,
            venues: venueStore.selectedVenues[0] && venueStore.selectedVenues[0]._id ? [{
                serviceId: venueStore.selectedVenues[0]._id,
                clientDescription: venueStore.selectedVenues[0].clientDescription || undefined,
                hours: venueStore.selectedVenues[0].hours || undefined,
                paymentType: venueStore.selectedVenues[0].paymentType || undefined
            }] : [],
            food: foodStore.selectedFood.filter(food => food._id).map(food => ({
                serviceId: food._id!,
                clientDescription: food.clientDescription || undefined,
                quantity: food.quantity || undefined
            })),
            animators: animatorStore.selectedAnimators.filter(animator => animator._id).map(animator => ({
                serviceId: animator._id!,
                clientDescription: animator.clientDescription || undefined,
                hours: animator.hours || undefined,
                paymentType: animator.paymentType || undefined
            })),
            vehicles: vehicleStore.selectedVehicles.filter(vehicle => vehicle._id).map(vehicle => ({
                serviceId: vehicle._id!,
                clientDescription: vehicle.clientDescription || undefined,
                hours: vehicle.hours || undefined,
                paymentType: vehicle.paymentType || undefined
            })),
            totalPrice: totalPrice
        };
        console.log(orderData)
        // Відправка замовлення
        const result = await cartService.createOrder(orderData);
        return result;
    } catch (error) {
        console.error('Error submitting order:', error);
        throw error;
    }
};

// Допоміжна функція для розрахунку загальної ціни
const calculateTotalPrice = (
    venue: any,
    food: any[],
    animators: any[],
    vehicles: any[]
): number => {
    let total = 0;

    // Додаємо ціну локації
    if (venue) {
        total += venue.paymentType === 'hourly' 
            ? venue.pricePerHour * (venue.hours || 1)
            : venue.pricePerDay;
    }

    // Додаємо ціну їжі
    food.forEach(item => {
        total += item.price * (item.quantity || 1);
    });

    // Додаємо ціну аніматорів
    animators.forEach(animator => {
        total += animator.paymentType === 'hourly'
            ? animator.pricePerHour * (animator.hours || 1)
            : animator.pricePerDay;
    });

    // Додаємо ціну транспортних засобів
    vehicles.forEach(vehicle => {
        total += vehicle.paymentType === 'hourly'
            ? vehicle.pricePerHour * (vehicle.hours || 1)
            : vehicle.pricePerDay;
    });

    return total;
}; 