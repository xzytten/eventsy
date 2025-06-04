import { forwardRef } from 'react';
import type { ForwardedRef } from 'react';
import DatePicker from 'react-datepicker';
import { Calendar } from 'lucide-react';
import 'react-datepicker/dist/react-datepicker.css';
import { uk } from 'date-fns/locale/uk';

interface CustomDatePickerProps {
  value: Date | null;
  onChange: (date: Date | null) => void;
  minDate?: Date;
  placeholder?: string;
  className?: string;
}

interface CalendarButtonProps {
  onClick?: () => void;
  ariaLabel?: string;
}

const CalendarButton = forwardRef<HTMLButtonElement, CalendarButtonProps>(
  ({ onClick, ariaLabel }, ref) => (
    <button
      type="button"
      className="cursor-pointer"
      onClick={onClick}
      ref={ref}
      tabIndex={0}
      aria-label={ariaLabel || "Вибрати дату"}
    >
      <Calendar className="text-blue-gray w-8 h-8" />
    </button>
  )
);

export default function CustomDatePicker({
  value,
  onChange,
  minDate,
  placeholder = 'Виберіть дату',
  className = '',
}: CustomDatePickerProps) {
  // Форматування дати для відображення (день місяць рік, місяць повністю)
  const formatted =
    value
      ? value.toLocaleDateString('uk-UA', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        })
      : placeholder;

  return (
    <div className={`relative flex items-center gap-3 ${className}`}>
      <DatePicker
        selected={value}
        onChange={onChange}
        minDate={minDate}
        locale={uk}
        dateFormat="dd.MM.yyyy"
        customInput={<CalendarButton ariaLabel="Вибрати дату" />}
        popperClassName="z-50"
      />
      <span className={`text-white text-lg select-none ${!value ? 'text-muted' : ''}`}>
        {formatted}
      </span>
    </div>
  );
}
