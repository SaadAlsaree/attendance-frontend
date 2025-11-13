/**
 * Converts a date string to a UTC DateTime object for backend API calls
 * This ensures PostgreSQL compatibility by providing DateTime with Kind=UTC
 */
export function toUTCDateTime(dateString: string): Date {
    // Ensure the date string is in YYYY-MM-DD format
    const [year, month, day] = dateString.split('-').map(Number);

    // Create a UTC DateTime object
    return new Date(Date.UTC(year, month - 1, day));
}

/**
 * Converts a date string to start of day UTC DateTime
 */
export function toStartOfDayUTC(dateString: string): Date {
    return toUTCDateTime(dateString);
}

/**
 * Converts a date string to end of day UTC DateTime
 */
export function toEndOfDayUTC(dateString: string): Date {
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(Date.UTC(year, month - 1, day, 23, 59, 59, 999));
}

/**
 * Gets the current month start date in YYYY-MM-DD format
 */
export function getCurrentMonthStart(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    return new Date(year, month, 1).toISOString().split('T')[0];
}

/**
 * Gets the next month start date in YYYY-MM-DD format
 */
export function getNextMonthStart(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    return new Date(year, month, 1).toISOString().split('T')[0];
} 