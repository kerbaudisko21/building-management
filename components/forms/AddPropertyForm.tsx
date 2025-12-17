'use client';

import { useState } from 'react';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import { Building2, MapPin, Home, DollarSign } from 'lucide-react';

interface AddPropertyFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: PropertyFormData) => void;
}

export interface PropertyFormData {
    name: string;
    address: string;
    city: string;
    type: string;
    totalUnits: number;
    description?: string;
    yearBuilt?: number;
    facilities?: string;
}

export default function AddPropertyForm({ isOpen, onClose, onSubmit }: AddPropertyFormProps) {
    const [formData, setFormData] = useState<PropertyFormData>({
        name: '',
        address: '',
        city: '',
        type: '',
        totalUnits: 0,
        description: '',
        yearBuilt: new Date().getFullYear(),
        facilities: '',
    });

    const [errors, setErrors] = useState<Partial<Record<keyof PropertyFormData, string>>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const propertyTypes = [
        { value: '', label: 'Select property type' },
        { value: 'apartment', label: 'Apartment' },
        { value: 'kost', label: 'Kost / Boarding House' },
        { value: 'house', label: 'House' },
        { value: 'villa', label: 'Villa' },
        { value: 'office', label: 'Office Space' },
    ];

    const cities = [
        { value: '', label: 'Select city' },
        { value: 'jakarta', label: 'Jakarta' },
        { value: 'bandung', label: 'Bandung' },
        { value: 'surabaya', label: 'Surabaya' },
        { value: 'yogyakarta', label: 'Yogyakarta' },
        { value: 'semarang', label: 'Semarang' },
        { value: 'other', label: 'Other' },
    ];

    const validate = (): boolean => {
        const newErrors: Partial<Record<keyof PropertyFormData, string>> = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Property name is required';
        }

        if (!formData.address.trim()) {
            newErrors.address = 'Address is required';
        }

        if (!formData.city) {
            newErrors.city = 'City is required';
        }

        if (!formData.type) {
            newErrors.type = 'Property type is required';
        }

        if (!formData.totalUnits || formData.totalUnits < 1) {
            newErrors.totalUnits = 'Total units must be at least 1';
        }

        if (formData.yearBuilt && (formData.yearBuilt < 1900 || formData.yearBuilt > new Date().getFullYear() + 5)) {
            newErrors.yearBuilt = 'Please enter a valid year';
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

        // Simulate API call
        setTimeout(() => {
            onSubmit(formData);
            setIsSubmitting(false);
            handleClose();
        }, 1000);
    };

    const handleClose = () => {
        setFormData({
            name: '',
            address: '',
            city: '',
            type: '',
            totalUnits: 0,
            description: '',
            yearBuilt: new Date().getFullYear(),
            facilities: '',
        });
        setErrors({});
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title="Add New Property"
            description="Fill in the details to add a new property"
            size="lg"
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Property Name */}
                <Input
                    label="Property Name"
                    type="text"
                    placeholder="e.g., Green Valley Apartments"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    error={errors.name}
                    required
                    leftIcon={<Building2 className="w-5 h-5" />}
                />

                {/* Type and City */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Select
                        label="Property Type"
                        options={propertyTypes}
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        error={errors.type}
                        required
                    />

                    <Select
                        label="City"
                        options={cities}
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        error={errors.city}
                        required
                    />
                </div>

                {/* Address */}
                <Textarea
                    label="Full Address"
                    placeholder="Enter complete address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    error={errors.address}
                    rows={3}
                    required
                />

                {/* Total Units and Year Built */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        label="Total Units"
                        type="number"
                        placeholder="e.g., 50"
                        value={formData.totalUnits || ''}
                        onChange={(e) => setFormData({ ...formData, totalUnits: parseInt(e.target.value) || 0 })}
                        error={errors.totalUnits}
                        required
                        leftIcon={<Home className="w-5 h-5" />}
                    />

                    <Input
                        label="Year Built"
                        type="number"
                        placeholder="e.g., 2020"
                        value={formData.yearBuilt || ''}
                        onChange={(e) => setFormData({ ...formData, yearBuilt: parseInt(e.target.value) || undefined })}
                        error={errors.yearBuilt}
                    />
                </div>

                {/* Facilities */}
                <Input
                    label="Facilities"
                    type="text"
                    placeholder="e.g., Swimming Pool, Gym, Parking, Security"
                    value={formData.facilities}
                    onChange={(e) => setFormData({ ...formData, facilities: e.target.value })}
                    helperText="Separate multiple facilities with commas"
                />

                {/* Description */}
                <Textarea
                    label="Description"
                    placeholder="Additional information about the property"
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
                        {isSubmitting ? 'Adding...' : 'Add Property'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}