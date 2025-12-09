import { InputHTMLAttributes, forwardRef, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  success?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  helperText?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      success,
      leftIcon,
      rightIcon,
      helperText,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    const hasError = !!error;
    const hasSuccess = !!success && !hasError;

    return (
      <div className="w-full">
        {/* Label */}
        {label && (
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        {/* Input Container */}
        <div className="relative">
          {/* Left Icon */}
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <div className="text-slate-400 dark:text-slate-500">
                {leftIcon}
              </div>
            </div>
          )}

          {/* Input Field */}
          <input
            ref={ref}
            className={cn(
              'block w-full px-4 py-2.5 rounded-lg transition-all',
              'bg-white dark:bg-slate-800',
              'border text-slate-900 dark:text-white',
              'placeholder-slate-400 dark:placeholder-slate-500',
              'focus:outline-none focus:ring-2',
              // Normal state
              !hasError && !hasSuccess && 'border-slate-300 dark:border-slate-700 focus:border-indigo-500 focus:ring-indigo-500/20',
              // Error state
              hasError && 'border-red-500 dark:border-red-500 focus:border-red-500 focus:ring-red-500/20',
              // Success state
              hasSuccess && 'border-emerald-500 dark:border-emerald-500 focus:border-emerald-500 focus:ring-emerald-500/20',
              // With icons
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              // Disabled
              disabled && 'opacity-50 cursor-not-allowed bg-slate-50 dark:bg-slate-900',
              className
            )}
            disabled={disabled}
            {...props}
          />

          {/* Right Icon */}
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <div className="text-slate-400 dark:text-slate-500">
                {rightIcon}
              </div>
            </div>
          )}
        </div>

        {/* Helper/Error/Success Text */}
        {(helperText || error || success) && (
          <p
            className={cn(
              'mt-1.5 text-sm',
              hasError && 'text-red-600 dark:text-red-400',
              hasSuccess && 'text-emerald-600 dark:text-emerald-400',
              !hasError && !hasSuccess && 'text-slate-500 dark:text-slate-400'
            )}
          >
            {error || success || helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
