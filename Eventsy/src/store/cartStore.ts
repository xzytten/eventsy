import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { type CartItem, type PaymentType } from '@/types/cart';

interface CartState {
    items: CartItem[];
    generalDescription: string;
    addToCart: (item: Omit<CartItem, 'quantity' | 'paymentType' | 'hours' | 'clientDescription'>) => void;
    removeFromCart: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    updatePaymentType: (id: string, type: PaymentType) => void;
    updateHours: (id: string, hours: number) => void;
    updateClientDescription: (id: string, description: string) => void;
    updateGeneralDescription: (description: string) => void;
    clearCart: () => void;
    toggleCartItem: (item: Omit<CartItem, 'quantity' | 'paymentType' | 'hours' | 'clientDescription'>) => void;
    getTotalPrice: () => number;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            generalDescription: '',
            
            updateQuantity: (id, newQuantity) => set(state => {
                if (newQuantity < 1) return state;
                return {
                    items: state.items.map(item =>
                        item.id === id ? { ...item, quantity: newQuantity } : item
                    )
                };
            }),
            
            addToCart: (item) => set((state) => {
                if (state.items.some(existingItem => existingItem.id === item.id)) {
                    return state;
                }

                const newItem: CartItem = {
                    ...item,
                    quantity: 1,
                    paymentType: item.hourlyPrice ? 'hourly' : 'full',
                    hours: item.hourlyPrice ? 1 : undefined,
                    description: item.description,
                    clientDescription: ''
                };
            
                return {
                    items: [...state.items, newItem]
                };
            }),
            
            removeFromCart: (id) => set((state) => ({
                items: state.items.filter(item => item.id !== id),
            })),
            
            toggleCartItem: (item) => set((state) => {
                const isItemInCart = state.items.some(existingItem => existingItem.id === item.id);
                
                if (isItemInCart) {
                    return {
                        items: state.items.filter(cartItem => cartItem.id !== item.id),
                    };
                } else {
                    const newItem: CartItem = {
                        ...item,
                        quantity: 1,
                        paymentType: item.hourlyPrice ? 'hourly' : 'full',
                        hours: item.hourlyPrice ? 1 : undefined,
                        description: item.description,
                        clientDescription: ''
                    };
                    return {
                        items: [...state.items, newItem]
                    };
                }
            }),
            
            updatePaymentType: (id, type) => set((state) => ({
                items: state.items.map(item =>
                    item.id === id ? { ...item, paymentType: type, hours: type === 'hourly' ? (item.hours || 1) : undefined } : item
                )
            })),
            
            updateHours: (id, hours) => set((state) => {
                if (hours < 1) return state;
                return {
                    items: state.items.map(item =>
                        item.id === id && item.paymentType === 'hourly' ? { ...item, hours } : item
                    )
                };
            }),
            
            updateClientDescription: (id, description) => set((state) => ({
                items: state.items.map(item =>
                    item.id === id ? { ...item, clientDescription: description } : item
                )
            })),
            
            updateGeneralDescription: (description) => set(() => ({ 
                generalDescription: description 
            })),
            
            clearCart: () => set(() => ({ 
                items: [], 
                generalDescription: '' 
            })),

            getTotalPrice: () => {
                const state = get();
                return state.items.reduce((total, item) => {
                    if (item.paymentType === 'hourly' && item.hours && item.hourlyPrice) {
                        return total + item.hourlyPrice * item.hours;
                    }
                    return total + (item.price || 0) * item.quantity;
                }, 0);
            }
        }),
        {
            name: 'cart-storage',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                items: state.items,
                generalDescription: state.generalDescription
            })
        }
    )
); 