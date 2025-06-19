import { type FC } from 'react';
import logo from '@/assets/eventsy_logo.png';
import TextField from '@/components/Fields/TextField/TextField';
import PasswordTextField from '@/components/Fields/PasswordTextField/PasswordTextField';
import BaseButton from '@/components/Buttons/BaseButton';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '@/store/userStore';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import toast from 'react-hot-toast';

interface RegisterFormValues {
  name: string;
  email: string;
  password: string;
}

const schema = yup.object().shape({
  name: yup
    .string()
    .min(3, "Ім’я має містити щонайменше 3 символи")
    .required("Введіть ім’я"),
  email: yup
    .string()
    .email("Некоректна пошта")
    .required("Введіть пошту"),
  password: yup
    .string()
    .min(6, "Мінімум 6 символів")
    .required("Введіть пароль"),
});

const RegisterPage: FC = () => {
  const navigate = useNavigate();
  const registerUser = useUserStore(state => state.register);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<RegisterFormValues>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      await registerUser(data.email, data.password, data.name);
      toast.success('Ви успішно зареєструвались!');
      navigate('/home');
    } catch (error: any) {
      toast.error(error?.message);
      throw new Error(error)
    }
  };

  return (
    <div className='flex w-full max-h-screen items-center justify-center'>
      <div className='register-container max-w-300 w-full flex gap-12 items-center'>
        <motion.div
          className='register-text flex flex-col gap-5 max-w-150'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.h3
            className='text-6xl text-center text-text-milk'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            Керуйте подіями з Eventsy
          </motion.h3>
          <motion.h3
            className='text-center text-minor-text text-2xl'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
          >
            Не потрібно тисячі списків, зайвих дзвінків і хвилювань. З Eventsy ти створиш подію за лічені хвилини — а далі ми допоможемо зробити її особливою.
          </motion.h3>
        </motion.div>

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
              <img src={logo} alt="Auth background" className="w-22 h-auto" />
              <div className="flex gap-3">
                <button
                  onClick={() => navigate('/auth/login')}
                  className="text-m text-white/70 hover:text-white transition cursor-pointer"
                >
                  Вхід
                </button>
                <button className="text-m px-3 py-1 bg-[#f97480] text-text-dark rounded-full font-medium">
                  Реєстрація
                </button>
              </div>
            </div>

            {/* Form */}
            <motion.form
              className="space-y-6 mb-5"
              onSubmit={handleSubmit(onSubmit)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              {errors.root?.message && (
                <div className="text-red-500 text-center">{errors.root.message}</div>
              )}
              <TextField
                placeholder="Ім'я"
                {...register("name")}
                error={errors.name?.message}
              />
              <TextField
                placeholder="Пошта"
                {...register("email")}
                error={errors.email?.message}
              />
              <PasswordTextField
                placeholder="Пароль"
                {...register("password")}
                error={errors.password?.message}
              />
              <BaseButton text='Зареєструватися' />
            </motion.form>

            {/* Bottom link */}
            <motion.p
              className="text-center text-sm text-white/80"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              Уже маю обліковий запис?{' '}
              <span
                onClick={() => navigate('/auth/login')}
                className="underline underline-offset-2 cursor-pointer hover:text-white"
              >
                Увійти
              </span>
            </motion.p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default RegisterPage;
