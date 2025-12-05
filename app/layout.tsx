import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google';
import '@/app/globals.css';
import { ThemeProvider } from '@/components/ThemeContext';
import Sidebar from '@/components/Sidebar';

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

export const metadata: Metadata = {
    title: 'MARS - Building Management System',
    description: 'Modern building management system with advanced features',
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning>
        <body className={`${jakarta.variable} ${mono.variable} font-sans antialiased`}>
        <ThemeProvider>
            <div className="flex h-screen overflow-hidden bg-background text-foreground">
                <Sidebar />
                <main className="flex-1 overflow-y-auto lg:ml-72 transition-all duration-500">
                    <div className="min-h-full">
                        {children}
                    </div>
                </main>
            </div>
        </ThemeProvider>
        </body>
        </html>
    );
}