'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Table from '@/components/ui/Table';
import {
    Wrench,
    Plus,
    Search,
    Filter,
    Calendar,
    User,
    Eye,
    Edit,
    CheckCircle,
    Clock,
    AlertCircle,
} from 'lucide-react';

export default function MaintenancePage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilters, setShowFilters] = useState(false);

    const requests = [
        {
            id: 1,
            ticketNumber: 'MNT-2024-001',
            room: 'Room 305 - Building A',
            tenant: 'John Doe',
            issue: 'AC not cooling',
            category: 'AC/Cooling',
            priority: 'High',
            status: 'In Progress',
            reportedDate: '2024-12-08',
            assignedTo: 'Technician A',
            estimatedCompletion: '2024-12-10',
        },
        {
            id: 2,
            ticketNumber: 'MNT-2024-002',
            room: 'Room 201 - Building B',
            tenant: 'Jane Smith',
            issue: 'Leaking faucet',
            category: 'Plumbing',
            priority: 'Medium',
            status: 'Pending',
            reportedDate: '2024-12-09',
            assignedTo: null,
            estimatedCompletion: null,
        },
        {
            id: 3,
            ticketNumber: 'MNT-2024-003',
            room: 'Room 102 - Building A',
            tenant: 'Bob Johnson',
            issue: 'Broken door lock',
            category: 'Security',
            priority: 'High',
            status: 'Completed',
            reportedDate: '2024-12-05',
            assignedTo: 'Technician B',
            estimatedCompletion: '2024-12-07',
        },
        {
            id: 4,
            ticketNumber: 'MNT-2024-004',
            room: 'Room 405 - Building C',
            tenant: 'Alice Williams',
            issue: 'Electrical outlet not working',
            category: 'Electrical',
            priority: 'High',
            status: 'In Progress',
            reportedDate: '2024-12-10',
            assignedTo: 'Technician C',
            estimatedCompletion: '2024-12-11',
        },
        {
            id: 5,
            ticketNumber: 'MNT-2024-005',
            room: 'Common Area - Building A',
            tenant: 'Management',
            issue: 'Elevator maintenance',
            category: 'Elevator',
            priority: 'Low',
            status: 'Pending',
            reportedDate: '2024-12-11',
            assignedTo: null,
            estimatedCompletion: null,
        },
    ];

    const categoryOptions = [
        { value: 'all', label: 'All Categories' },
        { value: 'ac', label: 'AC/Cooling' },
        { value: 'plumbing', label: 'Plumbing' },
        { value: 'electrical', label: 'Electrical' },
        { value: 'security', label: 'Security' },
        { value: 'elevator', label: 'Elevator' },
    ];

    const priorityOptions = [
        { value: 'all', label: 'All Priorities' },
        { value: 'high', label: 'High' },
        { value: 'medium', label: 'Medium' },
        { value: 'low', label: 'Low' },
    ];

    const statusOptions = [
        { value: 'all', label: 'All Status' },
        { value: 'pending', label: 'Pending' },
        { value: 'in-progress', label: 'In Progress' },
        { value: 'completed', label: 'Completed' },
    ];

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

    const getPriorityBadge = (priority: string) => {
        const variants: Record<string, any> = {
            High: 'danger',
            Medium: 'warning',
            Low: 'info',
        };
        return variants[priority] || 'default';
    };

    const getStatusBadge = (status: string) => {
        const variants: Record<string, any> = {
            Pending: { variant: 'warning', icon: Clock },
            'In Progress': { variant: 'info', icon: AlertCircle },
            Completed: { variant: 'success', icon: CheckCircle },
        };
        return variants[status] || variants.Pending;
    };

    const columns = [
        {
            key: 'ticketNumber',
            label: 'Ticket',
            sortable: true,
            render: (item: any) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
                        <Wrench className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <p className="font-semibold text-slate-900 dark:text-white">
                            {item.ticketNumber}
                        </p>
                        <p className="text-xs text-slate-600 dark:text-slate-400">{item.room}</p>
                    </div>
                </div>
            ),
        },
        {
            key: 'issue',
            label: 'Issue',
            render: (item: any) => (
                <div>
                    <p className="text-sm text-slate-900 dark:text-white font-medium">{item.issue}</p>
                    <Badge variant="purple" size="sm">{item.category}</Badge>
                </div>
            ),
        },
        {
            key: 'tenant',
            label: 'Reported By',
            render: (item: any) => (
                <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-slate-400" />
                    <span className="text-sm text-slate-900 dark:text-white">{item.tenant}</span>
                </div>
            ),
        },
        {
            key: 'priority',
            label: 'Priority',
            render: (item: any) => (
                <Badge variant={getPriorityBadge(item.priority)}>{item.priority}</Badge>
            ),
        },
        {
            key: 'status',
            label: 'Status',
            render: (item: any) => {
                const statusInfo = getStatusBadge(item.status);
                return (
                    <Badge variant={statusInfo.variant} dot>
                        {item.status}
                    </Badge>
                );
            },
        },
        {
            key: 'actions',
            label: 'Actions',
            render: (item: any) => (
                <div className="flex items-center gap-2">
                    <Button size="sm" variant="ghost"><Eye className="w-4 h-4" /></Button>
                    <Button size="sm" variant="ghost"><Edit className="w-4 h-4" /></Button>
                </div>
            ),
        },
    ];

    return (
        <div className="p-4 md:p-6 space-y-4 md:space-y-6 pb-24 md:pb-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
                        Maintenance
                    </h1>
                    <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 mt-1">
                        Manage maintenance requests and schedules
                    </p>
                </div>
                <Button className="w-full sm:w-auto">
                    <Plus className="w-5 h-5" />
                    New Request
                </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                <Card>
                    <CardContent className="p-3 md:p-4">
                        <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400">Total</p>
                        <p className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mt-1">
                            {requests.length}
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-3 md:p-4">
                        <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400">Pending</p>
                        <p className="text-xl md:text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">
                            {requests.filter(r => r.status === 'Pending').length}
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-3 md:p-4">
                        <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 truncate">In Progress</p>
                        <p className="text-xl md:text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">
                            {requests.filter(r => r.status === 'In Progress').length}
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-3 md:p-4">
                        <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400">Completed</p>
                        <p className="text-xl md:text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                            {requests.filter(r => r.status === 'Completed').length}
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardContent className="p-3 md:p-4">
                    <div className="space-y-3">
                        <Input
                            placeholder="Search requests..."
                            leftIcon={<Search className="w-5 h-5" />}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <Button
                            variant="outline"
                            onClick={() => setShowFilters(!showFilters)}
                            className="w-full md:hidden"
                        >
                            <Filter className="w-4 h-4" />
                            {showFilters ? 'Hide' : 'Show'} Filters
                        </Button>
                        <div className={`grid grid-cols-1 gap-3 md:grid-cols-3 ${showFilters ? 'block' : 'hidden md:grid'}`}>
                            <Select options={categoryOptions} placeholder="Category" />
                            <Select options={priorityOptions} placeholder="Priority" />
                            <Select options={statusOptions} placeholder="Status" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Mobile Cards */}
            <div className="block md:hidden space-y-3">
                {requests.map((request) => {
                    const statusInfo = getStatusBadge(request.status);
                    return (
                        <Card key={request.id} hover>
                            <CardContent className="p-4">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-slate-900 dark:text-white truncate">
                                            {request.ticketNumber}
                                        </h3>
                                        <p className="text-xs text-slate-600 dark:text-slate-400">{request.room}</p>
                                    </div>
                                    <Badge variant={statusInfo.variant} dot size="sm">
                                        {request.status}
                                    </Badge>
                                </div>
                                <div className="space-y-2 text-sm mb-3">
                                    <p className="text-slate-900 dark:text-white font-medium">{request.issue}</p>
                                    <div className="flex items-center justify-between">
                                        <Badge variant="purple" size="sm">{request.category}</Badge>
                                        <Badge variant={getPriorityBadge(request.priority)} size="sm">
                                            {request.priority}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-800">
                                        <User className="w-4 h-4" />
                                        <span>{request.tenant}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                        <Calendar className="w-4 h-4" />
                                        <span>Reported: {formatDate(request.reportedDate)}</span>
                                    </div>
                                    {request.assignedTo && (
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="text-slate-600 dark:text-slate-400">Assigned to:</span>
                                            <span className="text-slate-900 dark:text-white font-medium">{request.assignedTo}</span>
                                        </div>
                                    )}
                                </div>
                                <div className="flex gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                                    <Button size="sm" variant="outline" className="flex-1">
                                        <Eye className="w-4 h-4" />
                                        View
                                    </Button>
                                    <Button size="sm" variant="ghost">
                                        <Edit className="w-4 h-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block">
                <Table data={requests} columns={columns} />
            </div>
        </div>
    );
}