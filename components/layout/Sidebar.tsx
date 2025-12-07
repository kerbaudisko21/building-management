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
    LogOut,
    Search,
    X
} from 'lucide-react';
import Link from 'next/link';
import {redirect, usePathname, useRouter} from 'next/navigation';
import {router} from "next/client";

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
    const [searchQuery, setSearchQuery] = useState('');
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        setIsMobileOpen(false);
    }, [pathname]);

    const handleCollapse = () => {
        const newState = !isCollapsed;
        setIsCollapsed(newState);
        onCollapseChange?.(newState);
    };

    async function logout() {
        router.push('/login');
    }

    const filteredMenuItems = menuItems.filter(item =>
        item.label.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <>
            {/* FLOATING BURGER BUTTON */}
            <button
                onClick={() => setIsMobileOpen(!isMobileOpen)}
                className="lg:hidden fixed bottom-6 right-6 z-[60] w-14 h-14 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 shadow-2xl shadow-indigo-500/30 flex items-center justify-center transition-all duration-300 ease-out hover:scale-110 hover:shadow-indigo-500/50 active:scale-95"
                aria-label={isMobileOpen ? "Close menu" : "Open menu"}
            >
                {isMobileOpen ? (
                    <X className="w-6 h-6 text-white" strokeWidth={2.5} />
                ) : (
                    <div className="w-6 h-6 flex flex-col justify-center gap-1.5">
                        <span className="w-6 h-0.5 bg-white rounded-full" />
                        <span className="w-6 h-0.5 bg-white rounded-full" />
                        <span className="w-6 h-0.5 bg-white rounded-full" />
                    </div>
                )}
            </button>

            {/* OVERLAY */}
            <div
                className={`lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 ${isMobileOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={() => setIsMobileOpen(false)}
            />

            {/* SIDEBAR */}
            <aside className={`fixed top-0 left-0 h-screen z-50 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800/50 transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 w-72 lg:transition-[width] lg:duration-500 lg:ease-in-out ${isCollapsed ? 'lg:w-20' : 'lg:w-72'} overflow-hidden`}>
                <div className="h-full flex flex-col">

                    {/* LOGO SECTION */}
                    <div className={`h-20 flex items-center border-b border-slate-200 dark:border-slate-800/50 transition-all duration-500 ${isCollapsed ? 'lg:justify-center lg:px-0' : 'px-6'} px-6`}>
                        <div className="group relative flex items-center gap-3">
                            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 flex-shrink-0">
                                <span className="text-white font-bold text-lg">G</span>
                            </div>

                            {/* Text - Always visible on mobile, conditionally hidden on desktop when collapsed */}
                            <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isCollapsed ? 'lg:hidden' : ''}`}>
                                <div className="whitespace-nowrap">
                                    <h1 className="text-lg font-bold text-slate-900 dark:text-white">Gatau</h1>
                                    <p className="text-[10px] text-slate-500 dark:text-slate-400">Building Management</p>
                                </div>
                            </div>

                            {/* Tooltip - Desktop only when collapsed */}
                            <div className={`hidden lg:block absolute left-full ml-3 px-4 py-2.5 bg-slate-900 dark:bg-slate-800 border border-slate-700/50 text-white rounded-lg whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 shadow-2xl pointer-events-none ${isCollapsed ? '' : 'lg:hidden'}`}>
                                <p className="text-sm font-bold">Gatau</p>
                                <p className="text-xs text-slate-400 mt-0.5">Building Management</p>
                                <div className="absolute right-full top-1/2 -translate-y-1/2 border-8 border-transparent border-r-slate-900 dark:border-r-slate-800"></div>
                            </div>
                        </div>
                    </div>

                    {/* USER SECTION */}
                    <div className={`border-b border-slate-200 dark:border-slate-800/50 transition-all duration-500 px-4 py-4 ${isCollapsed ? 'lg:px-2 lg:py-2' : ''}`}>
                        <div className={`group relative flex items-center rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 transition-all duration-500 ease-in-out gap-3 p-3 ${isCollapsed ? 'lg:flex-col lg:p-2 lg:gap-1' : ''}`}>
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-md flex-shrink-0">
                                <span className="text-white font-semibold text-sm">AK</span>
                            </div>

                            {/* Text - Always visible on mobile, conditionally hidden on desktop when collapsed */}
                            <div className={`flex-1 min-w-0 overflow-hidden transition-all duration-500 ease-in-out ${isCollapsed ? 'lg:hidden' : ''}`}>
                                <div className="whitespace-nowrap">
                                    <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">Admin Kerbaudisko</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">Administrator</p>
                                </div>
                            </div>

                            {/* Tooltip - Desktop only when collapsed */}
                            <div className={`hidden lg:block absolute left-full ml-3 px-4 py-2.5 bg-slate-900 dark:bg-slate-800 border border-slate-700/50 text-white rounded-lg whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 shadow-2xl pointer-events-none ${isCollapsed ? '' : 'lg:hidden'}`}>
                                <p className="text-sm font-semibold">Admin Kerbaudisko</p>
                                <p className="text-xs text-slate-400 mt-0.5">Administrator</p>
                                <div className="absolute right-full top-1/2 -translate-y-1/2 border-8 border-transparent border-r-slate-900 dark:border-r-slate-800"></div>
                            </div>
                        </div>
                    </div>

                    {/* SEARCH SECTION */}
                    <div className={`border-b border-slate-200 dark:border-slate-800/50 transition-all duration-500 px-4 py-3 ${isCollapsed ? 'lg:px-2 lg:py-2' : ''}`}>
                        {/* Full search on mobile, toggle on desktop */}
                        <div className={`${isCollapsed ? 'lg:hidden' : ''}`}>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
                                <input
                                    type="text"
                                    placeholder="Search menu..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-lg text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/40 transition-all"
                                />
                            </div>
                        </div>

                        {/* Icon button - Desktop only when collapsed */}
                        <div className={`hidden ${isCollapsed ? 'lg:block' : ''}`}>
                            <button className="group/search relative w-full h-11 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center transition-colors">
                                <Search className="w-5 h-5 text-slate-400 dark:text-slate-500" />

                                {/* Tooltip */}
                                <div className="hidden lg:block absolute left-full ml-3 px-4 py-2 bg-slate-900 dark:bg-slate-800 border border-slate-700/50 text-white text-sm rounded-lg whitespace-nowrap opacity-0 invisible group-hover/search:opacity-100 group-hover/search:visible transition-all duration-200 z-50 shadow-2xl pointer-events-none">
                                    Search menu
                                    <div className="absolute right-full top-1/2 -translate-y-1/2 border-8 border-transparent border-r-slate-900 dark:border-r-slate-800"></div>
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* MENU SECTION */}
                    <nav className={`flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700/30 scrollbar-track-transparent hover:scrollbar-thumb-slate-400 dark:hover:scrollbar-thumb-slate-700/50 transition-all duration-500 p-3 ${isCollapsed ? 'lg:p-2' : ''}`}>
                        {searchQuery && filteredMenuItems.length === 0 && (
                            <div className="text-center py-8">
                                <Search className="w-8 h-8 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
                                <p className="text-sm text-slate-400 dark:text-slate-500">No menu found</p>
                            </div>
                        )}

                        <ul className="space-y-1">
                            {filteredMenuItems.map((item) => {
                                const isActive = pathname === item.href;
                                const Icon = item.icon;

                                return (
                                    <li key={item.href}>
                                        <Link
                                            href={item.href}
                                            className={`group relative flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 ${isActive ? `bg-gradient-to-r ${item.color} text-white shadow-lg` : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50'} ${isCollapsed ? 'lg:justify-center lg:p-2.5 lg:gap-0' : ''}`}
                                        >
                                            <div className={`rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-200 w-9 h-9 ${isActive ? 'bg-white/20' : 'bg-slate-100 dark:bg-slate-800/50'}`}>
                                                <Icon className="w-5 h-5" strokeWidth={2} />
                                            </div>

                                            {/* Label - Always visible on mobile, conditionally hidden on desktop when collapsed */}
                                            <span className={`font-medium text-sm whitespace-nowrap ${isCollapsed ? 'lg:hidden' : ''}`}>
                                                {item.label}
                                            </span>

                                            {/* Tooltip - Desktop only when collapsed */}
                                            <div className={`hidden lg:block absolute left-full ml-3 px-4 py-2 bg-slate-900 dark:bg-slate-800 border border-slate-700/50 text-white text-sm font-medium rounded-lg whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 shadow-2xl pointer-events-none ${isCollapsed ? '' : 'lg:hidden'}`}>
                                                {item.label}
                                                <div className="absolute right-full top-1/2 -translate-y-1/2 border-8 border-transparent border-r-slate-900 dark:border-r-slate-800"></div>
                                            </div>
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </nav>

                    {/* DIVIDER */}
                    <div className={`transition-all duration-500 ${isCollapsed ? 'lg:px-2' : 'px-4'}`}>
                        <div className="h-px bg-gradient-to-r from-transparent via-slate-300 dark:via-slate-700 to-transparent" />
                    </div>

                    {/* BOTTOM SECTION */}
                    <div className={`space-y-2 transition-all duration-500 p-4 ${isCollapsed ? 'lg:p-2' : ''}`}>
                        {/* Collapse Button - Desktop only */}
                        <button
                            onClick={handleCollapse}
                            className={`group/collapse relative hidden lg:flex items-center w-full bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/50 rounded-lg text-slate-700 dark:text-slate-300 transition-all duration-500 ease-in-out gap-2 px-3 py-2.5 ${isCollapsed ? 'lg:justify-center lg:p-2.5 lg:gap-0' : ''}`}
                        >
                            <ChevronLeft className={`flex-shrink-0 w-5 h-5 transition-transform duration-500 ease-in-out ${isCollapsed ? 'rotate-180' : 'rotate-0'}`} strokeWidth={2} />

                            {/* Text - Conditionally hidden on desktop when collapsed */}
                            <span className={`font-medium text-sm whitespace-nowrap ${isCollapsed ? 'lg:hidden' : ''}`}>
                                Collapse
                            </span>

                            {/* Tooltip - Desktop only when collapsed */}
                            <div className={`hidden lg:block absolute left-full ml-3 px-4 py-2 bg-slate-900 dark:bg-slate-800 border border-slate-700/50 text-white text-sm font-medium rounded-lg whitespace-nowrap opacity-0 invisible group-hover/collapse:opacity-100 group-hover/collapse:visible transition-all duration-200 z-50 shadow-2xl pointer-events-none ${isCollapsed ? '' : 'lg:hidden'}`}>
                                Expand
                                <div className="absolute right-full top-1/2 -translate-y-1/2 border-8 border-transparent border-r-slate-900 dark:border-r-slate-800"></div>
                            </div>
                        </button>

                        {/* Logout Button - Always full on mobile */}
                            <button onClick={logout} className={`group/logout relative flex items-center w-full bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 border border-red-200 dark:border-red-500/20 rounded-lg text-red-600 dark:text-red-400 transition-all duration-500 ease-in-out gap-3 px-3 py-2.5 ${isCollapsed ? 'lg:justify-center lg:p-2.5 lg:gap-0' : ''}`}>
                            <LogOut className="w-5 h-5 flex-shrink-0" strokeWidth={2} />

                            {/* Text - Always visible on mobile, conditionally hidden on desktop when collapsed */}
                            <span className={`font-medium text-sm whitespace-nowrap ${isCollapsed ? 'lg:hidden' : ''}`}>
                                Logout
                            </span>

                            {/* Tooltip - Desktop only when collapsed */}
                            <div className={`hidden lg:block absolute left-full ml-3 px-4 py-2 bg-slate-900 dark:bg-slate-800 border border-slate-700/50 text-white text-sm font-medium rounded-lg whitespace-nowrap opacity-0 invisible group-hover/logout:opacity-100 group-hover/logout:visible transition-all duration-200 z-50 shadow-2xl pointer-events-none ${isCollapsed ? '' : 'lg:hidden'}`}>
                                Logout
                                <div className="absolute right-full top-1/2 -translate-y-1/2 border-8 border-transparent border-r-slate-900 dark:border-r-slate-800"></div>
                            </div>
                        </button>
                    </div>

                </div>
            </aside>
        </>
    );
}