'use client';

import { useEffect, useState } from 'react';
import { Building2 } from 'lucide-react';

export default function SplashScreen() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Check if device is mobile or tablet
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        const isTablet = /iPad|Android/i.test(navigator.userAgent) &&
            window.innerWidth >= 768 && window.innerWidth <= 1024;

        // Check if splash already shown in this session
        const hasSeenSplash = sessionStorage.getItem('hasSeenSplash');

        // Only show splash on mobile/tablet AND if not seen in this session
        if ((isMobile || isTablet) && !hasSeenSplash) {
            setIsVisible(true);

            // Hide splash after 2.5 seconds
            const timer = setTimeout(() => {
                setIsVisible(false);
                // Mark as seen for this session
                sessionStorage.setItem('hasSeenSplash', 'true');
            }, 2500);

            return () => clearTimeout(timer);
        }
    }, []);

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 animate-gradient">
            <div className="text-center">
                {/* Animated Logo */}
                <div className="mb-6 animate-bounce-slow">
                    <div className="w-24 h-24 mx-auto bg-white rounded-2xl shadow-2xl flex items-center justify-center animate-scale-in">
                        <Building2 className="w-14 h-14 text-indigo-600" />
                    </div>
                </div>

                {/* App Name */}
                <h1 className="text-4xl font-bold text-white mb-2 animate-fade-in-up">
                    Gatau
                </h1>
                <p className="text-white/80 text-sm animate-fade-in-up animation-delay-200">
                    Property Management System
                </p>

                {/* Loading Dots */}
                <div className="flex justify-center gap-2 mt-8 animate-fade-in-up animation-delay-400">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse animation-delay-200"></div>
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse animation-delay-400"></div>
                </div>
            </div>

            <style jsx>{`
                @keyframes gradient {
                    0% {
                        background-position: 0% 50%;
                    }
                    50% {
                        background-position: 100% 50%;
                    }
                    100% {
                        background-position: 0% 50%;
                    }
                }

                @keyframes bounce-slow {
                    0%, 100% {
                        transform: translateY(0);
                    }
                    50% {
                        transform: translateY(-20px);
                    }
                }

                @keyframes scale-in {
                    0% {
                        transform: scale(0);
                        opacity: 0;
                    }
                    50% {
                        transform: scale(1.1);
                    }
                    100% {
                        transform: scale(1);
                        opacity: 1;
                    }
                }

                @keyframes fade-in-up {
                    0% {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    100% {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .animate-gradient {
                    background-size: 200% 200%;
                    animation: gradient 3s ease infinite;
                }

                .animate-bounce-slow {
                    animation: bounce-slow 2s ease-in-out infinite;
                }

                .animate-scale-in {
                    animation: scale-in 0.6s ease-out;
                }

                .animate-fade-in-up {
                    animation: fade-in-up 0.6s ease-out;
                    opacity: 0;
                    animation-fill-mode: forwards;
                }

                .animation-delay-200 {
                    animation-delay: 0.2s;
                }

                .animation-delay-400 {
                    animation-delay: 0.4s;
                }
            `}</style>
        </div>
    );
}