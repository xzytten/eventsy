import { type FC, type ReactElement } from 'react';

interface InfoFieldProps {
    icon: ReactElement;
    label: string;
    value: string | number;
}

const InfoField: FC<InfoFieldProps> = ({ icon, label, value }) => {
    return (
        <div className="flex justify-between items-center">
            <span className="flex items-center gap-2 text-muted">
                {icon}
                {label}
            </span>
            <span>{value}</span>
        </div>
    );
};

export default InfoField; 