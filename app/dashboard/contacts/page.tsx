'use client';

import { useState } from 'react'
import { contactService } from '@/lib/services'
import { useCrud } from '@/lib/hooks/useSupabaseQuery'
import type { ContactRow, ContactInsert, ContactUpdate } from '@/types/database'
import { Card, CardContent } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Table from '@/components/ui/Table';
import AddContactForm, { ContactFormData } from '@/components/forms/AddContactForm';
import {
    Users,
    Plus,
    Search,
    Filter,
    User,
    Phone,
    Mail,
    MapPin,
    Edit,
    Trash2,
    Building,
    Calendar,
Loader2, } from 'lucide-react';
import { useToast } from '@/components/ui/Toast'

export default function ContactsPage() {
    const { toast, confirm } = useToast()
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [filterType, setFilterType] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingContact, setEditingContact] = useState<ContactRow | null>(null)

    const {
        items: contacts,
        loading,
        error,
        addItem,
        updateItem,
        removeItem,
        actionLoading,
    } = useCrud<ContactRow, ContactInsert, ContactUpdate>({
        service: contactService,
        orderBy: 'created_at',
    })


    const typeOptions = [
        { value: 'all', label: 'All Types' },
        { value: 'Customer', label: 'Customer' },
        { value: 'Vendor', label: 'Vendor' },
        { value: 'Owner', label: 'Owner' },
    ];

    const statusOptions = [
        { value: 'all', label: 'All Status' },
        { value: 'Active', label: 'Active' },
        { value: 'Prospect', label: 'Prospect' },
        { value: 'Inactive', label: 'Inactive' },
    ];

    const formatDate = (dateString: string | null) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

    const getTypeBadge = (type: string) => {
        const variants: Record<string, any> = {
            Customer: 'info',
            Vendor: 'purple',
            Owner: 'success',
        };
        return variants[type] || 'default';
    };

    const getTypeIcon = (type: string) => {
        const icons: Record<string, any> = {
            Customer: User,
            Vendor: Building,
            Owner: Users,
        };
        return icons[type] || User;
    };

    const columns = [
        {
            key: 'name',
            label: 'Contact Info',
            sortable: true,
            render: (item: any) => {
                const Icon = getTypeIcon(item.type);
                return (
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center">
                            <Icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="min-w-0">
                            <p className="font-semibold text-slate-900 dark:text-white truncate">
                                {item.name}
                            </p>
                            <p className="text-xs text-slate-600 dark:text-slate-400 truncate">
                                KTP: {item.no_ktp}
                            </p>
                        </div>
                    </div>
                );
            },
        },
        {
            key: 'type',
            label: 'Type',
            sortable: true,
            render: (item: any) => (
                <Badge variant={getTypeBadge(item.type)}>{item.type}</Badge>
            ),
        },
        {
            key: 'contact',
            label: 'Contact',
            render: (item: any) => (
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <Phone className="w-3 h-3 text-slate-400" />
                        <span className="text-sm text-slate-900 dark:text-white">
                            {item.no_wa}
                        </span>
                    </div>
                    <div className="flex items-start gap-2">
                        <MapPin className="w-3 h-3 text-slate-400 mt-0.5 flex-shrink-0" />
                        <span className="text-xs text-slate-600 dark:text-slate-400 line-clamp-1">
                            {item.address}
                        </span>
                    </div>
                </div>
            ),
        },
        {
            key: 'room',
            label: 'Room/Unit',
            render: (item: any) => (
                <span className="text-sm text-slate-900 dark:text-white">
                    {item.room || '-'}
                </span>
            ),
        },
        {
            key: 'date_check_in',
            label: 'Check-in Date',
            sortable: true,
            render: (item: any) => (
                <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                        {formatDate(item.date_check_in)}
                    </span>
                </div>
            ),
        },
        {
            key: 'status',
            label: 'Status',
            sortable: true,
            render: (item: any) => {
                const variant = item.status === 'Active' ? 'success' :
                    item.status === 'Prospect' ? 'warning' : 'default';
                return (
                    <Badge variant={variant} dot>
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
                    <Button size="sm" variant="ghost" onClick={() => handleEdit(item)}>
                        <Edit className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => handleDelete(item.id)}>
                        <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                </div>
            ),
        },
    ];

    // Filter contacts
    const filteredContacts = contacts.filter(contact => {
        const matchSearch = contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            contact.no_wa.includes(searchQuery) ||
            contact.no_ktp.includes(searchQuery);
        const matchType = filterType === 'all' || contact.type === filterType;
        const matchStatus = filterStatus === 'all' || contact.status === filterStatus;
        return matchSearch && matchType && matchStatus;
    });

    // Stats
    const totalContacts = contacts.length;
    const customerCount = contacts.filter(c => c.type === 'Customer' && c.status === 'Active').length;
    const prospectCount = contacts.filter(c => c.type === 'Customer' && c.status === 'Prospect').length;
    const vendorCount = contacts.filter(c => c.type === 'Vendor').length;
    const ownerCount = contacts.filter(c => c.type === 'Owner').length;

    const handleFormSubmit = async (data: ContactFormData) => {
        if (editingContact) {
            const updResult = await updateItem(editingContact.id, data as unknown as ContactUpdate)
            if (updResult.error) toast.error('Gagal mengupdate', updResult.error)
            else toast.success('Berhasil', 'Data berhasil diupdate')
        } else {
            const addResult = await addItem(data as unknown as ContactInsert)
            if (addResult.error) toast.error('Gagal menyimpan', addResult.error)
            else toast.success('Berhasil', 'Data berhasil ditambahkan')
        }
        setEditingContact(null)
    }


    const handleEdit = (contact: any) => {
        setEditingContact(contact);
        setIsFormOpen(true);
    };

    const handleDelete = async (id: string) => {
        const yes = await confirm({ title: 'Konfirmasi Hapus', message: 'Apakah kamu yakin ingin menghapus data ini? Tindakan ini tidak bisa dibatalkan.', variant: 'danger' })
        if (!yes) return
        const delResult = await removeItem(id)
        if (delResult.error) toast.error('Gagal menghapus', delResult.error)
        else toast.success('Berhasil', 'Data berhasil dihapus')
    }


    const handleCloseForm = () => {
        setIsFormOpen(false);
        setEditingContact(null);
    };

    const handleAddNew = () => {
        setEditingContact(null);
        setIsFormOpen(true);
    };

    // ─── Loading State ─────────────────────────────────────
    if (loading) {
        return (
            <div className="p-4 md:p-6 lg:p-8">
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="text-center">
                        <div className="w-10 h-10 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                        <p className="text-sm text-slate-500 dark:text-slate-400">Memuat data...</p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="p-4 md:p-6 space-y-4 md:space-y-6 pb-24 md:pb-6">

            {/* Action Loading Overlay */}
            {actionLoading && (
                <div className="fixed inset-0 z-[90] bg-black/20 backdrop-blur-[1px] flex items-center justify-center pointer-events-auto">
                    <div className="bg-white dark:bg-slate-800 rounded-xl px-6 py-4 shadow-xl flex items-center gap-3">
                        <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Menyimpan...</span>
                    </div>
                </div>
            )}
            {/* Header */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
                        Contacts
                    </h1>
                    <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 mt-1">
                        Manage customers, vendors, and property owners
                    </p>
                </div>
                <Button className="w-full sm:w-auto" onClick={handleAddNew}>
                    <Plus className="w-5 h-5" />
                    Add Contact
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
                <Card>
                    <CardContent className="p-3 md:p-4">
                        <div className="flex items-center justify-between">
                            <div className="min-w-0 flex-1">
                                <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 truncate">
                                    Total Contacts
                                </p>
                                <p className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mt-1 truncate">
                                    {totalContacts}
                                </p>
                            </div>
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0 ml-2">
                                <Users className="w-5 h-5 md:w-6 md:h-6 text-slate-600 dark:text-slate-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-3 md:p-4">
                        <div className="flex items-center justify-between">
                            <div className="min-w-0 flex-1">
                                <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 truncate">
                                    Customers
                                </p>
                                <p className="text-xl md:text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1 truncate">
                                    {customerCount}
                                </p>
                            </div>
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0 ml-2">
                                <User className="w-5 h-5 md:w-6 md:h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-3 md:p-4">
                        <div className="flex items-center justify-between">
                            <div className="min-w-0 flex-1">
                                <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 truncate">
                                    Prospects
                                </p>
                                <p className="text-xl md:text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1 truncate">
                                    {prospectCount}
                                </p>
                            </div>
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0 ml-2">
                                <User className="w-5 h-5 md:w-6 md:h-6 text-amber-600 dark:text-amber-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-3 md:p-4">
                        <div className="flex items-center justify-between">
                            <div className="min-w-0 flex-1">
                                <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 truncate">
                                    Vendors
                                </p>
                                <p className="text-xl md:text-2xl font-bold text-purple-600 dark:text-purple-400 mt-1 truncate">
                                    {vendorCount}
                                </p>
                            </div>
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0 ml-2">
                                <Building className="w-5 h-5 md:w-6 md:h-6 text-purple-600 dark:text-purple-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-3 md:p-4">
                        <div className="flex items-center justify-between">
                            <div className="min-w-0 flex-1">
                                <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 truncate">
                                    Owners
                                </p>
                                <p className="text-xl md:text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1 truncate">
                                    {ownerCount}
                                </p>
                            </div>
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0 ml-2">
                                <Users className="w-5 h-5 md:w-6 md:h-6 text-emerald-600 dark:text-emerald-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Search & Filters */}
            <Card>
                <CardContent className="p-3 md:p-4">
                    <div className="space-y-3">
                        <Input
                            placeholder="Search by name, phone, or KTP..."
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
                        <div className={`grid grid-cols-1 gap-3 md:grid-cols-2 ${showFilters ? 'block' : 'hidden md:grid'}`}>
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

            {/* Mobile Cards */}
            <div className="block md:hidden space-y-3">
                {filteredContacts.map((contact) => {
                    const Icon = getTypeIcon(contact.type);
                    return (
                        <Card key={contact.id} hover>
                            <CardContent className="p-4">
                                <div className="flex items-start gap-3 mb-3">
                                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center flex-shrink-0">
                                        <Icon className="w-5 h-5 text-white" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-slate-900 dark:text-white truncate">
                                            {contact.name}
                                        </p>
                                        <Badge variant={getTypeBadge(contact.type)} size="sm" className="mt-1">
                                            {contact.type}
                                        </Badge>
                                    </div>
                                    <Badge variant={contact.status === 'Active' ? 'success' : 'default'} dot size="sm">
                                        {contact.status}
                                    </Badge>
                                </div>

                                <div className="space-y-2 text-sm">
                                    <div className="flex items-center gap-2">
                                        <Phone className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                        <span className="text-slate-900 dark:text-white">{contact.no_wa}</span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                                        <span className="text-slate-600 dark:text-slate-400 text-xs">
                                            {contact.address}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-700">
                                        <div>
                                            <span className="text-xs text-slate-500">KTP:</span>
                                            <span className="text-xs text-slate-900 dark:text-white ml-1">
                                                {contact.no_ktp}
                                            </span>
                                        </div>
                                        {contact.room && (
                                            <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400">
                                                {contact.room}
                                            </span>
                                        )}
                                    </div>
                                    {contact.date_check_in && (
                                        <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                                            <Calendar className="w-3 h-3" />
                                            Check-in: {formatDate(contact.date_check_in)}
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block">
                <Table data={filteredContacts} columns={columns} />
            </div>

            {/* Add/Edit Contact Form */}
            <AddContactForm
                isOpen={isFormOpen}
                onClose={handleCloseForm}
                onSubmit={handleFormSubmit}
                editData={editingContact as unknown as ContactFormData | null}
            />
        </div>
    );
}