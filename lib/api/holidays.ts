import { HolidayCache } from '@/lib/cache/holidays'

const CALENDARIFIC_API_KEY = 'qLMCgBSuBVrQzHZPTwGjHE1eMpd8Z5NJ'
const CALENDARIFIC_URL = 'https://calendarific.com/api/v2/holidays'

export interface Holiday {
    name: string
    date: string
    description?: string
    type: string[]
    locations?: string
    states?: string
}

// Static fallback data for Indonesia 2025
// Jika API gagal, akan pakai data ini
const STATIC_HOLIDAYS_2025: Holiday[] = [
    { name: "New Year's Day", date: '2025-01-01', type: ['National holiday'] },
    { name: 'Chinese New Year', date: '2025-01-29', type: ['National holiday'] },
    { name: 'Isra and Mi\'raj', date: '2025-02-07', type: ['National holiday'] },
    { name: 'Nyepi (Balinese New Year)', date: '2025-03-29', type: ['National holiday'] },
    { name: 'Good Friday', date: '2025-04-18', type: ['National holiday'] },
    { name: 'Eid al-Fitr', date: '2025-03-31', type: ['National holiday'] },
    { name: 'Eid al-Fitr Holiday', date: '2025-04-01', type: ['National holiday'] },
    { name: 'Labor Day', date: '2025-05-01', type: ['National holiday'] },
    { name: 'Ascension Day', date: '2025-05-29', type: ['National holiday'] },
    { name: 'Pancasila Day', date: '2025-06-01', type: ['National holiday'] },
    { name: 'Eid al-Adha', date: '2025-06-06', type: ['National holiday'] },
    { name: 'Islamic New Year', date: '2025-06-27', type: ['National holiday'] },
    { name: 'Independence Day', date: '2025-08-17', type: ['National holiday'] },
    { name: "Prophet Muhammad's Birthday", date: '2025-09-05', type: ['National holiday'] },
    { name: 'Christmas Day', date: '2025-12-25', type: ['National holiday'] },
    { name: 'Joint Holiday', date: '2025-12-26', type: ['National holiday'] },
]

/**
 * Get holidays for a specific year with 3-tier fallback:
 * 1. Try cache (localStorage) - valid for 30 days
 * 2. Try API call to Calendarific
 * 3. Fall back to static data
 */
export async function getHolidays(year: number = new Date().getFullYear()): Promise<Holiday[]> {
    // TIER 1: Check cache first (30 days validity)
    const cached = HolidayCache.get(year)
    if (cached) {
        return cached
    }

    // TIER 2: Try API
    try {
        console.log(`📡 Fetching holidays from Calendarific API for ${year}...`)

        const response = await fetch(
            `${CALENDARIFIC_URL}?api_key=${CALENDARIFIC_API_KEY}&country=ID&year=${year}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        )

        if (!response.ok) {
            throw new Error(`API Error: ${response.status} ${response.statusText}`)
        }

        const data = await response.json()

        if (!data.response || !data.response.holidays) {
            throw new Error('Invalid API response format')
        }

        // Transform API response to our format
        const holidays: Holiday[] = data.response.holidays
            .filter((h: any) => h.type.includes('National holiday'))
            .map((h: any) => ({
                name: h.name,
                date: h.date.iso,
                description: h.description || '',
                type: h.type,
                locations: h.locations || '',
                states: h.states || '',
            }))
            .sort((a: Holiday, b: Holiday) => a.date.localeCompare(b.date))

        console.log(`✅ Fetched ${holidays.length} holidays from API for ${year}`)

        // Cache the result for 30 days
        HolidayCache.set(year, holidays)

        return holidays
    } catch (error) {
        console.error('❌ Calendarific API failed:', error)

        // TIER 3: Fallback to static data
        console.log(`📋 Using static fallback data for ${year}`)

        if (year === 2025) {
            return STATIC_HOLIDAYS_2025
        }

        // For other years, return empty or generate generic holidays
        return []
    }
}

/**
 * Get upcoming holidays (from today)
 */
export async function getUpcomingHolidays(limit: number = 5): Promise<Holiday[]> {
    const today = new Date()
    const currentYear = today.getFullYear()

    // Get current year holidays
    let holidays = await getHolidays(currentYear)

    // Filter to only upcoming
    const todayStr = today.toISOString().split('T')[0]
    let upcoming = holidays.filter(h => h.date >= todayStr)

    // If less than limit, get next year's holidays too
    if (upcoming.length < limit) {
        const nextYearHolidays = await getHolidays(currentYear + 1)
        upcoming = [...upcoming, ...nextYearHolidays]
    }

    return upcoming.slice(0, limit)
}

/**
 * Preload next year's holidays in background
 * Call this on dashboard mount to prepare cache
 */
export function preloadNextYear(): void {
    const nextYear = new Date().getFullYear() + 1

    // Check if already cached
    if (!HolidayCache.isValid(nextYear)) {
        console.log(`🔄 Preloading holidays for ${nextYear}...`)
        // Fetch in background (don't await)
        getHolidays(nextYear).catch(err => {
            console.error(`Failed to preload ${nextYear}:`, err)
        })
    } else {
        console.log(`✅ Holidays for ${nextYear} already cached`)
    }
}

/**
 * Get cache statistics
 */
export function getCacheStats() {
    return {
        info: HolidayCache.getInfo(),
        currentYearValid: HolidayCache.isValid(new Date().getFullYear()),
        nextYearValid: HolidayCache.isValid(new Date().getFullYear() + 1),
    }
}

/**
 * Clear all holiday caches (for admin/debug purposes)
 */
export function clearAllCaches(): void {
    HolidayCache.clear()
    console.log('🗑️ All holiday caches cleared')
}