'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import {
    Building2,
    Users,
    DollarSign,
    TrendingUp,
    Home,
    AlertCircle,
    CheckCircle,
    Clock,
    ArrowRight,
    Plus,
    FileText,
    Wrench,
    ChevronRight,
} from 'lucide-react';

export default function Dashboard() {
    const stats = [
        {
            title: 'Properties',
            value: '24',
            change: '+12%',
            icon: Building2,
            color: 'indigo',
        },
        {
            title: 'Tenants',
            value: '156',
            change: '+8%',
            icon: Users,
            color: 'purple',
        },
        {
            title: 'Revenue',
            value: 'Rp 45.2M',
            change: '+15%',
            icon: DollarSign,
            color: 'emerald',
        },
        {
            title: 'Occupancy',
            value: '94.2%',
            change: '+2.5%',
            icon: TrendingUp,
            color: 'amber',
        },
    ];

    const recentActivities = [
        {
            id: 1,
            title: 'New tenant checked in',
            description: 'Room 305, Building A',
            time: '2h ago',
            icon: CheckCircle,
            color: 'emerald',
        },
        {
            id: 2,
            title: 'Invoice generated',
            description: 'INV-2024-001 • Rp 3.5M',
            time: '4h ago',
            icon: FileText,
            color: 'blue',
        },
        {
            id: 3,
            title: 'Maintenance request',
            description: 'Room 201 • AC issue',
            time: '6h ago',
            icon: AlertCircle,
            color: 'amber',
        },
    ];

    const topProperties = [
        {
            id: 1,
            name: 'Building A',
            occupancy: 96,
            occupied: 48,
            total: 50,
        },
        {
            id: 2,
            name: 'Building B',
            occupancy: 92,
            occupied: 46,
            total: 50,
        },
    ];

    const quickActions = [
        { label: 'Add Property', icon: Building2 },
        { label: 'New Tenant', icon: Users },
        { label: 'Invoice', icon: FileText },
        { label: 'Maintenance', icon: Wrench },
    ];

    const upcomingTasks = [
        { id: 1, task: 'Monthly cleaning - Building A', due: 'Today', priority: 'high' },
        { id: 2, task: 'AC maintenance - Room 305', due: 'Tomorrow', priority: 'medium' },
        { id: 3, task: 'Contract renewal - Room 102', due: 'In 7 days', priority: 'high' },
    ];

    const getIconColor = (color: string) => {
        const colors: Record<string, string> = {
            indigo: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400',
            purple: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
            emerald: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400',
            amber: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
            blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
        };
        return colors[color] || colors.indigo;
    };

    return (
        <div className="p-4 md:p-6 space-y-4 md:space-y-6 pb-24 md:pb-6">
            {/* Header */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
                        Dashboard
                    </h1>
                    <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 mt-1">
                        Welcome back! Here's what's happening today.
                    </p>
                </div>
                <Button className="w-full sm:w-auto">
                    <Plus className="w-5 h-5" />
                    Quick Add
                </Button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <Card key={index} hover>
                            <CardContent className="p-4 md:p-6">
                                <div className="flex flex-col gap-3">
                                    <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center ${getIconColor(stat.color)}`}>
                                        <Icon className="w-5 h-5 md:w-6 md:h-6" />
                                    </div>
                                    <div>
                                        <p className="text-xs md:text-sm font-medium text-slate-600 dark:text-slate-400">
                                            {stat.title}
                                        </p>
                                        <p className="text-xl md:text-3xl font-bold text-slate-900 dark:text-white mt-1">
                                            {stat.value}
                                        </p>
                                        <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                      {stat.change}
                    </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Quick Actions */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base md:text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {quickActions.map((action, index) => {
                            const Icon = action.icon;
                            return (
                                <Button
                                    key={index}
                                    variant="outline"
                                    className="h-auto py-4 flex-col gap-2"
                                >
                                    <Icon className="w-5 h-5 md:w-6 md:h-6" />
                                    <span className="text-xs md:text-sm">{action.label}</span>
                                </Button>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>

            {/* Recent Activities & Tasks */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
                {/* Recent Activities */}
                <Card className="lg:col-span-2">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-base md:text-lg">Recent Activities</CardTitle>
                        <Button variant="ghost" size="sm" className="text-xs md:text-sm">
                            View All
                            <ArrowRight className="w-4 h-4" />
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {recentActivities.map((activity) => {
                                const Icon = activity.icon;
                                return (
                                    <div
                                        key={activity.id}
                                        className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                                    >
                                        <div className={`w-9 h-9 md:w-10 md:h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${getIconColor(activity.color)}`}>
                                            <Icon className="w-4 h-4 md:w-5 md:h-5" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-slate-900 dark:text-white">
                                                {activity.title}
                                            </p>
                                            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 truncate">
                                                {activity.description}
                                            </p>
                                            <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                                                {activity.time}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>

                {/* Upcoming Tasks */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base md:text-lg">Upcoming Tasks</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {upcomingTasks.map((task) => (
                                <div
                                    key={task.id}
                                    className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors"
                                >
                                    <div className="flex items-start justify-between gap-2 mb-2">
                                        <p className="text-sm font-medium text-slate-900 dark:text-white flex-1">
                                            {task.task}
                                        </p>
                                        <Badge
                                            variant={task.priority === 'high' ? 'danger' : 'warning'}
                                            size="sm"
                                        >
                                            {task.priority}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
                                        <Clock className="w-3.5 h-3.5" />
                                        {task.due}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Top Properties */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-base md:text-lg">Top Properties</CardTitle>
                    <Button variant="ghost" size="sm" className="text-xs md:text-sm">
                        View All
                        <ChevronRight className="w-4 h-4" />
                    </Button>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {topProperties.map((property) => (
                            <div
                                key={property.id}
                                className="p-4 rounded-lg border border-slate-200 dark:border-slate-800"
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
                                            <Home className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-slate-900 dark:text-white">
                                                {property.name}
                                            </h3>
                                            <p className="text-xs text-slate-600 dark:text-slate-400">
                                                {property.occupied}/{property.total} rooms
                                            </p>
                                        </div>
                                    </div>
                                    <Badge variant="success" size="sm">
                                        {property.occupancy}%
                                    </Badge>
                                </div>
                                <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2">
                                    <div
                                        className="bg-gradient-to-r from-indigo-600 to-purple-600 h-2 rounded-full transition-all"
                                        style={{ width: `${property.occupancy}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}