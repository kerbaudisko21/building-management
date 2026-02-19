'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import type { ServiceResult, QueryOptions } from '@/lib/services/supabase-service'

/**
 * Generic hook for fetching data from Supabase services.
 *
 * Usage:
 *   const { data, loading, error, refetch } = useSupabaseQuery(
 *     () => propertyService.getAll()
 *   )
 */
export function useSupabaseQuery<T>(
    queryFn: () => Promise<ServiceResult<T>>
) {
    const [data, setData] = useState<T | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const queryFnRef = useRef(queryFn)
    queryFnRef.current = queryFn

    const fetchData = useCallback(async () => {
        setLoading(true)
        setError(null)
        try {
            const result = await queryFnRef.current()
            if (result.error) {
                setError(result.error)
                setData(null)
            } else {
                setData(result.data)
            }
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Unknown error'
            setError(message)
            setData(null)
        }
        setLoading(false)
    }, [])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    return { data, loading, error, refetch: fetchData }
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
    getAll: (options?: QueryOptions) => Promise<ServiceResult<TRow[]>>
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
    const itemsRef = useRef<TRow[]>([])
    itemsRef.current = items

    // Initial fetch
    const fetchItems = useCallback(async () => {
        setLoading(true)
        setError(null)
        try {
            const result = await service.getAll(
                orderBy ? { orderBy, ascending } : undefined
            )
            if (result.error) {
                setError(result.error)
            } else {
                setItems(result.data ?? [])
            }
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Unknown error'
            setError(message)
        }
        setLoading(false)
    }, [service, orderBy, ascending])

    useEffect(() => {
        fetchItems()
    }, [fetchItems])

    // Create
    const addItem = useCallback(async (data: TInsert): Promise<ServiceResult<TRow>> => {
        setActionLoading(true)
        try {
            const result = await service.create(data)
            if (result.data) {
                setItems(prev => [result.data!, ...prev])
            }
            setActionLoading(false)
            return result
        } catch (err: unknown) {
            setActionLoading(false)
            return { data: null, error: err instanceof Error ? err.message : 'Create failed' }
        }
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
        try {
            const result = await service.update(id, updates)
            if (result.error) {
                await fetchItems()
            } else if (result.data) {
                setItems(prev =>
                    prev.map(item => (item.id === id ? result.data! : item))
                )
            }
            setActionLoading(false)
            return result
        } catch (err: unknown) {
            await fetchItems()
            setActionLoading(false)
            return { data: null, error: err instanceof Error ? err.message : 'Update failed' }
        }
    }, [service, fetchItems])

    // Delete
    const removeItem = useCallback(async (id: string): Promise<ServiceResult<null>> => {
        setActionLoading(true)
        const previousItems = itemsRef.current
        setItems(prev => prev.filter(item => item.id !== id))
        try {
            const result = await service.remove(id)
            if (result.error) {
                setItems(previousItems)
            }
            setActionLoading(false)
            return result
        } catch (err: unknown) {
            setItems(previousItems)
            setActionLoading(false)
            return { data: null, error: err instanceof Error ? err.message : 'Delete failed' }
        }
    }, [service])

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