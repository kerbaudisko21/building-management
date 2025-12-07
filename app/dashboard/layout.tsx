'use client';

import { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';

export default function DashboardLayout({
                                            children,
                                        }: {
    children: React.ReactNode;
}) {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    return (
        <div className="flex h-screen overflow-hidden bg-background text-foreground">
            {/* Sidebar - only for dashboard pages */}
            <Sidebar onCollapseChange={setIsSidebarCollapsed} />

            {/* Main Content with dynamic margin */}
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
    );
}