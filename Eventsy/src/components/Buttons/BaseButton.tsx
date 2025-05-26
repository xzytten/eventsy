import { type FC } from 'react';

interface BaseButtonProps {
    text: string
}

const BaseButton: FC<BaseButtonProps> = ({ text }) => {
    return (
        <button
            type="submit"
            className="w-full py-2 mt-4 rounded-md bg-coral text-white font-normal text-xl hover:bg-[#b8626c] transition cursor-pointer"
        >
            {text}
        </button>
    );
};

export default BaseButton;