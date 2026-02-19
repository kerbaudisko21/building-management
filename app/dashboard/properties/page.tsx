'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Table from '@/components/ui/Table'
import AddPropertyForm, { PropertyFormData } from '@/components/forms/AddPropertyForm'
import { propertyService } from '@/lib/services'
import { useCrud } from '@/lib/hooks/useSupabaseQuery'
import { formatPercentage } from '@/utils'
import type { PropertyRow, PropertyInsert, PropertyUpdate } from '@/types/database'
import {
  Building, Plus, Search, MapPin, Home, Users,
  CheckCircle, Edit, Trash2, Wifi, Car, Droplet,
  Zap, Wind, Shield,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

// ─── Constants ───────────────────────────────────────────────

const FACILITY_ICONS: Record<string, LucideIcon> = {
  WiFi: Wifi,
  Parking: Car,
  'Swimming Pool': Droplet,
  Gym: Users,
  'Security 24/7': Shield,
  Elevator: Zap,
  AC: Wind,
}

// ─── Helpers ─────────────────────────────────────────────────

function getFacilityIcon(facility: string): LucideIcon {
  for (const [key, Icon] of Object.entries(FACILITY_ICONS)) {
    if (facility.includes(key)) return Icon
  }
  return CheckCircle
}

function getOccupancyPercentage(occupied: number, total: number): number {
  if (total === 0) return 0
  return Math.round((occupied / total) * 100)
}

function getOccupancyColor(percentage: number): string {
  if (percentage >= 90) return 'text-emerald-600 dark:text-emerald-400'
  if (percentage >= 70) return 'text-blue-600 dark:text-blue-400'
  if (percentage >= 50) return 'text-amber-600 dark:text-amber-400'
  return 'text-red-600 dark:text-red-400'
}

function getOccupancyBarColor(percentage: number): string {
  if (percentage >= 90) return 'bg-emerald-500'
  if (percentage >= 70) return 'bg-blue-500'
  if (percentage >= 50) return 'bg-amber-500'
  return 'bg-red-500'
}

// ─── Component ───────────────────────────────────────────────

export default function PropertiesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingProperty, setEditingProperty] = useState<PropertyRow | null>(null)

  const {
    items: properties,
    loading,
    error,
    addItem,
    updateItem,
    removeItem,
  } = useCrud<PropertyRow, PropertyInsert, PropertyUpdate>({
    service: propertyService,
    orderBy: 'created_at',
  })

  // ─── Handlers ────────────────────────────────────────────

  const handleEdit = (property: PropertyRow) => {
    setEditingProperty(property)
    setIsFormOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this property?')) return
    const result = await removeItem(id)
    if (result.error) {
      alert('Failed to delete: ' + result.error)
    }
  }

  const handleAddNew = () => {
    setEditingProperty(null)
    setIsFormOpen(true)
  }

  const handleFormSubmit = async (data: PropertyFormData) => {
    if (editingProperty) {
      await updateItem(editingProperty.id, data as PropertyUpdate)
    } else {
      await addItem(data as PropertyInsert)
    }
    setEditingProperty(null)
  }

  const handleCloseForm = () => {
    setIsFormOpen(false)
    setEditingProperty(null)
  }

  // ─── Derived State ───────────────────────────────────────

  const filteredProperties = properties.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.address.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const totalUnits = properties.reduce((sum, p) => sum + p.total_unit, 0)
  const totalOccupied = properties.reduce((sum, p) => sum + p.occupancy, 0)
  const avgOccupancy = totalUnits > 0 ? Math.round((totalOccupied / totalUnits) * 100) : 0

  // ─── Table Columns ───────────────────────────────────────

  const columns = [
    {
      key: 'name',
      label: 'Property',
      sortable: true,
      render: (item: PropertyRow) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
            <Building className="w-5 h-5 text-white" />
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-slate-900 dark:text-white truncate">
              {item.name}
            </p>
            <div className="flex items-start gap-1 mt-0.5">
              <MapPin className="w-3 h-3 text-slate-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-1">
                {item.address}
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'units',
      label: 'Units',
      sortable: true,
      render: (item: PropertyRow) => (
        <div className="text-center">
          <p className="text-2xl font-bold text-slate-900 dark:text-white">
            {item.total_unit}
          </p>
          <p className="text-xs text-slate-600 dark:text-slate-400">Total Units</p>
        </div>
      ),
    },
    {
      key: 'occupancy',
      label: 'Occupancy',
      sortable: true,
      render: (item: PropertyRow) => {
        const pct = getOccupancyPercentage(item.occupancy, item.total_unit)
        return (
          <div>
            <div className="flex items-baseline gap-2">
              <span className={`text-2xl font-bold ${getOccupancyColor(pct)}`}>
                {pct}%
              </span>
              <span className="text-sm text-slate-600 dark:text-slate-400">
                ({item.occupancy}/{item.total_unit})
              </span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mt-2">
              <div
                className={`h-2 rounded-full ${getOccupancyBarColor(pct)}`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        )
      },
    },
    {
      key: 'facility',
      label: 'Facilities',
      render: (item: PropertyRow) => (
        <div className="flex flex-wrap gap-1">
          {item.facility.slice(0, 3).map((fac, idx) => {
            const Icon = getFacilityIcon(fac)
            return (
              <div
                key={idx}
                className="flex items-center gap-1 px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-md"
                title={fac}
              >
                <Icon className="w-3 h-3 text-slate-600 dark:text-slate-400" />
                <span className="text-xs text-slate-600 dark:text-slate-400">
                  {fac.split(' ')[0]}
                </span>
              </div>
            )
          })}
          {item.facility.length > 3 && (
            <Badge variant="default" size="sm">
              +{item.facility.length - 3}
            </Badge>
          )}
        </div>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (item: PropertyRow) => (
        <div className="flex items-center gap-2">
          <Button size="sm" variant="ghost" onClick={() => handleEdit(item)}>
            <Edit className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="ghost" onClick={() => handleDelete(item.id)}>
            <Trash2 className="w-4 h-4 text-red-600" />
          </Button>
        </div>
      ),
    },
  ]

  // ─── Loading & Error States ──────────────────────────────

  if (loading) {
    return (
      <div className="p-4 md:p-6 flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="w-10 h-10 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-slate-600 dark:text-slate-400">Loading properties...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 md:p-6">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-red-600 dark:text-red-400 mb-2">Failed to load properties</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">{error}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // ─── Render ──────────────────────────────────────────────

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6 pb-24 md:pb-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
            Properties
          </h1>
          <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 mt-1">
            Manage buildings and apartment listings
          </p>
        </div>
        <Button className="w-full sm:w-auto" onClick={handleAddNew}>
          <Plus className="w-5 h-5" />
          Add Property
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <StatCard label="Total Properties" value={properties.length} icon={Building} color="indigo" />
        <StatCard label="Total Units" value={totalUnits} icon={Home} color="blue" />
        <StatCard label="Occupied" value={totalOccupied} icon={Users} color="emerald" />
        <StatCard
          label="Avg Occupancy"
          value={`${avgOccupancy}%`}
          icon={CheckCircle}
          color="purple"
          valueClass={getOccupancyColor(avgOccupancy)}
        />
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-3 md:p-4">
          <Input
            placeholder="Search properties by name or address..."
            leftIcon={<Search className="w-5 h-5" />}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </CardContent>
      </Card>

      {/* Mobile Cards */}
      <div className="block md:hidden space-y-3">
        {filteredProperties.map(property => (
          <PropertyMobileCard
            key={property.id}
            property={property}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block">
        <Table data={filteredProperties} columns={columns} />
      </div>

      {/* Add/Edit Form */}
      <AddPropertyForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSubmit={handleFormSubmit}
        editData={editingProperty}
      />
    </div>
  )
}

// ─── Sub-Components ──────────────────────────────────────────

interface StatCardProps {
  label: string
  value: string | number
  icon: LucideIcon
  color: string
  valueClass?: string
}

function StatCard({ label, value, icon: Icon, color, valueClass }: StatCardProps) {
  return (
    <Card>
      <CardContent className="p-3 md:p-4">
        <div className="flex items-center justify-between">
          <div className="min-w-0 flex-1">
            <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 truncate">
              {label}
            </p>
            <p className={`text-xl md:text-2xl font-bold mt-1 truncate ${
              valueClass ?? `text-${color}-600 dark:text-${color}-400`
            }`}>
              {value}
            </p>
          </div>
          <div className={`w-10 h-10 md:w-12 md:h-12 rounded-lg bg-${color}-100 dark:bg-${color}-900/30 flex items-center justify-center flex-shrink-0 ml-2`}>
            <Icon className={`w-5 h-5 md:w-6 md:h-6 text-${color}-600 dark:text-${color}-400`} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface PropertyMobileCardProps {
  property: PropertyRow
  onEdit: (property: PropertyRow) => void
  onDelete: (id: string) => void
}

function PropertyMobileCard({ property, onEdit, onDelete }: PropertyMobileCardProps) {
  const pct = getOccupancyPercentage(property.occupancy, property.total_unit)

  return (
    <Card hover>
      <CardContent className="p-4">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center flex-shrink-0">
            <Building className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-slate-900 dark:text-white truncate">
              {property.name}
            </h3>
            <div className="flex items-start gap-1 mt-1">
              <MapPin className="w-3 h-3 text-slate-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                {property.address}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="text-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
            <p className="text-2xl font-bold text-slate-900 dark:text-white">
              {property.total_unit}
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-400">Total Units</p>
          </div>
          <div className="text-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
            <p className={`text-2xl font-bold ${getOccupancyColor(pct)}`}>{pct}%</p>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              {property.occupancy}/{property.total_unit}
            </p>
          </div>
        </div>

        <div className="mb-3">
          <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">Facilities:</p>
          <div className="flex flex-wrap gap-1">
            {property.facility.map((fac, idx) => {
              const Icon = getFacilityIcon(fac)
              return (
                <div
                  key={idx}
                  className="flex items-center gap-1 px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-md"
                >
                  <Icon className="w-3 h-3 text-slate-600 dark:text-slate-400" />
                  <span className="text-xs text-slate-600 dark:text-slate-400">{fac}</span>
                </div>
              )
            })}
          </div>
        </div>

        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mb-3">
          <div
            className={`h-2 rounded-full ${getOccupancyBarColor(pct)}`}
            style={{ width: `${pct}%` }}
          />
        </div>

        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="flex-1" onClick={() => onEdit(property)}>
            <Edit className="w-4 h-4 mr-1" /> Edit
          </Button>
          <Button size="sm" variant="outline" className="flex-1" onClick={() => onDelete(property.id)}>
            <Trash2 className="w-4 h-4 mr-1 text-red-600" /> Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
