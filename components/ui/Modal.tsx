'use client';

import { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    description?: string;
    children: React.ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
    showClose?: boolean;
}

export default function Modal({
                                  isOpen,
                                  onClose,
                                  title,
                                  description,
                                  children,
                                  size = 'md',
                                  showClose = true,
                              }: ModalProps) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const sizeClasses = {
        sm: 'max-w-md',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl',
        full: 'max-w-full mx-4',
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
                onClick={onClose}
            />
            <div
                className={`relative w-full ${sizeClasses[size]} bg-white dark:bg-slate-900 rounded-2xl shadow-2xl animate-scale-in max-h-[90vh] flex flex-col`}
            >
                <div className="flex items-start justify-between p-6 border-b border-slate-200 dark:border-slate-800">
                    <div className="flex-1 pr-4">
                        <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">
                            {title}
                        </h2>
                        {description && (
                            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                                {description}
                            </p>
                        )}
                    </div>
                    {showClose && (
                        <button
                            onClick={onClose}
                            className="flex-shrink-0 w-10 h-10 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center transition-colors"
                        >
                            <X className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                        </button>
                    )}
                </div>
                <div className="flex-1 overflow-y-auto p-6">
                    {children}
                </div>
            </div>
            <style jsx>{`
                @keyframes fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes scale-in {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
                .animate-fade-in {
                    animation: fade-in 0.2s ease-out;
                }
                .animate-scale-in {
                    animation: scale-in 0.2s ease-out;
                }
            `}</style>
        </div>
    );
}