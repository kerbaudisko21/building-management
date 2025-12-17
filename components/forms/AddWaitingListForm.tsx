'use client';

import { useState } from 'react';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import { User, Mail, Phone, Home, Calendar } from 'lucide-react';

interface AddWaitingListFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: WaitingListFormData) => void;
}

export interface WaitingListFormData {
    name: string;
    email: string;
    phone: string;
    roomType: string;
    moveInDate: string;
    budget: number;
    notes?: string;
    status: string;
}

export default function AddWaitingListForm({ isOpen, onClose, onSubmit }: AddWaitingListFormProps) {
    const [formData, setFormData] = useState<WaitingListFormData>({
        name: '',
        email: '',
        phone: '',
        roomType: '',
        moveInDate: '',
        budget: 0,
        notes: '',
        status: 'waiting',
    });

    const [errors, setErrors] = useState<Partial<Record<keyof WaitingListFormData, string>>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const roomTypeOptions = [
        { value: '', label: 'Select room type' },
        { value: 'standard', label: 'Standard Room' },
        { value: 'deluxe', label: 'Deluxe Room' },
        { value: 'suite', label: 'Suite' },
        { value: 'studio', label: 'Studio' },
        { value: 'any', label: 'Any Available' },
    ];

    const statusOptions = [
        { value: 'waiting', label: 'Waiting' },
        { value: 'contacted', label: 'Contacted' },
        { value: 'interested', label: 'Interested' },
        { value: 'not-interested', label: 'Not Interested' },
    ];

    const validate = (): boolean => {
        const newErrors: Partial<Record<keyof WaitingListFormData, string>> = {};

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

        if (!formData.roomType) {
            newErrors.roomType = 'Room type is required';
        }

        if (!formData.moveInDate) {
            newErrors.moveInDate = 'Move-in date is required';
        }

        if (!formData.budget || formData.budget < 1) {
            newErrors.budget = 'Budget is required';
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
            roomType: '',
            moveInDate: '',
            budget: 0,
            notes: '',
            status: 'waiting',
        });
        setErrors({});
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title="Add to Waiting List"
            description="Add a prospect to the waiting list"
            size="lg"
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name */}
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

                {/* Email and Phone */}
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

                {/* Room Type */}
                <Select
                    label="Preferred Room Type"
                    options={roomTypeOptions}
                    value={formData.roomType}
                    onChange={(e) => setFormData({ ...formData, roomType: e.target.value })}
                    error={errors.roomType}
                    required
                />

                {/* Move-in Date and Budget */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        label="Desired Move-in Date"
                        type="date"
                        value={formData.moveInDate}
                        onChange={(e) => setFormData({ ...formData, moveInDate: e.target.value })}
                        error={errors.moveInDate}
                        required
                        leftIcon={<Calendar className="w-5 h-5" />}
                    />

                    <Input
                        label="Budget (Rp/month)"
                        type="number"
                        placeholder="e.g., 5000000"
                        value={formData.budget || ''}
                        onChange={(e) => setFormData({ ...formData, budget: parseFloat(e.target.value) || 0 })}
                        error={errors.budget}
                        required
                        leftIcon={<Home className="w-5 h-5" />}
                    />
                </div>

                {/* Status */}
                <Select
                    label="Status"
                    options={statusOptions}
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    required
                />

                {/* Notes */}
                <Textarea
                    label="Notes"
                    placeholder="Any additional information or special requests"
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
                        {isSubmitting ? 'Adding...' : 'Add to Waiting List'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}