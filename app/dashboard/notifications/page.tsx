'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import {
    Bell,
    DollarSign,
    Wrench,
    FileText,
    Users,
    CheckCircle,
    Trash2,
} from 'lucide-react';

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState([
        {
            id: 1,
            type: 'payment',
            title: 'Payment Received',
            message: 'John Doe has paid rent for Room 305 - Rp 3,500,000',
            time: '5 minutes ago',
            read: false,
            icon: DollarSign,
            color: 'emerald',
        },
        {
            id: 2,
            type: 'maintenance',
            title: 'Maintenance Request',
            message: 'New maintenance request from Room 201 - AC not cooling',
            time: '1 hour ago',
            read: false,
            icon: Wrench,
            color: 'amber',
        },
        {
            id: 3,
            type: 'contract',
            title: 'Contract Expiring Soon',
            message: 'Jane Smith contract for Room 201 expires in 7 days',
            time: '2 hours ago',
            read: false,
            icon: FileText,
            color: 'red',
        },
        {
            id: 4,
            type: 'waiting',
            title: 'New Waiting List Entry',
            message: 'Alice Johnson added to waiting list for Building A',
            time: '3 hours ago',
            read: true,
            icon: Users,
            color: 'blue',
        },
        {
            id: 5,
            type: 'maintenance',
            title: 'Maintenance Completed',
            message: 'AC repair in Room 305 has been completed',
            time: '5 hours ago',
            read: true,
            icon: CheckCircle,
            color: 'emerald',
        },
        {
            id: 6,
            type: 'payment',
            title: 'Payment Overdue',
            message: 'Bob Johnson - Room 102 payment is 5 days overdue',
            time: '1 day ago',
            read: true,
            icon: DollarSign,
            color: 'red',
        },
    ]);

    const markAsRead = (id: number) => {
        setNotifications(prev =>
            prev.map(notif =>
                notif.id === id ? { ...notif, read: true } : notif
            )
        );
    };

    const markAllAsRead = () => {
        setNotifications(prev =>
            prev.map(notif => ({ ...notif, read: true }))
        );
    };

    const deleteNotification = (id: number) => {
        setNotifications(prev => prev.filter(notif => notif.id !== id));
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    const getIconColor = (color: string) => {
        const colors: Record<string, string> = {
            emerald: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400',
            amber: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
            red: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
            blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
        };
        return colors[color] || colors.blue;
    };

    return (
        <div className="p-4 md:p-6 space-y-4 md:space-y-6 pb-24 md:pb-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
                        Notifications
                    </h1>
                    <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 mt-1">
                        Stay updated with your property activities
                    </p>
                </div>
                {unreadCount > 0 && (
                    <Button
                        variant="outline"
                        onClick={markAllAsRead}
                        className="w-full sm:w-auto"
                    >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Mark all as read
                    </Button>
                )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                <Card>
                    <CardContent className="p-3 md:p-4">
                        <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400">Total</p>
                        <p className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mt-1">
                            {notifications.length}
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-3 md:p-4">
                        <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400">Unread</p>
                        <p className="text-xl md:text-2xl font-bold text-indigo-600 dark:text-indigo-400 mt-1">
                            {unreadCount}
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-3 md:p-4">
                        <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400">Today</p>
                        <p className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mt-1">
                            {notifications.filter(n =>
                                n.time.includes('minute') || n.time.includes('hour')
                            ).length}
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-3 md:p-4">
                        <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400">Read</p>
                        <p className="text-xl md:text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                            {notifications.filter(n => n.read).length}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Notifications List */}
            {notifications.length > 0 ? (
                <div className="space-y-3">
                    {notifications.map((notification) => {
                        const Icon = notification.icon;
                        return (
                            <Card
                                key={notification.id}
                                hover
                                className={!notification.read ? 'border-l-4 border-l-indigo-600' : ''}
                            >
                                <CardContent className="p-4">
                                    <div className="flex items-start gap-3 md:gap-4">
                                        {/* Icon */}
                                        <div className={`w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${getIconColor(notification.color)}`}>
                                            <Icon className="w-5 h-5 md:w-6 md:h-6" />
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2 mb-1">
                                                <h3 className={`font-semibold text-sm md:text-base ${!notification.read ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}>
                                                    {notification.title}
                                                </h3>
                                                {!notification.read && (
                                                    <div className="w-2 h-2 rounded-full bg-indigo-600 flex-shrink-0 mt-1.5" />
                                                )}
                                            </div>
                                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                                                {notification.message}
                                            </p>
                                            <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-500 dark:text-slate-500">
                          {notification.time}
                        </span>
                                                <div className="flex items-center gap-2">
                                                    {!notification.read && (
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            onClick={() => markAsRead(notification.id)}
                                                        >
                                                            <CheckCircle className="w-4 h-4" />
                                                        </Button>
                                                    )}
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => deleteNotification(notification.id)}
                                                    >
                                                        <Trash2 className="w-4 h-4 text-red-600" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            ) : (
                <Card>
                    <CardContent className="p-12 text-center">
                        <Bell className="w-12 h-12 md:w-16 md:h-16 text-slate-400 dark:text-slate-600 mx-auto mb-4" />
                        <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base">
                            No notifications yet
                        </p>
                        <p className="text-slate-500 dark:text-slate-500 text-xs md:text-sm mt-2">
                            You're all caught up! 🎉
                        </p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}