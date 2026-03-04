'use client';

import { useState, useEffect } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { X } from 'lucide-react';

export interface ContactFormData {
    name: string;
    no_ktp: string;
    no_wa: string;
    address: string;
    type: 'Customer' | 'Vendor' | 'Owner';
    room: string;
    status: 'Active' | 'Inactive' | 'Prospect';
    date_check_in: string;
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
        status: 'Active',
        date_check_in: '',
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);

    // Load edit data
    useEffect(() => {
        if (editData) {
            setFormData(editData);
        } else {
            setFormData({
                name: '',
                no_ktp: '',
                no_wa: '',
                address: '',
                type: 'Customer',
                room: '',
                status: 'Active',
                date_check_in: '',
            });
        }
        setErrors({});
    }, [editData, isOpen]);

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [isOpen, onClose]);

    // Prevent body scroll when modal open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
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

    const validate = () => {
        const newErrors: Record<string, string> = {};

        // Common fields for all types
        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }

        if (!formData.no_wa.trim()) {
            newErrors.no_wa = 'WhatsApp number is required';
        } else if (!/^(\+62|62|0)[0-9]{9,12}$/.test(formData.no_wa.replace(/\s/g, ''))) {
            newErrors.no_wa = 'Invalid phone number format';
        }

        if (!formData.address.trim()) {
            newErrors.address = 'Address is required';
        }

        // Type-specific validations
        if (formData.type === 'Customer') {
            // For Prospects: KTP, Room, Check-in optional
            // For Active customers: All required
            const isProspect = formData.status === 'Prospect';

            if (!isProspect) {
                // Active/Inactive customers need full info
                if (!formData.no_ktp.trim()) {
                    newErrors.no_ktp = 'KTP number is required for active customers';
                } else if (formData.no_ktp.length !== 16) {
                    newErrors.no_ktp = 'KTP must be 16 digits';
                }

                if (!formData.room.trim()) {
                    newErrors.room = 'Room is required for active customers';
                }

                if (!formData.date_check_in) {
                    newErrors.date_check_in = 'Check-in date is required for active customers';
                }
            } else {
                // Prospects: optional fields but validate if provided
                if (formData.no_ktp.trim() && formData.no_ktp.length !== 16) {
                    newErrors.no_ktp = 'KTP must be 16 digits if provided';
                }
            }
        } else if (formData.type === 'Vendor') {
            // Vendor: KTP optional, Room/Check-in not needed
            if (formData.no_ktp.trim() && formData.no_ktp.length !== 16) {
                newErrors.no_ktp = 'KTP must be 16 digits if provided';
            }
        } else if (formData.type === 'Owner') {
            // Owner: KTP optional, Room/Check-in not needed
            if (formData.no_ktp.trim() && formData.no_ktp.length !== 16) {
                newErrors.no_ktp = 'KTP must be 16 digits if provided';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) return;

        setLoading(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));

        // Clear room and date_check_in if not Customer
        const submitData = {
            ...formData,
            room: formData.type === 'Customer' ? formData.room : '',
            date_check_in: formData.type === 'Customer' ? formData.date_check_in : '',
        };

        onSubmit(submitData);
        setLoading(false);
        onClose();
    };

    const handleChange = (field: keyof ContactFormData, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
            onClick={onClose}
        >
            <div
                className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 slide-in-from-bottom-4 duration-300"
                onClick={(e) => e.stopPropagation()}
            >
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
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                    >
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
                            <Input
                                value={formData.name}
                                onChange={(e) => handleChange('name', e.target.value)}
                                placeholder="Enter full name"
                                error={errors.name}
                            />
                        </div>

                        {/* Type */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                Contact Type <span className="text-red-500">*</span>
                            </label>
                            <Select
                                options={typeOptions}
                                value={formData.type}
                                onChange={(e) => handleChange('type', e.target.value as any)}
                            />
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                {formData.type === 'Customer' && '👤 Tenant or guest staying in a room'}
                                {formData.type === 'Vendor' && '🏢 Service provider or supplier'}
                                {formData.type === 'Owner' && '👥 Property owner'}
                            </p>
                        </div>

                        {/* Status - Show early for Customers to control field visibility */}
                        {formData.type === 'Customer' && (
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                    Status <span className="text-red-500">*</span>
                                </label>
                                <Select
                                    options={statusOptions}
                                    value={formData.status}
                                    onChange={(e) => handleChange('status', e.target.value as any)}
                                />
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                    {formData.status === 'Prospect' && '💡 Prospect: Room & check-in date optional'}
                                    {formData.status === 'Active' && '✅ Active: All fields required'}
                                    {formData.status === 'Inactive' && '⏸️ Inactive: No longer occupying'}
                                </p>
                            </div>
                        )}

                        {/* KTP Number */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                KTP Number {formData.type === 'Customer' && formData.status !== 'Prospect' && <span className="text-red-500">*</span>}
                                {(formData.type !== 'Customer' || formData.status === 'Prospect') && <span className="text-slate-400 text-xs">(Optional)</span>}
                            </label>
                            <Input
                                value={formData.no_ktp}
                                onChange={(e) => handleChange('no_ktp', e.target.value.replace(/\D/g, '').slice(0, 16))}
                                placeholder={
                                    formData.type === 'Customer' && formData.status !== 'Prospect'
                                        ? '3174012505850001'
                                        : 'NPWP or Company ID (optional)'
                                }
                                maxLength={16}
                                error={errors.no_ktp}
                            />
                            {formData.no_ktp && (
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                    {formData.no_ktp.length}/16 digits
                                </p>
                            )}
                            {(formData.type !== 'Customer' || formData.status === 'Prospect') && (
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                    {formData.type === 'Customer'
                                        ? 'For prospects, KTP can be collected later'
                                        : 'For vendors/owners, you can use NPWP or company registration number'}
                                </p>
                            )}
                        </div>

                        {/* WhatsApp Number */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                WhatsApp Number <span className="text-red-500">*</span>
                            </label>
                            <Input
                                value={formData.no_wa}
                                onChange={(e) => handleChange('no_wa', e.target.value)}
                                placeholder="+62 812 3456 7890"
                                error={errors.no_wa}
                            />
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                Format: +62xxx or 08xxx
                            </p>
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
                                className={`w-full px-3 py-2 rounded-lg border ${
                                    errors.address
                                        ? 'border-red-500 focus:border-red-500'
                                        : 'border-slate-300 dark:border-slate-600 focus:border-indigo-500'
                                } bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-colors`}
                            />
                            {errors.address && (
                                <p className="text-xs text-red-500 mt-1">{errors.address}</p>
                            )}
                        </div>

                        {/* Room/Unit (Only for Customer) */}
                        {formData.type === 'Customer' && (
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                    Room/Unit {formData.status !== 'Prospect' && <span className="text-red-500">*</span>}
                                    {formData.status === 'Prospect' && <span className="text-slate-400 text-xs">(Optional)</span>}
                                </label>
                                <Input
                                    value={formData.room}
                                    onChange={(e) => handleChange('room', e.target.value)}
                                    placeholder={formData.status === 'Prospect' ? 'Can be assigned later' : 'Room 305'}
                                    error={errors.room}
                                />
                                {formData.status === 'Prospect' && (
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                        Room can be assigned when prospect becomes active customer
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Check-in Date (Only for Customer) */}
                        {formData.type === 'Customer' && (
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                    Check-in Date {formData.status !== 'Prospect' && <span className="text-red-500">*</span>}
                                    {formData.status === 'Prospect' && <span className="text-slate-400 text-xs">(Optional)</span>}
                                </label>
                                <Input
                                    type="date"
                                    value={formData.date_check_in}
                                    onChange={(e) => handleChange('date_check_in', e.target.value)}
                                    error={errors.date_check_in}
                                />
                                {formData.status === 'Prospect' && (
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                        Check-in date can be set when booking is confirmed
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Status (for Vendor/Owner) */}
                        {formData.type !== 'Customer' && (
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                    Status <span className="text-red-500">*</span>
                                </label>
                                <Select
                                    options={statusOptions}
                                    value={formData.status}
                                    onChange={(e) => handleChange('status', e.target.value as any)}
                                />
                            </div>
                        )}
                    </div>
                </form>

                {/* Footer */}
                <div className="flex gap-3 p-4 md:p-6 border-t border-slate-200 dark:border-slate-700">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        className="flex-1"
                        disabled={loading}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        className="flex-1"
                        disabled={loading}
                    >
                        {loading ? 'Saving...' : editData ? 'Update Contact' : 'Add Contact'}
                    </Button>
                </div>
            </div>
        </div>
    );
}