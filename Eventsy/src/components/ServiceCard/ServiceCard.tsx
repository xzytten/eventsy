import { type FC } from 'react';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/hooks/useCart';

interface ServiceCardProps {
    id: string;
    title: string;
    price: number;
    hourlyPrice?: number;
    duration: string;
    location: string;
    image: string;
    category: string;
}

const ServiceCard: FC<ServiceCardProps> = ({
    id,
    title,
    price,
    hourlyPrice,
    duration,
    location,
    image,
    category
}) => {
    const { addToCart, cartItems } = useCart();
    const isInCart = cartItems.some(item => item.id === id);

    return (
        <div className="bg-black-40 rounded-lg overflow-hidden">
            <div className="aspect-video bg-black-30 flex items-center justify-center">
                <span className="text-2xl font-medium">{image}</span>
            </div>
            <div className="p-4 space-y-4">
                <div>
                    <h3 className="text-lg font-medium">{title}</h3>
                    <p className="text-muted mt-1">{duration}</p>
                </div>
                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <span className="text-muted">Ціна за весь день:</span>
                        <span className="text-xl font-medium text-coral">{price} ₴</span>
                    </div>
                    {hourlyPrice && (
                        <div className="flex justify-between items-center">
                            <span className="text-muted">Ціна за годину:</span>
                            <span className="text-xl font-medium text-coral">{hourlyPrice} ₴</span>
                        </div>
                    )}
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-muted">{location}</span>
                    <button
                        onClick={() => addToCart({ id, title, price, hourlyPrice, duration, location, image, category })}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                            isInCart
                                ? 'bg-coral/20 text-coral cursor-default'
                                : 'bg-coral text-white hover:bg-coral/90 cursor-pointer'
                        }`}
                    >
                        {isInCart ? 'В кошику' : 'Додати'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ServiceCard; 