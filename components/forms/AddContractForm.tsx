'use client';

import { useState, useEffect } from 'react';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import { formatCurrency } from '@/utils/currency';
import { formatDate, getDaysBetween } from '@/utils/date';
import { FileText, User, Building, Home, Calendar, DollarSign, Clock } from 'lucide-react';

interface AddContractFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: ContractFormData) => void;
    editData?: ContractFormData | null;
}

export interface ContractFormData {
    name_customer: string;
    name_owner: string;
    property: string;
    room_unit: string;
    date_check_in: string;
    date_check_out: string;
    rent_type: 'flexible' | 'daily' | 'monthly' | 'yearly';
    days_remaining: number;
    amount_rent: number;
}

export default function AddContractForm({
                                            isOpen,
                                            onClose,
                                            onSubmit,
                                            editData,
                                        }: AddContractFormProps) {
    const [formData, setFormData] = useState<ContractFormData>({
        name_customer: '',
        name_owner: '',
        property: '',
        room_unit: '',
        date_check_in: '',
        date_check_out: '',
        rent_type: 'monthly',
        days_remaining: 0,
        amount_rent: 0,
    });

    const [errors, setErrors] = useState<Partial<Record<keyof ContractFormData, string>>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Load edit data
    useEffect(() => {
        if (editData) {
            setFormData(editData);
        } else {
            setFormData({
                name_customer: '',
                name_owner: '',
                property: '',
                room_unit: '',
                date_check_in: '',
                date_check_out: '',
                rent_type: 'monthly',
                days_remaining: 0,
                amount_rent: 0,
            });
        }
        setErrors({});
    }, [editData, isOpen]);

    // Auto-calculate days remaining when dates change
    useEffect(() => {
        if (formData.date_check_out) {
            const days = getDaysBetween(formData.date_check_out);
            setFormData(prev => ({ ...prev, days_remaining: days }));
        }
    }, [formData.date_check_out]);

    // Customer options (FK from contacts: type=customer & status=active)
    const customerOptions = [
        { value: '', label: 'Select customer' },
        { value: 'John Doe', label: 'John Doe' },
        { value: 'Sarah Wilson', label: 'Sarah Wilson' },
        { value: 'Michael Chen', label: 'Michael Chen' },
        { value: 'Lisa Wong', label: 'Lisa Wong' },
    ];

    // Owner options (FK from contacts: type=owner)
    const ownerOptions = [
        { value: '', label: 'Select owner' },
        { value: 'PT Properti Indah', label: 'PT Properti Indah' },
        { value: 'Budi Santoso', label: 'Budi Santoso' },
        { value: 'CV Investasi Jaya', label: 'CV Investasi Jaya' },
    ];

    // Property options (FK from properties)
    const propertyOptions = [
        { value: '', label: 'Select property' },
        { value: 'Menteng Residence', label: 'Menteng Residence' },
        { value: 'BSD City Apartment', label: 'BSD City Apartment' },
        { value: 'Kemang Suites', label: 'Kemang Suites' },
        { value: 'Sudirman Park', label: 'Sudirman Park' },
    ];

    // Room/Unit options (FK from rooms)
    const roomOptions = [
        { value: '', label: 'Select room/unit' },
        { value: 'Unit 305-A', label: 'Unit 305-A' },
        { value: 'Unit 201-B', label: 'Unit 201-B' },
        { value: 'Unit 502-C', label: 'Unit 502-C' },
        { value: 'Unit 104-A', label: 'Unit 104-A' },
    ];

    const rentTypeOptions = [
        { value: 'flexible', label: 'Flexible (Any duration)' },
        { value: 'daily', label: 'Daily' },
        { value: 'monthly', label: 'Monthly' },
        { value: 'yearly', label: 'Yearly' },
    ];

    const validate = (): boolean => {
        const newErrors: Partial<Record<keyof ContractFormData, string>> = {};

        if (!formData.name_customer) {
            newErrors.name_customer = 'Customer is required';
        }

        if (!formData.name_owner) {
            newErrors.name_owner = 'Owner is required';
        }

        if (!formData.property) {
            newErrors.property = 'Property is required';
        }

        if (!formData.room_unit) {
            newErrors.room_unit = 'Room/unit is required';
        }

        if (!formData.date_check_in) {
            newErrors.date_check_in = 'Check-in date is required';
        }

        if (!formData.date_check_out) {
            newErrors.date_check_out = 'Check-out date is required';
        }

        if (formData.date_check_in && formData.date_check_out) {
            if (new Date(formData.date_check_out) <= new Date(formData.date_check_in)) {
                newErrors.date_check_out = 'Check-out must be after check-in';
            }
        }

        if (!formData.amount_rent || formData.amount_rent < 1) {
            newErrors.amount_rent = 'Rent amount is required';
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

        setTimeout(() => {
            onSubmit(formData);
            setIsSubmitting(false);
            handleClose();
        }, 1000);
    };

    const handleClose = () => {
        setFormData({
            name_customer: '',
            name_owner: '',
            property: '',
            room_unit: '',
            date_check_in: '',
            date_check_out: '',
            rent_type: 'monthly',
            days_remaining: 0,
            amount_rent: 0,
        });
        setErrors({});
        onClose();
    };

    const getContractDuration = () => {
        if (!formData.date_check_in || !formData.date_check_out) return null;

        const days = Math.abs(getDaysBetween(formData.date_check_in, formData.date_check_out));

        if (days <= 7) return `${days} days (Daily)`;
        if (days <= 60) {
            const months = Math.round(days / 30);
            return `${months} month${months > 1 ? 's' : ''} (Monthly)`;
        }
        const years = Math.round(days / 365);
        return `${years} year${years > 1 ? 's' : ''} (Yearly)`;
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title={editData ? 'Edit Contract' : 'Create New Contract'}
            description={editData ? 'Update contract information' : 'Fill in the contract details'}
            size="lg"
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Customer and Owner */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Select
                        label="Customer"
                        options={customerOptions}
                        value={formData.name_customer}
                        onChange={(e) => setFormData({ ...formData, name_customer: e.target.value })}
                        error={errors.name_customer}
                        required
                        helperText="FK: contact (type=customer & status=active)"
                    />

                    <Select
                        label="Owner"
                        options={ownerOptions}
                        value={formData.name_owner}
                        onChange={(e) => setFormData({ ...formData, name_owner: e.target.value })}
                        error={errors.name_owner}
                        required
                        helperText="FK: contact (type=owner)"
                    />
                </div>

                {/* Property and Room/Unit */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Select
                        label="Property"
                        options={propertyOptions}
                        value={formData.property}
                        onChange={(e) => setFormData({ ...formData, property: e.target.value })}
                        error={errors.property}
                        required
                        helperText="FK: properties table"
                    />

                    <Select
                        label="Room/Unit"
                        options={roomOptions}
                        value={formData.room_unit}
                        onChange={(e) => setFormData({ ...formData, room_unit: e.target.value })}
                        error={errors.room_unit}
                        required
                        helperText="FK: rooms table"
                    />
                </div>

                {/* Check-in and Check-out Dates */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        label="Check-in Date"
                        type="date"
                        value={formData.date_check_in}
                        onChange={(e) => setFormData({ ...formData, date_check_in: e.target.value })}
                        error={errors.date_check_in}
                        required
                        leftIcon={<Calendar className="w-5 h-5" />}
                    />

                    <Input
                        label="Check-out Date"
                        type="date"
                        value={formData.date_check_out}
                        onChange={(e) => setFormData({ ...formData, date_check_out: e.target.value })}
                        error={errors.date_check_out}
                        required
                        leftIcon={<Calendar className="w-5 h-5" />}
                    />
                </div>

                {/* Contract Duration Info */}
                {formData.date_check_in && formData.date_check_out && (
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                        <div className="flex items-center gap-2 text-sm text-blue-900 dark:text-blue-100">
                            <Clock className="w-4 h-4" />
                            <div>
                                <p className="font-semibold">Contract Duration: {getContractDuration()}</p>
                                <p className="text-xs mt-1">
                                    Days remaining: <span className="font-bold">{formData.days_remaining}</span>
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Rent Type */}
                <Select
                    label="Rent Type"
                    options={rentTypeOptions}
                    value={formData.rent_type}
                    onChange={(e) => setFormData({ ...formData, rent_type: e.target.value as any })}
                    required
                    helperText="Payment frequency"
                />

                {/* Rent Amount */}
                <Input
                    label="Rent Amount (Rp)"
                    type="number"
                    placeholder="e.g., 5000000"
                    value={formData.amount_rent || ''}
                    onChange={(e) => setFormData({ ...formData, amount_rent: parseFloat(e.target.value) || 0 })}
                    error={errors.amount_rent}
                    required
                    leftIcon={<DollarSign className="w-5 h-5" />}
                    helperText={`${formData.rent_type === 'daily' ? 'Per day' :
                        formData.rent_type === 'monthly' ? 'Per month' :
                            formData.rent_type === 'yearly' ? 'Per year' :
                                'Total amount'}`}
                />

                {/* Contract Summary */}
                {formData.name_customer && formData.property && formData.amount_rent > 0 && (
                    <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-200 dark:border-indigo-800">
                        <p className="text-sm font-semibold text-indigo-900 dark:text-indigo-100 mb-2">
                            Contract Summary:
                        </p>
                        <div className="space-y-1 text-xs text-indigo-800 dark:text-indigo-200">
                            <p>
                                <span className="font-semibold">{formData.name_customer}</span> will rent{' '}
                                <span className="font-semibold">{formData.room_unit || 'a unit'}</span>
                            </p>
                            <p>
                                at <span className="font-semibold">{formData.property}</span>
                            </p>
                            {formData.date_check_in && formData.date_check_out && (
                                <p>
                                    from <span className="font-semibold">{formatDate(formData.date_check_in)}</span> to{' '}
                                    <span className="font-semibold">{formatDate(formData.date_check_out)}</span>
                                </p>
                            )}
                            <p>
                                for <span className="font-semibold">{formatCurrency(formData.amount_rent)}</span>{' '}
                                ({formData.rent_type})
                            </p>
                            <p className="text-xs mt-2 pt-2 border-t border-indigo-300 dark:border-indigo-700">
                                Owner: <span className="font-semibold">{formData.name_owner || '-'}</span>
                            </p>
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
                        {isSubmitting ? (editData ? 'Updating...' : 'Creating...') : (editData ? 'Update Contract' : 'Create Contract')}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}