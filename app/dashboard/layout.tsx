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
        <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
            {/* Sidebar */}
            <Sidebar onCollapseChange={setIsSidebarCollapsed} />

            {/* Main Content */}
            <main
                className={`
          flex-1 overflow-y-auto
          transition-all duration-300 ease-in-out
          ${isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-72'}
          ml-0
        `}
            >
                {/* Content - dengan bottom padding untuk burger button di mobile */}
                <div className="min-h-full">
                    {children}
                </div>
            </main>
        </div>
    );
}