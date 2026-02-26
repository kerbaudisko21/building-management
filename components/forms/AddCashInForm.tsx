'use client';

import { useState } from 'react';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import { DollarSign, User, Calendar, FileText } from 'lucide-react';

interface AddCashInFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: CashInFormData) => void;
}

export interface CashInFormData {
    category: string;
    source: string;
    amount: number;
    paymentMethod: string;
    reference: string;
    date: string;
    description?: string;
}

export default function AddCashInForm({ isOpen, onClose, onSubmit }: AddCashInFormProps) {
    const [formData, setFormData] = useState<CashInFormData>({
        category: '',
        source: '',
        amount: 0,
        paymentMethod: '',
        reference: '',
        date: new Date().toISOString().split('T')[0],
        description: '',
    });

    const [errors, setErrors] = useState<Partial<Record<keyof CashInFormData, string>>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const categoryOptions = [
        { value: '', label: 'Select category' },
        { value: 'Rent Payment', label: 'Rent Payment' },
        { value: 'Deposit', label: 'Deposit' },
        { value: 'Utility Bills', label: 'Utility Bills' },
        { value: 'Parking Fee', label: 'Parking Fee' },
        { value: 'Late Fee', label: 'Late Fee' },
        { value: 'Other', label: 'Other Income' },
    ];

    const paymentMethodOptions = [
        { value: '', label: 'Select payment method' },
        { value: 'Bank Transfer', label: 'Bank Transfer' },
        { value: 'Cash', label: 'Cash' },
        { value: 'E-Wallet', label: 'E-Wallet (GoPay, OVO, Dana)' },
        { value: 'Debit Card', label: 'Debit Card' },
        { value: 'Credit Card', label: 'Credit Card' },
    ];

    const validate = (): boolean => {
        const newErrors: Partial<Record<keyof CashInFormData, string>> = {};

        if (!formData.category) {
            newErrors.category = 'Category is required';
        }

        if (!formData.source.trim()) {
            newErrors.source = 'Source is required';
        }

        if (!formData.amount || formData.amount < 1) {
            newErrors.amount = 'Amount must be greater than 0';
        }

        if (!formData.paymentMethod) {
            newErrors.paymentMethod = 'Payment method is required';
        }

        if (!formData.reference.trim()) {
            newErrors.reference = 'Reference number is required';
        }

        if (!formData.date) {
            newErrors.date = 'Date is required';
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
            category: '',
            source: '',
            amount: 0,
            paymentMethod: '',
            reference: '',
            date: new Date().toISOString().split('T')[0],
            description: '',
        });
        setErrors({});
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title="Add Income Transaction"
            description="Record a new income/payment received"
            size="lg"
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Category */}
                <Select
                    label="Category"
                    options={categoryOptions}
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    error={errors.category}
                    required
                />

                {/* Source */}
                <Input
                    label="Source"
                    type="text"
                    placeholder="e.g., John Doe - Room 305"
                    value={formData.source}
                    onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                    error={errors.source}
                    required
                    leftIcon={<User className="w-5 h-5" />}
                    helperText="Tenant name and room number"
                />

                {/* Amount and Date */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        label="Amount (Rp)"
                        type="number"
                        placeholder="e.g., 3500000"
                        value={formData.amount ?? ''}
                        onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                        error={errors.amount}
                        required
                        leftIcon={<DollarSign className="w-5 h-5" />}
                    />

                    <Input
                        label="Date"
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        error={errors.date}
                        required
                        leftIcon={<Calendar className="w-5 h-5" />}
                    />
                </div>

                {/* Payment Method */}
                <Select
                    label="Payment Method"
                    options={paymentMethodOptions}
                    value={formData.paymentMethod}
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                    error={errors.paymentMethod}
                    required
                />

                {/* Reference Number */}
                <Input
                    label="Reference Number"
                    type="text"
                    placeholder="e.g., TRF-20241208-001"
                    value={formData.reference}
                    onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                    error={errors.reference}
                    required
                    leftIcon={<FileText className="w-5 h-5" />}
                    helperText="Transaction ID or reference number"
                />

                {/* Description */}
                <Textarea
                    label="Description / Notes"
                    placeholder="Additional notes about this transaction"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    helperText="Optional: Add any relevant details"
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
                        {isSubmitting ? 'Recording...' : 'Record Income'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}