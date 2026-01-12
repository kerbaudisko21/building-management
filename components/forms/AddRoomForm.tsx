'use client';

import { useState, useEffect } from 'react';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import { Home, Building, User, DollarSign, Eye, Maximize } from 'lucide-react';

interface AddRoomFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: RoomFormData) => void;
    editData?: RoomFormData | null;
}

export interface RoomFormData {
    name: string;
    type: string;
    tower: string;
    floor: number;
    capacity: number;
    view: string;
    luas: number;
    owner: string;
    tenant: string | null;
    rent_type: 'flexible' | 'daily' | 'monthly' | 'yearly';
    price_daily: number;
    price_monthly: number;
    price_yearly: number;
}

export default function AddRoomForm({
                                        isOpen,
                                        onClose,
                                        onSubmit,
                                        editData,
                                    }: AddRoomFormProps) {
    const [formData, setFormData] = useState<RoomFormData>({
        name: '',
        type: '',
        tower: '',
        floor: 1,
        capacity: 1,
        view: '',
        luas: 0,
        owner: '',
        tenant: null,
        rent_type: 'flexible',
        price_daily: 0,
        price_monthly: 0,
        price_yearly: 0,
    });

    const [errors, setErrors] = useState<Partial<Record<keyof RoomFormData, string>>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Load edit data
    useEffect(() => {
        if (editData) {
            setFormData(editData);
        } else {
            setFormData({
                name: '',
                type: '',
                tower: '',
                floor: 1,
                capacity: 1,
                view: '',
                luas: 0,
                owner: '',
                tenant: null,
                rent_type: 'flexible',
                price_daily: 0,
                price_monthly: 0,
                price_yearly: 0,
            });
        }
        setErrors({});
    }, [editData, isOpen]);

    const typeOptions = [
        { value: '', label: 'Select unit type' },
        { value: 'Standard', label: 'Standard' },
        { value: 'Studio', label: 'Studio' },
        { value: 'Deluxe', label: 'Deluxe' },
        { value: 'Suite', label: 'Suite' },
        { value: 'Penthouse', label: 'Penthouse' },
    ];

    const rentTypeOptions = [
        { value: 'flexible', label: 'Flexible (Daily + Monthly + Yearly)' },
        { value: 'daily', label: 'Daily Only' },
        { value: 'monthly', label: 'Monthly Only' },
        { value: 'yearly', label: 'Yearly Only' },
    ];

    const viewOptions = [
        { value: '', label: 'Select view' },
        { value: 'City View', label: 'City View' },
        { value: 'Ocean View', label: 'Ocean View' },
        { value: 'Garden View', label: 'Garden View' },
        { value: 'Pool View', label: 'Pool View' },
        { value: 'Mountain View', label: 'Mountain View' },
        { value: 'No View', label: 'No View' },
    ];

    // Mock owners from contacts (type = Owner)
    const ownerOptions = [
        { value: '', label: 'Select owner' },
        { value: 'PT Properti Indah', label: 'PT Properti Indah' },
        { value: 'Budi Santoso', label: 'Budi Santoso' },
        { value: 'CV Investasi Jaya', label: 'CV Investasi Jaya' },
    ];

    // Mock tenants from contacts (type = Customer, status = Active)
    const tenantOptions = [
        { value: '', label: 'No tenant (Available)' },
        { value: 'John Doe', label: 'John Doe' },
        { value: 'Sarah Wilson', label: 'Sarah Wilson' },
        { value: 'Michael Chen', label: 'Michael Chen' },
    ];

    const validate = (): boolean => {
        const newErrors: Partial<Record<keyof RoomFormData, string>> = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Unit name is required';
        }

        if (!formData.type) {
            newErrors.type = 'Unit type is required';
        }

        if (!formData.tower.trim()) {
            newErrors.tower = 'Tower is required';
        }

        if (formData.floor < 0) {
            newErrors.floor = 'Floor cannot be negative';
        }

        if (!formData.capacity || formData.capacity < 1) {
            newErrors.capacity = 'Capacity must be at least 1';
        }

        if (!formData.view) {
            newErrors.view = 'View is required';
        }

        if (!formData.luas || formData.luas < 1) {
            newErrors.luas = 'Size must be greater than 0';
        }

        if (!formData.owner) {
            newErrors.owner = 'Owner is required';
        }

        // Validate prices based on rent_type
        if (formData.rent_type === 'flexible') {
            if (!formData.price_daily || formData.price_daily < 1) {
                newErrors.price_daily = 'Daily price is required for flexible';
            }
            if (!formData.price_monthly || formData.price_monthly < 1) {
                newErrors.price_monthly = 'Monthly price is required for flexible';
            }
            if (!formData.price_yearly || formData.price_yearly < 1) {
                newErrors.price_yearly = 'Yearly price is required for flexible';
            }
        } else if (formData.rent_type === 'daily') {
            if (!formData.price_daily || formData.price_daily < 1) {
                newErrors.price_daily = 'Daily price is required';
            }
        } else if (formData.rent_type === 'monthly') {
            if (!formData.price_monthly || formData.price_monthly < 1) {
                newErrors.price_monthly = 'Monthly price is required';
            }
        } else if (formData.rent_type === 'yearly') {
            if (!formData.price_yearly || formData.price_yearly < 1) {
                newErrors.price_yearly = 'Yearly price is required';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) {
            return;
        }

        setIsSubmitting(true);

        // Clean up prices based on rent_type
        const submitData = { ...formData };
        if (formData.rent_type === 'daily') {
            submitData.price_monthly = 0;
            submitData.price_yearly = 0;
        } else if (formData.rent_type === 'monthly') {
            submitData.price_daily = 0;
            submitData.price_yearly = 0;
        } else if (formData.rent_type === 'yearly') {
            submitData.price_daily = 0;
            submitData.price_monthly = 0;
        }

        setTimeout(() => {
            onSubmit(submitData);
            setIsSubmitting(false);
            handleClose();
        }, 1000);
    };

    const handleClose = () => {
        setFormData({
            name: '',
            type: '',
            tower: '',
            floor: 1,
            capacity: 1,
            view: '',
            luas: 0,
            owner: '',
            tenant: null,
            rent_type: 'flexible',
            price_daily: 0,
            price_monthly: 0,
            price_yearly: 0,
        });
        setErrors({});
        onClose();
    };

    const shouldShowPrice = (priceType: 'daily' | 'monthly' | 'yearly') => {
        if (formData.rent_type === 'flexible') return true;
        return formData.rent_type === priceType;
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title={editData ? 'Edit Unit' : 'Add New Unit'}
            description={editData ? 'Update unit information' : 'Fill in the unit details'}
            size="lg"
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Unit Name */}
                <Input
                    label="Unit Name"
                    type="text"
                    placeholder="e.g., Unit 305-A"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    error={errors.name}
                    required
                    leftIcon={<Home className="w-5 h-5" />}
                />

                {/* Type and Tower */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Select
                        label="Unit Type"
                        options={typeOptions}
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        error={errors.type}
                        required
                    />

                    <Input
                        label="Tower / Building"
                        type="text"
                        placeholder="e.g., Tower A"
                        value={formData.tower}
                        onChange={(e) => setFormData({ ...formData, tower: e.target.value })}
                        error={errors.tower}
                        required
                        leftIcon={<Building className="w-5 h-5" />}
                    />
                </div>

                {/* Floor and Capacity */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        label="Floor"
                        type="number"
                        placeholder="e.g., 3"
                        value={formData.floor || ''}
                        onChange={(e) => setFormData({ ...formData, floor: parseInt(e.target.value) || 0 })}
                        error={errors.floor}
                        required
                        helperText="Ground floor = 0"
                    />

                    <Input
                        label="Capacity (persons)"
                        type="number"
                        placeholder="e.g., 2"
                        value={formData.capacity || ''}
                        onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 0 })}
                        error={errors.capacity}
                        required
                        leftIcon={<User className="w-5 h-5" />}
                    />
                </div>

                {/* View and Size */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Select
                        label="View"
                        options={viewOptions}
                        value={formData.view}
                        onChange={(e) => setFormData({ ...formData, view: e.target.value })}
                        error={errors.view}
                        required
                    />

                    <Input
                        label="Size (m²)"
                        type="number"
                        placeholder="e.g., 35"
                        value={formData.luas || ''}
                        onChange={(e) => setFormData({ ...formData, luas: parseFloat(e.target.value) || 0 })}
                        error={errors.luas}
                        required
                        leftIcon={<Maximize className="w-5 h-5" />}
                    />
                </div>

                {/* Owner and Tenant */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Select
                        label="Owner"
                        options={ownerOptions}
                        value={formData.owner}
                        onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                        error={errors.owner}
                        required
                        helperText="From contacts (type = Owner)"
                    />

                    <Select
                        label="Tenant"
                        options={tenantOptions}
                        value={formData.tenant || ''}
                        onChange={(e) => setFormData({ ...formData, tenant: e.target.value || null })}
                        helperText="Optional - From active customers"
                    />
                </div>

                {/* Rent Type */}
                <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">
                        Pricing Information
                    </h3>
                    <Select
                        label="Rent Type"
                        options={rentTypeOptions}
                        value={formData.rent_type}
                        onChange={(e) => setFormData({ ...formData, rent_type: e.target.value as any })}
                        required
                        helperText="Select which rent periods are available"
                    />
                </div>

                {/* Dynamic Price Fields */}
                <div className="space-y-4">
                    {shouldShowPrice('daily') && (
                        <Input
                            label="Daily Price (Rp)"
                            type="number"
                            placeholder="e.g., 500000"
                            value={formData.price_daily || ''}
                            onChange={(e) => setFormData({ ...formData, price_daily: parseFloat(e.target.value) || 0 })}
                            error={errors.price_daily}
                            required={formData.rent_type === 'daily' || formData.rent_type === 'flexible'}
                            leftIcon={<DollarSign className="w-5 h-5" />}
                        />
                    )}

                    {shouldShowPrice('monthly') && (
                        <Input
                            label="Monthly Price (Rp)"
                            type="number"
                            placeholder="e.g., 5000000"
                            value={formData.price_monthly || ''}
                            onChange={(e) => setFormData({ ...formData, price_monthly: parseFloat(e.target.value) || 0 })}
                            error={errors.price_monthly}
                            required={formData.rent_type === 'monthly' || formData.rent_type === 'flexible'}
                            leftIcon={<DollarSign className="w-5 h-5" />}
                        />
                    )}

                    {shouldShowPrice('yearly') && (
                        <Input
                            label="Yearly Price (Rp)"
                            type="number"
                            placeholder="e.g., 50000000"
                            value={formData.price_yearly || ''}
                            onChange={(e) => setFormData({ ...formData, price_yearly: parseFloat(e.target.value) || 0 })}
                            error={errors.price_yearly}
                            required={formData.rent_type === 'yearly' || formData.rent_type === 'flexible'}
                            leftIcon={<DollarSign className="w-5 h-5" />}
                        />
                    )}
                </div>

                {/* Pricing Summary */}
                {(formData.price_daily > 0 || formData.price_monthly > 0 || formData.price_yearly > 0) && (
                    <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-200 dark:border-indigo-800">
                        <p className="text-sm font-semibold text-indigo-900 dark:text-indigo-100 mb-2">
                            Pricing Summary:
                        </p>
                        <div className="space-y-1 text-xs text-indigo-800 dark:text-indigo-200">
                            {formData.price_daily > 0 && (
                                <p>Daily: <span className="font-bold">Rp {formData.price_daily.toLocaleString('id-ID')}</span></p>
                            )}
                            {formData.price_monthly > 0 && (
                                <p>Monthly: <span className="font-bold">Rp {formData.price_monthly.toLocaleString('id-ID')}</span></p>
                            )}
                            {formData.price_yearly > 0 && (
                                <p>Yearly: <span className="font-bold">Rp {formData.price_yearly.toLocaleString('id-ID')}</span></p>
                            )}
                        </div>
                    </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleClose}
                        className="flex-1"
                        disabled={isSubmitting}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        className="flex-1"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (editData ? 'Updating...' : 'Adding...') : (editData ? 'Update Unit' : 'Add Unit')}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}