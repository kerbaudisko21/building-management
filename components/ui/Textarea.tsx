import { TextareaHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      error,
      helperText,
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

        {/* Textarea Field */}
        <textarea
          ref={ref}
          className={cn(
            'block w-full px-4 py-2.5 rounded-lg transition-all resize-none',
            'bg-white dark:bg-slate-800',
            'border text-slate-900 dark:text-white',
            'placeholder-slate-400 dark:placeholder-slate-500',
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
        />

        {/* Helper/Error Text */}
        {(helperText || error) && (
          <p
            className={cn(
              'mt-1.5 text-sm',
              hasError && 'text-red-600 dark:text-red-400',
              !hasError && 'text-slate-500 dark:text-slate-400'
            )}
          >
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export default Textarea;
