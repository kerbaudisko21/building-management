'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import {
    Calendar,
    Clock,
    Wrench,
    ClipboardCheck,
    KeyRound,
    Sparkles,
    Phone,
    MessageCircle,
    AlertCircle,
    DollarSign,
    FileText,
    TrendingUp,
    Users,
    Home,
    CheckCircle,
    XCircle,
    ChevronRight,
} from 'lucide-react';

export default function EnhancedDashboard() {
    const [expandedSections, setExpandedSections] = useState({
        schedule: true,
        alerts: true,
        week: false,
    });

    // Mock data - Today's schedule
    const todaySchedule = [
        {
            id: 1,
            time: '09:00',
            type: 'maintenance',
            title: 'AC Repair',
            location: 'Room 201, Building A',
            assignee: 'John Doe',
            phone: '+628123456789',
            status: 'scheduled',
            priority: 'high',
        },
        {
            id: 2,
            time: '10:00',
            type: 'checkout',
            title: 'Check-out',
            location: 'Room 301, Building B',
            guest: 'Sarah Lee',
            action: 'Call cleaning team',
            status: 'pending',
            priority: 'high',
        },
        {
            id: 3,
            time: '11:00',
            type: 'checkin',
            title: 'Check-in',
            location: 'Room 205, Building A',
            guest: 'Mike Chen',
            contract: '1 year contract',
            status: 'scheduled',
            priority: 'medium',
        },
        {
            id: 4,
            time: '13:00',
            type: 'maintenance',
            title: 'Plumbing Fix',
            location: 'Room 305, Building A',
            assignee: 'Bob Wilson',
            phone: '+628123456790',
            status: 'scheduled',
            priority: 'medium',
        },
        {
            id: 5,
            time: '14:00',
            type: 'survey',
            title: 'Property Survey',
            location: 'Unit 102, Building A',
            prospect: 'Jane Doe',
            phone: '+628123456791',
            status: 'scheduled',
            priority: 'low',
        },
    ];

    // Alerts
    const alerts = [
        {
            id: 1,
            type: 'payment',
            severity: 'urgent',
            title: '3 Late Payments',
            description: 'Total outstanding: Rp 14,500,000',
            items: [
                { room: 'Room 205', amount: 'Rp 5,000,000', days: 7 },
                { room: 'Room 301', amount: 'Rp 4,500,000', days: 3 },
                { room: 'Room 108', amount: 'Rp 5,000,000', days: 14 },
            ],
        },
        {
            id: 2,
            type: 'contract',
            severity: 'warning',
            title: '2 Contracts Expiring Soon',
            items: [
                { room: 'Room 401', tenant: 'Ahmad', days: 5 },
                { room: 'Room 203', tenant: 'Siti', days: 12 },
            ],
        },
        {
            id: 3,
            type: 'maintenance',
            severity: 'urgent',
            title: '1 Urgent Maintenance',
            description: 'Water leak - Room 501',
            time: '2 hours ago',
        },
    ];

    // Week overview
    const weekSchedule = [
        { day: 'Mon', tasks: 3, types: ['maintenance', 'survey', 'checkout'] },
        { day: 'Tue', tasks: 2, types: ['maintenance', 'checkin'] },
        { day: 'Wed', tasks: 1, types: ['survey'] },
        { day: 'Thu', tasks: 4, types: ['maintenance', 'checkout', 'checkin'] },
        { day: 'Fri', tasks: 2, types: ['survey', 'checkout'] },
        { day: 'Sat', tasks: 1, types: ['checkin'] },
        { day: 'Sun', tasks: 0, types: [] },
    ];

    const getTypeIcon = (type: string) => {
        const icons = {
            maintenance: Wrench,
            survey: ClipboardCheck,
            checkin: KeyRound,
            checkout: Sparkles,
        };
        return icons[type as keyof typeof icons] || Calendar;
    };

    const getTypeColor = (type: string) => {
        const colors = {
            maintenance: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
            survey: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
            checkin: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
            checkout: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
        };
        return colors[type as keyof typeof colors] || 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400';
    };

    const getSeverityColor = (severity: string) => {
        const colors = {
            urgent: 'bg-red-100 border-red-300 dark:bg-red-900/20 dark:border-red-800',
            warning: 'bg-amber-100 border-amber-300 dark:bg-amber-900/20 dark:border-amber-800',
            info: 'bg-blue-100 border-blue-300 dark:bg-blue-900/20 dark:border-blue-800',
        };
        return colors[severity as keyof typeof colors] || 'bg-slate-100 border-slate-300 dark:bg-slate-800 dark:border-slate-700';
    };

    const callPhone = (phone: string) => {
        window.location.href = `tel:${phone}`;
    };

    const callWhatsApp = (phone: string, message: string) => {
        const encodedMessage = encodeURIComponent(message);
        window.open(`https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${encodedMessage}`, '_blank');
    };

    return (
        <div className="p-4 md:p-6 space-y-4 md:space-y-6 pb-24 md:pb-6">
            {/* Header with Greeting */}
            <div>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
                    Good Morning, Pak Owner! 👋
                </h1>
                <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 mt-1">
                    Here's what needs your attention today
                </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                <Card>
                    <CardContent className="p-3 md:p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <DollarSign className="w-5 h-5 text-emerald-600" />
                            <p className="text-xs text-slate-600 dark:text-slate-400">Today Revenue</p>
                        </div>
                        <p className="text-lg md:text-xl font-bold text-slate-900 dark:text-white">
                            Rp 5M
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-3 md:p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Home className="w-5 h-5 text-indigo-600" />
                            <p className="text-xs text-slate-600 dark:text-slate-400">Occupancy</p>
                        </div>
                        <p className="text-lg md:text-xl font-bold text-slate-900 dark:text-white">
                            85%
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-3 md:p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Calendar className="w-5 h-5 text-blue-600" />
                            <p className="text-xs text-slate-600 dark:text-slate-400">Today Tasks</p>
                        </div>
                        <p className="text-lg md:text-xl font-bold text-slate-900 dark:text-white">
                            {todaySchedule.length}
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-3 md:p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <AlertCircle className="w-5 h-5 text-red-600" />
                            <p className="text-xs text-slate-600 dark:text-slate-400">Urgent</p>
                        </div>
                        <p className="text-lg md:text-xl font-bold text-red-600 dark:text-red-400">
                            {alerts.filter(a => a.severity === 'urgent').length}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Urgent Alerts */}
            <Card className="border-l-4 border-l-red-500">
                <CardContent className="p-4">
                    <div
                        className="flex items-center justify-between cursor-pointer"
                        onClick={() => setExpandedSections(prev => ({ ...prev, alerts: !prev.alerts }))}
                    >
                        <div className="flex items-center gap-3">
                            <AlertCircle className="w-6 h-6 text-red-600" />
                            <div>
                                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                                    ⚠️ {alerts.length} Urgent Alerts
                                </h2>
                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                    Requires immediate attention
                                </p>
                            </div>
                        </div>
                        <ChevronRight className={`w-5 h-5 text-slate-400 transition-transform ${expandedSections.alerts ? 'rotate-90' : ''}`} />
                    </div>

                    {expandedSections.alerts && (
                        <div className="mt-4 space-y-3">
                            {alerts.map((alert) => (
                                <div
                                    key={alert.id}
                                    className={`p-4 rounded-lg border-2 ${getSeverityColor(alert.severity)}`}
                                >
                                    <div className="flex items-start justify-between mb-2">
                                        <h3 className="font-semibold text-slate-900 dark:text-white">
                                            {alert.title}
                                        </h3>
                                        <Badge variant={alert.severity === 'urgent' ? 'error' : 'warning'} size="sm">
                                            {alert.severity}
                                        </Badge>
                                    </div>
                                    {alert.description && (
                                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                                            {alert.description}
                                        </p>
                                    )}
                                    {alert.items && (
                                        <div className="space-y-1">
                                            {alert.items.map((item: any, idx: number) => (
                                                <div key={idx} className="text-sm text-slate-700 dark:text-slate-300 flex items-center justify-between">
                          <span>
                            {item.room || item.tenant}
                              {item.amount && ` - ${item.amount}`}
                              {item.days && ` (${item.days} days ${alert.type === 'payment' ? 'late' : 'until expiry'})`}
                          </span>
                                                    {alert.type === 'payment' && (
                                                        <Button size="sm" variant="outline" className="ml-2">
                                                            Send Reminder
                                                        </Button>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    {alert.time && (
                                        <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">
                                            Submitted: {alert.time}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Today's Schedule */}
            <Card>
                <CardContent className="p-4">
                    <div
                        className="flex items-center justify-between cursor-pointer mb-4"
                        onClick={() => setExpandedSections(prev => ({ ...prev, schedule: !prev.schedule }))}
                    >
                        <div className="flex items-center gap-3">
                            <Calendar className="w-6 h-6 text-indigo-600" />
                            <div>
                                <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white">
                                    📅 Today's Schedule
                                </h2>
                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                    Tuesday, December 17, 2024
                                </p>
                            </div>
                        </div>
                        <ChevronRight className={`w-5 h-5 text-slate-400 transition-transform ${expandedSections.schedule ? 'rotate-90' : ''}`} />
                    </div>

                    {expandedSections.schedule && (
                        <div className="space-y-3">
                            {todaySchedule.map((item) => {
                                const Icon = getTypeIcon(item.type);
                                return (
                                    <Card key={item.id} hover className="border-l-4 border-l-indigo-500">
                                        <CardContent className="p-4">
                                            <div className="flex items-start gap-3">
                                                {/* Time */}
                                                <div className="flex-shrink-0 text-center">
                                                    <div className="w-16 h-16 rounded-lg bg-slate-100 dark:bg-slate-800 flex flex-col items-center justify-center">
                                                        <Clock className="w-4 h-4 text-slate-600 dark:text-slate-400 mb-1" />
                                                        <span className="text-sm font-bold text-slate-900 dark:text-white">
                              {item.time}
                            </span>
                                                    </div>
                                                </div>

                                                {/* Content */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between gap-2 mb-2">
                                                        <div className="flex items-center gap-2">
                                                            <div className={`w-8 h-8 rounded-lg ${getTypeColor(item.type)} flex items-center justify-center`}>
                                                                <Icon className="w-4 h-4" />
                                                            </div>
                                                            <div>
                                                                <h3 className="font-semibold text-slate-900 dark:text-white">
                                                                    {item.title}
                                                                </h3>
                                                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                                                    {item.location}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <Badge
                                                            variant={item.priority === 'high' ? 'error' : item.priority === 'medium' ? 'warning' : 'default'}
                                                            size="sm"
                                                        >
                                                            {item.priority}
                                                        </Badge>
                                                    </div>

                                                    {/* Details */}
                                                    <div className="space-y-2 mb-3">
                                                        {item.assignee && (
                                                            <p className="text-sm text-slate-700 dark:text-slate-300">
                                                                👤 Technician: <span className="font-medium">{item.assignee}</span>
                                                            </p>
                                                        )}
                                                        {item.guest && (
                                                            <p className="text-sm text-slate-700 dark:text-slate-300">
                                                                👤 Guest: <span className="font-medium">{item.guest}</span>
                                                            </p>
                                                        )}
                                                        {item.prospect && (
                                                            <p className="text-sm text-slate-700 dark:text-slate-300">
                                                                👤 Prospect: <span className="font-medium">{item.prospect}</span>
                                                            </p>
                                                        )}
                                                        {item.contract && (
                                                            <p className="text-sm text-slate-700 dark:text-slate-300">
                                                                📄 {item.contract}
                                                            </p>
                                                        )}
                                                        {item.action && (
                                                            <p className="text-sm font-medium text-amber-600 dark:text-amber-400">
                                                                ⚡ Action: {item.action}
                                                            </p>
                                                        )}
                                                    </div>

                                                    {/* Action Buttons */}
                                                    <div className="flex flex-wrap gap-2">
                                                        {item.type === 'checkout' && (
                                                            <Button
                                                                size="sm"
                                                                onClick={() => callWhatsApp('+628123456789', `Room ${item.location} sudah check-out. Mohon segera dibersihkan.`)}
                                                            >
                                                                <MessageCircle className="w-4 h-4 mr-1" />
                                                                Call Cleaning Team
                                                            </Button>
                                                        )}
                                                        {item.phone && (
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={() => callPhone(item.phone!)}
                                                            >
                                                                <Phone className="w-4 h-4 mr-1" />
                                                                Call
                                                            </Button>
                                                        )}
                                                        {item.type === 'checkin' && (
                                                            <Button size="sm" variant="outline">
                                                                <CheckCircle className="w-4 h-4 mr-1" />
                                                                Confirm Check-in
                                                            </Button>
                                                        )}
                                                        <Button size="sm" variant="outline">
                                                            <CheckCircle className="w-4 h-4 mr-1" />
                                                            Mark Done
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* This Week Overview */}
            <Card>
                <CardContent className="p-4">
                    <div
                        className="flex items-center justify-between cursor-pointer mb-4"
                        onClick={() => setExpandedSections(prev => ({ ...prev, week: !prev.week }))}
                    >
                        <div>
                            <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white">
                                This Week Overview
                            </h2>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                Dec 17-23, 2024
                            </p>
                        </div>
                        <ChevronRight className={`w-5 h-5 text-slate-400 transition-transform ${expandedSections.week ? 'rotate-90' : ''}`} />
                    </div>

                    {expandedSections.week && (
                        <div>
                            <div className="grid grid-cols-7 gap-2 mb-4">
                                {weekSchedule.map((day, idx) => (
                                    <div
                                        key={idx}
                                        className={`text-center p-3 rounded-lg ${idx === 0 ? 'bg-indigo-100 dark:bg-indigo-900/30' : 'bg-slate-100 dark:bg-slate-800'}`}
                                    >
                                        <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                                            {day.day}
                                        </p>
                                        <p className={`text-2xl font-bold ${day.tasks > 0 ? 'text-slate-900 dark:text-white' : 'text-slate-400 dark:text-slate-600'}`}>
                                            {day.tasks}
                                        </p>
                                        {day.tasks > 0 && (
                                            <div className="flex justify-center gap-0.5 mt-1">
                                                {day.types.slice(0, 3).map((type, i) => {
                                                    const Icon = getTypeIcon(type);
                                                    return (
                                                        <Icon key={i} className="w-3 h-3 text-slate-500 dark:text-slate-400" />
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                <div className="text-center p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                                    <Wrench className="w-5 h-5 text-amber-600 mx-auto mb-1" />
                                    <p className="text-sm font-medium text-slate-900 dark:text-white">5</p>
                                    <p className="text-xs text-slate-600 dark:text-slate-400">Maintenance</p>
                                </div>
                                <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                    <ClipboardCheck className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                                    <p className="text-sm font-medium text-slate-900 dark:text-white">4</p>
                                    <p className="text-xs text-slate-600 dark:text-slate-400">Surveys</p>
                                </div>
                                <div className="text-center p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                                    <KeyRound className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
                                    <p className="text-sm font-medium text-slate-900 dark:text-white">2</p>
                                    <p className="text-xs text-slate-600 dark:text-slate-400">Check-ins</p>
                                </div>
                                <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                                    <Sparkles className="w-5 h-5 text-purple-600 mx-auto mb-1" />
                                    <p className="text-sm font-medium text-slate-900 dark:text-white">2</p>
                                    <p className="text-xs text-slate-600 dark:text-slate-400">Check-outs</p>
                                </div>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
                <CardContent className="p-4">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                        Quick Actions
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        <Button
                            variant="outline"
                            className="justify-start"
                            onClick={() => callWhatsApp('+628123456789', 'Butuh bantuan cleaning team')}
                        >
                            <MessageCircle className="w-4 h-4 mr-2" />
                            Call Cleaning
                        </Button>
                        <Button
                            variant="outline"
                            className="justify-start"
                            onClick={() => callWhatsApp('+628123456790', 'Butuh bantuan maintenance')}
                        >
                            <Phone className="w-4 h-4 mr-2" />
                            Call Maintenance
                        </Button>
                        <Button variant="outline" className="justify-start">
                            <Wrench className="w-4 h-4 mr-2" />
                            New Maintenance
                        </Button>
                        <Button variant="outline" className="justify-start">
                            <ClipboardCheck className="w-4 h-4 mr-2" />
                            Schedule Survey
                        </Button>
                        <Button variant="outline" className="justify-start">
                            <FileText className="w-4 h-4 mr-2" />
                            Generate Report
                        </Button>
                        <Button variant="outline" className="justify-start">
                            <DollarSign className="w-4 h-4 mr-2" />
                            Record Payment
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}