'use client';

import { useState } from 'react';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import { Home, DollarSign, Maximize } from 'lucide-react';

interface AddRoomFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: RoomFormData) => void;
    properties?: { id: string; name: string }[];
}

export interface RoomFormData {
    propertyId: string;
    roomNumber: string;
    floor: number;
    type: string;
    size: number;
    monthlyRate: number;
    status: string;
    facilities?: string;
    description?: string;
}

export default function AddRoomForm({ isOpen, onClose, onSubmit, properties = [] }: AddRoomFormProps) {
    const [formData, setFormData] = useState<RoomFormData>({
        propertyId: '',
        roomNumber: '',
        floor: 1,
        type: '',
        size: 0,
        monthlyRate: 0,
        status: 'available',
        facilities: '',
        description: '',
    });

    const [errors, setErrors] = useState<Partial<Record<keyof RoomFormData, string>>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const roomTypes = [
        { value: '', label: 'Select room type' },
        { value: 'standard', label: 'Standard' },
        { value: 'deluxe', label: 'Deluxe' },
        { value: 'suite', label: 'Suite' },
        { value: 'studio', label: 'Studio' },
        { value: 'penthouse', label: 'Penthouse' },
    ];

    const statusOptions = [
        { value: 'available', label: 'Available' },
        { value: 'occupied', label: 'Occupied' },
        { value: 'maintenance', label: 'Under Maintenance' },
        { value: 'reserved', label: 'Reserved' },
    ];

    const propertyOptions = [
        { value: '', label: 'Select property' },
        ...properties.map(p => ({ value: p.id, label: p.name })),
    ];

    const validate = (): boolean => {
        const newErrors: Partial<Record<keyof RoomFormData, string>> = {};

        if (!formData.propertyId) {
            newErrors.propertyId = 'Please select a property';
        }

        if (!formData.roomNumber.trim()) {
            newErrors.roomNumber = 'Room number is required';
        }

        if (formData.floor < 0) {
            newErrors.floor = 'Floor cannot be negative';
        }

        if (!formData.type) {
            newErrors.type = 'Room type is required';
        }

        if (!formData.size || formData.size < 1) {
            newErrors.size = 'Size must be greater than 0';
        }

        if (!formData.monthlyRate || formData.monthlyRate < 1) {
            newErrors.monthlyRate = 'Monthly rate must be greater than 0';
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
            propertyId: '',
            roomNumber: '',
            floor: 1,
            type: '',
            size: 0,
            monthlyRate: 0,
            status: 'available',
            facilities: '',
            description: '',
        });
        setErrors({});
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title="Add New Room"
            description="Fill in the details to add a new room"
            size="lg"
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Property Selection */}
                <Select
                    label="Property"
                    options={propertyOptions}
                    value={formData.propertyId}
                    onChange={(e) => setFormData({ ...formData, propertyId: e.target.value })}
                    error={errors.propertyId}
                    required
                />

                {/* Room Number and Floor */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        label="Room Number"
                        type="text"
                        placeholder="e.g., 201"
                        value={formData.roomNumber}
                        onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                        error={errors.roomNumber}
                        required
                        leftIcon={<Home className="w-5 h-5" />}
                    />

                    <Input
                        label="Floor"
                        type="number"
                        placeholder="e.g., 2"
                        value={formData.floor || ''}
                        onChange={(e) => setFormData({ ...formData, floor: parseInt(e.target.value) || 0 })}
                        error={errors.floor}
                        required
                    />
                </div>

                {/* Room Type and Status */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Select
                        label="Room Type"
                        options={roomTypes}
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        error={errors.type}
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

                {/* Size and Monthly Rate */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        label="Size (m²)"
                        type="number"
                        placeholder="e.g., 25"
                        value={formData.size || ''}
                        onChange={(e) => setFormData({ ...formData, size: parseFloat(e.target.value) || 0 })}
                        error={errors.size}
                        required
                        leftIcon={<Maximize className="w-5 h-5" />}
                    />

                    <Input
                        label="Monthly Rate (Rp)"
                        type="number"
                        placeholder="e.g., 5000000"
                        value={formData.monthlyRate || ''}
                        onChange={(e) => setFormData({ ...formData, monthlyRate: parseFloat(e.target.value) || 0 })}
                        error={errors.monthlyRate}
                        required
                        leftIcon={<DollarSign className="w-5 h-5" />}
                    />
                </div>

                {/* Facilities */}
                <Input
                    label="Facilities"
                    type="text"
                    placeholder="e.g., AC, WiFi, Water Heater, Wardrobe"
                    value={formData.facilities}
                    onChange={(e) => setFormData({ ...formData, facilities: e.target.value })}
                    helperText="Separate multiple facilities with commas"
                />

                {/* Description */}
                <Textarea
                    label="Description"
                    placeholder="Additional information about the room"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    helperText="Optional: Add any additional details"
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
                        {isSubmitting ? 'Adding...' : 'Add Room'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}