'use client';

import { useState, useEffect } from 'react';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import { formatCurrency } from '@/utils/currency';
import { Package, Building, Home, MapPin, DollarSign, Calendar, FileText } from 'lucide-react';
import { propertyService, roomService } from '@/lib/services/index';

interface AddAssetFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: AssetFormData) => void;
    editData?: AssetFormData | null;
}

export interface AssetFormData {
    property: string;
    room_unit: string;
    name: string;
    current_location: string;
    category: string;
    condition: string;
    purchase_date: string;
    purchase_price: number;
    notes: string;
}

export default function AddAssetForm({
                                         isOpen,
                                         onClose,
                                         onSubmit,
                                         editData,
                                     }: AddAssetFormProps) {
    const [formData, setFormData] = useState<AssetFormData>({
        property: '',
        room_unit: '',
        name: '',
        current_location: '',
        category: 'Electronics',
        condition: 'Good',
        purchase_date: '',
        purchase_price: 0,
        notes: '',
    });

    const [errors, setErrors] = useState<Partial<Record<keyof AssetFormData, string>>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Load edit data
    useEffect(() => {
        if (editData) {
            setFormData(editData);
        } else {
            setFormData({
                property: '',
                room_unit: '',
                name: '',
                current_location: '',
                category: 'Electronics',
                condition: 'Good',
                purchase_date: '',
                purchase_price: 0,
                notes: '',
            });
        }
        setErrors({});
    }, [editData, isOpen]);

    // Fetch real data from Supabase
    const [propertyOptions, setPropertyOptions] = useState([{ value: '', label: 'Select property' }]);
    const [roomOptions, setRoomOptions] = useState([{ value: '', label: 'Select room/unit' }]);

    useEffect(() => {
        propertyService.getAll().then(res => {
            if (res.data) setPropertyOptions([{ value: '', label: 'Select property' }, ...res.data.map(p => ({ value: p.id, label: p.name }))]);
        });
        roomService.getAll().then(res => {
            if (res.data) setRoomOptions([{ value: '', label: 'Select room/unit' }, ...res.data.map(r => ({ value: r.id, label: `${r.name} - ${r.type}` }))]);
        });
    }, [isOpen]);

    const categoryOptions = [
        { value: 'Electronics', label: 'Electronics (TV, AC, etc)' },
        { value: 'Appliances', label: 'Appliances (Water Heater, etc)' },
        { value: 'Furniture', label: 'Furniture (Bed, Sofa, etc)' },
        { value: 'Security', label: 'Security (CCTV, etc)' },
        { value: 'HVAC', label: 'HVAC (AC, Ventilation)' },
        { value: 'Tools', label: 'Tools & Equipment' },
        { value: 'Other', label: 'Other' },
    ];

    const conditionOptions = [
        { value: 'Excellent', label: 'Excellent - Like new' },
        { value: 'Good', label: 'Good - Working well' },
        { value: 'Fair', label: 'Fair - Some wear' },
        { value: 'Poor', label: 'Poor - Needs attention' },
        { value: 'Needs Repair', label: 'Needs Repair - Not working' },
    ];

    const validate = (): boolean => {
        const newErrors: Partial<Record<keyof AssetFormData, string>> = {};

        if (!formData.property) {
            newErrors.property = 'Property is required';
        }

        if (!formData.room_unit) {
            newErrors.room_unit = 'Room/unit is required';
        }

        if (!formData.name.trim()) {
            newErrors.name = 'Asset name is required';
        }

        if (!formData.current_location.trim()) {
            newErrors.current_location = 'Current location is required';
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
            property: '',
            room_unit: '',
            name: '',
            current_location: '',
            category: 'Electronics',
            condition: 'Good',
            purchase_date: '',
            purchase_price: 0,
            notes: '',
        });
        setErrors({});
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title={editData ? 'Edit Asset' : 'Add New Asset'}
            description={editData ? 'Update asset information' : 'Register a new asset'}
            size="lg"
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Property and Room/Unit */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Select
                        label="Property"
                        options={propertyOptions}
                        value={formData.property}
                        onChange={(e) => setFormData({ ...formData, property: e.target.value })}
                        error={errors.property}
                        required
                        helperText="FK: properties table"
                    />

                    <Select
                        label="Room/Unit"
                        options={roomOptions}
                        value={formData.room_unit}
                        onChange={(e) => setFormData({ ...formData, room_unit: e.target.value })}
                        error={errors.room_unit}
                        required
                        helperText="FK: rooms table"
                    />
                </div>

                {/* Asset Name */}
                <Input
                    label="Asset Name"
                    type="text"
                    placeholder="e.g., AC Split 1.5 PK"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    error={errors.name}
                    required
                    leftIcon={<Package className="w-5 h-5" />}
                />

                {/* Current Location */}
                <Input
                    label="Current Location"
                    type="text"
                    placeholder="e.g., Unit 305-A, Warehouse, Lobby"
                    value={formData.current_location}
                    onChange={(e) => setFormData({ ...formData, current_location: e.target.value })}
                    error={errors.current_location}
                    required
                    leftIcon={<MapPin className="w-5 h-5" />}
                    helperText="Where is this asset currently located?"
                />

                {/* Info Box about Location */}
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <div className="flex items-start gap-2 text-sm text-blue-900 dark:text-blue-100">
                        <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="font-semibold">Current Location Info:</p>
                            <p className="text-xs mt-1">
                                This field tracks where the asset is NOW. It can be different from Room/Unit if:
                            </p>
                            <ul className="text-xs mt-1 space-y-0.5 list-disc list-inside">
                                <li>Asset moved to warehouse during renovation</li>
                                <li>Asset in common area vs. specific unit</li>
                                <li>Asset relocated for maintenance</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Category and Condition */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Select
                        label="Category"
                        options={categoryOptions}
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    />

                    <Select
                        label="Condition"
                        options={conditionOptions}
                        value={formData.condition}
                        onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                    />
                </div>

                {/* Purchase Date and Price */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        label="Purchase Date"
                        type="date"
                        value={formData.purchase_date}
                        onChange={(e) => setFormData({ ...formData, purchase_date: e.target.value })}
                        leftIcon={<Calendar className="w-5 h-5" />}
                        helperText="Optional"
                    />

                    <Input
                        label="Purchase Price (Rp)"
                        type="text"
                        inputMode="numeric"
                        placeholder="e.g., 4500000"
                        value={formData.purchase_price}
                        onChange={(e) => setFormData({ ...formData, purchase_price: Number(e.target.value.replace(/[^0-9]/g, '')) })}
                        leftIcon={<DollarSign className="w-5 h-5" />}
                        helperText="Optional"
                    />
                </div>

                {/* Notes */}
                <Textarea
                    label="Notes"
                    placeholder="Additional information, warranty details, maintenance schedule, etc."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={3}
                    helperText="Optional"
                />

                {/* Asset Summary */}
                {formData.name && formData.property && (
                    <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
                        <p className="text-sm font-semibold text-emerald-900 dark:text-emerald-100 mb-2">
                            Asset Summary:
                        </p>
                        <div className="space-y-1 text-xs text-emerald-800 dark:text-emerald-200">
                            <p>
                                <span className="font-semibold">{formData.name}</span> ({formData.category})
                            </p>
                            <p>
                                Registered at <span className="font-semibold">{formData.property}</span>
                            </p>
                            <p>
                                Assigned to <span className="font-semibold">{formData.room_unit || '-'}</span>
                            </p>
                            <p>
                                Current location: <span className="font-semibold">{formData.current_location || '-'}</span>
                            </p>
                            {formData.purchase_price && formData.purchase_price > 0 && (
                                <p>
                                    Value: <span className="font-semibold">{formatCurrency(formData.purchase_price)}</span>
                                </p>
                            )}
                            <p>
                                Condition: <span className="font-semibold">{formData.condition}</span>
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
                        {isSubmitting ? (editData ? 'Updating...' : 'Adding...') : (editData ? 'Update Asset' : 'Add Asset')}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}