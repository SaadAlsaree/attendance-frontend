import { z } from "zod";
import moment from "moment";
import { ShiftData, CreateShiftRequest, UpdateShiftRequest } from "../types/shift";

// Form schema for shift creation/editing
export const formSchema = (initialData: ShiftData | null) => {
    return z.object({
        name: z.string().min(1, "Shift name is required"),
        description: z.string().optional(),
        startTime: z.string().min(1, "Start time is required"),
        endTime: z.string().min(1, "End time is required"),
        shiftType: z.string().min(1, "Shift type is required"),
        isActive: z.boolean().default(true),
        gracePeriodMinutes: z.number().min(0, "Grace period must be 0 or greater").optional(),
        maxLateMinutes: z.number().min(0, "Max late minutes must be 0 or greater").optional(),
        allowEarlyCheckIn: z.boolean().default(false),
        allowLateCheckOut: z.boolean().default(false),
    });
};

// Define the form values type based on the schema
export type ShiftFormValues = z.infer<ReturnType<typeof formSchema>>;

// Helper to convert any time string to 'HH:mm:ss' (24-hour with seconds) for backend
export const toBackendTimeOnlyString = (time: string): string => {
    if (!time) return '';
    // If already in HH:mm:ss, return as is
    if (/^\d{2}:\d{2}:\d{2}$/.test(time)) return time;
    // If in HH:mm, add :00
    if (/^\d{2}:\d{2}$/.test(time)) return time + ':00';
    // If in 12-hour format (e.g., '3:00 PM'), convert to 24-hour
    if (time.includes(' ')) {
        const [timePart, modifier] = time.split(' ');
        let [hours, minutes] = timePart.split(':');
        hours = hours.padStart(2, '0');
        if (hours === '12') hours = '00';
        if (modifier === 'PM') hours = String(parseInt(hours, 10) + 12).padStart(2, '0');
        return `${hours}:${minutes}:00`;
    }
    // Fallback: try to parse as Date
    const date = new Date(`1970-01-01T${time}`);
    if (!isNaN(date.getTime())) {
        return date.toTimeString().slice(0, 8);
    }
    return time;
};

// Utility function to format shift data for API calls
export const formatShiftPayload = (formData: ShiftFormValues): CreateShiftRequest => {
    return {
        name: formData.name,
        description: formData.description,
        startTime: toBackendTimeOnlyString(formData.startTime),
        endTime: toBackendTimeOnlyString(formData.endTime),
        shiftType: formData.shiftType,
        isActive: formData.isActive,
        gracePeriodMinutes: formData.gracePeriodMinutes,
        maxLateMinutes: formData.maxLateMinutes,
        allowEarlyCheckIn: formData.allowEarlyCheckIn,
        allowLateCheckOut: formData.allowLateCheckOut,
    };
};

// Utility function to format shift data for update API calls
export const formatShiftUpdatePayload = (formData: ShiftFormValues): UpdateShiftRequest => {
    return {
        name: formData.name,
        description: formData.description,
        startTime: toBackendTimeOnlyString(formData.startTime),
        endTime: toBackendTimeOnlyString(formData.endTime),
        shiftType: formData.shiftType,
        isActive: formData.isActive,
        gracePeriodMinutes: formData.gracePeriodMinutes,
        maxLateMinutes: formData.maxLateMinutes,
        allowEarlyCheckIn: formData.allowEarlyCheckIn,
        allowLateCheckOut: formData.allowLateCheckOut,
    };
};

// Helper to get shift type display name (re-exported from types)
export { getShiftTypeDisplayName } from '../types/shift';

// Helper to format time for display
export const formatTime = (timeString: string): string => {
    if (!timeString) return "Not available";

    try {
        // Handle different time formats
        if (timeString.includes('T')) {
            // ISO format
            const date = new Date(timeString);
            return date.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            });
        } else if (timeString.includes(':')) {
            // Simple time format (HH:mm)
            const [hours, minutes] = timeString.split(':');
            const hour = parseInt(hours);
            const ampm = hour >= 12 ? 'PM' : 'AM';
            const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
            return `${displayHour}:${minutes} ${ampm}`;
        }
        return timeString;
    } catch (error) {
        return "Invalid time";
    }
};

// Helper to format duration in minutes
export const formatDuration = (minutes: number): string => {
    if (minutes < 60) {
        return `${minutes} دقيقة`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (remainingMinutes === 0) {
        return `${hours} ساعة`;
    }
    return `${hours} ساعة و ${remainingMinutes} دقيقة`;
};

// Helper to check if shift is active
export const isShiftActive = (isActive: boolean): boolean => {
    return isActive;
};

// Helper to get active status text
export const getActiveStatusText = (isActive: boolean): string => {
    return isActive ? "نشط" : "غير نشط";
};

// Helper to format date for display
export const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return "Not available";

    try {
        return moment(dateString).format('YYYY-MM-DD');
    } catch (error) {
        return "Invalid date";
    }
};

// Helper to validate time format
export const validateTimeFormat = (time: string): boolean => {
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return timeRegex.test(time);
};

// Helper to convert 12-hour format to 24-hour format
export const convertTo24Hour = (time12h: string): string => {
    const [time, modifier] = time12h.split(' ');
    let [hours, minutes] = time.split(':');

    if (hours === '12') {
        hours = '00';
    }

    if (modifier === 'PM') {
        hours = String(parseInt(hours, 10) + 12);
    }

    return `${hours}:${minutes}`;
};

// Helper to convert 24-hour format to 12-hour format
export const convertTo12Hour = (time24h: string): string => {
    const [hours, minutes] = time24h.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
};

// Helper to convert backend time format to 24-hour format for form inputs
export const convertBackendTimeTo24Hour = (timeString: string): string => {
    if (!timeString) return '';

    try {
        // If it's already in 24-hour format (HH:mm), return as is
        if (/^\d{1,2}:\d{2}$/.test(timeString)) {
            return timeString;
        }

        // If it's in 12-hour format (hh:mm tt), convert to 24-hour
        if (timeString.includes(' ')) {
            const [time, modifier] = timeString.split(' ');
            let [hours, minutes] = time.split(':');

            if (hours === '12') {
                hours = '00';
            }

            if (modifier === 'PM') {
                hours = String(parseInt(hours, 10) + 12);
            }

            return `${hours}:${minutes}`;
        }

        // If it's in ISO format or other format, try to parse it
        const date = new Date(timeString);
        if (!isNaN(date.getTime())) {
            return date.toTimeString().slice(0, 5); // Get HH:mm part
        }

        return timeString;
    } catch (error) {
        return timeString;
    }
};
