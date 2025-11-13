import { z } from 'zod';
import { Direct } from '../types/attendance-logs';

// Query Schema - matches AttendanceLogQuery interface
export const attendanceLogQuerySchema = z.object({
    page: z.number().min(1, 'Page must be at least 1').optional(),
    pageSize: z.number().min(1, 'Page size must be at least 1').max(100, 'Page size cannot exceed 100').optional(),
    employeeId: z.union([z.number(), z.string()]).optional(),
    organizationId: z.string().optional(),
    startDate: z.string().datetime('Start date must be a valid date').optional(),
    endDate: z.string().datetime('End date must be a valid date').optional(),
    searchTerm: z.string().max(100, 'Search term cannot exceed 100 characters').optional(),
    sortBy: z.string().max(50, 'Sort by cannot exceed 50 characters').optional(),
    sortOrder: z.enum(['asc', 'desc']).optional(),
});

// Validation Functions
export const validateAttendanceLogQuery = (data: unknown) => {
    return attendanceLogQuerySchema.safeParse(data);
};

// Helper Functions
export const validateDateRange = (startDate: string, endDate: string): boolean => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return start <= end;
};

export const validateUrl = (url: string): boolean => {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
};

export const validateCardNumber = (cardNo: string): boolean => {
    // Basic validation for card number (can be customized based on requirements)
    return cardNo.length >= 1 && /^[0-9A-Za-z]+$/.test(cardNo);
};

export const validateDirect = (direct: number): direct is Direct => {
    return direct === Direct.IN || direct === Direct.OUT;
};

// Error Messages
export const ATTENDANCE_LOG_ERROR_MESSAGES = {
    INVALID_EMPLOYEE_ID: 'Employee ID must be a valid number or string',
    INVALID_ORGANIZATION_ID: 'Organization ID must be a valid string',
    INVALID_DATE: 'Date must be a valid date',
    INVALID_CARD_NO: 'Card number is required',
    INVALID_CARD_NUMBER: 'Card number must contain only alphanumeric characters',
    INVALID_DATE_RANGE: 'Start date must be before or equal to end date',
    INVALID_DIRECT: 'Direct must be either IN (1) or OUT (2)',
    SEARCH_TERM_TOO_LONG: 'Search term cannot exceed 100 characters',
    REQUIRED_FIELD: 'This field is required',
} as const;

// Utility function to format date for API
export const formatDateForAPI = (date: Date | string): string => {
    if (typeof date === 'string') {
        return new Date(date).toISOString();
    }
    return date.toISOString();
};

// Utility function to parse date from API
export const parseDateFromAPI = (dateString: string): Date => {
    return new Date(dateString);
};

// Utility function to format time string (HH:mm:ss)
export const formatTimeString = (dateTime: string): string => {
    const date = new Date(dateTime);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
};

// Utility function to format date string (YYYY-MM-DD)
export const formatDateString = (dateTime: string): string => {
    const date = new Date(dateTime);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
};
