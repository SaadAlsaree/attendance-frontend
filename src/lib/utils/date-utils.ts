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

/**
 * Sets a Date object to the start of the day (00:00:00.000) in local timezone
 * Returns a new Date object with time set to midnight
 */
export function setToStartOfDay(date: Date): Date {
    const newDate = new Date(date);
    newDate.setHours(0, 0, 0, 0);
    return newDate;
}

/**
 * Sets a Date object to the end of the day (23:59:59.999) in local timezone
 * Returns a new Date object with time set to end of day
 */
export function setToEndOfDay(date: Date): Date {
    const newDate = new Date(date);
    newDate.setHours(23, 59, 59, 999);
    return newDate;
}

/**
 * Sets a Date object to the start of the day (00:00:00.000) in UTC
 * Returns a new Date object with time set to midnight UTC
 */
export function setToStartOfDayUTC(date: Date): Date {
    return new Date(Date.UTC(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        0, 0, 0, 0
    ));
}

/**
 * Sets a Date object to the end of the day (23:59:59.999) in UTC
 * Returns a new Date object with time set to end of day UTC
 */
export function setToEndOfDayUTC(date: Date): Date {
    return new Date(Date.UTC(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        23, 59, 59, 999
    ));
} 