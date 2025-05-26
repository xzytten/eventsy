import { type FC } from 'react';

interface PasswordTextFieldProps {

    placeholder: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PasswordTextField: FC<PasswordTextFieldProps> = ({ placeholder, value, onChange }) => {
    return (
        <input
            type="password"
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className="w-full px-4 py-2 rounded-md bg-bg-dark-60 text-whiteplaceholder-text-transperent focus:outline-none focus:ring-1 focus:ring-[#f97480]"
        />
    );
};

export default PasswordTextField;