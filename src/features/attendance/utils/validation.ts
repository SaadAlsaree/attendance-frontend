import { z } from 'zod';
import { AttendanceStatus, LogMethod } from '../types/attendance';

// Validation Schemas
export const createAttendanceSchema = z.object({
    employeeId: z.string().uuid('Employee ID must be a valid UUID'),
    organizationId: z.string().uuid('Organization ID must be a valid UUID'),
    date: z.string().datetime('Date must be a valid date'),
    shiftId: z.string().uuid('Shift ID must be a valid UUID').optional(),
    attendanceScheduleId: z.string().uuid('Attendance Schedule ID must be a valid UUID').optional(),
    notes: z.string().max(500, 'Notes cannot exceed 500 characters').optional(),
});

export const updateAttendanceSchema = z.object({
    checkInTime: z.string().datetime('Check-in time must be a valid date').optional(),
    checkOutTime: z.string().datetime('Check-out time must be a valid date').optional(),
    notes: z.string().max(500, 'Notes cannot exceed 500 characters').optional(),
    status: z.nativeEnum(AttendanceStatus).optional(),
});

export const checkInSchema = z.object({
    employeeId: z.string().uuid('Employee ID must be a valid UUID'),
    checkInTime: z.string().min(1, 'Check-in time is required'), // تغيير من datetime إلى string عادي
    location: z.string().max(200, 'Location cannot exceed 200 characters').optional(),
    latitude: z.number().min(-90).max(90).optional(),
    longitude: z.number().min(-180).max(180).optional(),
    workLocationId: z.string().uuid('Work Location ID must be a valid UUID').optional(),
    deviceId: z.string().uuid('Device ID must be a valid UUID').optional(),
    logMethod: z.nativeEnum(LogMethod, {
        errorMap: () => ({ message: 'Log method must be a valid enum value' }),
    }),
    notes: z.string().max(500, 'Notes cannot exceed 500 characters').optional(),
});

export const checkOutSchema = z.object({
    employeeId: z.string().uuid('Employee ID must be a valid UUID'),
    attendanceId: z.string().uuid('Attendance ID must be a valid UUID'),
    checkOutTime: z.string().datetime('Check-out time must be a valid date'),
    location: z.string().max(200, 'Location cannot exceed 200 characters').optional(),
    latitude: z.number().min(-90).max(90).optional(),
    longitude: z.number().min(-180).max(180).optional(),
    workLocationId: z.string().uuid('Work Location ID must be a valid UUID').optional(),
    deviceId: z.string().uuid('Device ID must be a valid UUID').optional(),
    logMethod: z.nativeEnum(LogMethod, {
        errorMap: () => ({ message: 'Log method must be a valid enum value' }),
    }),
    notes: z.string().max(500, 'Notes cannot exceed 500 characters').optional(),
});

export const approveAttendanceSchema = z.object({
    approvedBy: z.string().uuid('Approved By must be a valid UUID'),
    approvalNotes: z.string().max(500, 'Approval notes cannot exceed 500 characters').optional(),
});

export const attendanceQuerySchema = z.object({
    page: z.number().min(1, 'Page must be at least 1').optional(),
    pageSize: z.number().min(1, 'Page size must be at least 1').max(100, 'Page size cannot exceed 100').optional(),
    employeeId: z.string().uuid('Employee ID must be a valid UUID').optional(),
    organizationId: z.string().uuid('Organization ID must be a valid UUID').optional(),
    date: z.string().datetime('Date must be a valid date').optional(),
    status: z.union([z.nativeEnum(AttendanceStatus), z.number()]).optional(),
    shiftId: z.string().uuid('Shift ID must be a valid UUID').optional(),
    searchTerm: z.string().max(100, 'Search term cannot exceed 100 characters').optional(),
    sortBy: z.string().max(50, 'Sort by cannot exceed 50 characters').optional(),
    sortOrder: z.enum(['asc', 'desc']).optional(),
});

// Validation Functions
export const validateCreateAttendance = (data: unknown) => {
    return createAttendanceSchema.safeParse(data);
};

export const validateUpdateAttendance = (data: unknown) => {
    return updateAttendanceSchema.safeParse(data);
};

export const validateCheckIn = (data: unknown) => {
    return checkInSchema.safeParse(data);
};

export const validateCheckOut = (data: unknown) => {
    return checkOutSchema.safeParse(data);
};

export const validateApproveAttendance = (data: unknown) => {
    return approveAttendanceSchema.safeParse(data);
};

export const validateAttendanceQuery = (data: unknown) => {
    return attendanceQuerySchema.safeParse(data);
};

// Helper Functions
export const validateDateRange = (startDate: string, endDate: string): boolean => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return start <= end;
};

export const validateCoordinates = (latitude: number, longitude: number): boolean => {
    return latitude >= -90 && latitude <= 90 && longitude >= -180 && longitude <= 180;
};

export const validateTimeFormat = (time: string): boolean => {
    const date = new Date(time);
    return !isNaN(date.getTime());
};

// Error Messages
export const ATTENDANCE_ERROR_MESSAGES = {
    INVALID_EMPLOYEE_ID: 'Employee ID must be a valid UUID',
    INVALID_ORGANIZATION_ID: 'Organization ID must be a valid UUID',
    INVALID_DATE: 'Date must be a valid date',
    INVALID_TIME: 'Time must be a valid time',
    INVALID_COORDINATES: 'Coordinates must be within valid ranges',
    INVALID_DATE_RANGE: 'Start date must be before or equal to end date',
    NOTES_TOO_LONG: 'Notes cannot exceed 500 characters',
    LOCATION_TOO_LONG: 'Location cannot exceed 200 characters',
    SEARCH_TERM_TOO_LONG: 'Search term cannot exceed 100 characters',
    REQUIRED_FIELD: 'This field is required',
    INVALID_STATUS: 'Status must be a valid attendance status',
    INVALID_LOG_METHOD: 'Log method must be a valid enum value',
} as const; 