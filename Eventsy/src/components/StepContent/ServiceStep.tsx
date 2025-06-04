import { type FC } from 'react';
import { motion } from 'framer-motion';
import { useCartStore } from '@/store/cartStore';

const ServiceStep: FC = () => {
    const { items: cartItems, toggleCartItem } = useCartStore();

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cartItems.map((service) => (
                <motion.div
                    key={service.id}
                    onClick={() => toggleCartItem(service)}
                    className="cursor-pointer rounded-xl overflow-hidden"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <div className="aspect-video relative mb-4 rounded-lg overflow-hidden">
                        <img
                            src={service.image}
                            alt={service.title}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                    <div className="space-y-2">
                        <p className="text-muted">{service.location}</p>
                        <p className="text-coral font-semibold">
                            {service.hourlyPrice
                                ? `${service.hourlyPrice} грн/год`
                                : service.price
                                  ? `${service.price} грн`
                                  : 'Ціна не вказана'}
                        </p>
                    </div>
                </motion.div>
            ))}
        </div>
    );
};

export default ServiceStep; 