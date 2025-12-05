'use client';

import { useEffect } from 'react';

export default function PWAServiceWorkerRegister() {
    useEffect(() => {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker
                .register('/sw.js', { scope: '/' })
                .then(reg => console.log('SW registered:', reg))
                .catch(err => console.error('SW registration failed:', err));

            navigator.serviceWorker.addEventListener('controllerchange', () => {
                if (window.confirm('New version available! Reload?')) {
                    window.location.reload();
                }
            });
        }
    }, []);

    return null;
}