import { type FC } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import OutlinedButton from '../OutlinedButton/OutlinedButton';

interface NavOutlinedButtonProps {
    to: string;
    children: React.ReactNode;
    icon?: React.ReactNode;
    className?: string;
}

const NavOutlinedButton: FC<NavOutlinedButtonProps> = ({
    to,
    children,
    icon,
    className,
}) => {
    const location = useLocation();
    const navigate = useNavigate();
    const isActive = location.pathname === to;

    const activeStyles = 'border-coral font-semibold bg-white/5 ring-1 ring-coral';
    const inactiveStyles = 'border-white/20 hover:bg-white/10 hover:border-coral';
    const textColor = isActive ? 'text-coral' : 'text-white';

    return (
        <OutlinedButton
            icon={icon && <div className={textColor}>{icon}</div>}
            className={`transition-all ${isActive ? activeStyles : inactiveStyles} ${className ?? ''}`}
            onClick={() => navigate(to)}
        >
            <span className={textColor}>{children}</span>
        </OutlinedButton>
    );
};

export default NavOutlinedButton;
