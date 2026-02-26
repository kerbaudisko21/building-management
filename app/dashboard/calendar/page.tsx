'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Modal from '@/components/ui/Modal';
import {
    Calendar as CalendarIcon,
    Plus,
    Clock,
    MapPin,
    BarChart3,
    Grid3x3,
    List,
    Search,
    X,
    User,
    FileText,
} from 'lucide-react';
import { contractService, maintenanceService, todoService } from '@/lib/services';
import { Calendar, momentLocalizer, View } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

interface EventDetail {
    id: number;
    title: string;
    start: Date;
    end: Date;
    startDate: string;
    endDate: string;
    time: string;
    type: string;
    location: string;
    status: string;
    description: string;
    assignedTo: string;
}

export default function CalendarPage() {
    const [viewMode, setViewMode] = useState<'calendar' | 'gantt' | 'grid'>('calendar');
    const [calendarView, setCalendarView] = useState<View>('month');
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedEvent, setSelectedEvent] = useState<EventDetail | null>(null);
    const [showDetailModal, setShowDetailModal] = useState(false);

    // Filter states
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');

    const [events, setEvents] = useState<EventDetail[]>([]);
    const [loadingEvents, setLoadingEvents] = useState(true);

    useEffect(() => {
        async function loadCalendarData() {
            setLoadingEvents(true);
            const evts: EventDetail[] = [];
            let idx = 1;

            const [ctrRes, mntRes, todoRes] = await Promise.all([
                contractService.getAll(),
                maintenanceService.getAll(),
                todoService.getAll(),
            ]);

            if (ctrRes.data) {
                ctrRes.data.forEach(ct => {
                    if (ct.date_check_in) {
                        evts.push({ id: idx++, title: 'Check-in: ' + ct.name_customer, start: new Date(ct.date_check_in), end: new Date(ct.date_check_in), startDate: ct.date_check_in, endDate: ct.date_check_in, time: '14:00', type: 'Meeting', location: '-', status: ct.status === 'Active' ? 'Completed' : 'Scheduled', description: 'Contract ' + (ct.number || ''), assignedTo: 'Admin' });
                    }
                    if (ct.date_check_out) {
                        evts.push({ id: idx++, title: 'Check-out: ' + ct.name_customer, start: new Date(ct.date_check_out), end: new Date(ct.date_check_out), startDate: ct.date_check_out, endDate: ct.date_check_out, time: '12:00', type: 'Meeting', location: '-', status: new Date(ct.date_check_out) < new Date() ? 'Completed' : 'Scheduled', description: 'Contract ends', assignedTo: 'Admin' });
                    }
                });
            }

            if (mntRes.data) {
                mntRes.data.forEach(m => {
                    evts.push({ id: idx++, title: m.title, start: new Date(m.reported_date), end: new Date(m.completed_date || m.reported_date), startDate: m.reported_date, endDate: m.completed_date || m.reported_date, time: '09:00', type: 'Maintenance', location: m.room_name, status: m.status === 'Completed' ? 'Completed' : m.status === 'In Progress' ? 'In Progress' : 'Scheduled', description: m.description, assignedTo: m.assigned_to || '-' });
                });
            }

            if (todoRes.data) {
                todoRes.data.forEach(t => {
                    if (t.due_date) {
                        evts.push({ id: idx++, title: t.title, start: new Date(t.due_date), end: new Date(t.due_date), startDate: t.due_date, endDate: t.due_date, time: '23:59', type: 'Payment', location: '-', status: t.status === 'Completed' ? 'Completed' : t.status === 'In Progress' ? 'In Progress' : 'Scheduled', description: t.description, assignedTo: t.assigned_to || '-' });
                    }
                });
            }

            setEvents(evts);
            setLoadingEvents(false);
        }
        loadCalendarData();
    }, []);

    const typeOptions = [
        { value: 'all', label: 'All Types' },
        { value: 'Maintenance', label: 'Maintenance' },
        { value: 'Meeting', label: 'Meeting' },
        { value: 'Inspection', label: 'Inspection' },
        { value: 'Payment', label: 'Payment' },
    ];

    const statusOptions = [
        { value: 'all', label: 'All Status' },
        { value: 'Scheduled', label: 'Scheduled' },
        { value: 'In Progress', label: 'In Progress' },
        { value: 'Completed', label: 'Completed' },
    ];

    const getTypeBadge = (type: string) => {
        const variants: Record<string, any> = {
            Maintenance: 'warning',
            Meeting: 'info',
            Inspection: 'purple',
            Payment: 'success',
        };
        return variants[type] || 'default';
    };

    const getStatusBadge = (status: string) => {
        const variants: Record<string, any> = {
            Scheduled: 'info',
            'In Progress': 'warning',
            Completed: 'success',
        };
        return variants[status] || 'default';
    };

    // Filter events
    const filteredEvents = events.filter(event => {
        const matchSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            event.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchType = filterType === 'all' || event.type === filterType;
        const matchStatus = filterStatus === 'all' || event.status === filterStatus;
        return matchSearch && matchType && matchStatus;
    });

    const sortedEvents = [...filteredEvents].sort((a, b) =>
        new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    );

    // Generate dates for Gantt Chart
    const ganttStartDate = new Date('2024-12-11');
    const ganttEndDate = new Date('2024-12-31');
    const ganttDates: Date[] = [];

    for (let d = new Date(ganttStartDate); d <= ganttEndDate; d.setDate(d.getDate() + 1)) {
        ganttDates.push(new Date(d));
    }

    // Calculate position for Gantt bars
    const calculateGanttPosition = (startDate: string, endDate: string) => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const startDiff = Math.floor((start.getTime() - ganttStartDate.getTime()) / (1000 * 60 * 60 * 24));
        const duration = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
        return { startDiff, duration };
    };

    // Handle event click
    const handleEventClick = (event: EventDetail) => {
        setSelectedEvent(event);
        setShowDetailModal(true);
    };

    // Event style getter
    const eventStyleGetter = (event: any) => {
        const colors: Record<string, any> = {
            Maintenance: { backgroundColor: '#f59e0b', borderLeft: '4px solid #d97706' },
            Meeting: { backgroundColor: '#3b82f6', borderLeft: '4px solid #2563eb' },
            Inspection: { backgroundColor: '#8b5cf6', borderLeft: '4px solid #7c3aed' },
            Payment: { backgroundColor: '#10b981', borderLeft: '4px solid #059669' },
        };
        return {
            style: {
                ...(colors[event.type] || { backgroundColor: '#6366f1', borderLeft: '4px solid #4f46e5' }),
                borderRadius: '4px',
                opacity: 0.9,
                color: 'white',
                border: '0px',
                display: 'block',
                fontSize: '12px',
                padding: '2px 5px',
            },
        };
    };

    // Custom event component
    const EventComponent = ({ event }: any) => (
        <div className="flex items-center gap-1 truncate">
            <Clock className="w-3 h-3 flex-shrink-0" />
            <span className="truncate font-medium">{event.title}</span>
        </div>
    );

    return (
        <div className="p-4 md:p-6 space-y-4 md:space-y-6 pb-24 md:pb-6">
            {/* Header */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
                        Calendar
                    </h1>
                    <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 mt-1">
                        View events and schedules
                    </p>
                </div>
                <div className="flex gap-2">
                    <div className="hidden md:flex gap-1 border border-slate-300 dark:border-slate-700 rounded-lg p-1">
                        <Button
                            size="sm"
                            variant={viewMode === 'calendar' ? 'primary' : 'ghost'}
                            onClick={() => setViewMode('calendar')}
                        >
                            <CalendarIcon className="w-4 h-4" />
                        </Button>
                        <Button
                            size="sm"
                            variant={viewMode === 'gantt' ? 'primary' : 'ghost'}
                            onClick={() => setViewMode('gantt')}
                        >
                            <BarChart3 className="w-4 h-4" />
                        </Button>
                        <Button
                            size="sm"
                            variant={viewMode === 'grid' ? 'primary' : 'ghost'}
                            onClick={() => setViewMode('grid')}
                        >
                            <Grid3x3 className="w-4 h-4" />
                        </Button>
                    </div>
                    <Button className="w-full sm:w-auto">
                        <Plus className="w-5 h-5" />
                        Add Event
                    </Button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                <Card>
                    <CardContent className="p-3 md:p-4">
                        <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400">Total Events</p>
                        <p className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mt-1">
                            {events.length}
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-3 md:p-4">
                        <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400">This Week</p>
                        <p className="text-xl md:text-2xl font-bold text-indigo-600 dark:text-indigo-400 mt-1">
                            {events.filter(e => {
                                const eventDate = new Date(e.startDate);
                                const today = new Date();
                                const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
                                return eventDate >= today && eventDate <= weekFromNow;
                            }).length}
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-3 md:p-4">
                        <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 truncate">In Progress</p>
                        <p className="text-xl md:text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">
                            {events.filter(e => e.status === 'In Progress').length}
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-3 md:p-4">
                        <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400">Scheduled</p>
                        <p className="text-xl md:text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">
                            {events.filter(e => e.status === 'Scheduled').length}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* View Mode Toggle - Mobile */}
            <div className="flex md:hidden gap-2">
                <Button
                    variant={viewMode === 'calendar' ? 'primary' : 'outline'}
                    onClick={() => setViewMode('calendar')}
                    className="flex-1"
                    size="sm"
                >
                    <CalendarIcon className="w-4 h-4 mr-1" />
                    Calendar
                </Button>
                <Button
                    variant={viewMode === 'gantt' ? 'primary' : 'outline'}
                    onClick={() => setViewMode('gantt')}
                    className="flex-1"
                    size="sm"
                >
                    <BarChart3 className="w-4 h-4 mr-1" />
                    Gantt
                </Button>
                <Button
                    variant={viewMode === 'grid' ? 'primary' : 'outline'}
                    onClick={() => setViewMode('grid')}
                    className="flex-1"
                    size="sm"
                >
                    <Grid3x3 className="w-4 h-4 mr-1" />
                    Grid
                </Button>
            </div>

            {/* CALENDAR VIEW */}
            {viewMode === 'calendar' && (
                <Card>
                    <CardContent className="p-4 md:p-6">
                        <div className="calendar-container" style={{ minHeight: '700px' }}>
                            <Calendar
                                localizer={localizer}
                                events={events}
                                startAccessor="start"
                                endAccessor="end"
                                date={currentDate}
                                onNavigate={(date) => setCurrentDate(date)}
                                onSelectEvent={(event: any) => handleEventClick(event)}
                                style={{ height: '100%', minHeight: '700px' }}
                                view={calendarView}
                                onView={(view) => setCalendarView(view)}
                                eventPropGetter={eventStyleGetter}
                                components={{
                                    event: EventComponent,
                                }}
                                popup
                                views={['month', 'week', 'day']}
                            />
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* GANTT VIEW - CLICKABLE WITH DATE GROUPING */}
            {viewMode === 'gantt' && (
                <Card>
                    <CardContent className="p-4 md:p-6">
                        <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white mb-4">
                            Gantt Chart - December 2024
                        </h2>

                        <div className="hidden md:block overflow-x-auto">
                            <div className="min-w-[1000px]">
                                {/* Header */}
                                <div className="flex mb-2">
                                    <div className="w-48 flex-shrink-0"></div>
                                    <div className="flex-1 flex">
                                        {ganttDates.map((date, idx) => (
                                            <div
                                                key={idx}
                                                className="flex-1 text-center text-xs font-medium text-slate-600 dark:text-slate-400 pb-2 border-b border-slate-200 dark:border-slate-700"
                                            >
                                                <div>{date.getDate()}</div>
                                                <div className="text-[10px] text-slate-500">
                                                    {date.toLocaleDateString('en-US', { weekday: 'short' })}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Group events by date */}
                                {(() => {
                                    // Group events by start date
                                    const groupedByDate: Record<string, typeof sortedEvents> = {};
                                    sortedEvents.forEach(event => {
                                        const dateKey = event.startDate;
                                        if (!groupedByDate[dateKey]) {
                                            groupedByDate[dateKey] = [];
                                        }
                                        groupedByDate[dateKey].push(event);
                                    });

                                    // Sort dates
                                    const sortedDates = Object.keys(groupedByDate).sort();

                                    return sortedDates.map(dateKey => {
                                        const eventsOnDate = groupedByDate[dateKey];
                                        const dateObj = new Date(dateKey);

                                        return (
                                            <div key={dateKey} className="mb-4">
                                                {/* Date Header - Clickable to show all tasks */}
                                                <button
                                                    onClick={() => {
                                                        // Show modal with all tasks on this date
                                                        const tasksOnDate = eventsOnDate.map(e => e.title).join(', ');
                                                        setSelectedEvent({
                                                            ...eventsOnDate[0],
                                                            title: `Tasks on ${dateObj.toLocaleDateString('en-US', {
                                                                weekday: 'long',
                                                                year: 'numeric',
                                                                month: 'long',
                                                                day: 'numeric'
                                                            })}`,
                                                            description: `${eventsOnDate.length} task${eventsOnDate.length > 1 ? 's' : ''}: ${tasksOnDate}`,
                                                        });
                                                        setShowDetailModal(true);
                                                    }}
                                                    className="w-full text-left px-3 py-2 mb-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex flex-col items-center justify-center text-white">
                                                                <span className="text-xs font-medium">
                                                                    {dateObj.toLocaleDateString('en-US', { month: 'short' })}
                                                                </span>
                                                                <span className="text-lg font-bold">
                                                                    {dateObj.getDate()}
                                                                </span>
                                                            </div>
                                                            <div>
                                                                <p className="font-semibold text-slate-900 dark:text-white">
                                                                    {dateObj.toLocaleDateString('en-US', { weekday: 'long' })}
                                                                </p>
                                                                <p className="text-xs text-slate-600 dark:text-slate-400">
                                                                    {eventsOnDate.length} task{eventsOnDate.length > 1 ? 's' : ''} scheduled
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <span className="text-slate-400">▼</span>
                                                    </div>
                                                </button>

                                                {/* Tasks for this date */}
                                                {eventsOnDate.map((event) => {
                                                    const { startDiff, duration } = calculateGanttPosition(event.startDate, event.endDate);
                                                    const cellWidth = 100 / ganttDates.length;

                                                    return (
                                                        <div key={event.id} className="flex items-center mb-2 group pl-4">
                                                            {/* Task Name */}
                                                            <div className="w-44 flex-shrink-0 pr-4">
                                                                <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                                                                    {event.title}
                                                                </p>
                                                                <p className="text-xs text-slate-600 dark:text-slate-400">
                                                                    {event.assignedTo}
                                                                </p>
                                                            </div>

                                                            {/* Gantt Bar Container */}
                                                            <div className="flex-1 relative h-10 border-l border-slate-200 dark:border-slate-700">
                                                                <div className="absolute inset-0 flex">
                                                                    {ganttDates.map((_, idx) => (
                                                                        <div
                                                                            key={idx}
                                                                            className="flex-1 border-r border-slate-100 dark:border-slate-800"
                                                                        />
                                                                    ))}
                                                                </div>

                                                                {/* Clickable Gantt Bar */}
                                                                <button
                                                                    onClick={() => handleEventClick(event)}
                                                                    className="absolute top-1.5 h-7 rounded bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-between px-2 transition-all hover:from-indigo-600 hover:to-purple-600 hover:shadow-lg shadow-sm cursor-pointer"
                                                                    style={{
                                                                        left: `${startDiff * cellWidth}%`,
                                                                        width: `${duration * cellWidth}%`,
                                                                    }}
                                                                    title="Click to view details"
                                                                >
                                                                    <span className="text-xs text-white font-medium truncate">
                                                                        {event.title}
                                                                    </span>
                                                                    <span className="text-xs text-white/80 ml-2">▶</span>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        );
                                    });
                                })()}
                            </div>
                        </div>

                        {/* Mobile Gantt - Also grouped by date */}
                        <div className="block md:hidden space-y-4">
                            {(() => {
                                const groupedByDate: Record<string, typeof sortedEvents> = {};
                                sortedEvents.forEach(event => {
                                    const dateKey = event.startDate;
                                    if (!groupedByDate[dateKey]) {
                                        groupedByDate[dateKey] = [];
                                    }
                                    groupedByDate[dateKey].push(event);
                                });

                                const sortedDates = Object.keys(groupedByDate).sort();

                                return sortedDates.map(dateKey => {
                                    const eventsOnDate = groupedByDate[dateKey];
                                    const dateObj = new Date(dateKey);

                                    return (
                                        <div key={dateKey}>
                                            {/* Date Header */}
                                            <div className="flex items-center gap-3 mb-2 px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
                                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex flex-col items-center justify-center text-white flex-shrink-0">
                                                    <span className="text-xs font-medium">
                                                        {dateObj.toLocaleDateString('en-US', { month: 'short' })}
                                                    </span>
                                                    <span className="text-lg font-bold">
                                                        {dateObj.getDate()}
                                                    </span>
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-slate-900 dark:text-white text-sm">
                                                        {dateObj.toLocaleDateString('en-US', { weekday: 'long' })}
                                                    </p>
                                                    <p className="text-xs text-slate-600 dark:text-slate-400">
                                                        {eventsOnDate.length} task{eventsOnDate.length > 1 ? 's' : ''}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Tasks */}
                                            <div className="space-y-2 mb-3">
                                                {eventsOnDate.map(event => (
                                                    <Card key={event.id} hover onClick={() => handleEventClick(event)} className="cursor-pointer ml-4">
                                                        <CardContent className="p-3">
                                                            <div className="flex items-center justify-between mb-2">
                                                                <h3 className="font-semibold text-sm flex-1 truncate">{event.title}</h3>
                                                                <Badge variant={getTypeBadge(event.type)} size="sm">{event.type}</Badge>
                                                            </div>
                                                            <p className="text-xs text-slate-600 dark:text-slate-400">
                                                                {event.assignedTo}
                                                            </p>
                                                        </CardContent>
                                                    </Card>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                });
                            })()}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* GRID VIEW - CLICKABLE */}
            {viewMode === 'grid' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {sortedEvents.map((event) => (
                        <Card
                            key={event.id}
                            hover
                            onClick={() => handleEventClick(event)}
                            className="cursor-pointer transition-all hover:shadow-lg"
                        >
                            <CardContent className="p-4">
                                <div className="flex items-start gap-3 mb-3">
                                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex flex-col items-center justify-center text-white flex-shrink-0">
                                        <span className="text-xs font-medium">
                                            {new Date(event.startDate).toLocaleDateString('en-US', { month: 'short' })}
                                        </span>
                                        <span className="text-lg font-bold">
                                            {new Date(event.startDate).getDate()}
                                        </span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-slate-900 dark:text-white text-sm truncate">
                                            {event.title}
                                        </h3>
                                        <div className="flex gap-2 mt-1">
                                            <Badge variant={getTypeBadge(event.type)} size="sm">
                                                {event.type}
                                            </Badge>
                                            <Badge variant={getStatusBadge(event.status)} size="sm" dot>
                                                {event.status}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>

                                <p className="text-sm text-slate-700 dark:text-slate-300 mb-3 line-clamp-2">
                                    {event.description}
                                </p>

                                <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-4 h-4 flex-shrink-0" />
                                        <span>{event.time}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MapPin className="w-4 h-4 flex-shrink-0" />
                                        <span className="truncate">{event.location}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <User className="w-4 h-4 flex-shrink-0" />
                                        <span className="truncate">{event.assignedTo}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* TASK LIST WITH FILTERS - Always at Bottom */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <List className="w-5 h-5" />
                        Task List
                    </h2>
                    <Badge variant="info">
                        {sortedEvents.length} {sortedEvents.length === 1 ? 'task' : 'tasks'}
                    </Badge>
                </div>

                {/* Filters */}
                <Card className="mb-4">
                    <CardContent className="p-3">
                        <div className="space-y-3">
                            <Input
                                placeholder="Search tasks..."
                                leftIcon={<Search className="w-5 h-5" />}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                rightIcon={
                                    searchQuery && (
                                        <button onClick={() => setSearchQuery('')}>
                                            <X className="w-4 h-4 text-slate-400 hover:text-slate-600" />
                                        </button>
                                    )
                                }
                            />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <Select
                                    options={typeOptions}
                                    value={filterType}
                                    onChange={(e) => setFilterType(e.target.value)}
                                />
                                <Select
                                    options={statusOptions}
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Task List */}
                <div className="space-y-3">
                    {sortedEvents.map((event) => (
                        <Card
                            key={event.id}
                            hover
                            onClick={() => handleEventClick(event)}
                            className="cursor-pointer transition-all"
                        >
                            <CardContent className="p-4">
                                <div className="flex items-start gap-3 md:gap-4">
                                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex flex-col items-center justify-center flex-shrink-0 text-white">
                                        <span className="text-xs font-medium">
                                            {new Date(event.startDate).toLocaleDateString('en-US', { month: 'short' })}
                                        </span>
                                        <span className="text-lg md:text-xl font-bold">
                                            {new Date(event.startDate).getDate()}
                                        </span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-2">
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-semibold text-slate-900 dark:text-white text-base md:text-lg">
                                                    {event.title}
                                                </h3>
                                                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                                                    {event.description}
                                                </p>
                                            </div>
                                            <div className="flex gap-2">
                                                <Badge variant={getTypeBadge(event.type)} size="sm">
                                                    {event.type}
                                                </Badge>
                                                <Badge variant={getStatusBadge(event.status)} size="sm" dot>
                                                    {event.status}
                                                </Badge>
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-3 md:gap-4 text-sm text-slate-600 dark:text-slate-400">
                                            <div className="flex items-center gap-1.5">
                                                <Clock className="w-4 h-4" />
                                                <span className="text-xs md:text-sm">{event.time}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <MapPin className="w-4 h-4" />
                                                <span className="text-xs md:text-sm">{event.location}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <User className="w-4 h-4" />
                                                <span className="text-xs md:text-sm">{event.assignedTo}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {sortedEvents.length === 0 && (
                    <Card>
                        <CardContent className="p-8 text-center text-slate-500">
                            No tasks found matching your filters
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Detail Modal */}
            {selectedEvent && (
                <Modal
                    isOpen={showDetailModal}
                    onClose={() => {
                        setShowDetailModal(false);
                        setSelectedEvent(null);
                    }}
                    title="Task Details"
                    size="lg"
                >
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                                {selectedEvent.title}
                            </h3>
                            <div className="flex gap-2">
                                <Badge variant={getTypeBadge(selectedEvent.type)}>
                                    {selectedEvent.type}
                                </Badge>
                                <Badge variant={getStatusBadge(selectedEvent.status)} dot>
                                    {selectedEvent.status}
                                </Badge>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-start gap-3">
                                <FileText className="w-5 h-5 text-slate-400 mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Description</p>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">{selectedEvent.description}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <CalendarIcon className="w-5 h-5 text-slate-400" />
                                <div>
                                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Date</p>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">
                                        {new Date(selectedEvent.startDate).toLocaleDateString('en-US', {
                                            weekday: 'long',
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                        {selectedEvent.startDate !== selectedEvent.endDate && (
                                            <> - {new Date(selectedEvent.endDate).toLocaleDateString('en-US', {
                                                weekday: 'long',
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}</>
                                        )}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <Clock className="w-5 h-5 text-slate-400" />
                                <div>
                                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Time</p>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">{selectedEvent.time}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <MapPin className="w-5 h-5 text-slate-400" />
                                <div>
                                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Location</p>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">{selectedEvent.location}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <User className="w-5 h-5 text-slate-400" />
                                <div>
                                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Assigned To</p>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">{selectedEvent.assignedTo}</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                            <Button
                                variant="outline"
                                className="flex-1"
                                onClick={() => {
                                    setShowDetailModal(false);
                                    setSelectedEvent(null);
                                }}
                            >
                                Close
                            </Button>
                            <Button className="flex-1">
                                Edit Task
                            </Button>
                        </div>
                    </div>
                </Modal>
            )}

            {/* Calendar CSS */}
            <style jsx global>{`
                .calendar-container { font-family: inherit; }
                .rbc-toolbar { padding: 16px 0; margin-bottom: 16px; flex-wrap: wrap; gap: 12px; }
                .rbc-toolbar-label { font-size: 18px; font-weight: 700; color: rgb(15 23 42); }
                .rbc-toolbar button { color: rgb(71 85 105); background: white; border: 1px solid rgb(226 232 240); border-radius: 8px; padding: 8px 16px; font-size: 14px; font-weight: 500; transition: all 0.2s; }
                .rbc-toolbar button:hover { background-color: rgb(241 245 249); border-color: rgb(203 213 225); }
                .rbc-toolbar button.rbc-active { background: linear-gradient(to right, rgb(99 102 241), rgb(139 92 246)); color: white; border-color: rgb(99 102 241); }
                .rbc-header { padding: 16px 8px; font-weight: 600; font-size: 14px; background: rgb(248 250 252); border-bottom: 2px solid rgb(226 232 240); color: rgb(51 65 85); }
                .rbc-month-view { border: 1px solid rgb(226 232 240); border-radius: 12px; overflow: hidden; }
                .rbc-day-bg { border-left: 1px solid rgb(241 245 249); }
                .rbc-today { background-color: rgb(238 242 255) !important; }
                .rbc-off-range-bg { background: rgb(250 250 250); }
                .rbc-off-range { color: rgb(100 116 139); }
                .dark .rbc-off-range-bg { background: rgb(15 23 42); }
                .dark .rbc-off-range { color: rgb(71 85 105); }
                .rbc-date-cell { padding: 8px; text-align: right; }
                .rbc-date-cell button { font-weight: 500; font-size: 14px; color: rgb(71 85 105); }
                .rbc-now .rbc-date-cell button { color: rgb(99 102 241); font-weight: 700; }
                .rbc-event { padding: 4px 6px; margin: 2px 0; font-size: 12px; font-weight: 500; cursor: pointer; }
                .rbc-event:hover { opacity: 1 !important; }
                .rbc-event-label { font-size: 11px; }
                .rbc-show-more { color: rgb(99 102 241); font-weight: 600; font-size: 12px; padding: 4px; margin-top: 2px; }
                .dark .rbc-toolbar-label { color: white; }
                .dark .rbc-toolbar button { color: white; background: rgb(30 41 59); border-color: rgb(51 65 85); }
                .dark .rbc-toolbar button:hover { background-color: rgb(51 65 85); }
                .dark .rbc-header { background: rgb(30 41 59); border-bottom-color: rgb(51 65 85); color: white; }
                .dark .rbc-month-view { border-color: rgb(51 65 85); background: rgb(15 23 42); }
                .dark .rbc-today { background-color: rgb(49 46 129) !important; }
                .dark .rbc-date-cell button { color: rgb(203 213 225); }
            `}</style>
        </div>
    );
}