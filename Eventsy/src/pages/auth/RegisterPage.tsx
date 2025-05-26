import { type FC, useState } from 'react';
import logo from '@/assets/eventsy_logo.png';
import TextField from '@/components/Fields/TextField/TextField';
import PasswordTextField from '@/components/Fields/PasswordTextField/PasswordTextField';
import BaseButton from '@/components/Buttons/BaseButton';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '@/store/userStore';

const RegisterPage: FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const register = useUserStore(state => state.register);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await register(email, password, name);
      navigate('/home');
    } catch (err) {
      setError('Помилка реєстрації. Спробуйте ще раз.');
    }
  };

  return (
    <div className='flex w-full max-h-screen  items-center justify-center '>
      <div className='register-container max-w-300 w-full flex gap-12 items-center'>
        <div className='flex flex-col gap-5 max-w-150'>
          <h3 className='text-6xl text-center text-text-milk '>Керуйте подіями з Eventsy</h3>
          <h3 className='text-center text-minor-text text-2xl'>
            Не потрібно тисячі списків, зайвих дзвінків і хвилювань. З Eventsy ти створиш подію за лічені хвилини — а далі ми допоможемо зробити її особливою.
          </h3>
        </div>

        {/* form container */}
        <div className='max-w-150 w-full'>
          <div className="bg-mainbg rounded-xl shadow-xl max-w-100 text-white pt-8 pb-8 pl-15 pr-15">
            {/* Header */}
            <div className="flex justify-between items-center mb-12">
              <img src={logo} alt="Auth background" className="w-22 h-auto" />
              <div className="flex gap-3">
                <button onClick={() => navigate('/auth/login')} className="text-m text-white/70 hover:text-white transition cursor-pointer">
                  Вхід
                </button>
                <button className="text-m px-3 py-1 bg-[#f97480] text-text-dark rounded-full font-medium">
                  Реєстрація
                </button>
              </div>
            </div>

            {/* Form */}
            <form className="space-y-6 mb-5" onSubmit={handleRegister}>
              {error && <div className="text-red-500 text-center">{error}</div>}
              <TextField
                placeholder="Ім'я"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <TextField
                placeholder="Пошта"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <PasswordTextField
                placeholder="Пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <BaseButton text='Зареєструватися' />
            </form>

            {/* Bottom link */}
            <p className="text-center text-sm text-white/80">
              Уже маю обліковий запис?{' '}
              <span 
                onClick={() => navigate('/auth/login')}
                className="underline underline-offset-2 cursor-pointer hover:text-white"
              >
                Увійти
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
