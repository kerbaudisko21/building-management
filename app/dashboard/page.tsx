'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import {
    LogIn,
    LogOut,
    Sparkles,
    Wrench,
    DollarSign,
    Home,
    AlertCircle,
    FileText,
    Calendar,
    Plus,
    Phone,
    MessageCircle,
    User,
    Clock,
    CheckCircle,
    TrendingUp,
} from 'lucide-react';

export default function DashboardPage() {
    const [holidays, setHolidays] = useState<any[]>([]);
    const [loadingHolidays, setLoadingHolidays] = useState(true);

    // Check-in today
    const checkInsToday = [
        { id: 1, name: 'John Doe', room: 'Room 305', time: '14:00', status: 'Confirmed' },
        { id: 2, name: 'Sarah Wilson', room: 'Room 201', time: '15:30', status: 'Pending' },
        { id: 3, name: 'Michael Chen', room: 'Room 402', time: '16:00', status: 'Confirmed' },
    ];

    // Check-out today
    const checkOutsToday = [
        { id: 1, name: 'Jane Smith', room: 'Room 102', time: '11:00', status: 'Completed' },
        { id: 2, name: 'Bob Johnson', room: 'Room 205', time: '12:00', status: 'Pending' },
    ];

    // Cleaner tasks
    const cleanerTasks = [
        { id: 1, room: 'Room 102', task: 'Deep cleaning after checkout', status: 'In Progress' },
        { id: 2, room: 'Room 305', task: 'Pre check-in preparation', status: 'Pending' },
        { id: 3, room: 'Common Area', task: 'Daily cleaning', status: 'Completed' },
    ];

    // Maintenance tasks
    const maintenanceTasks = [
        { id: 1, room: 'Room 201', issue: 'AC not cooling', status: 'In Progress' },
        { id: 2, room: 'Room 403', issue: 'Leaking faucet', status: 'Pending' },
        { id: 3, room: 'Lobby', issue: 'Light bulb replacement', status: 'Pending' },
    ];

    // Outstanding payments
    const outstandingPayments = [
        { id: 1, tenant: 'Alice Brown', room: 'Room 301', amount: 3500000, daysOverdue: 5 },
        { id: 2, tenant: 'Charlie Davis', room: 'Room 404', amount: 4200000, daysOverdue: 3 },
    ];

    // Expiring contracts
    const expiringContracts = [
        { id: 1, tenant: 'Emma Wilson', room: 'Room 203', expiryDate: '2024-12-20', daysLeft: 7 },
        { id: 2, tenant: 'David Lee', room: 'Room 305', expiryDate: '2024-12-25', daysLeft: 12 },
    ];

    useEffect(() => {
        const fetchHolidays = async () => {
            try {
                setLoadingHolidays(true);
                const currentYear = new Date().getFullYear();
                const response = await fetch(`https://api-harilibur.vercel.app/api?year=${currentYear}`);

                if (!response.ok) {
                    throw new Error('API failed');
                }

                const data = await response.json();

                const today = new Date();
                today.setHours(0, 0, 0, 0);

                const upcoming = data
                    .filter((item: any) => item.is_national_holiday || item.holiday_name) // Filter actual holidays
                    .map((holiday: any) => {
                        const holidayDate = new Date(holiday.holiday_date);
                        const diffTime = holidayDate.getTime() - today.getTime();
                        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                        return {
                            id: holiday.holiday_date,
                            name: holiday.holiday_name,
                            date: holiday.holiday_date,
                            daysUntil: diffDays,
                            isNational: holiday.is_national_holiday
                        };
                    })
                    .filter((h: any) => h.daysUntil >= 0 && h.daysUntil <= 30)
                    .sort((a: any, b: any) => a.daysUntil - b.daysUntil)
                    .slice(0, 6);

                setHolidays(upcoming);
            } catch (error) {
                console.error('Error fetching holidays:', error);

                try {
                    const currentYear = new Date().getFullYear();
                    const response = await fetch(
                        `https://calendarific.com/api/v2/holidays?&api_key=YOUR_API_KEY&country=ID&year=${currentYear}`
                    );

                    if (response.ok) {
                        const data = await response.json();
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);

                        const upcoming = data.response.holidays
                            .map((holiday: any) => {
                                const holidayDate = new Date(holiday.date.iso);
                                const diffTime = holidayDate.getTime() - today.getTime();
                                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                                return {
                                    id: holiday.date.iso,
                                    name: holiday.name,
                                    date: holiday.date.iso,
                                    daysUntil: diffDays,
                                    isNational: holiday.type.includes('National')
                                };
                            })
                            .filter((h: any) => h.daysUntil >= 0 && h.daysUntil <= 30) // Next 30 days (1 month)
                            .sort((a: any, b: any) => a.daysUntil - b.daysUntil)
                            .slice(0, 6);

                        setHolidays(upcoming);
                    } else {
                        setHolidays([]);
                    }
                } catch (fallbackError) {
                    console.error('Fallback API also failed:', fallbackError);
                    setHolidays([]);
                }
            } finally {
                setLoadingHolidays(false);
            }
        };

        fetchHolidays();
    }, []);

    const todayRevenue = 15750000;
    const todayOccupancy = 85; // percentage

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const getStatusBadge = (status: string) => {
        const variants: Record<string, any> = {
            'Completed': 'success',
            'In Progress': 'info',
            'Pending': 'warning',
            'Confirmed': 'success',
        };
        return variants[status] || 'default';
    };

    return (
        <div className="p-4 md:p-6 space-y-4 md:space-y-6 pb-24 md:pb-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
                    Dashboard
                </h1>
                <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 mt-1">
                    Welcome back! Here's what's happening today.
                </p>
            </div>

            {/* Key Metrics - Top Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                {/* Check-ins Today */}
                <Card>
                    <CardContent className="p-3 md:p-4">
                        <div className="flex items-center justify-between">
                            <div className="min-w-0 flex-1">
                                <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 truncate">
                                    Check-ins Today
                                </p>
                                <p className="text-xl md:text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1 truncate">
                                    {checkInsToday.length}
                                </p>
                            </div>
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0 ml-2">
                                <LogIn className="w-5 h-5 md:w-6 md:h-6 text-emerald-600 dark:text-emerald-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Check-outs Today */}
                <Card>
                    <CardContent className="p-3 md:p-4">
                        <div className="flex items-center justify-between">
                            <div className="min-w-0 flex-1">
                                <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 truncate">
                                    Check-outs Today
                                </p>
                                <p className="text-xl md:text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1 truncate">
                                    {checkOutsToday.length}
                                </p>
                            </div>
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0 ml-2">
                                <LogOut className="w-5 h-5 md:w-6 md:h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Today Revenue */}
                <Card>
                    <CardContent className="p-3 md:p-4">
                        <div className="flex items-center justify-between">
                            <div className="min-w-0 flex-1">
                                <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 truncate">
                                    Today Revenue
                                </p>
                                <p className="text-base md:text-xl font-bold text-purple-600 dark:text-purple-400 mt-1 truncate">
                                    {formatCurrency(todayRevenue).substring(0, 10)}
                                </p>
                            </div>
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0 ml-2">
                                <DollarSign className="w-5 h-5 md:w-6 md:h-6 text-purple-600 dark:text-purple-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Today Occupancy */}
                <Card>
                    <CardContent className="p-3 md:p-4">
                        <div className="flex items-center justify-between">
                            <div className="min-w-0 flex-1">
                                <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 truncate">
                                    Today Occupancy
                                </p>
                                <p className="text-xl md:text-2xl font-bold text-indigo-600 dark:text-indigo-400 mt-1 truncate">
                                    {todayOccupancy}%
                                </p>
                            </div>
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center flex-shrink-0 ml-2">
                                <Home className="w-5 h-5 md:w-6 md:h-6 text-indigo-600 dark:text-indigo-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions */}
            <Card>
                <CardContent className="p-4 md:p-6">
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5" />
                        Quick Actions
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                        <Button variant="outline" className="flex-col h-auto py-3 gap-2">
                            <Calendar className="w-5 h-5" />
                            <span className="text-xs">Survey</span>
                        </Button>
                        <Button variant="outline" className="flex-col h-auto py-3 gap-2">
                            <Plus className="w-5 h-5" />
                            <span className="text-xs">New Booking</span>
                        </Button>
                        <Button variant="outline" className="flex-col h-auto py-3 gap-2">
                            <Wrench className="w-5 h-5" />
                            <span className="text-xs">Maintenance</span>
                        </Button>
                        <Button variant="outline" className="flex-col h-auto py-3 gap-2">
                            <MessageCircle className="w-5 h-5" />
                            <span className="text-xs">Call Cleaning</span>
                        </Button>
                        <Button variant="outline" className="flex-col h-auto py-3 gap-2">
                            <Phone className="w-5 h-5" />
                            <span className="text-xs">Call Maintenance</span>
                        </Button>
                        <Button variant="outline" className="flex-col h-auto py-3 gap-2">
                            <Calendar className="w-5 h-5" />
                            <span className="text-xs">Holidays</span>
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Check-ins & Check-outs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Check-ins Today */}
                <Card>
                    <CardContent className="p-4">
                        <h3 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                            <LogIn className="w-5 h-5 text-emerald-600" />
                            Check-ins Today
                        </h3>
                        <div className="space-y-2">
                            {checkInsToday.map((checkin) => (
                                <div key={checkin.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-slate-900 dark:text-white text-sm truncate">
                                            {checkin.name}
                                        </p>
                                        <p className="text-xs text-slate-600 dark:text-slate-400">
                                            {checkin.room} • {checkin.time}
                                        </p>
                                    </div>
                                    <Badge variant={getStatusBadge(checkin.status)} size="sm">
                                        {checkin.status}
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Check-outs Today */}
                <Card>
                    <CardContent className="p-4">
                        <h3 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                            <LogOut className="w-5 h-5 text-blue-600" />
                            Check-outs Today
                        </h3>
                        <div className="space-y-2">
                            {checkOutsToday.map((checkout) => (
                                <div key={checkout.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-slate-900 dark:text-white text-sm truncate">
                                            {checkout.name}
                                        </p>
                                        <p className="text-xs text-slate-600 dark:text-slate-400">
                                            {checkout.room} • {checkout.time}
                                        </p>
                                    </div>
                                    <Badge variant={getStatusBadge(checkout.status)} size="sm">
                                        {checkout.status}
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Tasks */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Cleaner Tasks */}
                <Card>
                    <CardContent className="p-4">
                        <h3 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-pink-600" />
                            Cleaner Tasks ({cleanerTasks.filter(t => t.status !== 'Completed').length})
                        </h3>
                        <div className="space-y-2">
                            {cleanerTasks.map((task) => (
                                <div key={task.id} className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-slate-900 dark:text-white text-sm">
                                                {task.room}
                                            </p>
                                            <p className="text-xs text-slate-600 dark:text-slate-400">
                                                {task.task}
                                            </p>
                                        </div>
                                        <Badge variant={getStatusBadge(task.status)} size="sm">
                                            {task.status}
                                        </Badge>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Maintenance Tasks */}
                <Card>
                    <CardContent className="p-4">
                        <h3 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                            <Wrench className="w-5 h-5 text-amber-600" />
                            Maintenance Tasks ({maintenanceTasks.filter(t => t.status !== 'Completed').length})
                        </h3>
                        <div className="space-y-2">
                            {maintenanceTasks.map((task) => (
                                <div key={task.id} className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-slate-900 dark:text-white text-sm">
                                                {task.room}
                                            </p>
                                            <p className="text-xs text-slate-600 dark:text-slate-400">
                                                {task.issue}
                                            </p>
                                        </div>
                                        <Badge variant={getStatusBadge(task.status)} size="sm">
                                            {task.status}
                                        </Badge>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Alerts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Outstanding Payments */}
                <Card>
                    <CardContent className="p-4">
                        <h3 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 text-red-600" />
                            Outstanding Payments ({outstandingPayments.length})
                        </h3>
                        <div className="space-y-2">
                            {outstandingPayments.map((payment) => (
                                <div key={payment.id} className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-900/50">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-slate-900 dark:text-white text-sm truncate">
                                                {payment.tenant}
                                            </p>
                                            <p className="text-xs text-slate-600 dark:text-slate-400">
                                                {payment.room}
                                            </p>
                                            <p className="text-sm font-bold text-red-600 dark:text-red-400 mt-1">
                                                {formatCurrency(payment.amount)}
                                            </p>
                                        </div>
                                        <Badge variant="danger" size="sm">
                                            {payment.daysOverdue}d overdue
                                        </Badge>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Expiring Contracts */}
                <Card>
                    <CardContent className="p-4">
                        <h3 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                            <FileText className="w-5 h-5 text-amber-600" />
                            Contract Expiring Soon ({expiringContracts.length})
                        </h3>
                        <div className="space-y-2">
                            {expiringContracts.map((contract) => (
                                <div key={contract.id} className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-900/50">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-slate-900 dark:text-white text-sm truncate">
                                                {contract.tenant}
                                            </p>
                                            <p className="text-xs text-slate-600 dark:text-slate-400">
                                                {contract.room}
                                            </p>
                                            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                                                Expires: {contract.expiryDate}
                                            </p>
                                        </div>
                                        <Badge variant="warning" size="sm">
                                            {contract.daysLeft} days left
                                        </Badge>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Upcoming Holidays */}
            <Card>
                <CardContent className="p-4">
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-indigo-600" />
                        Upcoming Holidays (Indonesia)
                    </h3>
                    {loadingHolidays ? (
                        <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                            Loading holidays...
                        </div>
                    ) : holidays.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {holidays.map((holiday) => (
                                <div key={holiday.id} className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-200 dark:border-indigo-900/50">
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <p className="font-medium text-slate-900 dark:text-white text-sm">
                                                    {holiday.name}
                                                </p>
                                                {holiday.isNational && (
                                                    <span className="text-xs px-1.5 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded">
                                                        Nasional
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-xs text-slate-600 dark:text-slate-400">
                                                {new Date(holiday.date).toLocaleDateString('id-ID', {
                                                    weekday: 'long',
                                                    day: 'numeric',
                                                    month: 'long',
                                                    year: 'numeric'
                                                })}
                                            </p>
                                        </div>
                                        <Badge variant="purple" size="sm" className="flex-shrink-0">
                                            {holiday.daysUntil === 0 ? 'Hari ini' :
                                                holiday.daysUntil === 1 ? 'Besok' :
                                                    `${holiday.daysUntil} hari`}
                                        </Badge>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                            Tidak ada libur dalam 30 hari ke depan
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}