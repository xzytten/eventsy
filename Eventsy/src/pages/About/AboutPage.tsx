import type { FC } from 'react';
import bgImage from '@/assets/about_us_1.png';
const AboutPage: FC = () => {
    return (
        <div className='flex flex-col items-center'>

            <div className='w-full  flex flex-col  items-center justify-center gap-10  bg-cover bg-center bg-no-repeat h-[650px]'
                style={{ backgroundImage: `url(${bgImage})` }}>
                <h2 className="text-5xl font-boldь text-coral mt-20">Хто ми?</h2>
                <p className='max-w-160 text-xl text-center text-white'><span className='text-coral'>Eventsy</span> — це сучасна онлайн-платформа для організації подій, яка економить ваш час і перетворює планування в задоволення.</p>
                <p className='max-w-160 text-xl text-center text-white'>Ми створили Eventsy, щоб кожен міг легко, швидко й інтуїтивно зібрати свою ідеальну подію — від вечірки до весілля. Забудьте про нескінченні дзвінки, блокноти й таблиці. Все під контролем — в одному інтерфейсі.</p>
            </div>
          <h2 className="text-5xl font-bold text-coral mt-20 mb-100 wi">НАШІ ПОСЛУГИ</h2>




        </div>
    );
};

export default AboutPage; 