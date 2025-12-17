'use client';

import { ChevronDown } from 'lucide-react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    helperText?: string;
    options: { value: string; label: string }[];
    placeholder?: string; // Added but won't be used for <select> elements
}

export default function Select({
                                   label,
                                   error,
                                   helperText,
                                   options,
                                   className = '',
                                   ...props
                               }: SelectProps) {
    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    {label}
                    {props.required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}
            <div className="relative">
                <select
                    className={`
            w-full px-4 py-2.5 pr-10
            bg-white dark:bg-slate-800
            border ${error ? 'border-red-500' : 'border-slate-300 dark:border-slate-700'}
            rounded-lg
            text-slate-900 dark:text-white
            text-sm
            appearance-none
            focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500
            disabled:bg-slate-100 dark:disabled:bg-slate-900 disabled:cursor-not-allowed
            transition-colors
            ${className}
          `}
                    {...props}
                >
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
            </div>
            {error && (
                <p className="mt-1.5 text-sm text-red-500">{error}</p>
            )}
            {helperText && !error && (
                <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">{helperText}</p>
            )}
        </div>
    );
}