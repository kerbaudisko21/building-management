import { createClient } from '@/lib/supabase/client'

export interface ServiceResult<T> {
  data: T | null
  error: string | null
}

export interface QueryOptions {
  orderBy?: string
  ascending?: boolean
  limit?: number
  offset?: number
  filters?: Record<string, unknown>
}

export function createService<
  TRow extends { id: string },
  TInsert = Omit<TRow, 'id' | 'created_at' | 'updated_at'>,
  TUpdate = Partial<TInsert>
>(tableName: string) {
  const supabase = createClient()

  return {
    async getAll(options?: QueryOptions): Promise<ServiceResult<TRow[]>> {
      try {
        let query = supabase.from(tableName).select('*')
        if (options?.filters) {
          for (const [key, value] of Object.entries(options.filters)) {
            query = query.eq(key, value)
          }
        }
        if (options?.orderBy) {
          query = query.order(options.orderBy, { ascending: options.ascending ?? false })
        } else {
          query = query.order('created_at', { ascending: false })
        }
        if (options?.limit) query = query.limit(options.limit)
        if (options?.offset) query = query.range(options.offset, options.offset + (options.limit ?? 50) - 1)
        const { data, error } = await query
        if (error) throw error
        return { data: (data as TRow[]) ?? [], error: null }
      } catch (err) {
        return { data: null, error: err instanceof Error ? err.message : 'Failed to fetch data' }
      }
    },

    async getById(id: string): Promise<ServiceResult<TRow>> {
      try {
        const { data, error } = await supabase.from(tableName).select('*').eq('id', id).single()
        if (error) throw error
        return { data: data as TRow, error: null }
      } catch (err) {
        return { data: null, error: err instanceof Error ? err.message : 'Failed to fetch record' }
      }
    },

    async create(record: TInsert): Promise<ServiceResult<TRow>> {
      try {
        const { data, error } = await supabase.from(tableName).insert(record as Record<string, unknown>).select().single()
        if (error) throw error
        return { data: data as TRow, error: null }
      } catch (err) {
        return { data: null, error: err instanceof Error ? err.message : 'Failed to create record' }
      }
    },

    async update(id: string, updates: TUpdate): Promise<ServiceResult<TRow>> {
      try {
        const { data, error } = await supabase.from(tableName).update(updates as Record<string, unknown>).eq('id', id).select().single()
        if (error) throw error
        return { data: data as TRow, error: null }
      } catch (err) {
        return { data: null, error: err instanceof Error ? err.message : 'Failed to update record' }
      }
    },

    async remove(id: string): Promise<ServiceResult<null>> {
      try {
        const { error } = await supabase.from(tableName).delete().eq('id', id)
        if (error) throw error
        return { data: null, error: null }
      } catch (err) {
        return { data: null, error: err instanceof Error ? err.message : 'Failed to delete record' }
      }
    },

    async count(filters?: Record<string, unknown>): Promise<ServiceResult<number>> {
      try {
        let query = supabase.from(tableName).select('*', { count: 'exact', head: true })
        if (filters) {
          for (const [key, value] of Object.entries(filters)) {
            query = query.eq(key, value)
          }
        }
        const { count, error } = await query
        if (error) throw error
        return { data: count ?? 0, error: null }
      } catch (err) {
        return { data: null, error: err instanceof Error ? err.message : 'Failed to count records' }
      }
    },
  }
}
