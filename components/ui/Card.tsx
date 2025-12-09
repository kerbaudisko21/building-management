import { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: 'default' | 'bordered' | 'elevated';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
}

const Card = ({
  children,
  variant = 'default',
  padding = 'md',
  hover = false,
  className,
  ...props
}: CardProps) => {
  const baseStyles = 'rounded-xl transition-all duration-200';

  const variants = {
    default: 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800',
    bordered: 'bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700',
    elevated: 'bg-white dark:bg-slate-900 shadow-lg border border-slate-200 dark:border-slate-800',
  };

  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const hoverStyles = hover
    ? 'hover:shadow-xl hover:border-indigo-300 dark:hover:border-indigo-700 hover:-translate-y-0.5 cursor-pointer'
    : '';

  return (
    <div
      className={cn(
        baseStyles,
        variants[variant],
        paddings[padding],
        hoverStyles,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

const CardHeader = ({ children, className, ...props }: CardHeaderProps) => {
  return (
    <div className={cn('mb-4', className)} {...props}>
      {children}
    </div>
  );
};

interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  children: ReactNode;
}

const CardTitle = ({ children, className, ...props }: CardTitleProps) => {
  return (
    <h3
      className={cn(
        'text-xl font-bold text-slate-900 dark:text-white',
        className
      )}
      {...props}
    >
      {children}
    </h3>
  );
};

interface CardDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {
  children: ReactNode;
}

const CardDescription = ({
  children,
  className,
  ...props
}: CardDescriptionProps) => {
  return (
    <p
      className={cn('text-sm text-slate-600 dark:text-slate-400', className)}
      {...props}
    >
      {children}
    </p>
  );
};

interface CardContentProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

const CardContent = ({ children, className, ...props }: CardContentProps) => {
  return (
    <div className={cn('', className)} {...props}>
      {children}
    </div>
  );
};

interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

const CardFooter = ({ children, className, ...props }: CardFooterProps) => {
  return (
    <div
      className={cn(
        'mt-4 pt-4 border-t border-slate-200 dark:border-slate-800',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
