import { z } from 'zod';
import {
    LeaveItem,
    LeaveType,
    LeaveTypeDisplay
} from '../types/leaves';

// Validation Schemas
export const createLeaveSchema = z.object({
    employeeId: z.string().min(1, 'Employee ID is required'),
    leaveType: z.nativeEnum(LeaveType, {
        errorMap: () => ({ message: 'Leave type must be a valid enum value' }),
    }),
    startDate: z.string().datetime('Start date must be a valid date'),
    endDate: z.string().datetime('End date must be a valid date'),
    reason: z.string().min(1, 'Reason is required').max(500, 'Reason cannot exceed 500 characters'),
});

export const updateLeaveSchema = z.object({
    leaveType: z.nativeEnum(LeaveType).optional(),
    startDate: z.string().datetime('Start date must be a valid date').optional(),
    endDate: z.string().datetime('End date must be a valid date').optional(),
    reason: z.string().min(1, 'Reason is required').max(500, 'Reason cannot exceed 500 characters').optional(),
    status: z.number().min(0, 'Status must be a non-negative number').max(3, 'Status must be between 0 and 3').optional(),
    rejectionReason: z.string().max(500, 'Rejection reason cannot exceed 500 characters').optional(),
});

export const leaveQuerySchema = z.object({
    page: z.number().min(1, 'Page number must be at least 1').optional(),
    pageSize: z.number().min(1, 'Page size must be at least 1').max(100, 'Page size cannot exceed 100').optional(),
    employeeId: z.string().optional(),
    managerId: z.string().optional(),
    startDate: z.string().datetime('Start date must be a valid date').optional(),
    endDate: z.string().datetime('End date must be a valid date').optional(),
    leaveType: z.nativeEnum(LeaveType).optional(),
    status: z.number().min(0, 'Status must be a non-negative number').max(3, 'Status must be between 0 and 3').optional(),
    searchTerm: z.string().max(100, 'Search term cannot exceed 100 characters').optional(),
});

// Validation Functions
export const validateCreateLeave = (data: unknown) => {
    return createLeaveSchema.safeParse(data);
};

export const validateUpdateLeave = (data: unknown) => {
    return updateLeaveSchema.safeParse(data);
};

export const validateLeaveQuery = (data: unknown) => {
    return leaveQuerySchema.safeParse(data);
};

// Helper Functions
export const validateDateRange = (startDate: string, endDate: string): boolean => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return start <= end;
};

export interface LeaveDuration {
    value: number;
    type: 'hours' | 'days';
}

export const calculateLeaveDays = (startDate: string, endDate: string): LeaveDuration => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Calculate difference in milliseconds
    const diffTime = end.getTime() - start.getTime();

    // Calculate hours
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));

    // If 3 hours or less, return hours
    if (diffHours <= 3) {
        return {
            value: diffHours,
            type: 'hours'
        };
    }

    // If 4 hours or more, calculate as days
    // Normalize dates to start of day (00:00:00) to calculate days only
    const startNormalized = new Date(start);
    startNormalized.setHours(0, 0, 0, 0);

    const endNormalized = new Date(end);
    endNormalized.setHours(0, 0, 0, 0);

    // Calculate difference in days
    const diffTimeDays = endNormalized.getTime() - startNormalized.getTime();
    const diffDays = Math.floor(diffTimeDays / (1000 * 60 * 60 * 24));

    // Return 1 if same day, otherwise add 1 to include both start and end dates
    return {
        value: diffDays + 1,
        type: 'days'
    };
};

export const validateLeaveType = (leaveType: LeaveType): boolean => {
    return Object.values(LeaveType).includes(leaveType);
};

export const validateStatus = (status: number): boolean => {
    return status >= 0 && status <= 3; // 0: Pending, 1: Approved, 2: Rejected, 3: Cancelled
};

