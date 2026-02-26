'use client';

import { useState, useEffect } from 'react';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import { Building, MapPin, Home } from 'lucide-react';

interface AddPropertyFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: PropertyFormData) => void;
    editData?: PropertyFormData | null;
}

export interface PropertyFormData {
    name: string;
    address: string;
    total_unit: number;
    occupancy: number;
    facility: string[];
}

export default function AddPropertyForm({
                                            isOpen,
                                            onClose,
                                            onSubmit,
                                            editData,
                                        }: AddPropertyFormProps) {
    const [formData, setFormData] = useState<PropertyFormData>({
        name: '',
        address: '',
        total_unit: 0,
        occupancy: 0,
        facility: [],
    });

    const [facilityInput, setFacilityInput] = useState('');
    const [errors, setErrors] = useState<Partial<Record<keyof PropertyFormData, string>>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (editData) {
            setFormData(editData);
            setFacilityInput(editData.facility.join(', '));
        } else {
            setFormData({
                name: '',
                address: '',
                total_unit: 0,
                occupancy: 0,
                facility: [],
            });
            setFacilityInput('');
        }
        setErrors({});
    }, [editData, isOpen]);

    const validate = (): boolean => {
        const newErrors: Partial<Record<keyof PropertyFormData, string>> = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Property name is required';
        }

        if (!formData.address.trim()) {
            newErrors.address = 'Address is required';
        }

        if (!formData.total_unit || formData.total_unit < 1) {
            newErrors.total_unit = 'Total units must be at least 1';
        }

        if (formData.occupancy < 0) {
            newErrors.occupancy = 'Occupancy cannot be negative';
        }

        if (formData.occupancy > formData.total_unit) {
            newErrors.occupancy = 'Occupancy cannot exceed total units';
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

        const facilities = facilityInput
            .split(',')
            .map(f => f.trim())
            .filter(f => f.length > 0);

        const submitData = {
            ...formData,
            facility: facilities,
        };

        setTimeout(() => {
            onSubmit(submitData);
            setIsSubmitting(false);
            handleClose();
        }, 1000);
    };

    const handleClose = () => {
        setFormData({
            name: '',
            address: '',
            total_unit: 0,
            occupancy: 0,
            facility: [],
        });
        setFacilityInput('');
        setErrors({});
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title={editData ? 'Edit Property' : 'Add New Property'}
            description={editData ? 'Update property information' : 'Fill in the property details'}
            size="lg"
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Property Name */}
                <Input
                    label="Property Name"
                    type="text"
                    placeholder="e.g., Menteng Residence"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    error={errors.name}
                    required
                    leftIcon={<Building className="w-5 h-5" />}
                />

                {/* Address */}
                <Textarea
                    label="Full Address"
                    placeholder="e.g., Jl. Menteng Raya No. 45, Jakarta Pusat"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    error={errors.address}
                    rows={3}
                    required
                />

                {/* Total Units and Occupancy */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        label="Total Units"
                        type="text"
                        inputMode="numeric"
                        placeholder="e.g., 50"
                        value={formData.total_unit}
                        onChange={(e) => setFormData({ ...formData, total_unit: Number(e.target.value.replace(/[^0-9]/g, '')) })}
                        error={errors.total_unit}
                        required
                        leftIcon={<Home className="w-5 h-5" />}
                        helperText="Total number of units/rooms"
                    />

                    <Input
                        label="Currently Occupied"
                        type="text"
                        inputMode="numeric"
                        placeholder="e.g., 42"
                        value={formData.occupancy}
                        required
                        onChange={(e) => {
                            const val = e.target.value.replace(/[^0-9]/g, '')
                            setFormData({ ...formData, occupancy: Number(val) })
                        }}
                    />
                </div>

                {/* Occupancy Info */}
                {formData.total_unit > 0 && (
                    <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-600 dark:text-slate-400">Occupancy Rate:</span>
                            <span className="font-bold text-indigo-600 dark:text-indigo-400">
                                {Math.round((formData.occupancy / formData.total_unit) * 100)}%
                            </span>
                        </div>
                        <div className="flex items-center justify-between text-sm mt-1">
                            <span className="text-slate-600 dark:text-slate-400">Available Units:</span>
                            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                                {formData.total_unit - formData.occupancy}
                            </span>
                        </div>
                    </div>
                )}

                {/* Facilities */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Facilities
                    </label>
                    <Input
                        type="text"
                        placeholder="WiFi, Parking, Security 24/7, Swimming Pool, Gym"
                        value={facilityInput}
                        onChange={(e) => setFacilityInput(e.target.value)}
                        leftIcon={<MapPin className="w-5 h-5" />}
                    />
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Separate multiple facilities with commas
                    </p>
                    {facilityInput && (
                        <div className="flex flex-wrap gap-2 mt-2">
                            {facilityInput.split(',').map((fac, idx) => {
                                const trimmed = fac.trim();
                                if (!trimmed) return null;
                                return (
                                    <span
                                        key={idx}
                                        className="px-2 py-1 text-xs bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-md"
                                    >
                                        {trimmed}
                                    </span>
                                );
                            })}
                        </div>
                    )}
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
                        {isSubmitting ? (editData ? 'Updating...' : 'Adding...') : (editData ? 'Update Property' : 'Add Property')}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}