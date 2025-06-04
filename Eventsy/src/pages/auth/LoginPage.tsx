import BaseButton from '@/components/Buttons/BaseButton';
import PasswordTextField from '@/components/Fields/PasswordTextField/PasswordTextField';
import TextField from '@/components/Fields/TextField/TextField';
import logo from '@/assets/eventsy_logo.png'
import { useUserStore } from '@/store/userStore';
import { motion } from 'framer-motion';

import { type FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const LoginPage: FC = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const login = useUserStore(state => state.login);
    const { user } = useUserStore();
    console.log('login page',user);
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            await login(email, password);
            navigate('/home');
        } catch (err) {
            toast.error('Помилка входу. Перевірте ваші дані.');
        }
    };

    return (
        <div className='login-container flex w-full max-h-screen items-center justify-center'>
            <div className='max-w-300 w-full flex gap-12 items-center'>
                <motion.div 
                    className='flex flex-col gap-5 max-w-150'
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <motion.h1 
                        className='text-6xl text-center text-text-milk'
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.3 }}
                    >
                        З поверненням!
                    </motion.h1>
                    <motion.h3 
                        className='text-center text-minor-text text-2xl'
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.6 }}
                    >
                        Раді бачити тебе знову в Eventsy — місці, де свята народжуються з натхненням. Ти вже знаєш, як це працює: кілька кліків — і твоя подія майже готова.
                    </motion.h3>
                </motion.div>
                {/* //form container*/}
                <motion.div 
                    className='max-w-150 w-full'
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ 
                        type: "spring",
                        stiffness: 50,
                        damping: 15,
                        mass: 1.2,
                        duration: 0.8
                    }}
                >
                    <div className="bg-mainbg rounded-xl shadow-xl max-w-100 text-white pt-8 pb-8 pl-15 pr-15">
                        {/* Header */}
                        <div className="flex justify-between items-center mb-12">
                            <div className="flex items-center gap-2">
                                <img src={logo} alt="Auth background" className="w-22 h-auto" />
                            </div>
                            <div className="flex gap-3">
                                <button className="text-m bg-[#f97480] rounded-full text-text-dark px-3 py-1 transition">Вхід</button>
                                <button 
                                    onClick={() => navigate('/auth/register')} 
                                    className="text-m text-white/70 font-medium cursor-pointer hover:text-white"
                                >
                                    Реєстрація
                                </button>
                            </div>
                        </div>
                        {/* Form */}
                        <motion.form 
                            className="space-y-6 mb-5" 
                            onSubmit={handleLogin}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                        >
                            {error && <div className="text-red-500 text-center">{error}</div>}
                            <TextField
                                placeholder="Пошта"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <PasswordTextField
                                placeholder='Пароль'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <BaseButton text='Увійти' />
                        </motion.form>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default LoginPage;