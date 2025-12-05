'use client';

import { Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google';
import '@/app/globals.css';
import { ThemeProvider } from '@/components/ThemeContext';
import Sidebar from '@/components/Sidebar';
import { useState } from 'react';

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
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    return (
        <html lang="en" suppressHydrationWarning>
        <head>
            {/* Basic Meta Tags */}
            <meta charSet="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes" />

            {/* PWA Meta Tags */}
            <meta name="application-name" content="Gatau" />
            <meta name="apple-mobile-web-app-capable" content="yes" />
            <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
            <meta name="apple-mobile-web-app-title" content="Gatau" />
            <meta name="description" content="Building Management System for properties, rooms, tenants, and utilities" />
            <meta name="format-detection" content="telephone=no" />
            <meta name="mobile-web-app-capable" content="yes" />
            <meta name="theme-color" content="#6366f1" />

            {/* PWA Manifest */}
            <link rel="manifest" href="/app/manifest.ts" />

            {/* Favicons */}
            <link rel="icon" type="image/png" sizes="32x32" href="/icons/icon-32x32.png" />
            <link rel="icon" type="image/png" sizes="16x16" href="/icons/icon-16x16.png" />
            <link rel="shortcut icon" href="/favicon.ico" />

            {/* Apple Touch Icons */}
            <link rel="apple-touch-icon" href="/icons/icon-152x152.png" />
            <link rel="apple-touch-icon" sizes="152x152" href="/icons/icon-152x152.png" />
            <link rel="apple-touch-icon" sizes="180x180" href="/icons/icon-192x192.png" />
            <link rel="apple-touch-icon" sizes="167x167" href="/icons/icon-192x192.png" />

            {/* Apple Splash Screens */}
            <link rel="apple-touch-startup-image" href="/icons/icon-512x512.png" />

            {/* Microsoft Tiles */}
            <meta name="msapplication-TileColor" content="#6366f1" />
            <meta name="msapplication-TileImage" content="/icons/icon-144x144.png" />
            <meta name="msapplication-config" content="/browserconfig.xml" />

            {/* Open Graph */}
            <meta property="og:type" content="website" />
            <meta property="og:title" content="Gatau - Management System" />
            <meta property="og:description" content="Building Management System for properties, rooms, tenants, and utilities" />
            <meta property="og:site_name" content="Gatau" />
            <meta property="og:image" content="/icons/icon-512x512.png" />

            {/* Twitter */}
            <meta name="twitter:card" content="summary" />
            <meta name="twitter:title" content="Gatau - Management System" />
            <meta name="twitter:description" content="Building Management System for properties, rooms, tenants, and utilities" />
            <meta name="twitter:image" content="/icons/icon-512x512.png" />

            <title>Gatau - Building Management System</title>
        </head>
        <body className={`${jakarta.variable} ${mono.variable} font-sans antialiased`}>
        <ThemeProvider>
            <div className="flex h-screen overflow-hidden bg-background text-foreground">
                <Sidebar onCollapseChange={setIsSidebarCollapsed} />

                {/* Dynamic margin with smooth transition */}
                <main
                    className={`
                                flex-1 overflow-y-auto 
                                transition-all duration-500 ease-in-out
                                ${isSidebarCollapsed ? 'lg:ml-24' : 'lg:ml-72'}
                            `}
                >
                    <div className="min-h-full w-full">
                        {children}
                    </div>
                </main>
            </div>
        </ThemeProvider>
        </body>
        </html>
    );
}