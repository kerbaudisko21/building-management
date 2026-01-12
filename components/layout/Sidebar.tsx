'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
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
} from 'lucide-react';
import Link from "next/link";

interface SidebarProps {
    onCollapseChange?: (collapsed: boolean) => void;
}

export default function Sidebar({ onCollapseChange }: SidebarProps) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const pathname = usePathname();
    const { theme, toggleTheme } = useTheme();

    const user = {
        name: 'Admin User',
        email: 'admin@gatau.com',
    };

    useEffect(() => {
        onCollapseChange?.(isCollapsed);
    }, [isCollapsed, onCollapseChange]);

    useEffect(() => {
        setIsMobileOpen(false);
    }, [pathname]);

    const menuItems = [
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

    const isActive = (href: string) => {
        if (href === '/dashboard') {
            return pathname === '/dashboard';
        }
        return pathname.startsWith(href);
    };

    const handleLogout = () => {
        window.location.href = '/login';
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

            {/* Sidebar - FIXED: Better mobile width */}
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
                    {/* Header - FIXED: Compact on mobile */}
                    <div className="h-14 lg:h-16 flex items-center px-3 lg:px-4 border-b border-slate-200 dark:border-slate-800 flex-shrink-0">
                        {isCollapsed ? (
                            /* Collapsed: Only Logo Centered */
                            <div className="hidden lg:flex w-full justify-center">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
                                    <Building2 className="w-6 h-6 text-white" />
                                </div>
                            </div>
                        ) : (
                            /* Expanded: Logo + Title */
                            <div className="flex items-center gap-2.5 lg:gap-3 w-full">
                                <div className="w-9 h-9 lg:w-10 lg:h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center flex-shrink-0">
                                    <Building2 className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                                </div>
                                <div className="hidden lg:block">
                                    <h1 className="text-lg font-bold text-slate-900 dark:text-white">
                                        Gatau
                                    </h1>
                                    <p className="text-xs text-slate-600 dark:text-slate-400">
                                        Management
                                    </p>
                                </div>
                                {/* Mobile: Show title */}
                                <div className="block lg:hidden">
                                    <h1 className="text-base font-bold text-slate-900 dark:text-white">
                                        Gatau
                                    </h1>
                                    <p className="text-xs text-slate-600 dark:text-slate-400">
                                        Management
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* User Profile - FIXED: Compact on mobile */}
                    <div className="px-2.5 lg:px-3 py-3 lg:py-4 border-b border-slate-200 dark:border-slate-800 flex-shrink-0">
                        {isCollapsed ? (
                            /* Collapsed: Only Avatar Centered */
                            <div className="hidden lg:flex w-full justify-center">
                                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center">
                                    <User className="w-5 h-5 text-white" />
                                </div>
                            </div>
                        ) : (
                            /* Expanded: Avatar + Info */
                            <>
                                <div className="hidden lg:flex items-center gap-3 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer">
                                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center flex-shrink-0">
                                        <User className="w-5 h-5 text-white" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                                            {user.name}
                                        </p>
                                        <p className="text-xs text-slate-600 dark:text-slate-400 truncate">
                                            {user.email}
                                        </p>
                                    </div>
                                </div>
                                {/* Mobile: Compact version */}
                                <div className="flex lg:hidden items-center gap-2.5 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center flex-shrink-0">
                                        <User className="w-4 h-4 text-white" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                                            {user.name}
                                        </p>
                                        <p className="text-xs text-slate-600 dark:text-slate-400 truncate">
                                            {user.email}
                                        </p>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Navigation - FIXED: Better spacing on mobile */}
                    <nav className="flex-1 overflow-y-auto overflow-x-hidden py-3 lg:py-4 scrollbar-custom">
                        <div className={`space-y-0.5 lg:space-y-1 ${isCollapsed ? 'px-2' : 'px-2.5 lg:px-3'}`}>
                            {menuItems.map((item) => {
                                const Icon = item.icon;
                                const active = isActive(item.href);

                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`
                      group relative flex items-center rounded-lg
                      transition-all duration-200 overflow-hidden
                      ${
                                            active
                                                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/50'
                                                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                                        }
                      ${isCollapsed ? 'lg:justify-center lg:p-2.5' : 'px-2.5 lg:px-3 py-2 lg:py-2.5'}
                    `}
                                    >
                                        <Icon className={`w-4.5 h-4.5 lg:w-5 lg:h-5 flex-shrink-0 ${active ? 'text-white' : ''} ${isCollapsed ? '' : 'mr-2.5 lg:mr-3'}`} />

                                        {/* Desktop: Show label only when expanded */}
                                        {!isCollapsed && (
                                            <span className="hidden lg:block font-medium text-sm whitespace-nowrap">
                        {item.label}
                      </span>
                                        )}

                                        {/* Mobile: Always show label */}
                                        <span className="lg:hidden font-medium text-sm whitespace-nowrap">
                      {item.label}
                    </span>

                                        {/* Tooltip - Desktop only when collapsed */}
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

                    {/* Footer - FIXED: Compact on mobile */}
                    <div className="border-t border-slate-200 dark:border-slate-800 p-2.5 lg:p-3 space-y-0.5 lg:space-y-1 flex-shrink-0">
                        {/* Collapse Menu - Desktop Only */}
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
                                    <span className="font-medium text-sm whitespace-nowrap">
                    Collapse Menu
                  </span>
                                </>
                            )}
                        </button>

                        {/* Theme Toggle */}
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
                            {!isCollapsed && (
                                <span className="hidden lg:block font-medium text-sm whitespace-nowrap">
                  {theme === 'dark' ? 'Light' : 'Dark'} Mode
                </span>
                            )}
                            <span className="lg:hidden font-medium text-sm whitespace-nowrap">
                {theme === 'dark' ? 'Light' : 'Dark'} Mode
              </span>
                        </button>

                        {/* Settings */}
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
                            {!isCollapsed && (
                                <span className="hidden lg:block font-medium text-sm whitespace-nowrap">
                  Settings
                </span>
                            )}
                            <span className="lg:hidden font-medium text-sm whitespace-nowrap">
                Settings
              </span>
                        </Link>

                        {/* Logout */}
                        <button
                            onClick={handleLogout}
                            className={`
                w-full flex items-center rounded-lg
                text-red-600 dark:text-red-400
                hover:bg-red-50 dark:hover:bg-red-900/20
                transition-all duration-200 overflow-hidden
                ${isCollapsed ? 'lg:justify-center lg:p-2.5' : 'px-2.5 lg:px-3 py-2 lg:py-2.5'}
              `}
                        >
                            <LogOut className={`w-4.5 h-4.5 lg:w-5 lg:h-5 flex-shrink-0 ${isCollapsed ? '' : 'mr-2.5 lg:mr-3'}`} />
                            {!isCollapsed && (
                                <span className="hidden lg:block font-medium text-sm whitespace-nowrap">
                  Logout
                </span>
                            )}
                            <span className="lg:hidden font-medium text-sm whitespace-nowrap">
                Logout
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