import { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
    children: ReactNode;
    variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple';
    size?: 'sm' | 'md' | 'lg';
    dot?: boolean;
}

const Badge = ({
                   children,
                   variant = 'default',
                   size = 'md',
                   dot = false,
                   className,
                   ...props
               }: BadgeProps) => {
    const baseStyles = 'inline-flex items-center gap-1.5 font-semibold rounded-full transition-all';

    const variants = {
        default: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300',
        success: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400',
        warning: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400',
        danger: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
        info: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
        purple: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400',
    };

    const sizes = {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-2.5 py-1 text-sm',
        lg: 'px-3 py-1.5 text-base',
    };

    const dotColors = {
        default: 'bg-slate-500',
        success: 'bg-emerald-500',
        warning: 'bg-amber-500',
        danger: 'bg-red-500',
        info: 'bg-blue-500',
        purple: 'bg-purple-500',
    };

    return (
        <span
            className={cn(baseStyles, variants[variant], sizes[size], className)}
            {...props}
        >
      {dot && (
          <span
              className={cn(
                  'w-1.5 h-1.5 rounded-full animate-pulse',
                  dotColors[variant]
              )}
          />
      )}
            {children}
    </span>
    );
};

export default Badge;