'use client';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
    helperText?: string;
}

export default function Textarea({
                                     label,
                                     error,
                                     helperText,
                                     className = '',
                                     ...props
                                 }: TextareaProps) {
    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    {label}
                    {props.required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}
            <textarea
                className={`
          w-full px-4 py-2.5
          bg-white dark:bg-slate-800
          border ${error ? 'border-red-500' : 'border-slate-300 dark:border-slate-700'}
          rounded-lg
          text-slate-900 dark:text-white
          placeholder:text-slate-400 dark:placeholder:text-slate-500
          text-sm
          focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500
          disabled:bg-slate-100 dark:disabled:bg-slate-900 disabled:cursor-not-allowed
          transition-colors
          resize-vertical
          ${className}
        `}
                {...props}
            />
            {error && (
                <p className="mt-1.5 text-sm text-red-500">{error}</p>
            )}
            {helperText && !error && (
                <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">{helperText}</p>
            )}
        </div>
    );
}