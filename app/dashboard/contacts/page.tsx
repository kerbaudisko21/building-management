'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Table from '@/components/ui/Table';
import {
    Users,
    Plus,
    Search,
    Phone,
    Mail,
    MapPin,
    Eye,
    Edit,
    Trash2,
    User,
    UserCheck,
    MessageSquare,
    IdCard,
    Filter,
} from 'lucide-react';

export default function ContactsPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [showFilters, setShowFilters] = useState(false);

    // Mock data
    const contacts = [
        {
            id: 1,
            name: 'John Doe',
            type: 'Guest',
            ktpNumber: '3171234567890123',
            phone: '+62 812-3456-7890',
            whatsapp: '+62 812-3456-7890',
            email: 'john.doe@email.com',
            gender: 'Male',
            totalPeople: 1,
            status: 'Active',
            property: 'Building A - Room 305',
            joinDate: '2024-01-15',
        },
        {
            id: 2,
            name: 'Jane Smith',
            type: 'Guest',
            ktpNumber: '3171234567890124',
            phone: '+62 813-4567-8901',
            whatsapp: '+62 813-4567-8901',
            email: 'jane.smith@email.com',
            gender: 'Female',
            totalPeople: 2,
            coupleId: 3,
            status: 'Active',
            property: 'Building B - Room 201',
            joinDate: '2024-02-20',
        },
        {
            id: 3,
            name: 'Bob Johnson',
            type: 'Guest',
            ktpNumber: '3171234567890125',
            phone: '+62 814-5678-9012',
            whatsapp: '+62 814-5678-9012',
            email: 'bob.johnson@email.com',
            gender: 'Male',
            totalPeople: 2,
            coupleId: 2,
            status: 'Active',
            property: 'Building B - Room 201',
            joinDate: '2024-02-20',
        },
        {
            id: 4,
            name: 'Alice Williams',
            type: 'Owner',
            ktpNumber: '3171234567890126',
            phone: '+62 815-6789-0123',
            whatsapp: '+62 815-6789-0123',
            email: 'alice.williams@email.com',
            gender: 'Female',
            totalPeople: 1,
            status: 'Active',
            property: 'Building A (Owner)',
            joinDate: '2023-01-10',
        },
        {
            id: 5,
            name: 'Charlie Brown',
            type: 'Guest',
            ktpNumber: '3171234567890127',
            phone: '+62 816-7890-1234',
            whatsapp: '+62 816-7890-1234',
            email: 'charlie.brown@email.com',
            gender: 'Male',
            totalPeople: 1,
            status: 'Inactive',
            property: 'Building C - Room 102 (Moved Out)',
            joinDate: '2023-11-05',
        },
        {
            id: 6,
            name: 'Diana Prince',
            type: 'Guest',
            ktpNumber: '3171234567890128',
            phone: '+62 817-8901-2345',
            whatsapp: '+62 817-8901-2345',
            email: 'diana.prince@email.com',
            gender: 'Female',
            totalPeople: 1,
            status: 'Active',
            property: 'Building A - Room 405',
            joinDate: '2024-03-10',
        },
    ];

    const typeOptions = [
        { value: 'all', label: 'All Types' },
        { value: 'owner', label: 'Owner' },
        { value: 'guest', label: 'Guest' },
    ];

    const statusOptions = [
        { value: 'all', label: 'All Status' },
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' },
    ];

    const genderOptions = [
        { value: 'all', label: 'All Gender' },
        { value: 'male', label: 'Male' },
        { value: 'female', label: 'Female' },
    ];

    // Filter contacts
    const filteredContacts = contacts.filter((contact) => {
        const matchesSearch =
            contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            contact.phone.includes(searchQuery) ||
            contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            contact.ktpNumber.includes(searchQuery);

        const matchesType =
            filterType === 'all' || contact.type.toLowerCase() === filterType.toLowerCase();

        return matchesSearch && matchesType;
    });

    // Table columns for desktop
    const columns = [
        {
            key: 'name',
            label: 'Name',
            sortable: true,
            render: (item: any) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center flex-shrink-0">
                        <User className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <p className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                            {item.name}
                            {item.coupleId && (
                                <span className="text-xs text-slate-500 dark:text-slate-400">
                  (Couple)
                </span>
                            )}
                        </p>
                        <p className="text-xs text-slate-600 dark:text-slate-400">{item.email}</p>
                    </div>
                </div>
            ),
        },
        {
            key: 'type',
            label: 'Type',
            render: (item: any) => (
                <Badge variant={item.type === 'Owner' ? 'purple' : 'info'}>
                    {item.type}
                </Badge>
            ),
        },
        {
            key: 'phone',
            label: 'Contact',
            render: (item: any) => (
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-slate-900 dark:text-white">{item.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <MessageSquare className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="text-slate-600 dark:text-slate-400">{item.whatsapp}</span>
                    </div>
                </div>
            ),
        },
        {
            key: 'property',
            label: 'Property',
            render: (item: any) => (
                <span className="text-sm text-slate-600 dark:text-slate-400">
          {item.property}
        </span>
            ),
        },
        {
            key: 'status',
            label: 'Status',
            render: (item: any) => (
                <Badge
                    variant={item.status === 'Active' ? 'success' : 'default'}
                    dot
                >
                    {item.status}
                </Badge>
            ),
        },
        {
            key: 'actions',
            label: 'Actions',
            render: (item: any) => (
                <div className="flex items-center gap-2">
                    <Button size="sm" variant="ghost" onClick={() => console.log('View', item.id)}>
                        <Eye className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => console.log('Edit', item.id)}>
                        <Edit className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => console.log('Delete', item.id)}>
                        <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <div className="p-4 md:p-6 space-y-4 md:space-y-6 pb-24 md:pb-6">
            {/* Page Header */}
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
                        Contacts
                    </h1>
                    <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 mt-1">
                        Manage property owners and tenants
                    </p>
                </div>
                <Button onClick={() => console.log('Add new contact')} className="w-full md:w-auto">
                    <Plus className="w-5 h-5" />
                    Add Contact
                </Button>
            </div>

            {/* Stats Summary - Mobile optimized */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                <Card>
                    <CardContent className="p-3 md:p-4">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                            <div className="flex-1 min-w-0">
                                <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 truncate">Total</p>
                                <p className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mt-1">
                                    {contacts.length}
                                </p>
                            </div>
                            <div className="w-10 h-10 md:w-12 md:h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Users className="w-5 h-5 md:w-6 md:h-6 text-indigo-600 dark:text-indigo-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-3 md:p-4">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                            <div className="flex-1 min-w-0">
                                <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 truncate">Owners</p>
                                <p className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mt-1">
                                    {contacts.filter((c) => c.type === 'Owner').length}
                                </p>
                            </div>
                            <div className="w-10 h-10 md:w-12 md:h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                                <UserCheck className="w-5 h-5 md:w-6 md:h-6 text-purple-600 dark:text-purple-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-3 md:p-4">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                            <div className="flex-1 min-w-0">
                                <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 truncate">Guests</p>
                                <p className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mt-1">
                                    {contacts.filter((c) => c.type === 'Guest').length}
                                </p>
                            </div>
                            <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                                <User className="w-5 h-5 md:w-6 md:h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-3 md:p-4">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                            <div className="flex-1 min-w-0">
                                <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 truncate">Active</p>
                                <p className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mt-1">
                                    {contacts.filter((c) => c.status === 'Active').length}
                                </p>
                            </div>
                            <div className="w-10 h-10 md:w-12 md:h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                                <UserCheck className="w-5 h-5 md:w-6 md:h-6 text-emerald-600 dark:text-emerald-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters - Mobile optimized */}
            <Card>
                <CardContent className="p-3 md:p-4">
                    <div className="space-y-3">
                        {/* Search */}
                        <Input
                            placeholder="Search by name, phone, email..."
                            leftIcon={<Search className="w-5 h-5" />}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />

                        {/* Filter Toggle - Mobile Only */}
                        <Button
                            variant="outline"
                            onClick={() => setShowFilters(!showFilters)}
                            className="w-full md:hidden"
                        >
                            <Filter className="w-4 h-4" />
                            {showFilters ? 'Hide' : 'Show'} Filters
                        </Button>

                        {/* Filter Options */}
                        <div className={`grid grid-cols-1 gap-3 md:grid-cols-3 ${showFilters ? 'block' : 'hidden md:grid'}`}>
                            <Select
                                options={typeOptions}
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value)}
                                placeholder="Type"
                            />
                            <Select options={statusOptions} placeholder="Status" />
                            <Select options={genderOptions} placeholder="Gender" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Contacts List - Mobile: Cards, Desktop: Table */}
            <div className="block md:hidden space-y-3">
                {filteredContacts.map((contact) => (
                    <Card key={contact.id} hover>
                        <CardContent className="p-4">
                            {/* Header */}
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center flex-shrink-0">
                                        <User className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="font-semibold text-slate-900 dark:text-white truncate">
                                            {contact.name}
                                        </p>
                                        <Badge variant={contact.type === 'Owner' ? 'purple' : 'info'} size="sm" className="mt-1">
                                            {contact.type}
                                        </Badge>
                                    </div>
                                </div>
                                <Badge variant={contact.status === 'Active' ? 'success' : 'default'} dot>
                                    {contact.status}
                                </Badge>
                            </div>

                            {/* Contact Info */}
                            <div className="space-y-2 mb-3">
                                <div className="flex items-center gap-2 text-sm">
                                    <Phone className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                    <span className="text-slate-900 dark:text-white truncate">{contact.phone}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <Mail className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                    <span className="text-slate-600 dark:text-slate-400 truncate">{contact.email}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                    <span className="text-slate-600 dark:text-slate-400 truncate">{contact.property}</span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                                <Button size="sm" variant="outline" className="flex-1" onClick={() => console.log('View', contact.id)}>
                                    <Eye className="w-4 h-4" />
                                    View
                                </Button>
                                <Button size="sm" variant="ghost" onClick={() => console.log('Edit', contact.id)}>
                                    <Edit className="w-4 h-4" />
                                </Button>
                                <Button size="sm" variant="ghost" onClick={() => console.log('Delete', contact.id)}>
                                    <Trash2 className="w-4 h-4 text-red-600" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block">
                <Table
                    data={filteredContacts}
                    columns={columns}
                    onRowClick={(contact) => console.log('View contact:', contact.id)}
                    emptyMessage="No contacts found"
                />
            </div>
        </div>
    );
}