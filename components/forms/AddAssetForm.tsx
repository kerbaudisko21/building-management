'use client';

import { useState } from 'react';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import { Package, DollarSign, Calendar, MapPin } from 'lucide-react';

interface AddAssetFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: AssetFormData) => void;
}

export interface AssetFormData {
    name: string;
    category: string;
    location: string;
    purchaseDate: string;
    purchasePrice: number;
    currentValue: number;
    condition: string;
    serialNumber?: string;
    notes?: string;
}

export default function AddAssetForm({ isOpen, onClose, onSubmit }: AddAssetFormProps) {
    const [formData, setFormData] = useState<AssetFormData>({
        name: '',
        category: '',
        location: '',
        purchaseDate: '',
        purchasePrice: 0,
        currentValue: 0,
        condition: '',
        serialNumber: '',
        notes: '',
    });

    const [errors, setErrors] = useState<Partial<Record<keyof AssetFormData, string>>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const categoryOptions = [
        { value: '', label: 'Select category' },
        { value: 'furniture', label: 'Furniture' },
        { value: 'electronics', label: 'Electronics' },
        { value: 'appliances', label: 'Appliances' },
        { value: 'hvac', label: 'HVAC System' },
        { value: 'security', label: 'Security Equipment' },
        { value: 'vehicle', label: 'Vehicle' },
        { value: 'tools', label: 'Tools & Equipment' },
        { value: 'other', label: 'Other' },
    ];

    const conditionOptions = [
        { value: '', label: 'Select condition' },
        { value: 'excellent', label: 'Excellent' },
        { value: 'good', label: 'Good' },
        { value: 'fair', label: 'Fair' },
        { value: 'poor', label: 'Poor' },
        { value: 'needs-repair', label: 'Needs Repair' },
    ];

    const validate = (): boolean => {
        const newErrors: Partial<Record<keyof AssetFormData, string>> = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Asset name is required';
        }

        if (!formData.category) {
            newErrors.category = 'Category is required';
        }

        if (!formData.location.trim()) {
            newErrors.location = 'Location is required';
        }

        if (!formData.purchaseDate) {
            newErrors.purchaseDate = 'Purchase date is required';
        }

        if (!formData.purchasePrice || formData.purchasePrice < 0) {
            newErrors.purchasePrice = 'Purchase price is required';
        }

        if (!formData.currentValue || formData.currentValue < 0) {
            newErrors.currentValue = 'Current value is required';
        }

        if (!formData.condition) {
            newErrors.condition = 'Condition is required';
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
            category: '',
            location: '',
            purchaseDate: '',
            purchasePrice: 0,
            currentValue: 0,
            condition: '',
            serialNumber: '',
            notes: '',
        });
        setErrors({});
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title="Add New Asset"
            description="Record a new asset or equipment"
            size="lg"
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Asset Name */}
                <Input
                    label="Asset Name"
                    type="text"
                    placeholder="e.g., AC Unit - Room 305"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    error={errors.name}
                    required
                    leftIcon={<Package className="w-5 h-5" />}
                />

                {/* Category and Condition */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Select
                        label="Category"
                        options={categoryOptions}
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        error={errors.category}
                        required
                    />

                    <Select
                        label="Condition"
                        options={conditionOptions}
                        value={formData.condition}
                        onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                        error={errors.condition}
                        required
                    />
                </div>

                {/* Location */}
                <Input
                    label="Location"
                    type="text"
                    placeholder="e.g., Building A, Room 305"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    error={errors.location}
                    required
                    leftIcon={<MapPin className="w-5 h-5" />}
                />

                {/* Purchase Date */}
                <Input
                    label="Purchase Date"
                    type="date"
                    value={formData.purchaseDate}
                    onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
                    error={errors.purchaseDate}
                    required
                    leftIcon={<Calendar className="w-5 h-5" />}
                />

                {/* Purchase Price and Current Value */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        label="Purchase Price (Rp)"
                        type="number"
                        placeholder="e.g., 5000000"
                        value={formData.purchasePrice || ''}
                        onChange={(e) => setFormData({ ...formData, purchasePrice: parseFloat(e.target.value) || 0 })}
                        error={errors.purchasePrice}
                        required
                        leftIcon={<DollarSign className="w-5 h-5" />}
                    />

                    <Input
                        label="Current Value (Rp)"
                        type="number"
                        placeholder="e.g., 4000000"
                        value={formData.currentValue || ''}
                        onChange={(e) => setFormData({ ...formData, currentValue: parseFloat(e.target.value) || 0 })}
                        error={errors.currentValue}
                        required
                        leftIcon={<DollarSign className="w-5 h-5" />}
                    />
                </div>

                {/* Serial Number */}
                <Input
                    label="Serial Number / ID"
                    type="text"
                    placeholder="e.g., SN-12345678"
                    value={formData.serialNumber}
                    onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                    helperText="Optional: For warranty or identification"
                />

                {/* Notes */}
                <Textarea
                    label="Notes"
                    placeholder="Additional information about this asset"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={3}
                    helperText="Optional: Warranty info, maintenance schedule, etc"
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
                        {isSubmitting ? 'Adding...' : 'Add Asset'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}