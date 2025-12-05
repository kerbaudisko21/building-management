'use client';

import { useState, useEffect } from 'react';
import {
    LayoutDashboard,
    FileText,
    Building2,
    Home,
    Bed,
    Users,
    Zap,
    AlertCircle,
    Bell,
    BarChart3,
    Settings,
    ChevronLeft,
    ChevronRight,
    Menu,
    X,
    LogOut,
    Search
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard', color: 'from-blue-500 to-cyan-500' },
    { icon: FileText, label: 'Invoices', href: '/invoices', color: 'from-purple-500 to-pink-500' },
    { icon: Building2, label: 'Properties', href: '/properties', color: 'from-emerald-500 to-teal-500' },
    { icon: Home, label: 'Rooms', href: '/rooms', color: 'from-amber-500 to-orange-500' },
    { icon: Bed, label: 'Beds', href: '/beds', color: 'from-indigo-500 to-purple-500' },
    { icon: Users, label: 'Tenants', href: '/tenants', color: 'from-rose-500 to-red-500' },
    { icon: Zap, label: 'Utility Bills', href: '/utility-bills', color: 'from-yellow-500 to-amber-500' },
    { icon: AlertCircle, label: 'Complaints', href: '/complaints', color: 'from-red-500 to-rose-500' },
    { icon: Bell, label: 'Notices', href: '/notices', color: 'from-sky-500 to-blue-500' },
    { icon: BarChart3, label: 'Reports', href: '/reports', color: 'from-violet-500 to-purple-500' },
    { icon: Settings, label: 'Account', href: '/account', color: 'from-slate-500 to-gray-500' }
];

interface SidebarProps {
    onCollapseChange?: (collapsed: boolean) => void;
}

