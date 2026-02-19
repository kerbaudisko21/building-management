                                                'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
    Building2, Users, Key, FileText, DollarSign,
    Wrench, Calendar, CheckCircle, AlertCircle, Clock
} from 'lucide-react'

export default function DashboardPage() {
    const router = useRouter()
    const [holidays, setHolidays] = useState<any[]>([])
    const [loadingHolidays, setLoadingHolidays] = useState(false)

    // Load holidays from API route
    useEffect(() => {
        async function loadHolidays() {
            setLoadingHolidays(true)
            try {
                const response = await fetch('/api/holidays')
                if (response.ok) {
                    const data = await response.json()
                    setHolidays(data.holidays || [])
                }
            } catch (error) {
                console.error('Error loading holidays:', error)
            } finally {
                setLoadingHolidays(false)
            }
        }

        loadHolidays()
    }, [])

    return (
        <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
            {/* Welcome Header */}
            <div className="mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2">
                    Dashboard Overview
                </h1>
                <p className="text-slate-600 dark:text-slate-400">
                    Building Management System
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                            <Building2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <span className="text-xs font-medium text-green-600 dark:text-green-400">+12%</span>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">24</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Total Properties</p>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                            <Key className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                        </div>
                        <span className="text-xs font-medium text-green-600 dark:text-green-400">+8%</span>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">156</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Total Units</p>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                            <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                        </div>
                        <span className="text-xs font-medium text-green-600 dark:text-green-400">89%</span>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">139</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Occupied Units</p>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-lg bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center">
                            <DollarSign className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                        </div>
                        <span className="text-xs font-medium text-green-600 dark:text-green-400">+15%</span>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">$45.2K</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Monthly Revenue</p>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="mb-8">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Quick Actions</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <button
                        onClick={() => router.push('/properties')}
                        className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-200 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-500 transition-colors text-center group"
                    >
                        <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                            <Building2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <p className="text-sm font-medium text-slate-900 dark:text-white">Add Property</p>
                    </button>

                    <button
                        onClick={() => router.push('/rooms')}
                        className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-200 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-500 transition-colors text-center group"
                    >
                        <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                            <Key className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                        </div>
                        <p className="text-sm font-medium text-slate-900 dark:text-white">Add Unit</p>
                    </button>

                    <button
                        onClick={() => router.push('/contacts')}
                        className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-200 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-500 transition-colors text-center group"
                    >
                        <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/20 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                            <Users className="w-6 h-6 text-green-600 dark:text-green-400" />
                        </div>
                        <p className="text-sm font-medium text-slate-900 dark:text-white">Add Contact</p>
                    </button>

                    <button
                        onClick={() => router.push('/contracts')}
                        className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-200 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-500 transition-colors text-center group"
                    >
                        <div className="w-12 h-12 rounded-lg bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                            <FileText className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                        </div>
                        <p className="text-sm font-medium text-slate-900 dark:text-white">New Contract</p>
                    </button>
                </div>
            </div>

            {/* Recent Activity & Holidays */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Activity */}
                <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Recent Activity</h3>
                    <div className="space-y-4">
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center flex-shrink-0">
                                <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm text-slate-900 dark:text-white font-medium">New tenant checked in</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">Unit A-101 • 2 hours ago</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center flex-shrink-0">
                                <DollarSign className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm text-slate-900 dark:text-white font-medium">Payment received</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">$1,200 from John Doe • 5 hours ago</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center flex-shrink-0">
                                <Wrench className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm text-slate-900 dark:text-white font-medium">Maintenance completed</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">AC repair in B-205 • Yesterday</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Upcoming Holidays */}
                <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-indigo-600" />
                        Upcoming Holidays
                    </h3>

                    {loadingHolidays ? (
                        <div className="text-center py-8">
                            <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                            <p className="text-sm text-slate-500 dark:text-slate-400">Loading holidays...</p>
                        </div>
                    ) : holidays.length === 0 ? (
                        <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                            <Calendar className="w-12 h-12 mx-auto mb-2 opacity-30" />
                            <p className="text-sm">No upcoming holidays</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {holidays.map((holiday, index) => (
                                <div key={index} className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                                    <div className="w-8 h-8 rounded bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center flex-shrink-0">
                                        <Calendar className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm text-slate-900 dark:text-white font-medium">{holiday.name}</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">
                                            {new Date(holiday.date).toLocaleDateString('id-ID', {
                                                weekday: 'long',
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                            {holiday.daysUntil === 0 && ' • Today!'}
                                            {holiday.daysUntil === 1 && ' • Tomorrow'}
                                            {holiday.daysUntil > 1 && ` • ${holiday.daysUntil} days`}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}