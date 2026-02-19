'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/lib/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { userService } from '@/lib/services'
import { useSupabaseQuery } from '@/lib/hooks/useSupabaseQuery'
import { Card, CardContent } from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Modal from '@/components/ui/Modal'
import Select from '@/components/ui/Select'
import { formatDate } from '@/utils'
import type { UserProfileRow } from '@/types/database'
import {
  UserPlus, Shield, User, Trash2, Search,
  Mail, UserCircle2, Key,
} from 'lucide-react'

// ─── Types ───────────────────────────────────────────────────

interface AddUserForm {
  email: string
  password: string
  fullName: string
  role: 'superadmin' | 'admin'
}

const INITIAL_FORM: AddUserForm = {
  email: '',
  password: '',
  fullName: '',
  role: 'admin',
}

// ─── Component ───────────────────────────────────────────────

export default function UsersPage() {
  const { user } = useAuth()
  const router = useRouter()
  const supabase = createClient()

  const [searchQuery, setSearchQuery] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [formData, setFormData] = useState<AddUserForm>(INITIAL_FORM)
  const [formError, setFormError] = useState('')
  const [formLoading, setFormLoading] = useState(false)

  const {
    data: users,
    loading: isLoading,
    refetch: loadUsers,
  } = useSupabaseQuery(
    () => userService.getAll({ orderBy: 'created_at', ascending: false }),
    []
  )

  // Guard: only superadmin can access
  useEffect(() => {
    if (!user) return
    if (user.role !== 'superadmin') {
      router.push('/dashboard')
    }
  }, [user, router])

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError('')
    setFormLoading(true)

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: { data: { full_name: formData.fullName } },
      })

      if (authError) throw authError

      if (authData.user && formData.role === 'superadmin') {
        await supabase
          .from('user_profiles')
          .update({ role: 'superadmin' })
          .eq('id', authData.user.id)
      }

      await loadUsers()
      setShowAddModal(false)
      setFormData(INITIAL_FORM)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create user'
      setFormError(message)
    } finally {
      setFormLoading(false)
    }
  }

  const handleDeleteUser = async (userId: string, userEmail: string) => {
    if (userId === user?.id) return
    if (!confirm(`Delete user: ${userEmail}?`)) return

    const result = await userService.remove(userId)
    if (result.error) {
      setFormError('Failed to delete: ' + result.error)
    } else {
      await loadUsers()
    }
  }

  // ─── Derived State ───────────────────────────────────────

  const userList = users ?? []
  const filteredUsers = userList.filter(u =>
    u.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchQuery.toLowerCase())
  )
  const superadminCount = userList.filter(u => u.role === 'superadmin').length
  const adminCount = userList.filter(u => u.role === 'admin').length

  // ─── Guards ──────────────────────────────────────────────

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400">Loading...</p>
        </div>
      </div>
    )
  }

  if (user.role !== 'superadmin') return null

  // ─── Render ──────────────────────────────────────────────

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6 pb-24 md:pb-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Shield className="w-8 h-8 text-purple-600" />
            User Management
          </h1>
          <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 mt-1">
            Manage system users and permissions
          </p>
        </div>
        <Button className="w-full sm:w-auto" onClick={() => setShowAddModal(true)}>
          <UserPlus className="w-5 h-5" />
          Add User
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
        <Card>
          <CardContent className="p-4 md:p-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                <User className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{userList.length}</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">Total Users</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 md:p-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                <Shield className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{superadminCount}</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">Super Admins</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 md:p-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                <User className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{adminCount}</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">Admins</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-3 md:p-4">
          <Input
            placeholder="Search users..."
            leftIcon={<Search className="w-5 h-5" />}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Created</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                      No users found
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map(u => (
                    <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                            {u.full_name?.charAt(0).toUpperCase() ?? '?'}
                          </div>
                          <span className="font-medium text-slate-900 dark:text-white">
                            {u.full_name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{u.email}</td>
                      <td className="px-6 py-4">
                        <Badge variant={u.role === 'superadmin' ? 'purple' : 'info'}>
                          {u.role === 'superadmin' ? 'Super Admin' : 'Admin'}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                        {formatDate(u.created_at)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {u.id !== user.id && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteUser(u.id, u.email)}
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Add User Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => { setShowAddModal(false); setFormError('') }}
        title="Add New User"
      >
        <form onSubmit={handleAddUser} className="space-y-4">
          {formError && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400">{formError}</p>
            </div>
          )}

          <Input
            label="Full Name"
            leftIcon={<UserCircle2 className="w-5 h-5" />}
            value={formData.fullName}
            onChange={e => setFormData({ ...formData, fullName: e.target.value })}
            placeholder="John Doe"
            required
          />

          <Input
            label="Email"
            type="email"
            leftIcon={<Mail className="w-5 h-5" />}
            value={formData.email}
            onChange={e => setFormData({ ...formData, email: e.target.value })}
            placeholder="user@example.com"
            required
          />

          <Input
            label="Password"
            type="password"
            leftIcon={<Key className="w-5 h-5" />}
            value={formData.password}
            onChange={e => setFormData({ ...formData, password: e.target.value })}
            placeholder="••••••••"
            required
            minLength={6}
          />

          <Select
            label="Role"
            value={formData.role}
            onChange={e => setFormData({ ...formData, role: e.target.value as 'admin' | 'superadmin' })}
            options={[
              { value: 'admin', label: 'Admin' },
              { value: 'superadmin', label: 'Super Admin' },
            ]}
          />

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => { setShowAddModal(false); setFormError('') }}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={formLoading}>
              {formLoading ? 'Creating...' : 'Create User'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
