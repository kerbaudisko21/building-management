'use client';

import { useState, useEffect } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { X } from 'lucide-react';
import { roomService, propertyService } from '@/lib/services/index';
import type { RoomRow, PropertyRow } from '@/types/database';

export interface ContactFormData {
    name: string;
    no_ktp: string;
    no_wa: string;
    address: string;
    type: 'Customer' | 'Vendor' | 'Owner';
    room: string;
    room_id?: string;
    status: 'Active' | 'Inactive' | 'Prospect';
    date_check_in: string | null;
}

interface AddContactFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: ContactFormData) => void;
    editData?: ContactFormData | null;
}

export default function AddContactForm({
                                           isOpen,
                                           onClose,
                                           editData,
                                           onSubmit,
                                       }: AddContactFormProps) {
    const [formData, setFormData] = useState<ContactFormData>({
        name: '',
        no_ktp: '',
        no_wa: '',
        address: '',
        type: 'Customer',
        room: '',
        room_id: '',
        status: 'Active',
        date_check_in: null,
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);
    const [availableRooms, setAvailableRooms] = useState<RoomRow[]>([]);
    const [properties, setProperties] = useState<PropertyRow[]>([]);
    const [selectedPropertyFilter, setSelectedPropertyFilter] = useState('all');

    useEffect(() => {
        if (editData) {
            setFormData(editData);
        } else {
            setFormData({
                name: '', no_ktp: '', no_wa: '', address: '',
                type: 'Customer', room: '', room_id: '',
                status: 'Active', date_check_in: null,
            });
            setSelectedPropertyFilter('all');
        }
        setErrors({});
    }, [editData, isOpen]);

    useEffect(() => {
        if (!isOpen) return;
        roomService.getAll().then(res => {
            if (res.data) {
                setAvailableRooms(res.data.filter(r =>
                    r.status === 'Available' || (editData?.room_id && r.id === editData.room_id)
                ));
            }
        });
        propertyService.getAll().then(res => {
            if (res.data) setProperties(res.data);
        });
    }, [isOpen, editData?.room_id]);

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape' && isOpen) onClose(); };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [isOpen, onClose]);

    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : 'unset';
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    const typeOptions = [
        { value: 'Customer', label: 'Customer' },
        { value: 'Vendor', label: 'Vendor' },
        { value: 'Owner', label: 'Owner' },
    ];

    const statusOptions = [
        { value: 'Active', label: 'Active' },
        { value: 'Prospect', label: 'Prospect' },
        { value: 'Inactive', label: 'Inactive' },
    ];

    const filteredRooms = availableRooms.filter(r =>
        selectedPropertyFilter === 'all' || r.property_id === selectedPropertyFilter
    );

    const propertyFilterOptions = [
        { value: 'all', label: 'All Properties' },
        ...properties.map(p => ({ value: p.id, label: p.name }))
    ];

    const roomOptions = [
        { value: '', label: filteredRooms.length > 0 ? 'Select available room' : 'No rooms available' },
        ...filteredRooms.map(r => {
            const prop = properties.find(p => p.id === r.property_id);
            const propLabel = prop ? ` (${prop.name})` : '';
            return { value: r.id, label: `${r.name} - ${r.type} ${r.luas}m²${propLabel}` };
        })
    ];

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.name.trim()) newErrors.name = 'Name is required';
        if (!formData.no_wa.trim()) {
            newErrors.no_wa = 'WhatsApp number is required';
        } else if (!/^(\+62|62|0)[0-9]{9,12}$/.test(formData.no_wa.replace(/\s/g, ''))) {
            newErrors.no_wa = 'Invalid phone number format';
        }
        if (!formData.address.trim()) newErrors.address = 'Address is required';

        if (formData.type === 'Customer') {
            const isActive = formData.status === 'Active';
            if (isActive) {
                if (!formData.no_ktp.trim()) newErrors.no_ktp = 'KTP number is required for active customers';
                else if (formData.no_ktp.length !== 16) newErrors.no_ktp = 'KTP must be 16 digits';
                if (!formData.room_id) newErrors.room = 'Room is required for active customers';
                if (!formData.date_check_in) newErrors.date_check_in = 'Check-in date is required for active customers';
            } else {
                if (formData.no_ktp.trim() && formData.no_ktp.length !== 16) newErrors.no_ktp = 'KTP must be 16 digits if provided';
            }
        } else {
            if (formData.no_ktp.trim() && formData.no_ktp.length !== 16) newErrors.no_ktp = 'KTP must be 16 digits if provided';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);

        const selectedRoom = availableRooms.find(r => r.id === formData.room_id);
        const submitData: ContactFormData = {
            ...formData,
            room: formData.type === 'Customer' && selectedRoom ? selectedRoom.name : '',
            room_id: formData.type === 'Customer' ? formData.room_id : '',
            date_check_in: (formData.type === 'Customer' && formData.date_check_in) ? formData.date_check_in : null,
        };

        onSubmit(submitData);
        setLoading(false);
        onClose();
    };

    const handleChange = (field: keyof ContactFormData, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
    };

    const handleRoomSelect = (roomId: string) => {
        const room = availableRooms.find(r => r.id === roomId);
        setFormData(prev => ({ ...prev, room_id: roomId, room: room ? room.name : '' }));
        if (errors.room) setErrors(prev => ({ ...prev, room: '' }));
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200" onClick={onClose}>
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 slide-in-from-bottom-4 duration-300" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="flex items-center justify-between p-4 md:p-6 border-b border-slate-200 dark:border-slate-700">
                    <div>
                        <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">
                            {editData ? 'Edit Contact' : 'Add New Contact'}
                        </h2>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                            {editData ? 'Update contact information' : 'Fill in the contact details'}
                        </p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                        <X className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 md:p-6">
                    <div className="space-y-4">
                        {/* Name */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                Full Name <span className="text-red-500">*</span>
                            </label>
                            <Input value={formData.name} onChange={(e) => handleChange('name', e.target.value)} placeholder="Enter full name" error={errors.name} />
                        </div>

                        {/* Type */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                Contact Type <span className="text-red-500">*</span>
                            </label>
                            <Select options={typeOptions} value={formData.type} onChange={(e) => handleChange('type', e.target.value as any)} />
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                {formData.type === 'Customer' && '👤 Tenant or guest staying in a room'}
                                {formData.type === 'Vendor' && '🏢 Service provider or supplier'}
                                {formData.type === 'Owner' && '👥 Property owner'}
                            </p>
                        </div>

                        {/* Status (Customer) */}
                        {formData.type === 'Customer' && (
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                    Status <span className="text-red-500">*</span>
                                </label>
                                <Select options={statusOptions} value={formData.status} onChange={(e) => handleChange('status', e.target.value as any)} />
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                    {formData.status === 'Prospect' && '💡 Prospect: Room & check-in date optional'}
                                    {formData.status === 'Active' && '✅ Active: All fields required'}
                                    {formData.status === 'Inactive' && '⏸️ Inactive: No longer occupying'}
                                </p>
                            </div>
                        )}

                        {/* KTP */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                KTP Number {formData.type === 'Customer' && formData.status === 'Active' && <span className="text-red-500">*</span>}
                                {(formData.type !== 'Customer' || formData.status === 'Prospect') && <span className="text-slate-400 text-xs">(Optional)</span>}
                            </label>
                            <Input
                                value={formData.no_ktp}
                                onChange={(e) => handleChange('no_ktp', e.target.value.replace(/\D/g, '').slice(0, 16))}
                                placeholder={formData.type === 'Customer' && formData.status === 'Active' ? '3174012505850001' : 'NPWP or Company ID (optional)'}
                                maxLength={16}
                                error={errors.no_ktp}
                            />
                            {formData.no_ktp && <p className="text-xs text-slate-500 mt-1">{formData.no_ktp.length}/16 digits</p>}
                        </div>

                        {/* WhatsApp */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                WhatsApp Number <span className="text-red-500">*</span>
                            </label>
                            <Input value={formData.no_wa} onChange={(e) => handleChange('no_wa', e.target.value)} placeholder="+62 812 3456 7890" error={errors.no_wa} />
                            <p className="text-xs text-slate-500 mt-1">Format: +62xxx or 08xxx</p>
                        </div>

                        {/* Address */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                Address <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                value={formData.address}
                                onChange={(e) => handleChange('address', e.target.value)}
                                placeholder="Enter full address"
                                rows={3}
                                className={`w-full px-3 py-2 rounded-lg border ${errors.address ? 'border-red-500' : 'border-slate-300 dark:border-slate-600 focus:border-indigo-500'} bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-colors`}
                            />
                            {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address}</p>}
                        </div>

                        {/* Room Assignment (Customer Active/Prospect only) */}
                        {formData.type === 'Customer' && formData.status !== 'Inactive' && (
                            <div className="space-y-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
                                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                                    Room Assignment {formData.status === 'Active' && <span className="text-red-500">*</span>}
                                    {formData.status === 'Prospect' && <span className="text-slate-400 text-xs font-normal ml-1">(Optional)</span>}
                                </p>

                                <div>
                                    <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Filter by Property</label>
                                    <Select
                                        options={propertyFilterOptions}
                                        value={selectedPropertyFilter}
                                        onChange={(e) => { setSelectedPropertyFilter(e.target.value); handleRoomSelect(''); }}
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Available Room</label>
                                    <Select options={roomOptions} value={formData.room_id || ''} onChange={(e) => handleRoomSelect(e.target.value)} />
                                    {errors.room && <p className="text-xs text-red-500 mt-1">{errors.room}</p>}
                                </div>

                                {formData.room_id && (() => {
                                    const selRoom = availableRooms.find(r => r.id === formData.room_id);
                                    if (!selRoom) return null;
                                    const prop = properties.find(p => p.id === selRoom.property_id);
                                    return (
                                        <div className="text-xs bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded-lg border border-indigo-200 dark:border-indigo-800">
                                            <p className="font-semibold text-indigo-900 dark:text-indigo-100 mb-1">Selected Room:</p>
                                            <p className="text-indigo-700 dark:text-indigo-300">
                                                {selRoom.name} • {selRoom.type} • {selRoom.luas}m² • Floor {selRoom.floor} • {selRoom.tower}
                                                {prop && <span> • {prop.name}</span>}
                                            </p>
                                        </div>
                                    );
                                })()}

                                {formData.status === 'Prospect' && !formData.room_id && (
                                    <p className="text-xs text-slate-500">Room can be assigned when prospect becomes active</p>
                                )}
                            </div>
                        )}

                        {/* Info when Inactive */}
                        {formData.type === 'Customer' && formData.status === 'Inactive' && (
                            <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                                <p className="text-sm text-amber-800 dark:text-amber-200">
                                    ⏸️ Contact akan di-set Inactive — room yang ditempati akan otomatis di-release menjadi Available.
                                </p>
                            </div>
                        )}

                        {/* Check-in Date (Customer Active/Prospect only) */}
                        {formData.type === 'Customer' && formData.status !== 'Inactive' && (
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                    Check-in Date {formData.status === 'Active' && <span className="text-red-500">*</span>}
                                    {formData.status === 'Prospect' && <span className="text-slate-400 text-xs">(Optional)</span>}
                                </label>
                                <Input type="date" value={formData.date_check_in || ''} onChange={(e) => handleChange('date_check_in', e.target.value || null)} error={errors.date_check_in} />
                                {formData.status === 'Prospect' && <p className="text-xs text-slate-500 mt-1">Check-in date can be set when booking is confirmed</p>}
                            </div>
                        )}

                        {/* Status (Vendor/Owner) */}
                        {formData.type !== 'Customer' && (
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Status <span className="text-red-500">*</span></label>
                                <Select options={statusOptions} value={formData.status} onChange={(e) => handleChange('status', e.target.value as any)} />
                            </div>
                        )}
                    </div>
                </form>

                {/* Footer */}
                <div className="flex gap-3 p-4 md:p-6 border-t border-slate-200 dark:border-slate-700">
                    <Button type="button" variant="outline" onClick={onClose} className="flex-1" disabled={loading}>Cancel</Button>
                    <Button onClick={handleSubmit} className="flex-1" disabled={loading}>
                        {loading ? 'Saving...' : editData ? 'Update Contact' : 'Add Contact'}
                    </Button>
                </div>
            </div>
        </div>
    );
}