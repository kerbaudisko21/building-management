'use client';

import { useEffect, useState } from 'react';

// Define BeforeInstallPromptEvent type
interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export default function PWAInstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [showInstall, setShowInstall] = useState(false);
    const [isStandalone, setIsStandalone] = useState(false);
    const [isIOS, setIsIOS] = useState(false);
    const [showIOSPrompt, setShowIOSPrompt] = useState(true);

    useEffect(() => {
        // Check if iOS
        const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        setIsIOS(iOS);

        // Check if already installed (standalone mode)
        const standalone = window.matchMedia('(display-mode: standalone)').matches;
        setIsStandalone(standalone);
        // Listen for install prompt
        const handleBeforeInstall = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e as BeforeInstallPromptEvent);
            setShowInstall(true);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstall);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
        };
    }, []);

    // Don't show if already installed
    if (isStandalone) {
        return null;
    }

    // iOS Install Instructions
    if (isIOS && showIOSPrompt) {
        return (
            <div className="fixed bottom-4 right-4 bg-gradient-to-br from-indigo-600 to-purple-600 text-white p-4 rounded-xl shadow-2xl max-w-sm z-50 animate-slide-up">
                <button
                    onClick={() => setShowIOSPrompt(false)}
                    className="absolute top-2 right-2 text-white/80 hover:text-white"
                    aria-label="Close"
                >
                    ✕
                </button>
                <h3 className="font-bold text-lg mb-2">📱 Install App</h3>
                <p className="text-sm mb-2">
                    Tap the Share button{' '}
                    <span className="inline-block mx-1">
                        <svg className="w-4 h-4 inline" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                        </svg>
                    </span>
                    then "Add to Home Screen"
                </p>
            </div>
        );
    }

    // Chrome/Edge Install Button
    if (showInstall && deferredPrompt) {
        const handleInstallClick = async () => {
            if (!deferredPrompt) return;

            try {
                // Show install prompt
                await deferredPrompt.prompt();

                // Wait for user choice
                const { outcome } = await deferredPrompt.userChoice;

                console.log(`User ${outcome} the install prompt`);

                // Reset state
                setShowInstall(false);
                setDeferredPrompt(null);
            } catch (error) {
                console.error('Install prompt error:', error);
            }
        };

        return (
            <button
                onClick={handleInstallClick}
                className="fixed bottom-4 right-4 bg-gradient-to-br from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-2 z-50 transition-all duration-300 hover:scale-105 active:scale-95 animate-slide-up"
            >
                <span className="text-xl">📲</span>
                <span className="font-semibold">Install App</span>
            </button>
        );
    }

    return null;
}