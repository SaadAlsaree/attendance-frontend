import { z } from 'zod';
import { AttendanceStatus, LogMethod, AttendanceResponse, UpdateAttendanceRequest } from '../types/attendance';

// Form schema for attendance form
export const attendanceFormSchema = (initialData: AttendanceResponse | null) => {
    return z.object({
        checkInTime: z.string().optional(),
        checkOutTime: z.string().optional(),
        notes: z.string().max(500, 'الملاحظات يجب أن تكون 500 حرف على الأكثر').optional(),
        status: z.nativeEnum(AttendanceStatus, {
            errorMap: () => ({ message: 'الحالة يجب أن تكون قيمة صحيحة' })
        }).optional(),
    });
};

// Define the form values type based on the schema
export type AttendanceFormValues = z.infer<ReturnType<typeof attendanceFormSchema>>;

// Utility function to format attendance data for API calls
export const formatAttendancePayload = (formData: AttendanceFormValues): UpdateAttendanceRequest => {
    return {
        checkInTime: formData.checkInTime || undefined,
        checkOutTime: formData.checkOutTime || undefined,
        notes: formData.notes,
        status: formData.status?.toString(),
    };
};

// Get status options for the select dropdown
export const getStatusOptions = () => {
    return Object.entries(AttendanceStatus).map(([key, value]) => ({
        value: value.toString(),
        label: getStatusLabel(value as AttendanceStatus)
    }));
};

// Get status label in Arabic
export const getStatusLabel = (status: AttendanceStatus): string => {
    switch (status) {
        case AttendanceStatus.Present:
            return 'حضور';
        case AttendanceStatus.Absent:
            return 'غياب';
        case AttendanceStatus.Break:
            return 'راحة';
        case AttendanceStatus.Vacation:
            return 'إجازة';
        case AttendanceStatus.Holiday:
            return 'عطلة';
        case AttendanceStatus.Late:
            return 'تأخير';
        case AttendanceStatus.Early_Out:
            return 'انصراف مبكر';
        case AttendanceStatus.Overtime:
            return 'عمل إضافي';
        case AttendanceStatus.Shift_Change:
            return 'تغيير الوقت';
        case AttendanceStatus.Shift_Swap:
            return 'تبديل الوقت';
        case AttendanceStatus.Shift_Swap_Request:
            return 'طلب تبديل الوقت';
        case AttendanceStatus.Completed:
            return 'مكتمل';
        default:
            return 'غير معروف';
    }
};

// Format time for display
export const formatTimeForDisplay = (timeString?: string): string => {
    if (!timeString) return '';

    try {
        const date = new Date(timeString);
        return date.toLocaleTimeString('ar-SA', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
    } catch (error) {
        console.error('Error formatting time:', error);
        return timeString;
    }
};

// Format time for input (HTML datetime-local format)
export const formatTimeForInput = (timeString?: string): string => {
    if (!timeString) return '';

    try {
        const date = new Date(timeString);
        return date.toISOString().slice(0, 16); // Format: YYYY-MM-DDTHH:MM
    } catch (error) {
        console.error('Error formatting time for input:', error);
        return '';
    }
}; 