export default function Sidebar({ onCollapseChange }: SidebarProps = {}) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        setIsMobileOpen(false);
    }, [pathname]);

    useEffect(() => {
        if (onCollapseChange) {
            onCollapseChange(isCollapsed);
        }
    }, [isCollapsed, onCollapseChange]);

    return (
        <>
            <button
                onClick={() => setIsMobileOpen(!isMobileOpen)}
                className={`
                    lg:hidden fixed z-[60] 
                    p-2.5 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl 
                    shadow-xl hover:scale-105 active:scale-95 transition-all duration-300
                    ${isMobileOpen ? 'top-4 left-4' : 'top-4 left-4'}
                `}
            >
                {isMobileOpen ? (
                    <X className="w-5 h-5 text-white" strokeWidth={2.5} />
                ) : (
                    <Menu className="w-5 h-5 text-white" strokeWidth={2.5} />
                )}
            </button>

            {isMobileOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/70 backdrop-blur-sm z-40 animate-fade-in"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            <aside
                className={`
                    fixed top-0 left-0 h-screen
                    transition-all duration-500 ease-in-out
                    ${isCollapsed ? 'lg:w-24 w-72' : 'lg:w-72 w-72'}
                    ${isMobileOpen ? 'translate-x-0 z-50' : '-translate-x-full lg:translate-x-0 z-40'}
                    bg-white dark:bg-slate-950
                    border-r border-slate-200 dark:border-slate-900
                    shadow-2xl
                    ${isMobileOpen ? 'pt-16' : ''}
                `}
            >
                <div className="relative h-full flex flex-col">
                    <div className={`h-20 flex items-center justify-center px-5 border-b border-slate-200 dark:border-slate-800 ${isMobileOpen ? '' : ''}`}>
                        <div className={`flex items-center gap-3 transition-all duration-500 ${isCollapsed ? 'lg:opacity-0 lg:invisible lg:absolute' : 'opacity-100'}`}>
                            <div className="relative group">
                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-600 flex items-center justify-center shadow-xl hover:scale-105 hover:rotate-3 transition-all duration-300">
                                    <span className="text-white font-bold text-xl">M</span>
                                </div>
                            </div>
                            <div>
                                <h1 className="font-bold text-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                                    Gatau
                                </h1>
                                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Management System</p>
                            </div>
                        </div>

                        <div className={`relative group transition-all duration-500 ${isCollapsed ? 'lg:opacity-100 lg:visible' : 'opacity-0 invisible absolute'}`}>
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-600 flex items-center justify-center shadow-xl hover:scale-105 hover:rotate-3 transition-all duration-300">
                                <span className="text-white font-bold text-xl">M</span>
                            </div>
                        </div>
                    </div>

                    <div className={`px-4 py-4 border-b border-slate-200 dark:border-slate-800 transition-all duration-500 ${isCollapsed ? 'lg:opacity-0 lg:invisible lg:h-0 lg:py-0' : 'opacity-100'}`}>
                        <div className="relative flex items-center gap-2 px-3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all">
                            <Search className="w-4 h-4 text-slate-500 dark:text-slate-400" strokeWidth={2} />
                            <input
                                type="text"
                                placeholder="Search menu..."
                                className="bg-transparent border-none outline-none text-sm text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 flex-1"
                            />
                        </div>
                    </div>

                    <div className={`px-4 py-4 border-b border-slate-200 dark:border-slate-800 transition-all duration-500 ${isCollapsed ? 'lg:opacity-0 lg:invisible lg:h-0 lg:py-0' : 'opacity-100'}`}>
                        <div className="relative">
                            <div className="relative flex items-center gap-3 p-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-200 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-700 cursor-pointer transition-all">
                                <div className="relative flex-shrink-0">
                                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-600 flex items-center justify-center shadow-xl hover:scale-105 transition-transform">
                                        <span className="text-white font-bold text-sm">AK</span>
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-sm text-slate-900 dark:text-white truncate">Admin Kerbaudisko</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">Super Administrator</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <nav className="flex-1 overflow-y-auto py-4 px-3 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700 scrollbar-track-transparent">
                        <div className="space-y-1.5">
                            {menuItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = pathname === item.href;

                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`
                                            relative flex items-center px-4 py-3 rounded-xl
                                            transition-all duration-300 group overflow-hidden
                                            ${isActive
                                            ? 'text-white'
                                            : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                                        }
                                            ${isCollapsed ? 'lg:justify-center lg:px-0' : ''}
                                        `}
                                        onClick={() => setIsMobileOpen(false)}
                                    >
                                        {isActive && (
                                            <>
                                                <div className={`absolute inset-0 bg-gradient-to-r ${item.color} rounded-xl shadow-lg`} />
                                                <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent rounded-xl" />
                                            </>
                                        )}

                                        {!isActive && (
                                            <>
                                                <div className="absolute inset-0 bg-slate-100 dark:bg-slate-800 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                                                <div className={`absolute inset-0 bg-gradient-to-r ${item.color} opacity-0 group-hover:opacity-10 rounded-xl transition-opacity`} />
                                                <div className="absolute inset-0 border border-slate-200 dark:border-slate-700 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </>
                                        )}

                                        <div className={`
                                            relative flex items-center justify-center flex-shrink-0
                                            w-10 h-10 rounded-lg transition-all
                                            ${isActive
                                            ? 'bg-white/20 shadow-lg'
                                            : 'bg-transparent group-hover:bg-white/50 dark:group-hover:bg-white/10'
                                        }
                                        `}>
                                            <Icon
                                                className={`w-5 h-5 transition-all ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}
                                                strokeWidth={2.5}
                                            />
                                        </div>

                                        <span className={`
                                            relative text-sm font-semibold ml-3 
                                            transition-all duration-500
                                            ${isCollapsed ? 'lg:opacity-0 lg:invisible lg:w-0 lg:ml-0' : 'opacity-100'}
                                        `}>
                                            {item.label}
                                        </span>

                                        {isActive && (
                                            <div className={`
                                                relative ml-auto w-2 h-2 rounded-full bg-white 
                                                shadow-lg animate-pulse
                                                transition-all duration-500
                                                ${isCollapsed ? 'lg:opacity-0 lg:invisible lg:w-0' : 'opacity-100'}
                                            `} />
                                        )}

                                        {item.href === '/notices' && !isCollapsed && (
                                            <div className="relative ml-auto px-2 py-0.5 bg-gradient-to-r from-red-500 to-rose-500 text-white text-[10px] font-bold rounded-full shadow-lg">
                                                3
                                            </div>
                                        )}

                                        <div className={`
                                            absolute left-full ml-4 px-4 py-2.5
                                            bg-slate-900 dark:bg-slate-950 text-white text-sm font-medium rounded-xl
                                            opacity-0 invisible group-hover:opacity-100 group-hover:visible
                                            pointer-events-none whitespace-nowrap z-50
                                            shadow-2xl border border-slate-700 dark:border-slate-800
                                            transition-all duration-300
                                            ${isCollapsed ? 'hidden lg:block' : 'hidden'}
                                        `}>
                                            <div className={`absolute inset-0 bg-gradient-to-r ${item.color} opacity-20 rounded-xl`} />
                                            <span className="relative">{item.label}</span>
                                            <div className="absolute top-1/2 -left-1.5 -translate-y-1/2 w-3 h-3 bg-slate-900 dark:bg-slate-950 border-l border-t border-slate-700 dark:border-slate-800 rotate-45" />
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>

                        <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800">
                            <button className={`
                                relative w-full flex items-center px-4 py-3 rounded-xl
                                text-slate-700 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400
                                transition-all duration-300 group
                                ${isCollapsed ? 'lg:justify-center lg:px-0' : ''}
                            `}>
                                <div className="absolute inset-0 bg-red-50 dark:bg-red-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="absolute inset-0 border border-red-200 dark:border-red-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />

                                <div className="relative flex items-center justify-center flex-shrink-0 w-10 h-10 rounded-lg group-hover:bg-red-100 dark:group-hover:bg-red-500/20 transition-all">
                                    <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" strokeWidth={2.5} />
                                </div>

                                <span className={`
                                    relative text-sm font-semibold ml-3
                                    transition-all duration-500
                                    ${isCollapsed ? 'lg:opacity-0 lg:invisible lg:w-0 lg:ml-0' : 'opacity-100'}
                                `}>
                                    Logout
                                </span>

                                <div className={`
                                    absolute left-full ml-4 px-4 py-2.5
                                    bg-slate-900 dark:bg-slate-950 text-white text-sm font-medium rounded-xl
                                    opacity-0 invisible group-hover:opacity-100 group-hover:visible
                                    pointer-events-none whitespace-nowrap z-50
                                    shadow-2xl border border-slate-700 dark:border-slate-800
                                    transition-all duration-300
                                    ${isCollapsed ? 'hidden lg:block' : 'hidden'}
                                `}>
                                    <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-rose-500/20 rounded-xl" />
                                    <span className="relative">Logout</span>
                                    <div className="absolute top-1/2 -left-1.5 -translate-y-1/2 w-3 h-3 bg-slate-900 dark:bg-slate-950 border-l border-t border-slate-700 dark:border-slate-800 rotate-45" />
                                </div>
                            </button>
                        </div>
                    </nav>

                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="relative hidden lg:flex items-center justify-center h-14 border-t border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all group"
                    >
                        {isCollapsed ? (
                            <ChevronRight className="w-5 h-5 text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors" strokeWidth={2.5} />
                        ) : (
                            <div className="flex items-center gap-2">
                                <ChevronLeft className="w-4 h-4 text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors" strokeWidth={2.5} />
                                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">Collapse Menu</span>
                            </div>
                        )}
                    </button>
                </div>
            </aside>
        </>
    );
}