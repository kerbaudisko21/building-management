'use client'

import { useState, useEffect, useCallback } from 'react'
import type { ServiceResult } from '@/lib/services/supabase-service'

/**
 * Generic hook for fetching data from Supabase services.
 *
 * Usage:
 *   const { data, loading, error, refetch } = useSupabaseQuery(
 *     () => propertyService.getAll()
 *   )
 */
export function useSupabaseQuery<T>(
  queryFn: () => Promise<ServiceResult<T>>,
  deps: unknown[] = []
) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetch = useCallback(async () => {
    setLoading(true)
    setError(null)

    const result = await queryFn()

    if (result.error) {
      setError(result.error)
      setData(null)
    } else {
      setData(result.data)
    }

    setLoading(false)
  }, deps) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetch()
  }, [fetch])

  return { data, loading, error, refetch: fetch }
}

/**
 * Hook for CRUD operations with optimistic updates.
 *
 * Usage:
 *   const { items, loading, error, addItem, updateItem, removeItem } = useCrud({
 *     service: propertyService,
 *   })
 */
interface CrudService<TRow extends { id: string }, TInsert, TUpdate> {
  getAll: (options?: unknown) => Promise<ServiceResult<TRow[]>>
  create: (record: TInsert) => Promise<ServiceResult<TRow>>
  update: (id: string, updates: TUpdate) => Promise<ServiceResult<TRow>>
  remove: (id: string) => Promise<ServiceResult<null>>
}

interface UseCrudOptions<TRow extends { id: string }, TInsert, TUpdate> {
  service: CrudService<TRow, TInsert, TUpdate>
  orderBy?: string
  ascending?: boolean
}

export function useCrud<
  TRow extends { id: string },
  TInsert = Omit<TRow, 'id' | 'created_at' | 'updated_at'>,
  TUpdate = Partial<TInsert>
>({ service, orderBy, ascending }: UseCrudOptions<TRow, TInsert, TUpdate>) {
  const [items, setItems] = useState<TRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState(false)

  // Initial fetch
  const fetchItems = useCallback(async () => {
    setLoading(true)
    setError(null)

    const result = await service.getAll(
      orderBy ? { orderBy, ascending } : undefined
    )

    if (result.error) {
      setError(result.error)
    } else {
      setItems(result.data ?? [])
    }

    setLoading(false)
  }, [service, orderBy, ascending])

  useEffect(() => {
    fetchItems()
  }, [fetchItems])

  // Create
  const addItem = useCallback(async (data: TInsert): Promise<ServiceResult<TRow>> => {
    setActionLoading(true)
    const result = await service.create(data)

    if (result.data) {
      setItems(prev => [result.data!, ...prev])
    }

    setActionLoading(false)
    return result
  }, [service])

  // Update
  const updateItem = useCallback(async (id: string, updates: TUpdate): Promise<ServiceResult<TRow>> => {
    setActionLoading(true)

    // Optimistic update
    setItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, ...(updates as Partial<TRow>) } : item
      )
    )

    const result = await service.update(id, updates)

    if (result.error) {
      // Revert on error
      await fetchItems()
    } else if (result.data) {
      setItems(prev =>
        prev.map(item => (item.id === id ? result.data! : item))
      )
    }

    setActionLoading(false)
    return result
  }, [service, fetchItems])

  // Delete
  const removeItem = useCallback(async (id: string): Promise<ServiceResult<null>> => {
    setActionLoading(true)

    // Optimistic delete
    const previousItems = items
    setItems(prev => prev.filter(item => item.id !== id))

    const result = await service.remove(id)

    if (result.error) {
      // Revert on error
      setItems(previousItems)
    }

    setActionLoading(false)
    return result
  }, [service, items])

  return {
    items,
    loading,
    error,
    actionLoading,
    addItem,
    updateItem,
    removeItem,
    refetch: fetchItems,
  }
}
