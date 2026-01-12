/**
 * Currency Formatting Utilities
 * Indonesian Rupiah (IDR) formatting functions
 */

/**
 * Format currency with full Indonesian Rupiah format
 * Used for: Forms, detail views, mobile cards
 * @param amount - Amount to format
 * @returns Formatted string (e.g., "Rp 5.000.000")
 */
export function formatCurrency(amount: number): string {
    if (amount === 0) return '-';

    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
}

/**
 * Format currency with abbreviated format (K/M)
 * Used for: Tables, stats cards, compact displays
 * @param amount - Amount to format
 * @returns Abbreviated string (e.g., "Rp 5.0M")
 */
export function formatCurrencyShort(amount: number): string {
    if (amount === 0) return '-';

    if (amount >= 1000000) {
        return `Rp ${(amount / 1000000).toFixed(1)}M`;
    }

    if (amount >= 1000) {
        return `Rp ${(amount / 1000).toFixed(0)}K`;
    }

    return `Rp ${amount.toLocaleString('id-ID')}`;
}

/**
 * Format currency without symbol (numbers only)
 * Used for: Input fields, calculations
 * @param amount - Amount to format
 * @returns Formatted number string (e.g., "5.000.000")
 */
export function formatCurrencyNumber(amount: number): string {
    if (amount === 0) return '0';

    return amount.toLocaleString('id-ID', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    });
}

/**
 * Parse currency string back to number
 * Removes all non-numeric characters except decimal
 * @param value - String to parse
 * @returns Numeric value
 */
export function parseCurrency(value: string): number {
    if (!value) return 0;

    // Remove all non-numeric characters except decimal point
    const cleaned = value.replace(/[^\d.-]/g, '');
    const parsed = parseFloat(cleaned);

    return isNaN(parsed) ? 0 : parsed;
}

/**
 * Format currency for input display
 * Automatically formats as user types
 * @param value - Current input value
 * @returns Formatted display value
 */
export function formatCurrencyInput(value: string | number): string {
    if (!value) return '';

    const numValue = typeof value === 'string' ? parseCurrency(value) : value;

    if (numValue === 0) return '';

    return formatCurrencyNumber(numValue);
}

/**
 * Get currency symbol
 * @returns Currency symbol string
 */
export function getCurrencySymbol(): string {
    return 'Rp';
}

/**
 * Format percentage
 * @param value - Percentage value (0-100)
 * @param decimals - Number of decimal places (default: 0)
 * @returns Formatted percentage string (e.g., "85%")
 */
export function formatPercentage(value: number, decimals: number = 0): string {
    return `${value.toFixed(decimals)}%`;
}

/**
 * Format large numbers with suffix (K, M, B)
 * @param value - Number to format
 * @returns Formatted string (e.g., "1.5K", "2.3M")
 */
export function formatNumberShort(value: number): string {
    if (value === 0) return '0';

    if (value >= 1000000000) {
        return `${(value / 1000000000).toFixed(1)}B`;
    }

    if (value >= 1000000) {
        return `${(value / 1000000).toFixed(1)}M`;
    }

    if (value >= 1000) {
        return `${(value / 1000).toFixed(1)}K`;
    }

    return value.toString();
}