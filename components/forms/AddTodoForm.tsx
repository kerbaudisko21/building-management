'use client';

import { useState } from 'react';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import { CheckSquare, Calendar, User } from 'lucide-react';

interface AddTodoFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: TodoFormData) => void;
}

export interface TodoFormData {
    title: string;
    description: string;
    category: string;
    priority: string;
    dueDate: string;
    assignedTo: string;
    status: string;
}

export default function AddTodoForm({ isOpen, onClose, onSubmit }: AddTodoFormProps) {
    const [formData, setFormData] = useState<TodoFormData>({
        title: '',
        description: '',
        category: '',
        priority: '',
        dueDate: '',
        assignedTo: '',
        status: 'Todo',
    });

    const [errors, setErrors] = useState<Partial<Record<keyof TodoFormData, string>>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const categoryOptions = [
        { value: '', label: 'Select category' },
        { value: 'Finance', label: 'Finance' },
        { value: 'Maintenance', label: 'Maintenance' },
        { value: 'Contract', label: 'Contract' },
        { value: 'Marketing', label: 'Marketing' },
        { value: 'Sales', label: 'Sales' },
        { value: 'Operations', label: 'Operations' },
    ];

    const priorityOptions = [
        { value: '', label: 'Select priority' },
        { value: 'Low', label: 'Low' },
        { value: 'Medium', label: 'Medium' },
        { value: 'High', label: 'High' },
    ];

    const assigneeOptions = [
        { value: '', label: 'Select assignee' },
        { value: 'Admin', label: 'Admin' },
        { value: 'Manager', label: 'Manager' },
        { value: 'Staff', label: 'Staff' },
    ];

    const statusOptions = [
        { value: 'Pending', label: 'Pending' },
        { value: 'In Progress', label: 'In Progress' },
        { value: 'Completed', label: 'Completed' },
    ];

    const validate = (): boolean => {
        const newErrors: Partial<Record<keyof TodoFormData, string>> = {};

        if (!formData.title.trim()) {
            newErrors.title = 'Title is required';
        }

        if (!formData.description.trim()) {
            newErrors.description = 'Description is required';
        }

        if (!formData.category) {
            newErrors.category = 'Category is required';
        }

        if (!formData.priority) {
            newErrors.priority = 'Priority is required';
        }

        if (!formData.dueDate) {
            newErrors.dueDate = 'Due date is required';
        }

        if (!formData.assignedTo) {
            newErrors.assignedTo = 'Please assign to someone';
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
            title: '',
            description: '',
            category: '',
            priority: '',
            dueDate: '',
            assignedTo: '',
            status: 'Todo',
        });
        setErrors({});
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title="Add New Task"
            description="Create a new todo task"
            size="lg"
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                    label="Task Title"
                    type="text"
                    placeholder="e.g., Process rent payment from John Doe"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    error={errors.title}
                    required
                    leftIcon={<CheckSquare className="w-5 h-5" />}
                />

                <Textarea
                    label="Description"
                    placeholder="Describe the task details..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    error={errors.description}
                    rows={3}
                    required
                />

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
                        label="Priority"
                        options={priorityOptions}
                        value={formData.priority}
                        onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                        error={errors.priority}
                        required
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        label="Due Date"
                        type="date"
                        value={formData.dueDate}
                        onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                        error={errors.dueDate}
                        required
                        leftIcon={<Calendar className="w-5 h-5" />}
                    />

                    <Select
                        label="Assign To"
                        options={assigneeOptions}
                        value={formData.assignedTo}
                        onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                        error={errors.assignedTo}
                        required
                    />
                </div>

                <Select
                    label="Status"
                    options={statusOptions}
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    required
                />

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
                        {isSubmitting ? 'Creating...' : 'Create Task'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}