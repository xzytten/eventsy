import BaseButton from '@/components/Buttons/BaseButton';
import PasswordTextField from '@/components/Fields/PasswordTextField/PasswordTextField';
import TextField from '@/components/Fields/TextField/TextField';
import logo from '@/assets/eventsy_logo.png'
import { useUserStore } from '@/store/userStore';

import { type FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
            setError('Помилка входу. Перевірте ваші дані.');
        }
    };

    return (
        <div className='login-container flex w-full max-h-screen  items-center justify-center '>
            <div className='max-w-300 w-full flex gap-12  items-center'>
                <div className='flex flex-col gap-5 max-w-150'>
                    <h1 className='text-6xl text-center text-text-milk '>З поверненням!</h1>
                    <h3 className='text-center text-minor-text text-2xl'>Раді бачити тебе знову в Eventsy — місці, де свята народжуються з натхненням. Ти вже знаєш, як це працює: кілька кліків — і твоя подія майже готова.</h3>
                </div>
                {/* //form container*/}
                <div className='max-w-150 w-full'>
                    <div className=" bg-mainbg rounded-xl shadow-xl max-w-100  text-white pt-8 pb-8 pl-15 pr-15">
                        {/* Header */}
                        <div className="flex justify-between items-center mb-12">
                            <div className="flex items-center gap-2 ">
                                <img src={logo} alt="Auth background" className="w-22 h-auto" />
                            </div>
                            <div className="flex gap-3">
                                <button className="text-m bg-[#f97480] rounded-full  text-text-dark px-3 py-1  transition">Вхід</button>
                                <button onClick={() => navigate('/auth/register')} className="text-m  text-white/70  font-medium cursor-pointer hover:text-white">
                                    Реєстрація
                                </button>
                            </div>
                        </div>
                        {/* Form */}
                        <form className="space-y-6 mb-5" onSubmit={handleLogin}>
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
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;