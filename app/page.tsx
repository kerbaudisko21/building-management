'use client';

import {
    Building2,
    Bed,
    Users,
    FileText,
    Receipt,
    Zap,
    Bell,
    ChevronRight,
    TrendingUp,
    TrendingDown,
    Moon,
    Sun,
    Activity,
    Home,
    ArrowUpRight,
    Clock
} from 'lucide-react';
import { useTheme } from '@/components/ThemeContext';

export default function Dashboard() {
    const { theme, toggleTheme } = useTheme();

    const metrics = [
        {
            title: 'Total Rooms',
            value: '11',
            change: '+2.5%',
            trend: 'up',
            category: 'rooms',
            icon: Building2,
            gradient: 'from-blue-500 to-blue-600',
            bgColor: 'bg-blue-500',
            lightBg: 'bg-blue-50 dark:bg-blue-950/30',
            textColor: 'text-blue-600 dark:text-blue-400',
            occupied: 5,
            total: 11,
            chart: [45, 52, 48, 58, 55, 65, 70]
        },
        {
            title: 'Total Properties',
            value: '9',
            change: '+12%',
            trend: 'up',
            category: 'properties',
            icon: Home,
            gradient: 'from-purple-500 to-purple-600',
            bgColor: 'bg-purple-500',
            lightBg: 'bg-purple-50 dark:bg-purple-950/30',
            textColor: 'text-purple-600 dark:text-purple-400',
            occupied: 0,
            total: 9,
            chart: [30, 35, 40, 38, 45, 50, 55]
        },
        {
            title: 'Total Beds',
            value: '5',
            change: '0%',
            trend: 'neutral',
            category: 'beds',
            icon: Bed,
            gradient: 'from-teal-500 to-teal-600',
            bgColor: 'bg-teal-500',
            lightBg: 'bg-teal-50 dark:bg-teal-950/30',
            textColor: 'text-teal-600 dark:text-teal-400',
            occupied: 3,
            total: 5,
            chart: [20, 25, 22, 28, 30, 32, 35]
        },
        {
            title: 'Active Tenants',
            value: '6',
            change: '-15%',
            trend: 'down',
            category: 'tenants',
            icon: Users,
            gradient: 'from-green-500 to-green-600',
            bgColor: 'bg-green-500',
            lightBg: 'bg-green-50 dark:bg-green-950/30',
            textColor: 'text-green-600 dark:text-green-400',
            occupied: 6,
            total: 19,
            chart: [65, 70, 68, 58, 55, 52, 50]
        },
        {
            title: 'Pending Notices',
            value: '0',
            change: '-100%',
            trend: 'up',
            category: 'notices',
            icon: Bell,
            gradient: 'from-orange-500 to-orange-600',
            bgColor: 'bg-orange-500',
            lightBg: 'bg-orange-50 dark:bg-orange-950/30',
            textColor: 'text-orange-600 dark:text-orange-400',
            occupied: 0,
            total: 0,
            chart: [10, 8, 5, 3, 2, 1, 0]
        },
        {
            title: 'Unpaid Invoices',
            value: '49',
            change: '+8%',
            trend: 'down',
            category: 'invoices',
            icon: FileText,
            gradient: 'from-rose-500 to-rose-600',
            bgColor: 'bg-rose-500',
            lightBg: 'bg-rose-50 dark:bg-rose-950/30',
            textColor: 'text-rose-600 dark:text-rose-400',
            occupied: 49,
            total: 50,
            chart: [40, 42, 43, 45, 46, 48, 49]
        },
        {
            title: 'Utility Bills',
            value: '2',
            change: '+50%',
            trend: 'down',
            category: 'utility',
            icon: Zap,
            gradient: 'from-amber-500 to-amber-600',
            bgColor: 'bg-amber-500',
            lightBg: 'bg-amber-50 dark:bg-amber-950/30',
            textColor: 'text-amber-600 dark:text-amber-400',
            occupied: 2,
            total: 2,
            chart: [1, 1, 1, 1, 2, 2, 2]
        },
    ];

    return (
        <div className="relative min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-gray-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
            {/* Enhanced Animated Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 bg-gradient-mesh">
                <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-gradient-to-br from-blue-400/15 via-purple-400/15 to-pink-400/15 dark:from-blue-600/10 dark:via-purple-600/10 dark:to-pink-600/10 rounded-full blur-3xl animate-pulse-slow" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-orange-400/15 via-pink-400/15 to-red-400/15 dark:from-orange-600/10 dark:via-pink-600/10 dark:to-red-600/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-cyan-400/10 via-blue-400/10 to-purple-400/10 dark:from-cyan-600/5 dark:via-blue-600/5 dark:to-purple-600/5 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '4s' }} />
            </div>

            {/* Header */}
            <header className="glass sticky top-0 z-20 border-b border-gray-200/60 dark:border-slate-700/60">
                <div className="px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between gap-4">
                        <div className="animate-slide-down">
                            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-orange-600 via-pink-600 to-purple-600 dark:from-orange-400 dark:via-pink-500 dark:to-purple-500 bg-clip-text text-transparent">
                                Welcome to MARS
                            </h1>
                            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1 flex items-center gap-2">
                                <Activity className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                <span className="font-mono">03 December, 2025</span>
                            </p>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-3 animate-slide-down" style={{ animationDelay: '0.1s' }}>
                            <button
                                onClick={toggleTheme}
                                className="relative p-2 sm:p-2.5 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-all hover:scale-110 active:scale-95 group overflow-hidden"
                                aria-label="Toggle theme"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                                {theme === 'light' ? (
                                    <Moon className="relative w-4 h-4 sm:w-5 sm:h-5 text-gray-700 dark:text-gray-300" />
                                ) : (
                                    <Sun className="relative w-4 h-4 sm:w-5 sm:h-5 text-amber-500 animate-pulse-slow" />
                                )}
                            </button>
                            <button className="relative p-2 sm:p-2.5 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-all hover:scale-110 active:scale-95 group overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                                <Bell className="relative w-4 h-4 sm:w-5 sm:h-5 text-gray-700 dark:text-gray-300" />
                                <span className="absolute top-1 right-1 sm:top-1.5 sm:right-1.5 w-2 h-2 bg-red-500 rounded-full animate-ping" />
                                <span className="absolute top-1 right-1 sm:top-1.5 sm:right-1.5 w-2 h-2 bg-red-500 rounded-full" />
                            </button>
                            <div className="hidden sm:flex items-center gap-3 pl-3 border-l border-gray-300 dark:border-slate-700">
                                <div className="text-right">
                                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">Admin</p>
                                    <p className="text-xs text-gray-600 dark:text-gray-400">Administrator</p>
                                </div>
                                <div className="relative group cursor-pointer">
                                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-pink-600 rounded-xl blur-md opacity-50 group-hover:opacity-75 transition-opacity" />
                                    <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-pink-600 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                                        <span className="text-white font-bold">A</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto">
                {/* Quick Stats Overview */}
                <div className="mb-6 sm:mb-8 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 animate-fade-in">
                    {[
                        { label: 'Occupancy Rate', value: '54.5%', icon: Building2, gradient: 'from-blue-500 to-blue-600', lightBg: 'bg-blue-50 dark:bg-blue-950/30' },
                        { label: 'Payment Rate', value: '2.0%', icon: Receipt, gradient: 'from-green-500 to-green-600', lightBg: 'bg-green-50 dark:bg-green-950/30' },
                        { label: 'Active Rate', value: '31.6%', icon: Activity, gradient: 'from-purple-500 to-purple-600', lightBg: 'bg-purple-50 dark:bg-purple-950/30' },
                        { label: 'Issues', value: '0', icon: Bell, gradient: 'from-orange-500 to-orange-600', lightBg: 'bg-orange-50 dark:bg-orange-950/30' },
                    ].map((stat, i) => {
                        const Icon = stat.icon;
                        return (
                            <div
                                key={stat.label}
                                className="relative glass-card p-4 sm:p-5 rounded-2xl hover:scale-105 transition-all group cursor-pointer overflow-hidden"
                                style={{ animationDelay: `${i * 0.1}s` }}
                            >
                                <div className="absolute top-0 right-0 w-24 h-24 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <Icon className="w-full h-full" strokeWidth={1} />
                                </div>
                                <div className="relative flex items-center justify-between mb-3">
                                    <div className={`relative p-2.5 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg group-hover:scale-110 transition-transform`}>
                                        <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} blur-md opacity-50`} />
                                        <Icon className="relative w-4 h-4 sm:w-5 sm:h-5 text-white" strokeWidth={2.5} />
                                    </div>
                                    <ArrowUpRight className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                                </div>
                                <div className="relative">
                                    <p className="text-2xl sm:text-3xl font-bold font-mono text-gray-900 dark:text-gray-100 mb-1 tracking-tight">{stat.value}</p>
                                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-medium">{stat.label}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
                    {metrics.map((metric, index) => {
                        const Icon = metric.icon;
                        const TrendIcon = metric.trend === 'up' ? TrendingUp : TrendingDown;
                        const percentage = metric.total > 0 ? (metric.occupied / metric.total) * 100 : 0;

                        return (
                            <div
                                key={metric.category}
                                className="group animate-slide-up"
                                style={{ animationDelay: `${index * 0.05}s` }}
                            >
                                <div className="glass-card rounded-2xl sm:rounded-3xl overflow-hidden hover:scale-105 transition-all duration-500 cursor-pointer hover:shadow-2xl">
                                    {/* Card Header with Gradient */}
                                    <div className={`relative p-5 sm:p-6 bg-gradient-to-br ${metric.gradient} text-white overflow-hidden`}>
                                        {/* Large Icon Background with animation */}
                                        <div className="absolute -top-4 -right-4 opacity-10 group-hover:opacity-15 transition-opacity duration-500">
                                            <Icon className="w-24 h-24 sm:w-32 sm:h-32 group-hover:scale-110 transition-transform duration-500" strokeWidth={1} />
                                        </div>

                                        {/* Animated gradient overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                        {/* Content */}
                                        <div className="relative z-10">
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="relative p-2.5 bg-white/20 backdrop-blur-sm rounded-xl shadow-lg group-hover:bg-white/30 transition-colors group-hover:scale-110 transition-transform duration-300">
                                                    <Icon className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2.5} />
                                                </div>
                                                {metric.trend !== 'neutral' && (
                                                    <div className="flex items-center gap-1 text-xs font-bold px-2.5 py-1.5 rounded-full backdrop-blur-sm bg-white/20 group-hover:bg-white/30 transition-colors">
                                                        <TrendIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                                        {metric.change}
                                                    </div>
                                                )}
                                            </div>
                                            <p className="text-xs sm:text-sm font-semibold opacity-95 mb-2">{metric.title}</p>
                                            <p className="text-4xl sm:text-5xl font-bold tracking-tight group-hover:scale-105 transition-transform duration-300 inline-block">{metric.value}</p>
                                        </div>
                                    </div>

                                    {/* Card Body */}
                                    {metric.total > 0 && (
                                        <div className="p-4 sm:p-5 bg-white dark:bg-slate-800">
                                            <div className="flex justify-between text-xs mb-2.5">
                                                <span className="text-gray-600 dark:text-gray-400 font-medium">
                                                    {metric.occupied} of {metric.total}
                                                </span>
                                                <span className="font-mono font-bold text-gray-900 dark:text-gray-100">
                                                    {percentage.toFixed(0)}%
                                                </span>
                                            </div>
                                            <div className="relative h-2.5 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full bg-gradient-to-r ${metric.gradient} transition-all duration-1000 ease-out rounded-full relative overflow-hidden`}
                                                    style={{ width: `${percentage}%` }}
                                                >
                                                    <div className="absolute inset-0 bg-white/20 animate-shimmer" style={{ backgroundSize: '200% 100%', backgroundImage: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)' }} />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Card Footer */}
                                    <button className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700/50 hover:bg-gray-100 dark:hover:bg-slate-700 transition-all flex items-center justify-between group/btn border-t border-gray-200 dark:border-slate-700 relative overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-200/50 dark:via-slate-600/50 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
                                        <span className="relative text-sm font-semibold text-gray-900 dark:text-gray-100">View Details</span>
                                        <ChevronRight className="relative w-4 h-4 text-gray-600 dark:text-gray-400 group-hover/btn:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Recent Activity */}
                <div className="glass-card rounded-2xl sm:rounded-3xl p-5 sm:p-6 animate-fade-in relative overflow-hidden" style={{ animationDelay: '0.4s' }}>
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-orange-500/5 to-pink-500/5 rounded-full blur-3xl" />
                    <div className="relative flex items-center justify-between mb-6">
                        <h2 className="text-lg sm:text-xl font-bold flex items-center gap-3 text-gray-900 dark:text-gray-100">
                            <div className="relative p-2.5 rounded-xl bg-gradient-to-br from-orange-500 to-pink-600 shadow-lg">
                                <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-pink-600 blur-md opacity-50" />
                                <Activity className="relative w-4 h-4 sm:w-5 sm:h-5 text-white" />
                            </div>
                            Recent Activity
                        </h2>
                        <button className="text-sm font-semibold text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 transition-colors flex items-center gap-1 group hover:scale-105">
                            View All
                            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </button>
                    </div>
                    <div className="relative space-y-3">
                        {[
                            { action: 'New tenant registered', time: '2 minutes ago', type: 'success', icon: Users },
                            { action: 'Invoice #1234 paid', time: '1 hour ago', type: 'success', icon: Receipt },
                            { action: 'Maintenance request submitted', time: '3 hours ago', type: 'warning', icon: Bell },
                            { action: 'Room 204 checked out', time: '5 hours ago', type: 'info', icon: Building2 },
                        ].map((activity, i) => {
                            const ActivityIcon = activity.icon;
                            return (
                                <div
                                    key={i}
                                    className="flex items-center justify-between p-3 sm:p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800 transition-all cursor-pointer group border border-transparent hover:border-gray-200 dark:hover:border-slate-700"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2.5 rounded-lg transition-all group-hover:scale-110 ${
                                            activity.type === 'success' ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' :
                                                activity.type === 'warning' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400' :
                                                    'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                                        }`}>
                                            <ActivityIcon className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{activity.action}</p>
                                            <p className="text-xs text-gray-600 dark:text-gray-400 font-mono flex items-center gap-1 mt-0.5">
                                                <Clock className="w-3 h-3" />
                                                {activity.time}
                                            </p>
                                        </div>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                                </div>
                            );
                        })}
                    </div>
                </div>
            </main>
        </div>
    );
}