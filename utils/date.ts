/**
 * Date Formatting Utilities
 * Indonesian locale date formatting functions
 */

/**
 * Format date to Indonesian format
 * @param date - Date string or Date object
 * @param options - Intl.DateTimeFormatOptions (optional)
 * @returns Formatted date string (e.g., "15 Feb 2024")
 */
export function formatDate(
    date: string | Date,
    options?: Intl.DateTimeFormatOptions
): string {
    if (!date) return '-';

    const dateObj = typeof date === 'string' ? new Date(date) : date;

    const defaultOptions: Intl.DateTimeFormatOptions = {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        ...options,
    };

    return dateObj.toLocaleDateString('id-ID', defaultOptions);
}

/**
 * Format date with full month name
 * @param date - Date string or Date object
 * @returns Formatted date string (e.g., "15 Februari 2024")
 */
export function formatDateLong(date: string | Date): string {
    return formatDate(date, {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
}

/**
 * Format date with weekday
 * @param date - Date string or Date object
 * @returns Formatted date string (e.g., "Senin, 15 Feb 2024")
 */
export function formatDateWithDay(date: string | Date): string {
    return formatDate(date, {
        weekday: 'long',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
}

/**
 * Format date for input fields (YYYY-MM-DD)
 * @param date - Date string or Date object
 * @returns ISO date string (e.g., "2024-02-15")
 */
export function formatDateForInput(date: string | Date): string {
    if (!date) return '';

    const dateObj = typeof date === 'string' ? new Date(date) : date;

    return dateObj.toISOString().split('T')[0];
}

/**
 * Calculate days between two dates
 * @param date1 - First date
 * @param date2 - Second date (default: today)
 * @returns Number of days (negative if date1 is in past)
 */
export function getDaysBetween(date1: string | Date, date2?: string | Date): number {
    const d1 = typeof date1 === 'string' ? new Date(date1) : date1;
    const d2 = date2
        ? (typeof date2 === 'string' ? new Date(date2) : date2)
        : new Date();

    const diffTime = d1.getTime() - d2.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Format relative time (e.g., "2 days ago", "in 5 days")
 * @param date - Date string or Date object
 * @returns Relative time string
 */
export function formatRelativeTime(date: string | Date): string {
    const days = getDaysBetween(date);

    if (days === 0) return 'Hari ini';
    if (days === 1) return 'Besok';
    if (days === -1) return 'Kemarin';
    if (days > 0) return `${days} hari lagi`;
    return `${Math.abs(days)} hari yang lalu`;
}

/**
 * Format date for countdown display
 * @param date - Target date
 * @returns Countdown string (e.g., "In 5 days", "Today", "3 days overdue")
 */
export function formatCountdown(date: string | Date): string {
    const days = getDaysBetween(date);

    if (days < 0) {
        return `${Math.abs(days)} days overdue`;
    }
    if (days === 0) return 'Today';
    if (days === 1) return 'Tomorrow';
    return `In ${days} days`;
}

/**
 * Check if date is in the past
 * @param date - Date to check
 * @returns True if date is in the past
 */
export function isPastDate(date: string | Date): boolean {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    dateObj.setHours(0, 0, 0, 0);

    return dateObj < today;
}

/**
 * Check if date is within range
 * @param date - Date to check
 * @param days - Number of days (default: 7)
 * @returns True if date is within the range
 */
export function isWithinDays(date: string | Date, days: number = 7): boolean {
    const daysBetween = getDaysBetween(date);
    return daysBetween >= 0 && daysBetween <= days;
}

/**
 * Get current date in ISO format
 * @returns Current date string (YYYY-MM-DD)
 */
export function getTodayISO(): string {
    return new Date().toISOString().split('T')[0];
}

/**
 * Format time (HH:MM)
 * @param date - Date string or Date object
 * @returns Time string (e.g., "14:30")
 */
export function formatTime(date: string | Date): string {
    if (!date) return '-';

    const dateObj = typeof date === 'string' ? new Date(date) : date;

    return dateObj.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    });
}

/**
 * Format datetime
 * @param date - Date string or Date object
 * @returns Formatted datetime string (e.g., "15 Feb 2024, 14:30")
 */
export function formatDateTime(date: string | Date): string {
    if (!date) return '-';

    return `${formatDate(date)}, ${formatTime(date)}`;
}

/**
 * Get month name in Indonesian
 * @param monthIndex - Month index (0-11)
 * @returns Month name
 */
export function getMonthName(monthIndex: number): string {
    const months = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    return months[monthIndex] || '';
}

/**
 * Get day name in Indonesian
 * @param dayIndex - Day index (0-6, Sunday = 0)
 * @returns Day name
 */
export function getDayName(dayIndex: number): string {
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    return days[dayIndex] || '';
}