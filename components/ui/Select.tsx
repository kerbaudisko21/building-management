import { SelectHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      error,
      options,
      placeholder = 'Select an option',
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    const hasError = !!error;

    return (
      <div className="w-full">
        {/* Label */}
        {label && (
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        {/* Select Container */}
        <div className="relative">
          <select
            ref={ref}
            className={cn(
              'block w-full px-4 py-2.5 pr-10 rounded-lg transition-all appearance-none',
              'bg-white dark:bg-slate-800',
              'border text-slate-900 dark:text-white',
              'focus:outline-none focus:ring-2',
              // Normal state
              !hasError && 'border-slate-300 dark:border-slate-700 focus:border-indigo-500 focus:ring-indigo-500/20',
              // Error state
              hasError && 'border-red-500 dark:border-red-500 focus:border-red-500 focus:ring-red-500/20',
              // Disabled
              disabled && 'opacity-50 cursor-not-allowed bg-slate-50 dark:bg-slate-900',
              className
            )}
            disabled={disabled}
            {...props}
          >
            <option value="" disabled>
              {placeholder}
            </option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          {/* Chevron Icon */}
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <ChevronDown className="w-5 h-5 text-slate-400 dark:text-slate-500" />
          </div>
        </div>

        {/* Error Text */}
        {error && (
          <p className="mt-1.5 text-sm text-red-600 dark:text-red-400">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;
