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
    LogOut,
    Search,
    X
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
    const [searchQuery, setSearchQuery] = useState('');
    const pathname = usePathname();

    useEffect(() => {
        setIsMobileOpen(false);
    }, [pathname]);

    const handleCollapse = () => {
        const newState = !isCollapsed;
        setIsCollapsed(newState);
        onCollapseChange?.(newState);
    };

    const filteredMenuItems = menuItems.filter(item =>
        item.label.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <>
            {/* ==================== FLOATING BURGER BUTTON ==================== */}
            <button
                onClick={() => setIsMobileOpen(!isMobileOpen)}
                className="
                    lg:hidden fixed bottom-6 right-6 z-[60]
                    w-14 h-14 rounded-full
                    bg-gradient-to-br from-indigo-600 to-purple-600
                    shadow-2xl shadow-indigo-500/30
                    flex items-center justify-center
                    transition-all duration-300 ease-out
                    hover:scale-110 hover:shadow-indigo-500/50
                    active:scale-95
                "
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

            {/* ==================== OVERLAY ==================== */}
            <div
                className={`
                    lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40
                    transition-opacity duration-300
                    ${isMobileOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
                `}
                onClick={() => setIsMobileOpen(false)}
            />

            {/* ==================== SIDEBAR ==================== */}
            <aside
                className={`
                    fixed top-0 left-0 h-screen z-50
                    bg-slate-900 border-r border-slate-800/50
                    transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
                    ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
                    lg:translate-x-0
                    w-72
                    lg:transition-[width] lg:duration-500 lg:ease-in-out
                    ${isCollapsed ? 'lg:w-20' : 'lg:w-72'}
                `}
            >
                <div className="h-full flex flex-col">

                    {/* ==================== LOGO SECTION ==================== */}
                    <div className="h-20 flex items-center justify-center px-6 border-b border-slate-800/50">
                        {/* Expanded */}
                        <div className={`
                            flex items-center gap-3
                            transition-all duration-300
                            ${isCollapsed ? 'lg:hidden' : ''}
                        `}>
                            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                                <span className="text-white font-bold text-lg">G</span>
                            </div>
                            <div>
                                <h1 className="text-lg font-bold text-white">Gatau</h1>
                                <p className="text-[10px] text-slate-400">Building Management</p>
                            </div>
                        </div>

                        {/* Collapsed */}
                        <div className={`
                            transition-all duration-300
                            ${isCollapsed ? 'lg:block' : 'lg:hidden'}
                            hidden
                        `}>
                            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                                <span className="text-white font-bold text-lg">G</span>
                            </div>
                        </div>
                    </div>

                    {/* ==================== USER SECTION ==================== */}
                    <div className="px-4 py-4 border-b border-slate-800/50">
                        <div className={`
                            flex items-center gap-3 p-3 rounded-xl
                            bg-slate-800/50 border border-slate-700/50
                            transition-all duration-300
                            ${isCollapsed ? 'lg:flex-col lg:p-2 lg:gap-2' : ''}
                        `}>
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-md flex-shrink-0">
                                <span className="text-white font-semibold text-sm">AK</span>
                            </div>
                            <div className={`
                                flex-1 min-w-0
                                transition-all duration-300
                                ${isCollapsed ? 'lg:hidden' : ''}
                            `}>
                                <p className="text-sm font-semibold text-white truncate">Admin Kerbaudisko</p>
                                <p className="text-xs text-slate-400 truncate">Administrator</p>
                            </div>
                        </div>
                    </div>

                    {/* ==================== SEARCH SECTION ==================== */}
                    <div className="px-4 py-3 border-b border-slate-800/50">
                        {/* Expanded */}
                        <div className={`
                            relative
                            transition-all duration-300
                            ${isCollapsed ? 'lg:hidden' : ''}
                        `}>
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search menu..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="
                                    w-full pl-9 pr-3 py-2.5
                                    bg-slate-800/50 border border-slate-700/50
                                    rounded-lg text-sm text-white
                                    placeholder:text-slate-500
                                    focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/40
                                    transition-all
                                "
                            />
                        </div>

                        {/* Collapsed */}
                        <div className={`
                            transition-all duration-300
                            ${isCollapsed ? 'lg:flex' : 'lg:hidden'}
                            hidden justify-center
                        `}>
                            <button className="w-11 h-11 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:bg-slate-800 flex items-center justify-center transition-colors">
                                <Search className="w-5 h-5 text-slate-400" />
                            </button>
                        </div>
                    </div>

                    {/* ==================== MENU SECTION ==================== */}
                    <nav className="flex-1 overflow-y-auto p-3">
                        {searchQuery && filteredMenuItems.length === 0 && (
                            <div className="text-center py-8">
                                <Search className="w-8 h-8 text-slate-700 mx-auto mb-2" />
                                <p className="text-sm text-slate-500">No menu found</p>
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
                                            className={`
                                                group relative
                                                flex items-center gap-3 px-3 py-3 rounded-lg
                                                transition-all duration-200
                                                ${isActive
                                                ? `bg-gradient-to-r ${item.color} text-white shadow-lg`
                                                : 'text-slate-300 hover:bg-slate-800/50'
                                            }
                                            `}
                                        >
                                            {/* Icon */}
                                            <div className={`
                                                w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0
                                                transition-all duration-200
                                                ${isActive
                                                ? 'bg-white/20'
                                                : 'bg-slate-800/50'
                                            }
                                            `}>
                                                <Icon className="w-5 h-5" strokeWidth={2} />
                                            </div>

                                            {/* Label */}
                                            <span className={`
                                                font-medium text-sm
                                                transition-all duration-300
                                                ${isCollapsed ? 'lg:hidden' : ''}
                                            `}>
                                                {item.label}
                                            </span>

                                            {/* Tooltip */}
                                            {isCollapsed && (
                                                <div className="
                                                    hidden lg:block
                                                    absolute left-full ml-2 px-3 py-2
                                                    bg-slate-800 border border-slate-700/50 text-white text-sm rounded-lg
                                                    whitespace-nowrap
                                                    opacity-0 invisible group-hover:opacity-100 group-hover:visible
                                                    transition-all duration-200
                                                    z-50 shadow-xl
                                                ">
                                                    {item.label}
                                                </div>
                                            )}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </nav>

                    {/* ==================== BOTTOM SECTION ==================== */}
                    <div className="p-4 border-t border-slate-800/50 space-y-2">
                        {/* Collapse Button - Desktop Only */}
                        <button
                            onClick={handleCollapse}
                            className={`
                                hidden lg:flex
                                items-center gap-2 w-full px-3 py-2.5
                                bg-slate-800/50 hover:bg-slate-800
                                border border-slate-700/50
                                rounded-lg text-slate-300
                                transition-all duration-200
                                ${isCollapsed ? 'justify-center' : 'justify-start'}
                            `}
                        >
                            {isCollapsed ? (
                                <ChevronRight className="w-5 h-5" strokeWidth={2} />
                            ) : (
                                <>
                                    <ChevronLeft className="w-5 h-5" strokeWidth={2} />
                                    <span className="font-medium text-sm">Collapse</span>
                                </>
                            )}
                        </button>

                        {/* Logout Button */}
                        <button className={`
                            flex items-center gap-2 w-full px-3 py-2.5
                            bg-red-500/10 hover:bg-red-500/20
                            border border-red-500/20
                            rounded-lg text-red-400
                            transition-all duration-200
                            ${isCollapsed ? 'lg:justify-center' : 'justify-start'}
                        `}>
                            <LogOut className="w-5 h-5" strokeWidth={2} />
                            <span className={`
                                font-medium text-sm
                                transition-all duration-300
                                ${isCollapsed ? 'lg:hidden' : ''}
                            `}>
                                Logout
                            </span>
                        </button>
                    </div>

                </div>
            </aside>
        </>
    );
}