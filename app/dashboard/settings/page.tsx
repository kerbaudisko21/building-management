'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import {
    User,
    Lock,
    Bell,
    Moon,
    Mail,
    Download,
    Upload,
    Trash2,
    Save,
} from 'lucide-react';

export default function SettingsPage() {
    const [darkMode, setDarkMode] = useState(false);
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [pushNotifications, setPushNotifications] = useState(true);

    return (
        <div className="p-4 md:p-6 space-y-4 md:space-y-6 pb-24 md:pb-6">
            <div>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
                    Settings
                </h1>
                <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 mt-1">
                    Manage your account settings and preferences
                </p>
            </div>

            {/* Account Settings */}
            <Card>
                <CardContent className="p-4 md:p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
                            <User className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white">
                                Account Settings
                            </h2>
                            <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400">
                                Update your account information
                            </p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Full Name
                                </label>
                                <Input
                                    type="text"
                                    placeholder="John Doe"
                                    defaultValue="John Doe"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Email Address
                                </label>
                                <Input
                                    type="email"
                                    placeholder="john@example.com"
                                    defaultValue="john@example.com"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Phone Number
                                </label>
                                <Input
                                    type="tel"
                                    placeholder="+62 812 3456 7890"
                                    defaultValue="+62 812 3456 7890"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Company Name
                                </label>
                                <Input
                                    type="text"
                                    placeholder="Property Management Co."
                                    defaultValue="Property Management Co."
                                />
                            </div>
                        </div>

                        <div className="flex justify-end pt-2">
                            <Button>
                                <Save className="w-4 h-4 mr-2" />
                                Save Changes
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Security Settings */}
            <Card>
                <CardContent className="p-4 md:p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-600 to-orange-600 flex items-center justify-center">
                            <Lock className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white">
                                Security
                            </h2>
                            <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400">
                                Change your password and security settings
                            </p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Current Password
                            </label>
                            <Input
                                type="password"
                                placeholder="Enter current password"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    New Password
                                </label>
                                <Input
                                    type="password"
                                    placeholder="Enter new password"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Confirm Password
                                </label>
                                <Input
                                    type="password"
                                    placeholder="Confirm new password"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end pt-2">
                            <Button>
                                <Lock className="w-4 h-4 mr-2" />
                                Update Password
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Preferences */}
            <Card>
                <CardContent className="p-4 md:p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center">
                            <Bell className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white">
                                Preferences
                            </h2>
                            <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400">
                                Customize your experience
                            </p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {/* Dark Mode Toggle */}
                        <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                            <div className="flex items-center gap-3">
                                <Moon className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                                <div>
                                    <p className="font-medium text-slate-900 dark:text-white">Dark Mode</p>
                                    <p className="text-xs text-slate-600 dark:text-slate-400">
                                        Toggle dark theme
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setDarkMode(!darkMode)}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                    darkMode ? 'bg-indigo-600' : 'bg-slate-300'
                                }`}
                            >
                <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        darkMode ? 'translate-x-6' : 'translate-x-1'
                    }`}
                />
                            </button>
                        </div>

                        {/* Email Notifications */}
                        <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                            <div className="flex items-center gap-3">
                                <Mail className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                                <div>
                                    <p className="font-medium text-slate-900 dark:text-white">Email Notifications</p>
                                    <p className="text-xs text-slate-600 dark:text-slate-400">
                                        Receive email updates
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setEmailNotifications(!emailNotifications)}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                    emailNotifications ? 'bg-indigo-600' : 'bg-slate-300'
                                }`}
                            >
                <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        emailNotifications ? 'translate-x-6' : 'translate-x-1'
                    }`}
                />
                            </button>
                        </div>

                        {/* Push Notifications */}
                        <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                            <div className="flex items-center gap-3">
                                <Bell className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                                <div>
                                    <p className="font-medium text-slate-900 dark:text-white">Push Notifications</p>
                                    <p className="text-xs text-slate-600 dark:text-slate-400">
                                        Receive push notifications
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setPushNotifications(!pushNotifications)}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                    pushNotifications ? 'bg-indigo-600' : 'bg-slate-300'
                                }`}
                            >
                <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        pushNotifications ? 'translate-x-6' : 'translate-x-1'
                    }`}
                />
                            </button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Data Management */}
            <Card>
                <CardContent className="p-4 md:p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-600 to-emerald-600 flex items-center justify-center">
                            <Download className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white">
                                Data Management
                            </h2>
                            <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400">
                                Export, import, or delete your data
                            </p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <Button variant="outline" className="w-full justify-start">
                            <Download className="w-4 h-4 mr-2" />
                            Export Data
                            <span className="ml-auto text-xs text-slate-500">Download as CSV</span>
                        </Button>

                        <Button variant="outline" className="w-full justify-start">
                            <Upload className="w-4 h-4 mr-2" />
                            Import Data
                            <span className="ml-auto text-xs text-slate-500">Upload CSV file</span>
                        </Button>

                        <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                            <Button variant="outline" className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-900/20">
                                <Trash2 className="w-4 h-4 mr-2" />
                                Clear All Data
                                <span className="ml-auto text-xs">Permanent action</span>
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Danger Zone */}
            <Card className="border-red-200 dark:border-red-900">
                <CardContent className="p-4 md:p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                            <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400" />
                        </div>
                        <div>
                            <h2 className="text-lg md:text-xl font-bold text-red-600 dark:text-red-400">
                                Danger Zone
                            </h2>
                            <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400">
                                Irreversible actions
                            </p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-900">
                            <p className="text-sm text-slate-900 dark:text-white font-medium mb-1">
                                Delete Account
                            </p>
                            <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">
                                Once you delete your account, there is no going back. Please be certain.
                            </p>
                            <Button variant="outline" className="text-red-600 border-red-300 hover:bg-red-100 dark:border-red-800 dark:hover:bg-red-900/30">
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete My Account
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}