'use client';

import { useState } from 'react';
import {
    Building2,
    Users,
    DollarSign,
    TrendingUp,
    Home,
    Bed,
    Zap,
    AlertCircle,
    ArrowUpRight,
    ArrowDownRight,
    Moon,
    Sun
} from 'lucide-react';
import { useTheme } from '@/components/providers/ThemeProvider';

const stats = [
    {
        title: 'Total Properties',
        value: '24',
        change: '+12%',
        trend: 'up',
        icon: Building2,
        color: 'from-emerald-500 to-teal-500',
        bgColor: 'from-emerald-500/10 to-teal-500/10'
    },
    {
        title: 'Active Tenants',
        value: '156',
        change: '+8%',
        trend: 'up',
        icon: Users,
        color: 'from-blue-500 to-cyan-500',
        bgColor: 'from-blue-500/10 to-cyan-500/10'
    },
    {
        title: 'Monthly Revenue',
        value: '$45,280',
        change: '+15%',
        trend: 'up',
        icon: DollarSign,
        color: 'from-purple-500 to-pink-500',
        bgColor: 'from-purple-500/10 to-pink-500/10'
    },
    {
        title: 'Occupancy Rate',
        value: '94.2%',
        change: '-2%',
        trend: 'down',
        icon: TrendingUp,
        color: 'from-amber-500 to-orange-500',
        bgColor: 'from-amber-500/10 to-orange-500/10'
    }
];

const recentActivities = [
    { id: 1, type: 'payment', tenant: 'John Doe', property: 'Sunset Villa', amount: '$1,250', time: '2 hours ago', status: 'completed' },
    { id: 2, type: 'complaint', tenant: 'Jane Smith', property: 'Ocean View', issue: 'Water leak', time: '4 hours ago', status: 'pending' },
    { id: 3, type: 'checkout', tenant: 'Mike Johnson', property: 'Garden House', time: '1 day ago', status: 'completed' },
    { id: 4, type: 'checkin', tenant: 'Sarah Wilson', property: 'Mountain Lodge', time: '2 days ago', status: 'completed' },
];

const properties = [
    { name: 'Sunset Villa', rooms: 12, occupied: 10, revenue: '$8,500', status: 'excellent' },
    { name: 'Ocean View', rooms: 8, occupied: 8, revenue: '$6,200', status: 'excellent' },
    { name: 'Garden House', rooms: 15, occupied: 13, revenue: '$10,800', status: 'good' },
    { name: 'Mountain Lodge', rooms: 10, occupied: 7, revenue: '$5,400', status: 'moderate' },
];

