'use client';

import { useState } from 'react';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import { FileText, User, DollarSign, Calendar } from 'lucide-react';

interface AddInvoiceFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: InvoiceFormData) => void;
    tenants?: { id: string; name: string }[];
}

export interface InvoiceFormData {
    tenantId: string;
    invoiceType: string;
    amount: number;
    dueDate: string;
    issueDate: string;
    description?: string;
    status: string;
}

export default function AddInvoiceForm({
                                           isOpen,
                                           onClose,
                                           onSubmit,
                                           tenants = [],
                                       }: AddInvoiceFormProps) {
    const [formData, setFormData] = useState<InvoiceFormData>({
        tenantId: '',
        invoiceType: '',
        amount: 0,
        dueDate: '',
        issueDate: new Date().toISOString().split('T')[0],
        description: '',
        status: 'pending',
    });

    const [errors, setErrors] = useState<Partial<Record<keyof InvoiceFormData, string>>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const invoiceTypes = [
        { value: '', label: 'Select invoice type' },
        { value: 'rent', label: 'Monthly Rent' },
        { value: 'electricity', label: 'Electricity Bill' },
        { value: 'water', label: 'Water Bill' },
        { value: 'internet', label: 'Internet Bill' },
        { value: 'maintenance', label: 'Maintenance Fee' },
        { value: 'parking', label: 'Parking Fee' },
        { value: 'other', label: 'Other' },
    ];

    const tenantOptions = [
        { value: '', label: 'Select tenant' },
        ...tenants.map(t => ({ value: t.id, label: t.name })),
    ];

    const statusOptions = [
        { value: 'pending', label: 'Pending' },
        { value: 'paid', label: 'Paid' },
        { value: 'overdue', label: 'Overdue' },
        { value: 'cancelled', label: 'Cancelled' },
    ];

    const validate = (): boolean => {
        const newErrors: Partial<Record<keyof InvoiceFormData, string>> = {};

        if (!formData.tenantId) {
            newErrors.tenantId = 'Please select a tenant';
        }

        if (!formData.invoiceType) {
            newErrors.invoiceType = 'Invoice type is required';
        }

        if (!formData.amount || formData.amount < 1) {
            newErrors.amount = 'Amount must be greater than 0';
        }

        if (!formData.issueDate) {
            newErrors.issueDate = 'Issue date is required';
        }

        if (!formData.dueDate) {
            newErrors.dueDate = 'Due date is required';
        }

        if (formData.issueDate && formData.dueDate) {
            if (new Date(formData.dueDate) < new Date(formData.issueDate)) {
                newErrors.dueDate = 'Due date cannot be before issue date';
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

        setTimeout(() => {
            onSubmit(formData);
            setIsSubmitting(false);
            handleClose();
        }, 1000);
    };

    const handleClose = () => {
        setFormData({
            tenantId: '',
            invoiceType: '',
            amount: 0,
            dueDate: '',
            issueDate: new Date().toISOString().split('T')[0],
            description: '',
            status: 'pending',
        });
        setErrors({});
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title="Create New Invoice"
            description="Generate invoice for tenant"
            size="lg"
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Tenant Selection */}
                <Select
                    label="Tenant"
                    options={tenantOptions}
                    value={formData.tenantId}
                    onChange={(e) => setFormData({ ...formData, tenantId: e.target.value })}
                    error={errors.tenantId}
                    required
                />

                {/* Invoice Type and Status */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Select
                        label="Invoice Type"
                        options={invoiceTypes}
                        value={formData.invoiceType}
                        onChange={(e) => setFormData({ ...formData, invoiceType: e.target.value })}
                        error={errors.invoiceType}
                        required
                    />

                    <Select
                        label="Status"
                        options={statusOptions}
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        required
                    />
                </div>

                {/* Amount */}
                <Input
                    label="Amount (Rp)"
                    type="number"
                    placeholder="e.g., 5000000"
                    value={formData.amount || ''}
                    onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                    error={errors.amount}
                    required
                    leftIcon={<DollarSign className="w-5 h-5" />}
                />

                {/* Issue Date and Due Date */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        label="Issue Date"
                        type="date"
                        value={formData.issueDate}
                        onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                        error={errors.issueDate}
                        required
                        leftIcon={<Calendar className="w-5 h-5" />}
                    />

                    <Input
                        label="Due Date"
                        type="date"
                        value={formData.dueDate}
                        onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                        error={errors.dueDate}
                        required
                        leftIcon={<Calendar className="w-5 h-5" />}
                    />
                </div>

                {/* Description */}
                <Textarea
                    label="Description / Notes"
                    placeholder="Additional notes or description for this invoice"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    helperText="Optional: Add details about this invoice"
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
                        {isSubmitting ? 'Creating...' : 'Create Invoice'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}