'use client';

import { Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google';
import '@/app/globals.css';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { AuthProvider } from '@/lib/hooks/useAuth';
import PWAInstallPrompt from '@/components/ui/pwa-install-prompt';
import SplashScreen from '@/components/SplashScreen';

const jakarta = Plus_Jakarta_Sans({
    subsets: ['latin'],
    variable: '--font-jakarta',
    display: 'swap',
});

const mono = JetBrains_Mono({
    subsets: ['latin'],
    variable: '--font-mono',
    display: 'swap',
});

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning>
        <head>
            <meta charSet="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes" />

            <meta name="application-name" content="Gatau" />
            <meta name="apple-mobile-web-app-capable" content="yes" />
            <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
            <meta name="apple-mobile-web-app-title" content="Gatau" />
            <meta name="description" content="Building Management System for properties, rooms, tenants, and utilities" />
            <meta name="format-detection" content="telephone=no" />
            <meta name="mobile-web-app-capable" content="yes" />
            <meta name="theme-color" content="#6366f1" />

            {/* PWA Manifest */}
            <link rel="manifest" href="/manifest.json" />

            {/* Favicons */}
            <link rel="icon" type="image/png" sizes="192x192" href="/icons-192x192.png" />
            <link rel="icon" type="image/png" sizes="512x512" href="/icons-512x512.png" />
            <link rel="shortcut icon" href="/icons-192x192.png" />

            {/* Apple Touch Icons */}
            <link rel="apple-touch-icon" href="/icons-192x192.png" />
            <link rel="apple-touch-icon" sizes="192x192" href="/icons-192x192.png" />
            <link rel="apple-touch-icon" sizes="512x512" href="/icons-512x512.png" />

            {/* Open Graph */}
            <meta property="og:type" content="website" />
            <meta property="og:title" content="Gatau - Management System" />
            <meta property="og:description" content="Building Management System for properties, rooms, tenants, and utilities" />
            <meta property="og:site_name" content="Gatau" />
            <meta property="og:image" content="/icons-512x512.png" />

            {/* Twitter */}
            <meta name="twitter:card" content="summary" />
            <meta name="twitter:title" content="Gatau - Management System" />
            <meta name="twitter:description" content="Building Management System for properties, rooms, tenants, and utilities" />
            <meta name="twitter:image" content="/icons-512x512.png" />

            <title>Gatau - Building Management System</title>
        </head>
        <body className={`${jakarta.variable} ${mono.variable} font-sans antialiased`}>
        <ThemeProvider>
            <AuthProvider>
                <SplashScreen />
                {children}
                <PWAInstallPrompt />
            </AuthProvider>
        </ThemeProvider>
        </body>
        </html>
    );
}