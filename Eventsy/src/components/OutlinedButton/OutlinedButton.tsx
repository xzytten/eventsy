import type { FC, ReactNode, ButtonHTMLAttributes } from 'react';
import clsx from 'clsx';

interface OutlinedButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    icon?: ReactNode;
    children: ReactNode;
    className?: string;
}

const OutlinedButton: FC<OutlinedButtonProps> = ({
    icon,
    children,
    className,
    ...rest
}) => (
    <button
        className={clsx(
            'flex items-center gap-2 border border-white/20 text-white px-4 py-2 rounded-xl hover:bg-white/5 transition cursor-pointer',
            className
        )}
        {...rest}
    >
        {icon}
        {children}
    </button>
);

export default OutlinedButton;
