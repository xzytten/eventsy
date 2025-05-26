import { type FC } from 'react';

interface TextFieldProps {
    placeholder: string;
    type?: string,
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const TextField: FC<TextFieldProps> = ({ placeholder, value, onChange, type = 'text' }) => {
    return (
        <input
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className="w-full px-4 py-2 rounded-md bg-bg-dark-60  text-white  focus:outline-none focus:ring-1 focus:ring-[#f97480]"
        />
    );
};

export default TextField;