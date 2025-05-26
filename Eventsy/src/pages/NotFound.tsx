import type { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { ParticlesBackground } from '@/components/Particles/ParticlesBackground';

const NotFound: FC = () => {
    const navigate = useNavigate();

    return (
        <div className="main-container">
            <ParticlesBackground />
            <div className="relative z-10 min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-9xl font-bold text-text-milk mb-4">404</h1>
                    <p className="text-2xl text-minor-text mb-8">Сторінку не знайдено</p>
                    <button
                        onClick={() => navigate('/home')}
                        className="px-6 py-3 bg-coral text-text-dark rounded-full hover:bg-[#b8626c] transition"
                    >
                        Повернутися на головну
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NotFound; 