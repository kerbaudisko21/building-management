'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Table from '@/components/ui/Table';
import AddTenantForm, { TenantFormData } from '@/components/forms/AddTenantForm';
import { User, Plus, Edit, Trash2, Search, Filter, Grid3x3, List, Mail, Phone, MapPin } from 'lucide-react';

export default function ContactsPage() {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [filterStatus, setFilterStatus] = useState('all');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [isMobile, setIsMobile] = useState(false);

    // Detect mobile and force grid view
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const effectiveViewMode = isMobile ? 'grid' : viewMode;

    const [contacts, setContacts] = useState([
        {
            id: '1',
            name: 'John Doe',
            email: 'john.doe@email.com',
            phone: '+62 812 3456 7890',
            idNumber: '3201234567890123',
            occupation: 'Software Engineer',
            room: 'Room 305',
            status: 'Active',
            moveInDate: '2024-01-15',
        },
        {
            id: '2',
            name: 'Jane Smith',
            email: 'jane.smith@email.com',
            phone: '+62 813 9876 5432',
            idNumber: '3301987654321098',
            occupation: 'Marketing Manager',
            room: 'Room 201',
            status: 'Active',
            moveInDate: '2024-03-01',
        },
        {
            id: '3',
            name: 'Bob Johnson',
            email: 'bob.johnson@email.com',
            phone: '+62 821 5555 4444',
            idNumber: '3401122334455667',
            occupation: 'Teacher',
            room: null,
            status: 'Prospect',
            moveInDate: null,
        },
        {
            id: '4',
            name: 'Alice Williams',
            email: 'alice.w@email.com',
            phone: '+62 856 7777 8888',
            idNumber: '3501998877665544',
            occupation: 'Graphic Designer',
            room: 'Room 405',
            status: 'Pending',
            moveInDate: '2024-12-20',
        },
    ]);

    const statusOptions = [
        { value: 'all', label: 'All Status' },
        { value: 'active', label: 'Active' },
        { value: 'pending', label: 'Pending' },
        { value: 'prospect', label: 'Prospect' },
        { value: 'inactive', label: 'Inactive' },
    ];

    const handleSubmit = (data: TenantFormData) => {
        const newContact = {
            id: Date.now().toString(),
            name: data.name,
            email: data.email,
            phone: data.phone,
            idNumber: data.idNumber,
            occupation: data.occupation || '-',
            room: null,
            status: 'Prospect',
            moveInDate: null,
        };
        // setContacts([...contacts, newContact]);
    };

    const getStatusBadge = (status: string) => {
        const variants: Record<string, any> = {
            Active: 'success',
            Pending: 'warning',
            Prospect: 'info',
            Inactive: 'default',
        };
        return variants[status] || 'default';
    };

    const columns = [
        {
            key: 'name',
            label: 'Name',
            sortable: true,
            render: (item: any) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <p className="font-semibold text-slate-900 dark:text-white">{item.name}</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{item.occupation}</p>
                    </div>
                </div>
            ),
        },
        {
            key: 'email',
            label: 'Contact',
            render: (item: any) => (
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-slate-400" />
                        <span className="text-sm text-slate-600 dark:text-slate-400">{item.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-slate-400" />
                        <span className="text-sm text-slate-600 dark:text-slate-400">{item.phone}</span>
                    </div>
                </div>
            ),
        },
        {
            key: 'idNumber',
            label: 'ID Number',
            render: (item: any) => (
                <span className="text-sm font-mono text-slate-600 dark:text-slate-400">{item.idNumber}</span>
            ),
        },
        {
            key: 'room',
            label: 'Room',
            render: (item: any) => (
                <span className="text-sm text-slate-600 dark:text-slate-400">
                    {item.room || '-'}
                </span>
            ),
        },
        {
            key: 'status',
            label: 'Status',
            render: (item: any) => (
                <Badge variant={getStatusBadge(item.status)} dot>
                    {item.status}
                </Badge>
            ),
        },
        {
            key: 'moveInDate',
            label: 'Move-in Date',
            render: (item: any) => (
                <span className="text-sm text-slate-600 dark:text-slate-400">
                    {item.moveInDate ? new Date(item.moveInDate).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                    }) : '-'}
                </span>
            ),
        },
        {
            key: 'actions',
            label: 'Actions',
            render: (item: any) => (
                <div className="flex items-center gap-2">
                    <Button size="sm" variant="ghost"><Edit className="w-4 h-4" /></Button>
                    <Button size="sm" variant="ghost"><Trash2 className="w-4 h-4 text-red-600" /></Button>
                </div>
            ),
        },
    ];

    return (
        <div className="p-4 md:p-6 space-y-6 pb-24 md:pb-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">Contacts</h1>
                    <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 mt-1">
                        Manage tenants and prospects
                    </p>
                </div>
                <Button onClick={() => setIsFormOpen(true)}>
                    <Plus className="w-5 h-5" />
                    Add Contact
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-600 dark:text-slate-400">Total Contacts</p>
                                <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{contacts.length}</p>
                            </div>
                            <div className="w-12 h-12 rounded-lg bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center">
                                <User className="w-6 h-6 text-pink-600 dark:text-pink-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-600 dark:text-slate-400">Active</p>
                                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                                    {contacts.filter(c => c.status === 'Active').length}
                                </p>
                            </div>
                            <div className="w-12 h-12 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                                <User className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-600 dark:text-slate-400">Pending</p>
                                <p className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">
                                    {contacts.filter(c => c.status === 'Pending').length}
                                </p>
                            </div>
                            <div className="w-12 h-12 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                                <User className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-600 dark:text-slate-400">Prospects</p>
                                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">
                                    {contacts.filter(c => c.status === 'Prospect').length}
                                </p>
                            </div>
                            <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                <User className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Search, Filters, and View Mode Toggle */}
            <Card>
                <CardContent className="p-3 md:p-4">
                    <div className="space-y-3">
                        <div className="flex gap-2">
                            <Input
                                placeholder="Search contacts..."
                                leftIcon={<Search className="w-5 h-5" />}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="flex-1"
                            />
                            {/* View Mode Toggle - Desktop */}
                            <div className="hidden md:flex gap-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => setViewMode('grid')}
                                    className={`px-3 ${
                                        viewMode === 'grid'
                                            ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600'
                                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                                    }`}
                                >
                                    <Grid3x3 className="w-4 h-4" />
                                </Button>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => setViewMode('list')}
                                    className={`px-3 ${
                                        viewMode === 'list'
                                            ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600'
                                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                                    }`}
                                >
                                    <List className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                        <Button
                            variant="outline"
                            onClick={() => setShowFilters(!showFilters)}
                            className="w-full md:hidden"
                        >
                            <Filter className="w-4 h-4" />
                            {showFilters ? 'Hide' : 'Show'} Filters
                        </Button>
                        <div className={`grid grid-cols-1 gap-3 ${showFilters ? 'block' : 'hidden md:grid'}`}>
                            <Select options={statusOptions} value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Grid View */}
            {effectiveViewMode === 'grid' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {contacts.map((contact) => (
                        <Card key={contact.id} hover>
                            <CardContent className="p-4">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center">
                                            <User className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-slate-900 dark:text-white">
                                                {contact.name}
                                            </h3>
                                            <p className="text-sm text-slate-500 dark:text-slate-400">{contact.occupation}</p>
                                        </div>
                                    </div>
                                    <Badge variant={getStatusBadge(contact.status)} dot size="sm">
                                        {contact.status}
                                    </Badge>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <Mail className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                        <span className="text-sm text-slate-600 dark:text-slate-400 truncate">{contact.email}</span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Phone className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                        <span className="text-sm text-slate-600 dark:text-slate-400">{contact.phone}</span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                        <span className="text-sm text-slate-600 dark:text-slate-400">
                                            {contact.room || 'Not assigned'}
                                        </span>
                                    </div>

                                    <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-slate-600 dark:text-slate-400">ID:</span>
                                            <span className="font-mono text-xs text-slate-900 dark:text-white">{contact.idNumber}</span>
                                        </div>
                                        {contact.moveInDate && (
                                            <div className="flex items-center justify-between text-sm mt-1">
                                                <span className="text-slate-600 dark:text-slate-400">Move-in:</span>
                                                <span className="text-slate-900 dark:text-white">
                                                    {new Date(contact.moveInDate).toLocaleDateString('id-ID', {
                                                        day: 'numeric',
                                                        month: 'short',
                                                        year: 'numeric',
                                                    })}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex gap-2 pt-3 border-t border-slate-200 dark:border-slate-800 mt-3">
                                    <Button size="sm" variant="outline" className="flex-1">
                                        <Edit className="w-4 h-4 mr-1" />
                                        Edit
                                    </Button>
                                    <Button size="sm" variant="ghost">
                                        <Trash2 className="w-4 h-4 text-red-600" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* List View (Table) */}
            {effectiveViewMode === 'list' && (
                <Table data={contacts} columns={columns} />
            )}

            {/* Add Contact Form */}
            <AddTenantForm
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onSubmit={handleSubmit}
            />
        </div>
    );
}