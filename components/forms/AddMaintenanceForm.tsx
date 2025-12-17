'use client';

import { useState } from 'react';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import { Wrench, Home, User, AlertCircle } from 'lucide-react';

interface AddMaintenanceFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: MaintenanceFormData) => void;
    rooms?: { id: string; name: string }[];
}

export interface MaintenanceFormData {
    roomId: string;
    issueType: string;
    priority: string;
    description: string;
    reportedBy?: string;
    assignedTo?: string;
    status: string;
    scheduledDate?: string;
}

export default function AddMaintenanceForm({
                                               isOpen,
                                               onClose,
                                               onSubmit,
                                               rooms = [],
                                           }: AddMaintenanceFormProps) {
    const [formData, setFormData] = useState<MaintenanceFormData>({
        roomId: '',
        issueType: '',
        priority: '',
        description: '',
        reportedBy: '',
        assignedTo: '',
        status: 'pending',
        scheduledDate: '',
    });

    const [errors, setErrors] = useState<Partial<Record<keyof MaintenanceFormData, string>>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const issueTypes = [
        { value: '', label: 'Select issue type' },
        { value: 'ac', label: 'Air Conditioning' },
        { value: 'plumbing', label: 'Plumbing' },
        { value: 'electrical', label: 'Electrical' },
        { value: 'door-lock', label: 'Door/Lock' },
        { value: 'window', label: 'Window' },
        { value: 'furniture', label: 'Furniture' },
        { value: 'appliance', label: 'Appliance' },
        { value: 'cleaning', label: 'Cleaning' },
        { value: 'painting', label: 'Painting' },
        { value: 'pest-control', label: 'Pest Control' },
        { value: 'other', label: 'Other' },
    ];

    const priorityOptions = [
        { value: '', label: 'Select priority' },
        { value: 'low', label: 'Low - Can wait' },
        { value: 'medium', label: 'Medium - Schedule soon' },
        { value: 'high', label: 'High - Urgent' },
        { value: 'critical', label: 'Critical - Immediate' },
    ];

    const statusOptions = [
        { value: 'pending', label: 'Pending' },
        { value: 'scheduled', label: 'Scheduled' },
        { value: 'in-progress', label: 'In Progress' },
        { value: 'completed', label: 'Completed' },
        { value: 'cancelled', label: 'Cancelled' },
    ];

    const roomOptions = [
        { value: '', label: 'Select room' },
        ...rooms.map(r => ({ value: r.id, label: r.name })),
    ];

    const validate = (): boolean => {
        const newErrors: Partial<Record<keyof MaintenanceFormData, string>> = {};

        if (!formData.roomId) {
            newErrors.roomId = 'Please select a room';
        }

        if (!formData.issueType) {
            newErrors.issueType = 'Issue type is required';
        }

        if (!formData.priority) {
            newErrors.priority = 'Priority is required';
        }

        if (!formData.description.trim()) {
            newErrors.description = 'Description is required';
        } else if (formData.description.length < 10) {
            newErrors.description = 'Description must be at least 10 characters';
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
            roomId: '',
            issueType: '',
            priority: '',
            description: '',
            reportedBy: '',
            assignedTo: '',
            status: 'pending',
            scheduledDate: '',
        });
        setErrors({});
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title="New Maintenance Request"
            description="Report a maintenance issue"
            size="lg"
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Room Selection */}
                <Select
                    label="Room / Location"
                    options={roomOptions}
                    value={formData.roomId}
                    onChange={(e) => setFormData({ ...formData, roomId: e.target.value })}
                    error={errors.roomId}
                    required
                />

                {/* Issue Type and Priority */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Select
                        label="Issue Type"
                        options={issueTypes}
                        value={formData.issueType}
                        onChange={(e) => setFormData({ ...formData, issueType: e.target.value })}
                        error={errors.issueType}
                        required
                    />

                    <Select
                        label="Priority"
                        options={priorityOptions}
                        value={formData.priority}
                        onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                        error={errors.priority}
                        required
                    />
                </div>

                {/* Description */}
                <Textarea
                    label="Description"
                    placeholder="Describe the issue in detail..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    error={errors.description}
                    rows={4}
                    required
                    helperText="Minimum 10 characters"
                />

                {/* Status and Scheduled Date */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Select
                        label="Status"
                        options={statusOptions}
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        required
                    />

                    <Input
                        label="Scheduled Date"
                        type="date"
                        value={formData.scheduledDate}
                        onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                        helperText="Optional: When to schedule the fix"
                    />
                </div>

                {/* Reported By and Assigned To */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        label="Reported By"
                        type="text"
                        placeholder="e.g., Tenant name or Staff name"
                        value={formData.reportedBy}
                        onChange={(e) => setFormData({ ...formData, reportedBy: e.target.value })}
                        leftIcon={<User className="w-5 h-5" />}
                        helperText="Optional"
                    />

                    <Input
                        label="Assigned To"
                        type="text"
                        placeholder="e.g., Technician name"
                        value={formData.assignedTo}
                        onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                        leftIcon={<Wrench className="w-5 h-5" />}
                        helperText="Optional"
                    />
                </div>

                {/* Priority Alert */}
                {formData.priority === 'critical' && (
                    <div className="p-4 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-lg">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5" />
                            <div>
                                <p className="font-semibold text-red-900 dark:text-red-100">
                                    Critical Priority
                                </p>
                                <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                                    This issue requires immediate attention. Make sure to assign a technician and schedule as soon as possible.
                                </p>
                            </div>
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
                        {isSubmitting ? 'Creating...' : 'Create Request'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}