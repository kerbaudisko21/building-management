'use client';

import { useState } from 'react';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import { FileText, User, Home, Calendar, DollarSign } from 'lucide-react';

interface AddContractFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: ContractFormData) => void;
    tenants?: { id: string; name: string }[];
    rooms?: { id: string; name: string }[];
}

export interface ContractFormData {
    tenantId: string;
    roomId: string;
    startDate: string;
    endDate: string;
    monthlyRent: number;
    depositAmount: number;
    contractType: string;
    paymentDueDate: number;
    terms?: string;
}

export default function AddContractForm({
                                            isOpen,
                                            onClose,
                                            onSubmit,
                                            tenants = [],
                                            rooms = [],
                                        }: AddContractFormProps) {
    const [formData, setFormData] = useState<ContractFormData>({
        tenantId: '',
        roomId: '',
        startDate: '',
        endDate: '',
        monthlyRent: 0,
        depositAmount: 0,
        contractType: '',
        paymentDueDate: 1,
        terms: '',
    });

    const [errors, setErrors] = useState<Partial<Record<keyof ContractFormData, string>>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const contractTypes = [
        { value: '', label: 'Select contract type' },
        { value: '1-year', label: '1 Year Contract' },
        { value: '6-months', label: '6 Months Contract' },
        { value: '3-months', label: '3 Months Contract' },
        { value: 'monthly', label: 'Monthly Contract' },
    ];

    const tenantOptions = [
        { value: '', label: 'Select tenant' },
        ...tenants.map(t => ({ value: t.id, label: t.name })),
    ];

    const roomOptions = [
        { value: '', label: 'Select room' },
        ...rooms.map(r => ({ value: r.id, label: r.name })),
    ];

    const dueDateOptions = Array.from({ length: 28 }, (_, i) => ({
        value: (i + 1).toString(),
        label: `Day ${i + 1}`,
    }));
    dueDateOptions.unshift({ value: '', label: 'Select due date' });

    const validate = (): boolean => {
        const newErrors: Partial<Record<keyof ContractFormData, string>> = {};

        if (!formData.tenantId) {
            newErrors.tenantId = 'Please select a tenant';
        }

        if (!formData.roomId) {
            newErrors.roomId = 'Please select a room';
        }

        if (!formData.startDate) {
            newErrors.startDate = 'Start date is required';
        }

        if (!formData.endDate) {
            newErrors.endDate = 'End date is required';
        }

        if (formData.startDate && formData.endDate) {
            if (new Date(formData.endDate) <= new Date(formData.startDate)) {
                newErrors.endDate = 'End date must be after start date';
            }
        }

        if (!formData.monthlyRent || formData.monthlyRent < 1) {
            newErrors.monthlyRent = 'Monthly rent is required';
        }

        if (!formData.depositAmount || formData.depositAmount < 0) {
            newErrors.depositAmount = 'Deposit amount is required';
        }

        if (!formData.contractType) {
            newErrors.contractType = 'Contract type is required';
        }

        if (!formData.paymentDueDate || formData.paymentDueDate < 1 || formData.paymentDueDate > 28) {
            newErrors.paymentDueDate = 'Payment due date must be between 1-28';
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
            tenantId: '',
            roomId: '',
            startDate: '',
            endDate: '',
            monthlyRent: 0,
            depositAmount: 0,
            contractType: '',
            paymentDueDate: 1,
            terms: '',
        });
        setErrors({});
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title="Create New Contract"
            description="Fill in the contract details"
            size="lg"
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Tenant and Room Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Select
                        label="Tenant"
                        options={tenantOptions}
                        value={formData.tenantId}
                        onChange={(e) => setFormData({ ...formData, tenantId: e.target.value })}
                        error={errors.tenantId}
                        required
                    />

                    <Select
                        label="Room"
                        options={roomOptions}
                        value={formData.roomId}
                        onChange={(e) => setFormData({ ...formData, roomId: e.target.value })}
                        error={errors.roomId}
                        required
                    />
                </div>

                {/* Contract Type */}
                <Select
                    label="Contract Type"
                    options={contractTypes}
                    value={formData.contractType}
                    onChange={(e) => setFormData({ ...formData, contractType: e.target.value })}
                    error={errors.contractType}
                    required
                />

                {/* Start and End Date */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        label="Start Date"
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                        error={errors.startDate}
                        required
                        leftIcon={<Calendar className="w-5 h-5" />}
                    />

                    <Input
                        label="End Date"
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                        error={errors.endDate}
                        required
                        leftIcon={<Calendar className="w-5 h-5" />}
                    />
                </div>

                {/* Monthly Rent and Deposit */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        label="Monthly Rent (Rp)"
                        type="number"
                        placeholder="e.g., 5000000"
                        value={formData.monthlyRent || ''}
                        onChange={(e) => setFormData({ ...formData, monthlyRent: parseFloat(e.target.value) || 0 })}
                        error={errors.monthlyRent}
                        required
                        leftIcon={<DollarSign className="w-5 h-5" />}
                    />

                    <Input
                        label="Deposit Amount (Rp)"
                        type="number"
                        placeholder="e.g., 5000000"
                        value={formData.depositAmount || ''}
                        onChange={(e) => setFormData({ ...formData, depositAmount: parseFloat(e.target.value) || 0 })}
                        error={errors.depositAmount}
                        required
                        leftIcon={<DollarSign className="w-5 h-5" />}
                    />
                </div>

                {/* Payment Due Date */}
                <Select
                    label="Monthly Payment Due Date"
                    options={dueDateOptions}
                    value={formData.paymentDueDate.toString()}
                    onChange={(e) => setFormData({ ...formData, paymentDueDate: parseInt(e.target.value) || 1 })}
                    error={errors.paymentDueDate}
                    required
                    helperText="Day of month when rent payment is due (1-28)"
                />

                {/* Terms and Conditions */}
                <Textarea
                    label="Terms & Conditions"
                    placeholder="Enter contract terms, rules, and conditions"
                    value={formData.terms}
                    onChange={(e) => setFormData({ ...formData, terms: e.target.value })}
                    rows={4}
                    helperText="Optional: Special terms, rules, or conditions"
                />

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
                        {isSubmitting ? 'Creating...' : 'Create Contract'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}