export default function DashboardPage() {
    const { theme, toggleTheme } = useTheme();

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-slate-950 dark:via-indigo-950/20 dark:to-purple-950/10">
            <header className="sticky top-0 z-20 backdrop-blur-xl bg-white/80 dark:bg-slate-950/80 border-b border-slate-200 dark:border-white/5 shadow-sm">
                <div className="px-4 sm:px-8 py-4 sm:py-5 lg:ml-0 ml-16">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="flex text-2xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                                Dashboard
                            </h1>
                            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 hidden sm:block">
                                Welcome back! Here's what's happening today.
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={toggleTheme}
                                className="relative p-2.5 sm:p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg group flex items-center justify-center"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                                {theme === 'dark' ? (
                                    <Sun className="w-5 h-5 text-amber-500 relative z-10" strokeWidth={2.5} />
                                ) : (
                                    <Moon className="w-5 h-5 text-indigo-600 relative z-10" strokeWidth={2.5} />
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="p-4 sm:p-8 space-y-6 sm:space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                    {stats.map((stat, index) => {
                        const Icon = stat.icon;
                        const TrendIcon = stat.trend === 'up' ? ArrowUpRight : ArrowDownRight;

                        return (
                            <div
                                key={index}
                                className="group relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/10 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1"
                            >
                                <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                                <div className="relative p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                            <Icon className="w-6 h-6 text-white" strokeWidth={2.5} />
                                        </div>
                                        <div className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold ${
                                            stat.trend === 'up'
                                                ? 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                                                : 'bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-400'
                                        }`}>
                                            <TrendIcon className="w-3 h-3" strokeWidth={3} />
                                            {stat.change}
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">{stat.title}</p>
                                        <p className="text-3xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
                                    </div>
                                </div>

                                <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 blur-2xl transition-opacity duration-300 pointer-events-none`} />
                            </div>
                        );
                    })}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
                    <div className="lg:col-span-2">
                        <div className="rounded-2xl bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 shadow-xl overflow-hidden">
                            <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-slate-200 dark:border-white/5">
                                <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">Recent Activities</h2>
                                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">Latest updates from your properties</p>
                            </div>
                            <div className="p-4 sm:p-6">
                                <div className="space-y-3 sm:space-y-4">
                                    {recentActivities.map((activity) => (
                                        <div
                                            key={activity.id}
                                            className="group flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-white/10 transition-all duration-300 cursor-pointer"
                                        >
                                            <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${
                                                activity.status === 'completed'
                                                    ? 'bg-gradient-to-br from-emerald-500 to-teal-500'
                                                    : 'bg-gradient-to-br from-amber-500 to-orange-500'
                                            }`}>
                                                {activity.type === 'payment' && <DollarSign className="w-5 h-5 text-white" strokeWidth={2.5} />}
                                                {activity.type === 'complaint' && <AlertCircle className="w-5 h-5 text-white" strokeWidth={2.5} />}
                                                {activity.type === 'checkout' && <Bed className="w-5 h-5 text-white" strokeWidth={2.5} />}
                                                {activity.type === 'checkin' && <Home className="w-5 h-5 text-white" strokeWidth={2.5} />}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold text-sm sm:text-base text-slate-900 dark:text-white truncate">{activity.tenant}</p>
                                                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 truncate">
                                                    {activity.property} {activity.amount && `• ${activity.amount}`} {activity.issue && `• ${activity.issue}`}
                                                </p>
                                            </div>
                                            <div className="flex-shrink-0 text-right">
                                                <p className="text-xs text-slate-500 dark:text-slate-500 hidden sm:block">{activity.time}</p>
                                                <span className={`inline-block mt-1 px-2 py-0.5 text-xs font-medium rounded-md ${
                                                    activity.status === 'completed'
                                                        ? 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                                                        : 'bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400'
                                                }`}>
                                                    {activity.status}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-1">
                        <div className="rounded-2xl bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 shadow-xl overflow-hidden">
                            <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-slate-200 dark:border-white/5">
                                <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">Properties</h2>
                                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">Performance overview</p>
                            </div>
                            <div className="p-4 sm:p-6">
                                <div className="space-y-4">
                                    {properties.map((property, index) => (
                                        <div
                                            key={index}
                                            className="group p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-white/10 transition-all duration-300 cursor-pointer"
                                        >
                                            <div className="flex items-center justify-between mb-3">
                                                <h3 className="font-semibold text-slate-900 dark:text-white">{property.name}</h3>
                                                <span className={`px-2 py-1 text-xs font-medium rounded-md ${
                                                    property.status === 'excellent'
                                                        ? 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                                                        : property.status === 'good'
                                                            ? 'bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400'
                                                            : 'bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400'
                                                }`}>
                                                    {property.status}
                                                </span>
                                            </div>
                                            <div className="space-y-2">
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-slate-600 dark:text-slate-400">Occupancy</span>
                                                    <span className="font-semibold text-slate-900 dark:text-white">
                                                        {property.occupied}/{property.rooms}
                                                    </span>
                                                </div>
                                                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                                                    <div
                                                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
                                                        style={{ width: `${(property.occupied / property.rooms) * 100}%` }}
                                                    />
                                                </div>
                                                <div className="flex justify-between text-sm pt-1">
                                                    <span className="text-slate-600 dark:text-slate-400">Revenue</span>
                                                    <span className="font-bold text-indigo-600 dark:text-indigo-400">{property.revenue}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}