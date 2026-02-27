'use client';

import { useState, useEffect } from 'react';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import { User, Phone, Building, Home, DollarSign, Calendar } from 'lucide-react';
import { propertyService, roomService } from '@/lib/services/index';

interface AddWaitingListFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: WaitingListFormData) => void;
    editData?: WaitingListFormData | null;
}

export interface WaitingListFormData {
    name: string;
    phone: string;
    property: string;
    room_unit: string;
    budget: number;
    date_entry_plan: string;
}

export default function AddWaitingListForm({
                                               isOpen,
                                               onClose,
                                               onSubmit,
                                               editData,
                                           }: AddWaitingListFormProps) {
    const [formData, setFormData] = useState<WaitingListFormData>({
        name: '',
        phone: '',
        property: '',
        room_unit: '',
        budget: 0,
        date_entry_plan: '',
    });

    const [errors, setErrors] = useState<Partial<Record<keyof WaitingListFormData, string>>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Load edit data
    useEffect(() => {
        if (editData) {
            setFormData(editData);
        } else {
            setFormData({
                name: '',
                phone: '',
                property: '',
                room_unit: '',
                budget: 0,
                date_entry_plan: '',
            });
        }
        setErrors({});
    }, [editData, isOpen]);

    // Fetch real data from Supabase
    const [propertyOptions, setPropertyOptions] = useState([{ value: '', label: 'Select property' }]);
    const [roomUnitOptions, setRoomUnitOptions] = useState([{ value: '', label: 'Select room/unit type' }]);

    useEffect(() => {
        propertyService.getAll().then(res => {
            if (res.data) setPropertyOptions([{ value: '', label: 'Select property' }, ...res.data.map(p => ({ value: p.id, label: p.name }))]);
        });
        roomService.getAll({ filters: { status: 'Available' } }).then(res => {
            if (res.data) setRoomUnitOptions([{ value: '', label: 'Select room/unit type' }, ...res.data.map(r => ({ value: r.id, label: `${r.name} - ${r.type} (${r.luas}m²)` }))]);
        });
    }, [isOpen]);

    const validate = (): boolean => {
        const newErrors: Partial<Record<keyof WaitingListFormData, string>> = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }

        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone number is required';
        } else if (!/^(\+62|62|0)[0-9]{9,12}$/.test(formData.phone.replace(/[\s-]/g, ''))) {
            newErrors.phone = 'Invalid Indonesian phone number';
        }

        if (!formData.property) {
            newErrors.property = 'Property is required';
        }

        if (!formData.room_unit) {
            newErrors.room_unit = 'Room/unit type is required';
        }

        if (!formData.budget || formData.budget < 1) {
            newErrors.budget = 'Budget must be greater than 0';
        }

        if (!formData.date_entry_plan) {
            newErrors.date_entry_plan = 'Entry date is required';
        } else {
            const entryDate = new Date(formData.date_entry_plan);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (entryDate < today) {
                newErrors.date_entry_plan = 'Entry date cannot be in the past';
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
            name: '',
            phone: '',
            property: '',
            room_unit: '',
            budget: 0,
            date_entry_plan: '',
        });
        setErrors({});
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title={editData ? 'Edit Prospect' : 'Add New Prospect'}
            description={editData ? 'Update prospect information' : 'Add prospect to waiting list'}
            size="lg"
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name */}
                <Input
                    label="Full Name"
                    type="text"
                    placeholder="e.g., Amanda Lee"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    error={errors.name}
                    required
                    leftIcon={<User className="w-5 h-5" />}
                    helperText="From contacts (type = Customer, status = Prospect)"
                />

                {/* Phone */}
                <Input
                    label="WhatsApp Number"
                    type="tel"
                    placeholder="+62 817 8888 9999"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    error={errors.phone}
                    required
                    leftIcon={<Phone className="w-5 h-5" />}
                />

                {/* Property */}
                <Select
                    label="Interested Property"
                    options={propertyOptions}
                    value={formData.property}
                    onChange={(e) => setFormData({ ...formData, property: e.target.value })}
                    error={errors.property}
                    required
                    helperText="From properties table (FK)"
                />

                {/* Room/Unit Type */}
                <Select
                    label="Preferred Room/Unit Type"
                    options={roomUnitOptions}
                    value={formData.room_unit}
                    onChange={(e) => setFormData({ ...formData, room_unit: e.target.value })}
                    error={errors.room_unit}
                    required
                    helperText="From rooms table (FK)"
                />

                {/* Budget */}
                <Input
                    label="Budget (Rp/month)"
                    type="text"
                    inputMode="numeric"
                    placeholder="e.g., 5000000"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: Number(e.target.value.replace(/[^0-9]/g, '')) })}
                    error={errors.budget}
                    required
                    leftIcon={<DollarSign className="w-5 h-5" />}
                    helperText="Expected monthly budget"
                />

                {/* Entry Date */}
                <Input
                    label="Planned Entry Date"
                    type="date"
                    value={formData.date_entry_plan}
                    onChange={(e) => setFormData({ ...formData, date_entry_plan: e.target.value })}
                    error={errors.date_entry_plan}
                    required
                    leftIcon={<Calendar className="w-5 h-5" />}
                    helperText="When they plan to move in"
                />

                {/* Info Box */}
                {formData.budget > 0 && formData.date_entry_plan && (
                    <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                        <p className="text-sm font-semibold text-purple-900 dark:text-purple-100 mb-2">
                            Prospect Summary:
                        </p>
                        <div className="space-y-1 text-xs text-purple-800 dark:text-purple-200">
                            <p>
                                <span className="font-semibold">{formData.name || 'Prospect'}</span> interested in{' '}
                                <span className="font-semibold">{formData.room_unit || 'a unit'}</span>
                            </p>
                            <p>
                                at <span className="font-semibold">{formData.property || 'property'}</span> with budget{' '}
                                <span className="font-semibold">Rp {formData.budget.toLocaleString('id-ID')}</span>
                            </p>
                            <p>
                                Planning to move in on{' '}
                                <span className="font-semibold">
                                    {new Date(formData.date_entry_plan).toLocaleDateString('id-ID', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric'
                                    })}
                                </span>
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
                        {isSubmitting ? (editData ? 'Updating...' : 'Adding...') : (editData ? 'Update Prospect' : 'Add Prospect')}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}