import { type FC } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Clock, ArrowRight } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

const OrderSuccessPage: FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // Перевіряємо, чи користувач прийшов зі сторінки оформлення замовлення
        if (!location.state?.fromCheckout) {
            navigate('/home');
        }
    }, [location.state, navigate]);

    return (
        <div className="max-h-screen flex items-center justify-center bg-background px-4">
            <motion.div 
                className="max-w-2xl w-full bg-black-40 rounded-2xl p-8 md:p-12 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ 
                        type: "spring",
                        stiffness: 200,
                        damping: 20,
                        delay: 0.2
                    }}
                >
                    <CheckCircle2 className="w-20 h-20 text-coral mx-auto mb-6" />
                </motion.div>

                <motion.h1 
                    className="text-3xl md:text-4xl font-bold text-white mb-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    Замовлення успішно оформлене!
                </motion.h1>

                <motion.div 
                    className="flex items-center justify-center gap-2 text-muted mb-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                >
                    <Clock className="w-5 h-5" />
                    <span>Наш менеджер зв'яжеться з вами найближчим часом</span>
                </motion.div>

                <motion.p 
                    className="text-lg text-muted mb-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    Дякуємо за ваше замовлення! Наші спеціалісти вже почали його обробку. 
                    Ми проаналізуємо всі деталі та зв'яжемося з вами для уточнення всіх нюансів.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                >
                    <button
                        onClick={() => navigate('/home')}
                        className="inline-flex items-center gap-2 bg-coral text-white px-6 py-3 rounded-lg hover:bg-coral/90 transition-colors cursor-pointer"
                    >
                        Повернутися на головну
                        <ArrowRight className="w-5 h-5" />
                    </button>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default OrderSuccessPage; 