'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react'
import { cn } from '@/lib/utils'

type ToastType = 'success' | 'error' | 'warning' | 'info'

interface Toast {
    id: string
    type: ToastType
    title: string
    message?: string
}

interface ConfirmOptions {
    title: string
    message: string
    confirmLabel?: string
    cancelLabel?: string
    variant?: 'danger' | 'warning' | 'info'
}

interface ConfirmState extends ConfirmOptions {
    resolve: (value: boolean) => void
}

interface ToastContextValue {
    toast: {
        success: (title: string, message?: string) => void
        error: (title: string, message?: string) => void
        warning: (title: string, message?: string) => void
        info: (title: string, message?: string) => void
    }
    confirm: (options: ConfirmOptions) => Promise<boolean>
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function useToast() {
    const ctx = useContext(ToastContext)
    if (!ctx) throw new Error('useToast must be used inside ToastProvider')
    return ctx
}

const TOAST_ICONS = { success: CheckCircle, error: XCircle, warning: AlertTriangle, info: Info }

const TOAST_STYLES = {
    success: 'border-l-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-100',
    error: 'border-l-red-500 bg-red-50 dark:bg-red-950/60 text-red-900 dark:text-red-100',
    warning: 'border-l-amber-500 bg-amber-50 dark:bg-amber-950/60 text-amber-900 dark:text-amber-100',
    info: 'border-l-blue-500 bg-blue-50 dark:bg-blue-950/60 text-blue-900 dark:text-blue-100',
}

const TOAST_ICON_STYLES = {
    success: 'text-emerald-600 dark:text-emerald-400',
    error: 'text-red-600 dark:text-red-400',
    warning: 'text-amber-600 dark:text-amber-400',
    info: 'text-blue-600 dark:text-blue-400',
}

const CONFIRM_VARIANTS = {
    danger: { bg: 'bg-red-600 hover:bg-red-700 focus:ring-red-500', icon: 'text-red-600 dark:text-red-400', iconBg: 'bg-red-100 dark:bg-red-900/30' },
    warning: { bg: 'bg-amber-600 hover:bg-amber-700 focus:ring-amber-500', icon: 'text-amber-600 dark:text-amber-400', iconBg: 'bg-amber-100 dark:bg-amber-900/30' },
    info: { bg: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500', icon: 'text-blue-600 dark:text-blue-400', iconBg: 'bg-blue-100 dark:bg-blue-900/30' },
}

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([])
    const [confirmState, setConfirmState] = useState<ConfirmState | null>(null)

    const addToast = useCallback((type: ToastType, title: string, message?: string) => {
        const id = Date.now().toString() + Math.random().toString(36).slice(2)
        setToasts(prev => [...prev, { id, type, title, message }])
        setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500)
    }, [])

    const removeToast = useCallback((id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id))
    }, [])

    const toast = {
        success: (title: string, message?: string) => addToast('success', title, message),
        error: (title: string, message?: string) => addToast('error', title, message),
        warning: (title: string, message?: string) => addToast('warning', title, message),
        info: (title: string, message?: string) => addToast('info', title, message),
    }

    const confirm = useCallback((options: ConfirmOptions): Promise<boolean> => {
        return new Promise<boolean>((resolve) => {
            setConfirmState({ ...options, resolve })
        })
    }, [])

    const handleConfirmResult = useCallback((value: boolean) => {
        if (confirmState) {
            confirmState.resolve(value)
            setConfirmState(null)
        }
    }, [confirmState])

    return (
        <ToastContext.Provider value={{ toast, confirm }}>
            {children}

            {/* Toast Container */}
            <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
                {toasts.map((t) => {
                    const Icon = TOAST_ICONS[t.type]
                    return (
                        <div
                            key={t.id}
                            className={cn(
                                'pointer-events-auto flex items-start gap-3 p-4 rounded-xl border-l-4 shadow-lg toast-slide-in',
                                TOAST_STYLES[t.type]
                            )}
                        >
                            <Icon className={cn('w-5 h-5 flex-shrink-0 mt-0.5', TOAST_ICON_STYLES[t.type])} />
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-sm">{t.title}</p>
                                {t.message && <p className="text-xs mt-0.5 opacity-75">{t.message}</p>}
                            </div>
                            <button onClick={() => removeToast(t.id)} className="flex-shrink-0 opacity-50 hover:opacity-100 transition-opacity">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    )
                })}
            </div>

            {/* Confirm Dialog */}
            {confirmState && (() => {
                const v = CONFIRM_VARIANTS[confirmState.variant || 'danger']
                return (
                    <div className="fixed inset-0 z-[9998] flex items-center justify-center p-4">
                        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm confirm-fade-in" onClick={() => handleConfirmResult(false)} />
                        <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full confirm-scale-in p-6">
                            <div className="flex items-start gap-4 mb-5">
                                <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0', v.iconBg)}>
                                    <AlertTriangle className={cn('w-6 h-6', v.icon)} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">{confirmState.title}</h3>
                                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{confirmState.message}</p>
                                </div>
                            </div>
                            <div className="flex gap-3 justify-end">
                                <button
                                    onClick={() => handleConfirmResult(false)}
                                    className="px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors"
                                >
                                    {confirmState.cancelLabel || 'Batal'}
                                </button>
                                <button
                                    onClick={() => handleConfirmResult(true)}
                                    className={cn('px-4 py-2.5 text-sm font-medium text-white rounded-xl transition-colors', v.bg)}
                                >
                                    {confirmState.confirmLabel || 'Ya, Hapus'}
                                </button>
                            </div>
                        </div>
                    </div>
                )
            })()}
        </ToastContext.Provider>
    )
}
