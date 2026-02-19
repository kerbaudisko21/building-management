'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useTheme } from '@/components/providers/ThemeProvider';
import {
    Building2,
    Users,
    FileText,
    Calendar,
    Wrench,
    LayoutDashboard,
    ClipboardList,
    Bed,
    Receipt,
    Coins,
    CreditCard,
    Package,
    CheckSquare,
    Bell,
    Settings,
    Menu,
    X,
    ChevronsLeft,
    ChevronsRight,
    Sun,
    Moon,
    LogOut,
    User,
    UserCog,
} from 'lucide-react';
import Link from "next/link";
import { useAuth } from "@/lib/hooks/useAuth";

interface SidebarProps {
    onCollapseChange?: (collapsed: boolean) => void;
}

export default function Sidebar({ onCollapseChange }: SidebarProps) {
    const { user, signOut } = useAuth();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const pathname = usePathname();
    const { theme, toggleTheme } = useTheme();

    useEffect(() => {
        onCollapseChange?.(isCollapsed);
    }, [isCollapsed, onCollapseChange]);

    useEffect(() => {
        setIsMobileOpen(false);
    }, [pathname]);

    const baseMenuItems = [
        { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
        { label: 'Properties', icon: Building2, href: '/dashboard/properties' },
        { label: 'Rooms/Units', icon: Bed, href: '/dashboard/rooms' },
        { label: 'Contacts', icon: Users, href: '/dashboard/contacts' },
        { label: 'Waiting List', icon: ClipboardList, href: '/dashboard/waiting-list' },
        { label: 'Contracts', icon: FileText, href: '/dashboard/contracts' },
        { label: 'Invoices', icon: Receipt, href: '/dashboard/invoices' },
        { label: 'Cash In', icon: Coins, href: '/dashboard/cash-in' },
        { label: 'Cash Out', icon: CreditCard, href: '/dashboard/cash-out' },
        { label: 'Assets', icon: Package, href: '/dashboard/assets' },
        { label: 'Maintenance', icon: Wrench, href: '/dashboard/maintenance' },
        { label: 'Todo List', icon: CheckSquare, href: '/dashboard/todo' },
        { label: 'Calendar', icon: Calendar, href: '/dashboard/calendar' },
        { label: 'Notifications', icon: Bell, href: '/dashboard/notifications' },
    ];

    const superadminMenuItems = [
        { label: 'Users', icon: UserCog, href: '/dashboard/users' },
    ];

    const menuItems = user?.role === 'superadmin'
        ? [...baseMenuItems, ...superadminMenuItems]
        : baseMenuItems;

    const isActive = (href: string) => {
        if (href === '/dashboard') return pathname === '/dashboard';
        return pathname.startsWith(href);
    };

    // ─── FIXED: Simple logout ────────────────────────────────
    // Sebelumnya:
    //   - Check if (signOut) else dynamic import createClient() = 2 instances
    //   - localStorage.removeItem('user') = nggak ada efek
    //   - router.push('/login') = bisa ke-override middleware
    //
    // Sekarang: cukup panggil signOut() dari useAuth.
    // signOut() sudah handle semuanya:
    //   1. Clear state
    //   2. Clear Supabase session
    //   3. Hard redirect window.location.href = '/login'
    const handleLogout = async () => {
        if (isLoggingOut) return; // prevent double click
        setIsLoggingOut(true);
        await signOut();
    };

    return (
        <>
            {/* Mobile Overlay */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            {/* Mobile Burger Button */}
            <button
                onClick={() => setIsMobileOpen(!isMobileOpen)}
                className="fixed bottom-6 right-6 z-50 lg:hidden w-14 h-14 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-2xl hover:shadow-indigo-500/50 transition-all active:scale-95"
            >
                {isMobileOpen ? (
                    <X className="w-6 h-6 text-white" />
                ) : (
                    <Menu className="w-6 h-6 text-white" />
                )}
            </button>

            {/* Sidebar */}
            <aside
                className={`
          fixed top-0 left-0 z-40 h-screen
          bg-white dark:bg-slate-900 
          border-r border-slate-200 dark:border-slate-800
          transition-all duration-300 ease-in-out
          overflow-x-hidden
          
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
          
          ${isCollapsed ? 'lg:w-20' : 'lg:w-72'}
          
          w-64
        `}
            >
                <div className="flex flex-col h-full overflow-x-hidden">
                    {/* Header */}
                    <div className="h-14 lg:h-16 flex items-center px-3 lg:px-4 border-b border-slate-200 dark:border-slate-800 flex-shrink-0">
                        {isCollapsed ? (
                            <div className="hidden lg:flex w-full justify-center">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
                                    <Building2 className="w-6 h-6 text-white" />
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2.5 lg:gap-3 w-full">
                                <div className="w-9 h-9 lg:w-10 lg:h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center flex-shrink-0">
                                    <Building2 className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-base lg:text-lg font-bold text-slate-900 dark:text-white">
                                        Gatau
                                    </h1>
                                    <p className="text-xs text-slate-600 dark:text-slate-400">
                                        Management
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* User Profile */}
                    <div className="px-2.5 lg:px-3 py-3 lg:py-4 border-b border-slate-200 dark:border-slate-800 flex-shrink-0">
                        {isCollapsed ? (
                            <div className="hidden lg:flex w-full justify-center">
                                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center">
                                    <User className="w-5 h-5 text-white" />
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2.5 lg:gap-3 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer">
                                <div className="w-8 h-8 lg:w-9 lg:h-9 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center flex-shrink-0">
                                    <User className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                                        {user?.fullName || 'User'}
                                    </p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                                        {user?.email || 'Loading...'}
                                    </p>
                                    {user?.role && (
                                        <span className={`inline-block mt-0.5 px-1.5 lg:px-2 py-0.5 text-xs font-semibold rounded-full ${
                                            user.role === 'superadmin'
                                                ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400'
                                                : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                                        }`}>
                                            {user.role === 'superadmin' ? 'Super Admin' : 'Admin'}
                                        </span>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-custom p-2.5 lg:p-3">
                        <div className="space-y-0.5 lg:space-y-1">
                            {menuItems.map((item) => {
                                const Icon = item.icon;
                                const active = isActive(item.href);
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`
                      group relative w-full flex items-center rounded-lg
                      transition-all duration-200 font-medium
                      ${
                                            active
                                                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/50'
                                                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                                        }
                      ${isCollapsed ? 'lg:justify-center lg:p-2.5' : 'px-2.5 lg:px-3 py-2 lg:py-2.5'}
                    `}
                                    >
                                        <Icon className={`w-4.5 h-4.5 lg:w-5 lg:h-5 flex-shrink-0 ${active ? 'text-white' : ''} ${isCollapsed ? '' : 'mr-2.5 lg:mr-3'}`} />

                                        <span className={`font-medium text-sm whitespace-nowrap ${isCollapsed ? 'lg:hidden' : ''}`}>
                                            {item.label}
                                        </span>

                                        {isCollapsed && (
                                            <div className="hidden lg:block absolute left-full ml-2 px-3 py-1.5 bg-slate-900 dark:bg-slate-700 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 shadow-lg pointer-events-none">
                                                {item.label}
                                            </div>
                                        )}
                                    </Link>
                                );
                            })}
                        </div>
                    </nav>

                    {/* Footer */}
                    <div className="border-t border-slate-200 dark:border-slate-800 p-2.5 lg:p-3 space-y-0.5 lg:space-y-1 flex-shrink-0">
                        <button
                            onClick={() => setIsCollapsed(!isCollapsed)}
                            className={`
                hidden lg:flex w-full items-center rounded-lg
                text-slate-700 dark:text-slate-300
                hover:bg-slate-100 dark:hover:bg-slate-800
                transition-all duration-200 overflow-hidden
                ${isCollapsed ? 'justify-center p-2.5' : 'px-3 py-2.5'}
              `}
                        >
                            {isCollapsed ? (
                                <ChevronsRight className="w-5 h-5 flex-shrink-0" />
                            ) : (
                                <>
                                    <ChevronsLeft className="w-5 h-5 flex-shrink-0 mr-3" />
                                    <span className="font-medium text-sm whitespace-nowrap">Collapse Menu</span>
                                </>
                            )}
                        </button>

                        <button
                            onClick={toggleTheme}
                            className={`
                w-full flex items-center rounded-lg
                text-slate-700 dark:text-slate-300
                hover:bg-slate-100 dark:hover:bg-slate-800
                transition-all duration-200 overflow-hidden
                ${isCollapsed ? 'lg:justify-center lg:p-2.5' : 'px-2.5 lg:px-3 py-2 lg:py-2.5'}
              `}
                        >
                            {theme === 'dark' ? (
                                <Sun className={`w-4.5 h-4.5 lg:w-5 lg:h-5 flex-shrink-0 ${isCollapsed ? '' : 'mr-2.5 lg:mr-3'}`} />
                            ) : (
                                <Moon className={`w-4.5 h-4.5 lg:w-5 lg:h-5 flex-shrink-0 ${isCollapsed ? '' : 'mr-2.5 lg:mr-3'}`} />
                            )}
                            <span className={`font-medium text-sm whitespace-nowrap ${isCollapsed ? 'lg:hidden' : ''}`}>
                                {theme === 'dark' ? 'Light' : 'Dark'} Mode
                            </span>
                        </button>

                        <Link
                            href="/dashboard/settings"
                            className={`
                w-full flex items-center rounded-lg
                text-slate-700 dark:text-slate-300
                hover:bg-slate-100 dark:hover:bg-slate-800
                transition-all duration-200 overflow-hidden
                ${isCollapsed ? 'lg:justify-center lg:p-2.5' : 'px-2.5 lg:px-3 py-2 lg:py-2.5'}
              `}
                        >
                            <Settings className={`w-4.5 h-4.5 lg:w-5 lg:h-5 flex-shrink-0 ${isCollapsed ? '' : 'mr-2.5 lg:mr-3'}`} />
                            <span className={`font-medium text-sm whitespace-nowrap ${isCollapsed ? 'lg:hidden' : ''}`}>
                                Settings
                            </span>
                        </Link>

                        {/* ─── FIXED: Logout button with loading state ─── */}
                        <button
                            onClick={handleLogout}
                            disabled={isLoggingOut}
                            className={`
                w-full flex items-center rounded-lg
                text-red-600 dark:text-red-400
                hover:bg-red-50 dark:hover:bg-red-900/20
                transition-all duration-200 overflow-hidden
                disabled:opacity-50 disabled:cursor-not-allowed
                ${isCollapsed ? 'lg:justify-center lg:p-2.5' : 'px-2.5 lg:px-3 py-2 lg:py-2.5'}
              `}
                        >
                            {isLoggingOut ? (
                                <div className={`w-4.5 h-4.5 lg:w-5 lg:h-5 border-2 border-red-400 border-t-transparent rounded-full animate-spin flex-shrink-0 ${isCollapsed ? '' : 'mr-2.5 lg:mr-3'}`} />
                            ) : (
                                <LogOut className={`w-4.5 h-4.5 lg:w-5 lg:h-5 flex-shrink-0 ${isCollapsed ? '' : 'mr-2.5 lg:mr-3'}`} />
                            )}
                            <span className={`font-medium text-sm whitespace-nowrap ${isCollapsed ? 'lg:hidden' : ''}`}>
                                {isLoggingOut ? 'Logging out...' : 'Logout'}
                            </span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Custom Scrollbar Styles */}
            <style jsx global>{`
                .scrollbar-custom {
                    scrollbar-width: thin;
                    scrollbar-color: rgb(203 213 225) transparent;
                }
                .dark .scrollbar-custom {
                    scrollbar-color: rgb(51 65 85) transparent;
                }
                .scrollbar-custom::-webkit-scrollbar {
                    width: 6px;
                }
                .scrollbar-custom::-webkit-scrollbar-track {
                    background: transparent;
                }
                .scrollbar-custom::-webkit-scrollbar-thumb {
                    background-color: rgb(203 213 225);
                    border-radius: 3px;
                }
                .dark .scrollbar-custom::-webkit-scrollbar-thumb {
                    background-color: rgb(51 65 85);
                }
                .scrollbar-custom::-webkit-scrollbar-thumb:hover {
                    background-color: rgb(148 163 184);
                }
                .dark .scrollbar-custom::-webkit-scrollbar-thumb:hover {
                    background-color: rgb(71 85 105);
                }
            `}</style>
        </>
    );
}