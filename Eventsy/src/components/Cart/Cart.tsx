import { type FC } from 'react';
import { X, Plus, Minus, Trash2 } from 'lucide-react';
import { useCart } from '@/hooks/useCart';

interface CartProps {
    isOpen: boolean;
    onClose: () => void;
}

const Cart: FC<CartProps> = ({ isOpen, onClose }) => {
    const { cartItems, updateQuantity, removeFromCart, getTotalPrice } = useCart();

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-[#181820] z-50 flex items-center justify-center">
            <div className="w-full max-w-3xl mx-auto px-4">
                <div className="rounded-xl flex flex-col max-h-[80vh]">
                    <div className="p-6 border-b border-white/10 flex justify-between items-center">
                        <h2 className="text-2xl font-semibold">Кошик</h2>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        {cartItems.length === 0 ? (
                            <div className="text-center text-muted py-12 text-lg">
                                Кошик порожній
                            </div>
                        ) : (
                            cartItems.map((item) => (
                                <div
                                    key={item.id}
                                    className="bg-black-40 rounded-lg p-6 space-y-4"
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-lg font-medium">{item.title}</h3>
                                            <p className="text-muted mt-1">{item.duration}</p>
                                        </div>
                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                                        >
                                            <Trash2 size={20} className="text-red-500" />
                                        </button>
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                                            >
                                                <Minus size={20} />
                                            </button>
                                            <span className="text-lg">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                                            >
                                                <Plus size={20} />
                                            </button>
                                        </div>
                                        <span className="text-xl font-medium text-coral">
                                            {item.price * item.quantity} ₴
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="p-6 border-t border-white/10">
                        <div className="flex justify-between items-center mb-6">
                            <span className="text-xl">Всього:</span>
                            <span className="text-2xl font-semibold text-coral">
                                {getTotalPrice()} ₴
                            </span>
                        </div>
                        <button
                            className="w-full bg-coral text-white py-4 rounded-lg text-lg font-medium hover:bg-coral/90 transition-colors"
                            disabled={cartItems.length === 0}
                        >
                            Оформити замовлення
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart; 