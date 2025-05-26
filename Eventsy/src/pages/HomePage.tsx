import type { FC } from 'react';
import { useUserStore } from '@/store/userStore';

const HomePage: FC = () => {
    const { user } = useUserStore();
    console.log('home page',user);


    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-4">Welcome to Eventsy</h1>
            {user && (
                <p className="text-lg mb-4">
                    Hello, {user.name}!
                </p>
            )}
        </div>
    );
};

export default HomePage; 