import { type FC } from 'react';
import { ArrowLeft, Plus, Minus, Trash2 } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useNavigate } from 'react-router-dom';

const CartPage: FC = () => {
    const { cartItems, updateQuantity, removeFromCart, getTotalPrice } = useCart();
    const navigate = useNavigate();

    return (
        <div className="max-w-7xl mx-auto px-4 py-10">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-muted hover:text-white transition-colors mb-6"
            >
                <ArrowLeft size={20} />
                <span>Назад</span>
            </button>

            <div className="flex gap-8">
                {/* Основний контент */}
                <div className="flex-1">
                    <h1 className="text-2xl font-semibold mb-6">Кошик</h1>

                    <div className="space-y-4">
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
                </div>

                {/* Бічна панель з загальною сумою */}
                <div className="w-80 shrink-0 sticky top-4 h-fit">
                    <div className="bg-black-30 rounded-xl p-6">
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

export default CartPage; 