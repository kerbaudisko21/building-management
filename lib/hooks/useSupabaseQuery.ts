'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import type { ServiceResult, QueryOptions } from '@/lib/services/supabase-service'

/**
 * Generic hook for fetching data from Supabase services.
 * Uses a fetchId counter to handle race conditions instead of mountedRef.
 */
export function useSupabaseQuery<T>(
    queryFn: () => Promise<ServiceResult<T>>
) {
    const [data, setData] = useState<T | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const queryFnRef = useRef(queryFn)
    queryFnRef.current = queryFn
    // Counter to track the latest fetch — stale fetches are ignored
    const fetchIdRef = useRef(0)

    const fetchData = useCallback(async () => {
        const myFetchId = ++fetchIdRef.current
        setLoading(true)
        setError(null)
        try {
            const result = await queryFnRef.current()
            // Only apply if this is still the latest fetch
            if (myFetchId !== fetchIdRef.current) return
            if (result.error) {
                setError(result.error)
                setData(null)
            } else {
                setData(result.data)
            }
        } catch (err: unknown) {
            if (myFetchId !== fetchIdRef.current) return
            const message = err instanceof Error ? err.message : 'Unknown error'
            setError(message)
            setData(null)
        }
        if (myFetchId === fetchIdRef.current) setLoading(false)
    }, [])

    useEffect(() => {
        fetchData()
        // No cleanup needed — fetchId handles staleness
    }, [fetchData])

    return { data, loading, error, refetch: fetchData }
}

/**
 * Hook for CRUD operations with optimistic updates.
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

    const serviceRef = useRef(service)
    const orderByRef = useRef(orderBy)
    const ascendingRef = useRef(ascending)
    const itemsRef = useRef<TRow[]>([])
    const fetchIdRef = useRef(0)
    serviceRef.current = service
    orderByRef.current = orderBy
    ascendingRef.current = ascending
    itemsRef.current = items

    const fetchItems = useCallback(async () => {
        const myFetchId = ++fetchIdRef.current
        setLoading(true)
        setError(null)
        try {
            const result = await serviceRef.current.getAll(
                orderByRef.current ? { orderBy: orderByRef.current, ascending: ascendingRef.current } : undefined
            )
            if (myFetchId !== fetchIdRef.current) return
            if (result.error) {
                setError(result.error)
            } else {
                setItems(result.data ?? [])
            }
        } catch (err: unknown) {
            if (myFetchId !== fetchIdRef.current) return
            const message = err instanceof Error ? err.message : 'Unknown error'
            setError(message)
        }
        if (myFetchId === fetchIdRef.current) setLoading(false)
    }, [])

    useEffect(() => {
        fetchItems()
    }, [fetchItems])

    const addItem = useCallback(async (data: TInsert): Promise<ServiceResult<TRow>> => {
        setActionLoading(true)
        try {
            const result = await serviceRef.current.create(data)
            if (result.data) {
                setItems(prev => [result.data!, ...prev])
            }
            setActionLoading(false)
            return result
        } catch (err: unknown) {
            setActionLoading(false)
            return { data: null, error: err instanceof Error ? err.message : 'Create failed' }
        }
    }, [])

    const updateItem = useCallback(async (id: string, updates: TUpdate): Promise<ServiceResult<TRow>> => {
        setActionLoading(true)
        setItems(prev =>
            prev.map(item =>
                item.id === id ? { ...item, ...(updates as Partial<TRow>) } : item
            )
        )
        try {
            const result = await serviceRef.current.update(id, updates)
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
    }, [fetchItems])

    const removeItem = useCallback(async (id: string): Promise<ServiceResult<null>> => {
        setActionLoading(true)
        const previousItems = itemsRef.current
        setItems(prev => prev.filter(item => item.id !== id))
        try {
            const result = await serviceRef.current.remove(id)
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
    }, [])

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