import PasswordTextField from '@/components/Fields/PasswordTextField/PasswordTextField';
import TextField from '@/components/Fields/TextField/TextField';
import logo from '@/assets/eventsy_logo.png';
import { useUserStore } from '@/store/userStore';
import { motion } from 'framer-motion';

import { type FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
    email: Yup.string().email('Невірний формат пошти').required('Пошта обов’язкова'),
    password: Yup.string().min(6, 'Мінімум 6 символів').required('Пароль обов’язковий'),
});

interface LoginFormValues {
    email: string;
    password: string;
}

const LoginPage: FC = () => {
    const navigate = useNavigate();
    const login = useUserStore(state => state.login);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormValues>({
        resolver: yupResolver(validationSchema),
    });

    const onSubmit = async (data: LoginFormValues) => {
        try {
            await login(data.email, data.password);
             toast.success('Ви успішно увійшли до системи!');
            navigate('/cabinet');
        } catch (err) {
            toast.error('Помилка входу. Перевірте ваші дані.');
        }
    };

    return (
        <div className='login-container flex w-full max-h-screen items-center justify-center'>
            <div className='max-w-300 w-full flex gap-12 items-center'>
                <motion.div
                    className='login-text flex flex-col gap-5 max-w-150'
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
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

                <motion.div
                    className='max-w-150 w-full'
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                        type: 'spring',
                        stiffness: 50,
                        damping: 15,
                        mass: 1.2,
                        duration: 0.8,
                    }}
                >
                    <div className='bg-mainbg rounded-xl shadow-xl max-w-100 text-white pt-8 pb-8 pl-15 pr-15'>
                        {/* Header */}
                        <div className='flex justify-between items-center mb-12'>
                            <div className='flex items-center gap-2'>
                                <img src={logo} alt='Auth background' className='w-22 h-auto' />
                            </div>
                            <div className='flex gap-3'>
                                <button className='text-m bg-[#f97480] rounded-full text-text-dark px-3 py-1 transition'>
                                    Вхід
                                </button>
                                <button
                                    onClick={() => navigate('/auth/register')}
                                    className='text-m text-white/70 font-medium cursor-pointer hover:text-white'
                                >
                                    Реєстрація
                                </button>
                            </div>
                        </div>

                        {/* Form */}
                        <motion.form
                            className='space-y-6 mb-5'
                            onSubmit={handleSubmit(onSubmit)}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                        >
                            <TextField
                                placeholder='Пошта'
                                {...register('email')}
                                error={errors.email?.message}
                            />

                            <PasswordTextField
                                placeholder='Пароль'
                                {...register('password')}
                                error={errors.password?.message}
                            />
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full py-2 mt-4 rounded-md bg-coral text-white font-normal text-xl hover:bg-[#b8626c] transition cursor-pointer"
                            >
                                Увійти
                            </button>
                        </motion.form>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default LoginPage;
