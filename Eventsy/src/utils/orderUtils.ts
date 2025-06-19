import { cartService } from '@/services/cartService';
import { useServiceStore } from '@/store/serviceStore';
import { useVenueStore } from '@/store/venueStore';
import useFoodStore from '@/store/foodStore';
import { useAnimatorStore } from '@/store/animatorStore';
import { useVehicleStore } from '@/store/vehicleStore';
import useBeverageStore from '@/store/beverageStore';
import usePhotographerStore from '@/store/photographerStore';
import { type EventType } from '@/constants/types';

export const submitOrder = async (totalPrice: number, phoneNumber:string) => {
    try {
        const serviceStore = useServiceStore.getState();
        const venueStore = useVenueStore.getState();
        const foodStore = useFoodStore.getState();
        const animatorStore = useAnimatorStore.getState();
        const vehicleStore = useVehicleStore.getState();
        const beverageStore = useBeverageStore.getState();
        const photographerStore = usePhotographerStore.getState();
        console.log(serviceStore)
        const eventType = serviceStore.eventType || localStorage.getItem('eventsy_event_type');
        if (!eventType) {
            throw new Error('Event type is required');
        }

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
            beverages: beverageStore.selectedBeverages.filter(beverage => beverage.name).map(beverage => ({
                serviceId: beverage.name, 
                clientDescription: ('clientDescription' in beverage && typeof beverage.clientDescription === 'string') ? beverage.clientDescription : undefined,
                quantity: 'quantity' in beverage && typeof beverage.quantity === 'number' ? beverage.quantity : undefined
            })),
            photographers: photographerStore.selectedPhotographers.filter(photographer => photographer._id).map(photographer => ({
                serviceId: photographer._id!,
                clientDescription: photographer.clientDescription || undefined,
                hours: photographer.hours || undefined,
                paymentType: photographer.paymentType || undefined
            })),
            totalPrice: totalPrice,
            phoneNumber: phoneNumber,
        };
        console.log(orderData)
        const result = await cartService.createOrder(orderData);
        return result;
    } catch (error) {
        console.error('Error submitting order:', error);
        throw error;
    }
};

const calculateTotalPrice = (
    venue: any,
    food: any[],
    animators: any[],
    vehicles: any[]
): number => {
    let total = 0;

    if (venue) {
        total += venue.paymentType === 'hourly' 
            ? venue.pricePerHour * (venue.hours || 1)
            : venue.pricePerDay;
    }

    food.forEach(item => {
        total += item.price * (item.quantity || 1);
    });

    animators.forEach(animator => {
        total += animator.paymentType === 'hourly'
            ? animator.pricePerHour * (animator.hours || 1)
            : animator.pricePerDay;
    });

    vehicles.forEach(vehicle => {
        total += vehicle.paymentType === 'hourly'
            ? vehicle.pricePerHour * (vehicle.hours || 1)
            : vehicle.pricePerDay;
    });

    return total;
}; 