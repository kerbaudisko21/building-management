'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import AddTodoForm, { TodoFormData } from '@/components/forms/AddTodoForm';
import {
    CheckSquare,
    Plus,
    Search,
    Calendar,
    User,
    ListTodo,
    Clock,
    Loader,
    CheckCircle,
} from 'lucide-react';

export default function TodoListPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [isFormOpen, setIsFormOpen] = useState(false);

    const [tasks, setTasks] = useState([
        {
            id: 1,
            title: 'Process rent payment from John Doe',
            description: 'Verify and record Room 305 monthly payment',
            category: 'Finance',
            priority: 'High',
            dueDate: '2024-12-10',
            assignedTo: 'Admin',
            status: 'Todo',
            completed: false,
        },
        {
            id: 2,
            title: 'Schedule AC maintenance for Building A',
            description: 'Annual AC servicing for all units',
            category: 'Maintenance',
            priority: 'Medium',
            dueDate: '2024-12-15',
            assignedTo: 'Manager',
            status: 'In Progress',
            completed: false,
        },
        {
            id: 3,
            title: 'Review contract renewal for Room 201',
            description: 'Contract expires end of month',
            category: 'Contract',
            priority: 'High',
            dueDate: '2024-12-12',
            assignedTo: 'Admin',
            status: 'Todo',
            completed: false,
        },
        {
            id: 4,
            title: 'Update property photos',
            description: 'Take new photos for website',
            category: 'Marketing',
            priority: 'Low',
            dueDate: '2024-12-20',
            assignedTo: 'Manager',
            status: 'Done',
            completed: true,
        },
        {
            id: 5,
            title: 'Prepare monthly financial report',
            description: 'Summary of all income and expenses',
            category: 'Finance',
            priority: 'High',
            dueDate: '2024-12-11',
            assignedTo: 'Admin',
            status: 'In Progress',
            completed: false,
        },
        {
            id: 6,
            title: 'Follow up with waiting list entries',
            description: 'Contact prospects from last week',
            category: 'Sales',
            priority: 'Medium',
            dueDate: '2024-12-13',
            assignedTo: 'Manager',
            status: 'Todo',
            completed: false,
        },
    ]);

    const handleFormSubmit = (data: TodoFormData) => {
        const newTask = {
            id: tasks.length + 1,
            title: data.title,
            description: data.description,
            category: data.category,
            priority: data.priority,
            dueDate: data.dueDate,
            assignedTo: data.assignedTo,
            status: data.status,
            completed: false,
        };
        setTasks([...tasks, newTask]);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

    const getPriorityBadge = (priority: string) => {
        const variants: Record<string, any> = {
            High: 'danger',
            Medium: 'warning',
            Low: 'info',
        };
        return variants[priority] || 'default';
    };

    const getStatusBadge = (status: string) => {
        const variants: Record<string, any> = {
            Todo: 'warning',
            'In Progress': 'info',
            Done: 'success',
        };
        return variants[status] || 'default';
    };

    return (
        <div className="p-4 md:p-6 space-y-4 md:space-y-6 pb-24 md:pb-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
                        Todo List
                    </h1>
                    <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 mt-1">
                        Manage tasks and assignments
                    </p>
                </div>
                <Button className="w-full sm:w-auto" onClick={() => setIsFormOpen(true)}>
                    <Plus className="w-5 h-5" />
                    Add Task
                </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                <Card>
                    <CardContent className="p-3 md:p-4">
                        <div className="flex items-center justify-between">
                            <div className="min-w-0 flex-1">
                                <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 truncate">Total</p>
                                <p className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mt-1 truncate">
                                    {tasks.length}
                                </p>
                            </div>
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0 ml-2">
                                <ListTodo className="w-5 h-5 md:w-6 md:h-6 text-slate-600 dark:text-slate-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-3 md:p-4">
                        <div className="flex items-center justify-between">
                            <div className="min-w-0 flex-1">
                                <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 truncate">Todo</p>
                                <p className="text-xl md:text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1 truncate">
                                    {tasks.filter(t => t.status === 'Todo').length}
                                </p>
                            </div>
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0 ml-2">
                                <Clock className="w-5 h-5 md:w-6 md:h-6 text-amber-600 dark:text-amber-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-3 md:p-4">
                        <div className="flex items-center justify-between">
                            <div className="min-w-0 flex-1">
                                <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 truncate">In Progress</p>
                                <p className="text-xl md:text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1 truncate">
                                    {tasks.filter(t => t.status === 'In Progress').length}
                                </p>
                            </div>
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0 ml-2">
                                <Loader className="w-5 h-5 md:w-6 md:h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-3 md:p-4">
                        <div className="flex items-center justify-between">
                            <div className="min-w-0 flex-1">
                                <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 truncate">Done</p>
                                <p className="text-xl md:text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1 truncate">
                                    {tasks.filter(t => t.status === 'Done').length}
                                </p>
                            </div>
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0 ml-2">
                                <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-emerald-600 dark:text-emerald-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardContent className="p-3 md:p-4">
                    <Input
                        placeholder="Search tasks..."
                        leftIcon={<Search className="w-5 h-5" />}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </CardContent>
            </Card>

            <div className="space-y-3">
                {tasks.map((task) => (
                    <Card key={task.id} hover>
                        <CardContent className="p-4 md:p-6">
                            <div className="flex items-start gap-3 md:gap-4">
                                <input
                                    type="checkbox"
                                    checked={task.completed}
                                    className="mt-1 w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                                    readOnly
                                />
                                <div className="flex-1 min-w-0">
                                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-2">
                                        <div className="flex-1 min-w-0">
                                            <h3 className={`text-base md:text-lg font-semibold ${task.completed ? 'line-through text-slate-500 dark:text-slate-500' : 'text-slate-900 dark:text-white'}`}>
                                                {task.title}
                                            </h3>
                                            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                                                {task.description}
                                            </p>
                                        </div>
                                        <Badge variant={getStatusBadge(task.status)} size="sm" className="self-start">
                                            {task.status}
                                        </Badge>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-2 md:gap-3 text-sm">
                                        <Badge variant="purple" size="sm">{task.category}</Badge>
                                        <Badge variant={getPriorityBadge(task.priority)} size="sm">
                                            {task.priority}
                                        </Badge>
                                        <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                                            <Calendar className="w-4 h-4" />
                                            <span className="text-xs md:text-sm">{formatDate(task.dueDate)}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                                            <User className="w-4 h-4" />
                                            <span className="text-xs md:text-sm">{task.assignedTo}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <AddTodoForm
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onSubmit={handleFormSubmit}
            />
        </div>
    );
}