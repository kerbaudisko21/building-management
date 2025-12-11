'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import {
    Calendar as CalendarIcon,
    Plus,
    Clock,
    MapPin,
    BarChart3,
    Grid3x3,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';
import { Calendar, momentLocalizer, View } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

export default function CalendarPage() {
    const [viewMode, setViewMode] = useState<'calendar' | 'gantt'>('calendar');
    const [calendarView, setCalendarView] = useState<View>('month');
    const [currentDate, setCurrentDate] = useState(new Date('2024-12-15'));

    const events = [
        {
            id: 1,
            title: 'Monthly Cleaning - Building A',
            start: new Date('2024-12-15T09:00:00'),
            end: new Date('2024-12-15T12:00:00'),
            startDate: '2024-12-15',
            endDate: '2024-12-15',
            time: '09:00',
            type: 'Maintenance',
            location: 'Building A',
            status: 'Scheduled',
            description: 'Complete cleaning service for all units',
            assignedTo: 'Cleaning Team',
            progress: 0,
        },
        {
            id: 2,
            title: 'Contract Renewal - John Doe',
            start: new Date('2024-12-18T14:00:00'),
            end: new Date('2024-12-18T15:30:00'),
            startDate: '2024-12-16',
            endDate: '2024-12-20',
            time: '14:00',
            type: 'Meeting',
            location: 'Office',
            status: 'In Progress',
            description: 'Discuss contract renewal terms',
            assignedTo: 'Admin',
            progress: 30,
        },
        {
            id: 3,
            title: 'Property Inspection',
            start: new Date('2024-12-20T10:00:00'),
            end: new Date('2024-12-20T16:00:00'),
            startDate: '2024-12-20',
            endDate: '2024-12-22',
            time: '10:00',
            type: 'Inspection',
            location: 'Building B',
            status: 'Scheduled',
            description: 'Quarterly property inspection',
            assignedTo: 'Inspector A',
            progress: 0,
        },
        {
            id: 4,
            title: 'Rent Payment Deadline',
            start: new Date('2024-12-25T00:00:00'),
            end: new Date('2024-12-25T23:59:00'),
            startDate: '2024-12-20',
            endDate: '2024-12-25',
            time: '23:59',
            type: 'Payment',
            location: 'All Properties',
            status: 'In Progress',
            description: 'Monthly rent collection deadline',
            assignedTo: 'Finance',
            progress: 60,
        },
        {
            id: 5,
            title: 'Staff Meeting',
            start: new Date('2024-12-16T15:00:00'),
            end: new Date('2024-12-16T16:30:00'),
            startDate: '2024-12-16',
            endDate: '2024-12-16',
            time: '15:00',
            type: 'Meeting',
            location: 'Office',
            status: 'Scheduled',
            description: 'Monthly staff coordination meeting',
            assignedTo: 'Manager',
            progress: 0,
        },
        {
            id: 6,
            title: 'AC Maintenance - Building C',
            start: new Date('2024-12-22T08:00:00'),
            end: new Date('2024-12-22T17:00:00'),
            startDate: '2024-12-22',
            endDate: '2024-12-24',
            time: '08:00',
            type: 'Maintenance',
            location: 'Building C',
            status: 'Scheduled',
            description: 'Routine AC servicing',
            assignedTo: 'Technician B',
            progress: 0,
        },
        {
            id: 7,
            title: 'Fire Safety Check',
            start: new Date('2024-12-12T10:00:00'),
            end: new Date('2024-12-12T14:00:00'),
            startDate: '2024-12-12',
            endDate: '2024-12-12',
            time: '10:00',
            type: 'Inspection',
            location: 'All Buildings',
            status: 'Scheduled',
            description: 'Annual fire safety inspection',
            assignedTo: 'Fire Inspector',
            progress: 0,
        },
        {
            id: 8,
            title: 'Water Bill Payment',
            start: new Date('2024-12-28T00:00:00'),
            end: new Date('2024-12-28T23:59:00'),
            startDate: '2024-12-28',
            endDate: '2024-12-28',
            time: 'All day',
            type: 'Payment',
            location: 'Finance',
            status: 'Scheduled',
            description: 'Monthly water bill payment',
            assignedTo: 'Finance',
            progress: 0,
        },
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

    const sortedEvents = [...events].sort((a, b) =>
        new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    );

    // Generate dates for Gantt Chart (Dec 11-31, 2024)
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

    // Event style getter for calendar
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
                            <Grid3x3 className="w-4 h-4" />
                        </Button>
                        <Button
                            size="sm"
                            variant={viewMode === 'gantt' ? 'primary' : 'ghost'}
                            onClick={() => setViewMode('gantt')}
                        >
                            <BarChart3 className="w-4 h-4" />
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
                >
                    <Grid3x3 className="w-4 h-4 mr-2" />
                    Calendar
                </Button>
                <Button
                    variant={viewMode === 'gantt' ? 'primary' : 'outline'}
                    onClick={() => setViewMode('gantt')}
                    className="flex-1"
                >
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Gantt
                </Button>
            </div>

            {/* CALENDAR VIEW - React Big Calendar */}
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
                                style={{ height: '100%', minHeight: '700px' }}
                                view={calendarView}
                                onView={(view) => setCalendarView(view)}
                                eventPropGetter={eventStyleGetter}
                                components={{
                                    event: EventComponent,
                                }}
                                popup
                                views={['month', 'week', 'day', 'agenda']}
                                messages={{
                                    next: 'Next',
                                    previous: 'Prev',
                                    today: 'Today',
                                    month: 'Month',
                                    week: 'Week',
                                    day: 'Day',
                                    agenda: 'Agenda',
                                    date: 'Date',
                                    time: 'Time',
                                    event: 'Event',
                                    showMore: (total) => `+${total} more`,
                                }}
                            />
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* GANTT CHART VIEW */}
            {viewMode === 'gantt' && (
                <Card>
                    <CardContent className="p-4 md:p-6">
                        <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white mb-4">
                            Gantt Chart - December 2024
                        </h2>

                        {/* Gantt Chart - Desktop */}
                        <div className="hidden md:block overflow-x-auto">
                            <div className="min-w-[1000px]">
                                {/* Header - Dates */}
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

                                {/* Tasks */}
                                {sortedEvents.map((event) => {
                                    const { startDiff, duration } = calculateGanttPosition(event.startDate, event.endDate);
                                    const cellWidth = 100 / ganttDates.length;

                                    return (
                                        <div key={event.id} className="flex items-center mb-3 group">
                                            {/* Task Name */}
                                            <div className="w-48 flex-shrink-0 pr-4">
                                                <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                                                    {event.title}
                                                </p>
                                                <p className="text-xs text-slate-600 dark:text-slate-400">
                                                    {event.assignedTo}
                                                </p>
                                            </div>

                                            {/* Gantt Bar Container */}
                                            <div className="flex-1 relative h-12 border-l border-slate-200 dark:border-slate-700">
                                                <div className="absolute inset-0 flex">
                                                    {ganttDates.map((_, idx) => (
                                                        <div
                                                            key={idx}
                                                            className="flex-1 border-r border-slate-100 dark:border-slate-800"
                                                        />
                                                    ))}
                                                </div>

                                                {/* Gantt Bar */}
                                                <div
                                                    className="absolute top-2 h-8 rounded bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center px-2 transition-all group-hover:from-indigo-600 group-hover:to-purple-600 shadow-sm"
                                                    style={{
                                                        left: `${startDiff * cellWidth}%`,
                                                        width: `${duration * cellWidth}%`,
                                                    }}
                                                >
                          <span className="text-xs text-white font-medium truncate">
                            {event.progress > 0 ? `${event.progress}%` : event.title}
                          </span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Gantt Chart - Mobile (Simplified) */}
                        <div className="block md:hidden">
                            <p className="text-sm text-slate-600 dark:text-slate-400 text-center py-8">
                                Gantt chart is best viewed on desktop.
                                <br />
                                <span className="text-xs">Switch to calendar view for mobile.</span>
                            </p>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* UPCOMING EVENTS - Always Visible Below */}
            <div>
                <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white mb-4">
                    Upcoming Events
                </h2>
                <div className="space-y-3">
                    {sortedEvents.map((event) => (
                        <Card key={event.id} hover>
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
                                            <Badge variant={getTypeBadge(event.type)} size="sm" className="self-start">
                                                {event.type}
                                            </Badge>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-3 md:gap-4 text-sm text-slate-600 dark:text-slate-400 mb-2">
                                            <div className="flex items-center gap-1.5">
                                                <Clock className="w-4 h-4" />
                                                <span className="text-xs md:text-sm">{event.time}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <MapPin className="w-4 h-4" />
                                                <span className="text-xs md:text-sm">{event.location}</span>
                                            </div>
                                        </div>
                                        {event.progress > 0 && (
                                            <div className="mt-2">
                                                <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 mb-1">
                                                    <span>Progress</span>
                                                    <span className="font-semibold">{event.progress}%</span>
                                                </div>
                                                <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2">
                                                    <div
                                                        className="bg-gradient-to-r from-indigo-600 to-purple-600 h-2 rounded-full transition-all"
                                                        style={{ width: `${event.progress}%` }}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Enhanced Custom CSS for Calendar */}
            <style jsx global>{`
                /* Calendar Container */
                .calendar-container {
                    font-family: inherit;
                }

                /* Toolbar */
                .rbc-toolbar {
                    padding: 16px 0;
                    margin-bottom: 16px;
                    flex-wrap: wrap;
                    gap: 12px;
                }

                .rbc-toolbar-label {
                    font-size: 18px;
                    font-weight: 700;
                    color: rgb(15 23 42);
                }

                .rbc-toolbar button {
                    color: rgb(71 85 105);
                    background: white;
                    border: 1px solid rgb(226 232 240);
                    border-radius: 8px;
                    padding: 8px 16px;
                    font-size: 14px;
                    font-weight: 500;
                    transition: all 0.2s;
                }

                .rbc-toolbar button:hover {
                    background-color: rgb(241 245 249);
                    border-color: rgb(203 213 225);
                }

                .rbc-toolbar button.rbc-active {
                    background: linear-gradient(to right, rgb(99 102 241), rgb(139 92 246));
                    color: white;
                    border-color: rgb(99 102 241);
                }

                /* Header */
                .rbc-header {
                    padding: 16px 8px;
                    font-weight: 600;
                    font-size: 14px;
                    background: rgb(248 250 252);
                    border-bottom: 2px solid rgb(226 232 240);
                    color: rgb(51 65 85);
                }

                /* Month View */
                .rbc-month-view {
                    border: 1px solid rgb(226 232 240);
                    border-radius: 12px;
                    overflow: hidden;
                }

                .rbc-day-bg {
                    border-left: 1px solid rgb(241 245 249);
                }

                .rbc-today {
                    background-color: rgb(238 242 255) !important;
                }

                .rbc-off-range-bg {
                    background: rgb(250 250 250);
                }

                /* Date Numbers */
                .rbc-date-cell {
                    padding: 8px;
                    text-align: right;
                }

                .rbc-date-cell button {
                    font-weight: 500;
                    font-size: 14px;
                    color: rgb(71 85 105);
                }

                .rbc-now .rbc-date-cell button {
                    color: rgb(99 102 241);
                    font-weight: 700;
                }

                /* Events */
                .rbc-event {
                    padding: 4px 6px;
                    margin: 2px 0;
                    font-size: 12px;
                    font-weight: 500;
                    cursor: pointer;
                }

                .rbc-event:hover {
                    opacity: 1 !important;
                }

                .rbc-event-label {
                    font-size: 11px;
                }

                .rbc-show-more {
                    color: rgb(99 102 241);
                    font-weight: 600;
                    font-size: 12px;
                    padding: 4px;
                    margin-top: 2px;
                }

                /* Week & Day View */
                .rbc-time-view {
                    border: 1px solid rgb(226 232 240);
                    border-radius: 12px;
                    overflow: hidden;
                }

                .rbc-time-header-content {
                    border-left: 1px solid rgb(226 232 240);
                }

                .rbc-time-slot {
                    border-top: 1px solid rgb(241 245 249);
                }

                .rbc-current-time-indicator {
                    background-color: rgb(239 68 68);
                    height: 2px;
                }

                /* Agenda View */
                .rbc-agenda-view {
                    border: 1px solid rgb(226 232 240);
                    border-radius: 12px;
                    overflow: hidden;
                }

                .rbc-agenda-view table {
                    border-spacing: 0;
                }

                .rbc-agenda-date-cell,
                .rbc-agenda-time-cell {
                    padding: 12px 16px;
                    font-weight: 600;
                    background: rgb(248 250 252);
                }

                .rbc-agenda-event-cell {
                    padding: 12px 16px;
                }

                /* Dark Mode */
                .dark .rbc-toolbar-label {
                    color: white;
                }

                .dark .rbc-toolbar button {
                    color: white;
                    background: rgb(30 41 59);
                    border-color: rgb(51 65 85);
                }

                .dark .rbc-toolbar button:hover {
                    background-color: rgb(51 65 85);
                }

                .dark .rbc-toolbar button.rbc-active {
                    background: linear-gradient(to right, rgb(99 102 241), rgb(139 92 246));
                    border-color: rgb(99 102 241);
                }

                .dark .rbc-header {
                    background: rgb(30 41 59);
                    border-bottom-color: rgb(51 65 85);
                    color: white;
                }

                .dark .rbc-month-view,
                .dark .rbc-time-view,
                .dark .rbc-agenda-view {
                    border-color: rgb(51 65 85);
                    background: rgb(15 23 42);
                }

                .dark .rbc-day-bg {
                    border-left-color: rgb(30 41 59);
                }

                .dark .rbc-today {
                    background-color: rgb(49 46 129) !important;
                }

                .dark .rbc-off-range-bg {
                    background: rgb(15 23 42);
                }

                .dark .rbc-date-cell button {
                    color: rgb(203 213 225);
                }

                .dark .rbc-now .rbc-date-cell button {
                    color: rgb(165 180 252);
                }

                .dark .rbc-time-header-content {
                    border-left-color: rgb(51 65 85);
                }

                .dark .rbc-time-slot {
                    border-top-color: rgb(30 41 59);
                }

                .dark .rbc-agenda-date-cell,
                .dark .rbc-agenda-time-cell {
                    background: rgb(30 41 59);
                    color: white;
                }

                .dark .rbc-agenda-event-cell {
                    color: white;
                }

                .dark .rbc-time-content {
                    border-top-color: rgb(51 65 85);
                }

                .dark .rbc-time-slot {
                    color: rgb(148 163 184);
                }

                .dark .rbc-day-slot .rbc-time-slot {
                    border-top-color: rgb(30 41 59);
                }

                .dark .rbc-label {
                    color: rgb(148 163 184);
                }

                .dark .rbc-event-content {
                    color: white;
                }

                .dark .rbc-show-more {
                    color: rgb(165 180 252);
                }

                .dark .rbc-off-range {
                    color: rgb(71 85 105);
                }

                .dark .rbc-time-header-gutter,
                .dark .rbc-time-gutter {
                    background: rgb(15 23 42);
                    color: rgb(148 163 184);
                }
            `}</style>
        </div>
    );
}