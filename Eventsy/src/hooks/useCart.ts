import { useState, useEffect } from 'react';

export type PaymentType = 'hourly' | 'full';

export interface CartItem {
    id: string;
    title: string;
    price: number;
    hourlyPrice?: number;
    duration: string;
    location: string;
    image: string;
    category: string;
    quantity: number;
    paymentType: PaymentType;
    hours?: number;
}

const CART_STORAGE_KEY = 'eventsy_cart';

export const useCart = () => {
    const [cartItems, setCartItems] = useState<CartItem[]>(() => {
        // Ініціалізація стану з localStorage при створенні хука
        if (typeof window !== 'undefined') {
            const savedCart = localStorage.getItem(CART_STORAGE_KEY);
            return savedCart ? JSON.parse(savedCart) : [];
        }
        return [];
    });

    // Збереження в localStorage при кожній зміні cartItems
    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
        }
    }, [cartItems]);

    const addToCart = (item: Omit<CartItem, 'quantity' | 'paymentType' | 'hours'>) => {
        setCartItems(prev => {
            const existingItem = prev.find(i => i.id === item.id);
            if (existingItem) {
                return prev;
            }
            return [...prev, { ...item, quantity: 1, paymentType: 'full' }];
        });
    };

    const updateQuantity = (id: string, quantity: number) => {
        if (quantity < 1) return;
        setCartItems(prev =>
            prev.map(item =>
                item.id === id ? { ...item, quantity } : item
            )
        );
    };

    const updatePaymentType = (id: string, paymentType: PaymentType, hours?: number) => {
        setCartItems(prev =>
            prev.map(item =>
                item.id === id ? { ...item, paymentType, hours } : item
            )
        );
    };

    const removeFromCart = (id: string) => {
        setCartItems(prev => prev.filter(item => item.id !== id));
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const getTotalPrice = () => {
        return cartItems.reduce((total, item) => {
            if (item.paymentType === 'hourly' && item.hours) {
                return total + (item.price * item.hours);
            }
            return total + (item.price * item.quantity);
        }, 0);
    };

    return {
        cartItems,
        addToCart,
        updateQuantity,
        updatePaymentType,
        removeFromCart,
        clearCart,
        getTotalPrice
    };
}; 