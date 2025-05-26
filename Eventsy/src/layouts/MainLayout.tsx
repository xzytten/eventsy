import type { FC } from 'react';
import { Outlet } from 'react-router-dom';
import { ParticlesBackground } from '@/components/Particles/ParticlesBackground';
import Header from '@/components/Header/Header';
import '@/components/Particles/animation.css';

const MainLayout: FC = () => {
    return (
        <div className="main-container overflow-auto">
            <ParticlesBackground />
            <div className="relative z-10 min-h-screen">
                <Header />
                <main className=" container mx-auto py-5 px-5 ">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default MainLayout; 