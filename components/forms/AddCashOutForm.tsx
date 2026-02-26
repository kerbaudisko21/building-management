'use client';

import { useState } from 'react';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import { DollarSign, User, Calendar, FileText } from 'lucide-react';

interface AddCashOutFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: CashOutFormData) => void;
}

export interface CashOutFormData {
    category: string;
    description: string;
    amount: number;
    paymentMethod: string;
    vendor: string;
    date: string;
    notes?: string;
}

export default function AddCashOutForm({ isOpen, onClose, onSubmit }: AddCashOutFormProps) {
    const [formData, setFormData] = useState<CashOutFormData>({
        category: '',
        description: '',
        amount: 0,
        paymentMethod: '',
        vendor: '',
        date: new Date().toISOString().split('T')[0],
        notes: '',
    });

    const [errors, setErrors] = useState<Partial<Record<keyof CashOutFormData, string>>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const categoryOptions = [
        { value: '', label: 'Select category' },
        { value: 'Maintenance', label: 'Maintenance' },
        { value: 'Utilities', label: 'Utilities' },
        { value: 'Cleaning', label: 'Cleaning' },
        { value: 'Supplies', label: 'Supplies' },
        { value: 'Salary', label: 'Salary' },
        { value: 'Marketing', label: 'Marketing' },
        { value: 'Insurance', label: 'Insurance' },
        { value: 'Tax', label: 'Tax' },
        { value: 'Other', label: 'Other Expense' },
    ];

    const paymentMethodOptions = [
        { value: '', label: 'Select payment method' },
        { value: 'Bank Transfer', label: 'Bank Transfer' },
        { value: 'Cash', label: 'Cash' },
        { value: 'E-Wallet', label: 'E-Wallet' },
        { value: 'Debit Card', label: 'Debit Card' },
        { value: 'Credit Card', label: 'Credit Card' },
        { value: 'Check', label: 'Check' },
    ];

    const validate = (): boolean => {
        const newErrors: Partial<Record<keyof CashOutFormData, string>> = {};

        if (!formData.category) {
            newErrors.category = 'Category is required';
        }

        if (!formData.description.trim()) {
            newErrors.description = 'Description is required';
        }

        if (!formData.amount || formData.amount < 1) {
            newErrors.amount = 'Amount must be greater than 0';
        }

        if (!formData.paymentMethod) {
            newErrors.paymentMethod = 'Payment method is required';
        }

        if (!formData.vendor.trim()) {
            newErrors.vendor = 'Vendor/payee is required';
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
            description: '',
            amount: 0,
            paymentMethod: '',
            vendor: '',
            date: new Date().toISOString().split('T')[0],
            notes: '',
        });
        setErrors({});
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title="Add Expense Transaction"
            description="Record a new expense/payment made"
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

                {/* Description */}
                <Input
                    label="Description"
                    type="text"
                    placeholder="e.g., AC Repair - Room 305"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    error={errors.description}
                    required
                    leftIcon={<FileText className="w-5 h-5" />}
                />

                {/* Vendor */}
                <Input
                    label="Vendor / Payee"
                    type="text"
                    placeholder="e.g., Cool Air Services, PLN"
                    value={formData.vendor}
                    onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
                    error={errors.vendor}
                    required
                    leftIcon={<User className="w-5 h-5" />}
                />

                {/* Amount and Date */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        label="Amount (Rp)"
                        type="number"
                        placeholder="e.g., 750000"
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

                {/* Notes */}
                <Textarea
                    label="Additional Notes"
                    placeholder="Any additional details about this expense"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
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
                        {isSubmitting ? 'Recording...' : 'Record Expense'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}