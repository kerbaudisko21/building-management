interface CachedHolidays {
    data: any[]
    timestamp: number
    year: number
}

const CACHE_KEY = 'calendarific_holidays'
const CACHE_DURATION = 30 * 24 * 60 * 60 * 1000 // 30 days in milliseconds

export class HolidayCache {
    static get(year: number): any[] | null {
        if (typeof window === 'undefined') return null

        try {
            const cached = localStorage.getItem(`${CACHE_KEY}_${year}`)
            if (!cached) return null

            const parsed: CachedHolidays = JSON.parse(cached)

            const now = Date.now()
            if (now - parsed.timestamp > CACHE_DURATION) {
                localStorage.removeItem(`${CACHE_KEY}_${year}`)
                console.log(`🗑️ Cache expired for ${year}`)
                return null
            }

            console.log(`✅ Using cached holidays for ${year}`)
            return parsed.data
        } catch (error) {
            console.error('Cache read error:', error)
            return null
        }
    }

    static set(year: number, data: any[]): void {
        if (typeof window === 'undefined') return

        try {
            const cacheData: CachedHolidays = {
                data,
                timestamp: Date.now(),
                year,
            }
            localStorage.setItem(`${CACHE_KEY}_${year}`, JSON.stringify(cacheData))
            console.log(`💾 Cached ${data.length} holidays for ${year}`)
        } catch (error) {
            console.error('Cache write error:', error)
            // If localStorage is full, clear old caches
            if (error instanceof Error && error.name === 'QuotaExceededError') {
                this.clearOldCaches()
                // Try again
                try {
                    const cacheData: CachedHolidays = { data, timestamp: Date.now(), year }
                    localStorage.setItem(`${CACHE_KEY}_${year}`, JSON.stringify(cacheData))
                } catch {
                    console.error('Failed to cache after cleanup')
                }
            }
        }
    }

    static clear(): void {
        if (typeof window === 'undefined') return

        const keys = Object.keys(localStorage).filter(key => key.startsWith(CACHE_KEY))
        keys.forEach(key => localStorage.removeItem(key))

        console.log(`🗑️ Cleared ${keys.length} holiday caches`)
    }

    static clearOldCaches(): void {
        if (typeof window === 'undefined') return

        const currentYear = new Date().getFullYear()
        const keys = Object.keys(localStorage).filter(key => key.startsWith(CACHE_KEY))

        keys.forEach(key => {
            try {
                const cached: CachedHolidays = JSON.parse(localStorage.getItem(key)!)
                if (cached.year < currentYear) {
                    localStorage.removeItem(key)
                    console.log(`🗑️ Removed old cache for ${cached.year}`)
                }
            } catch {
                // Invalid cache, remove it
                localStorage.removeItem(key)
            }
        })
    }

    static getInfo(): { year: number; cachedAt: Date; expiresAt: Date; size: number }[] {
        if (typeof window === 'undefined') return []

        return Object.keys(localStorage)
            .filter(key => key.startsWith(CACHE_KEY))
            .map(key => {
                try {
                    const cached: CachedHolidays = JSON.parse(localStorage.getItem(key)!)
                    return {
                        year: cached.year,
                        cachedAt: new Date(cached.timestamp),
                        expiresAt: new Date(cached.timestamp + CACHE_DURATION),
                        size: cached.data.length,
                    }
                } catch {
                    return null
                }
            })
            .filter(Boolean) as any[]
    }

    static isValid(year: number): boolean {
        if (typeof window === 'undefined') return false

        try {
            const cached = localStorage.getItem(`${CACHE_KEY}_${year}`)
            if (!cached) return false

            const parsed: CachedHolidays = JSON.parse(cached)
            const now = Date.now()

            return (now - parsed.timestamp) <= CACHE_DURATION
        } catch {
            return false
        }
    }
}