// Error Messages
export const LEAVE_ERROR_MESSAGES = {
    INVALID_EMPLOYEE_ID: 'Employee ID must be a positive number',
    INVALID_LEAVE_TYPE: 'Leave type must be a valid enum value',
    INVALID_START_DATE: 'Start date must be a valid date',
    INVALID_END_DATE: 'End date must be a valid date',
    INVALID_DATE_RANGE: 'Start date must be before or equal to end date',
    INVALID_REASON: 'Reason is required and cannot exceed 500 characters',
    INVALID_STATUS: 'Status must be between 0 and 3',
    INVALID_REJECTION_REASON: 'Rejection reason cannot exceed 500 characters',
    SEARCH_TERM_TOO_LONG: 'Search term cannot exceed 100 characters',
    REQUIRED_FIELD: 'This field is required',
    LEAVE_TYPE_NOT_FOUND: 'Leave type not found',
    INVALID_STATUS_VALUE: 'Status must be a valid value',
} as const;

// Status Constants — must match backend LeaveStatus enum
// (Pending=1, Approved=2, Rejected=3, Cancelled=4). Previously off-by-one (0-3),
// which made isLeavePending()/status badges/list filters wrong across the module.
export const LEAVE_STATUS = {
    PENDING: 1,
    APPROVED: 2,
    REJECTED: 3,
    CANCELLED: 4,
} as const;

export const LEAVE_STATUS_DISPLAY: Record<number, string> = {
    [LEAVE_STATUS.PENDING]: 'قيد الانتظار',
    [LEAVE_STATUS.APPROVED]: 'تمت الموافقة',
    [LEAVE_STATUS.REJECTED]: 'مرفوض',
    [LEAVE_STATUS.CANCELLED]: 'ملغي',
};

// Form Schema for UI
export const formSchema = (initialData: LeaveItem | null) => {
    return z.object({
        employeeId: z.string().min(1, "Employee is required"),
        leaveType: z.nativeEnum(LeaveType, {
            errorMap: () => ({ message: 'Leave type is required' }),
        }),
        startDate: z.string().min(1, "Start date is required"),
        endDate: z.string().min(1, "End date is required"),
        reason: z.string().min(1, "Reason is required").max(500, "Reason cannot exceed 500 characters"),
        status: z.number().min(1, "Status is required").max(5, "Status must be between 1 and 5").optional(),
        rejectionReason: z.string().max(500, "Rejection reason cannot exceed 500 characters").optional(),
    }).refine((data) => {
        if (data.startDate && data.endDate) {
            return validateDateRange(data.startDate, data.endDate);
        }
        return true;
    }, {
        message: "End date must be after or equal to start date",
        path: ["endDate"],
    });
};

// Define the form values type based on the schema
export type LeaveFormValues = z.infer<ReturnType<typeof formSchema>>;

// Utility function to format leave data for API calls
export const formatLeavePayload = (formData: LeaveFormValues): Partial<LeaveItem> => {
    return {
        employeeId: formData.employeeId,
        leaveType: formData.leaveType,
        startDate: formData.startDate,
        endDate: formData.endDate,
        reason: formData.reason,
        status: formData.status,
        rejectionReason: formData.rejectionReason,
    };
};

// Utility function to format update payload
export const formatUpdateLeavePayload = (formData: Partial<LeaveFormValues>): Partial<LeaveItem> => {
    return {
        leaveType: formData.leaveType,
        startDate: formData.startDate,
        endDate: formData.endDate,
        reason: formData.reason,
        status: formData.status,
        rejectionReason: formData.rejectionReason,
    };
};

// Utility function to get leave type display name
export const getLeaveTypeDisplayName = (leaveType: LeaveType): string => {
    return LeaveTypeDisplay[leaveType] || 'Unknown';
};

// Utility function to get status display name
export const getStatusDisplayName = (status: number): string => {
    return LEAVE_STATUS_DISPLAY[status] || 'Unknown';
};

// Utility function to check if leave is pending
export const isLeavePending = (status: number): boolean => {
    return status === LEAVE_STATUS.PENDING;
};

// Utility function to check if leave is approved
export const isLeaveApproved = (status: number): boolean => {
    return status === LEAVE_STATUS.APPROVED;
};

// Utility function to check if leave is rejected
export const isLeaveRejected = (status: number): boolean => {
    return status === LEAVE_STATUS.REJECTED;
};

// Utility function to check if leave is cancelled
export const isLeaveCancelled = (status: number): boolean => {
    return status === LEAVE_STATUS.CANCELLED;
};

// Utility function to format date for display
export const formatDateForDisplay = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-SA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};

// Utility function to format date for input
export const formatDateForInput = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
};
