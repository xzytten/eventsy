import { forwardRef } from 'react';

interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  ({ placeholder, type = 'text', error, className = '', ...rest }, ref) => {
    return (
      <div className="flex flex-col gap-1 w-full">
        <input
          ref={ref}
          type={type}
          placeholder={placeholder}
          className={`w-full px-4 py-2 rounded-md bg-bg-dark-60 text-white focus:outline-none focus:ring-1 ${
            error ? 'ring-red-500' : 'focus:ring-[#f97480]'
          } ${className}`}
          {...rest}
        />
        {error && <span className="text-red-500 text-sm">{error}</span>}
      </div>
    );
  }
);

TextField.displayName = 'TextField';

export default TextField;
