'use client';

import { useState } from 'react';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import { User, Mail, Phone, Briefcase, MapPin } from 'lucide-react';

interface AddTenantFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: TenantFormData) => void;
}

export interface TenantFormData {
    name: string;
    email: string;
    phone: string;
    idNumber?: string;
    occupation?: string;
    company?: string;
    emergencyContact?: string;
    emergencyPhone?: string;
    address?: string;
    notes?: string;
}

export default function AddTenantForm({ isOpen, onClose, onSubmit }: AddTenantFormProps) {
    const [formData, setFormData] = useState<TenantFormData>({
        name: '',
        email: '',
        phone: '',
        idNumber: '',
        occupation: '',
        company: '',
        emergencyContact: '',
        emergencyPhone: '',
        address: '',
        notes: '',
    });

    const [errors, setErrors] = useState<Partial<Record<keyof TenantFormData, string>>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validate = (): boolean => {
        const newErrors: Partial<Record<keyof TenantFormData, string>> = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Invalid email format';
        }

        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone number is required';
        } else if (!/^(\+62|62|0)[0-9]{9,12}$/.test(formData.phone.replace(/[\s-]/g, ''))) {
            newErrors.phone = 'Invalid Indonesian phone number';
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
            name: '',
            email: '',
            phone: '',
            idNumber: '',
            occupation: '',
            company: '',
            emergencyContact: '',
            emergencyPhone: '',
            address: '',
            notes: '',
        });
        setErrors({});
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title="Add New Tenant"
            description="Fill in the tenant information"
            size="lg"
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Personal Information */}
                <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                        Personal Information
                    </h3>

                    <Input
                        label="Full Name"
                        type="text"
                        placeholder="e.g., John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        error={errors.name}
                        required
                        leftIcon={<User className="w-5 h-5" />}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            label="Email"
                            type="email"
                            placeholder="john@example.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            error={errors.email}
                            required
                            leftIcon={<Mail className="w-5 h-5" />}
                        />

                        <Input
                            label="Phone Number"
                            type="tel"
                            placeholder="+62 812 3456 7890"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            error={errors.phone}
                            required
                            leftIcon={<Phone className="w-5 h-5" />}
                        />
                    </div>

                    <Input
                        label="ID Number (KTP/Passport)"
                        type="text"
                        placeholder="e.g., 3201234567890123"
                        value={formData.idNumber}
                        onChange={(e) => setFormData({ ...formData, idNumber: e.target.value })}
                        helperText="Optional: For verification purposes"
                    />
                </div>

                {/* Employment Information */}
                <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                        Employment Information
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            label="Occupation"
                            type="text"
                            placeholder="e.g., Software Engineer"
                            value={formData.occupation}
                            onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                            leftIcon={<Briefcase className="w-5 h-5" />}
                        />

                        <Input
                            label="Company"
                            type="text"
                            placeholder="e.g., Tech Corp"
                            value={formData.company}
                            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        />
                    </div>
                </div>

                {/* Emergency Contact */}
                <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                        Emergency Contact
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            label="Contact Name"
                            type="text"
                            placeholder="e.g., Jane Doe (Mother)"
                            value={formData.emergencyContact}
                            onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                            leftIcon={<User className="w-5 h-5" />}
                        />

                        <Input
                            label="Contact Phone"
                            type="tel"
                            placeholder="+62 812 3456 7890"
                            value={formData.emergencyPhone}
                            onChange={(e) => setFormData({ ...formData, emergencyPhone: e.target.value })}
                            leftIcon={<Phone className="w-5 h-5" />}
                        />
                    </div>
                </div>

                {/* Additional Information */}
                <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                        Additional Information
                    </h3>

                    <Textarea
                        label="Current Address"
                        placeholder="Enter current/permanent address"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        rows={2}
                    />

                    <Textarea
                        label="Notes"
                        placeholder="Any additional notes or special requirements"
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        rows={3}
                    />
                </div>

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
                        {isSubmitting ? 'Adding...' : 'Add Tenant'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}