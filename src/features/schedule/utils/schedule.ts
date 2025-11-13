import { z } from "zod";
import moment from "moment";
import {
    AttendanceScheduleResponse,
    CreateAttendanceScheduleRequest,
    UpdateAttendanceScheduleRequest,
    CreateScheduleDayRequest,
    SCHEDULE_TYPE_OPTIONS,
    DAYS_OF_WEEK
} from "../types/schedules";

export const formSchema = (_initialData: AttendanceScheduleResponse | null = null) => {
    return z
        .object({
            employeeId: z.string().min(1, "Employee ID is required"),
            startDate: z.string().min(1, "Start date is required"),
            endDate: z.string().optional(),
            scheduleType: z.string().min(1, "Schedule type is required"),
            isActive: z.boolean().default(true),
            notes: z.string().optional(),
            scheduleDays: z
                .array(
                    z.object({
                        id: z.string().optional(),
                        shiftId: z.string().min(1, "Shift is required"),
                        dayOfWeek: z.number().optional(),
                        scheduleDayDate: z.string().min(1, "Schedule day date is required"),
                        isActive: z.boolean().default(true),
                        notes: z.string().optional(),
                    }),
                )
                .min(1, "At least one schedule day is required"),
            excludedDates: z.array(z.string()).default([]),
        })
        .refine(
            (data) => {
                // Check if all active schedule days have shifts assigned
                const activeDaysWithoutShifts = data.scheduleDays.filter(day => day.isActive && !day.shiftId);
                return activeDaysWithoutShifts.length === 0;
            },
            {
                message: "يجب اختيار وردية لجميع الأيام النشطة",
                path: ["scheduleDays"],
            },
        )
}

export type FormData = z.infer<ReturnType<typeof formSchema>>

// Schema for schedule day form
export const scheduleDaySchema = z.object({
    shiftId: z.string().min(1, "Shift is required"),
    dayOfWeek: z.number().optional(),
    isActive: z.boolean().default(true),
    notes: z.string().optional(),
});

export type ScheduleDayFormValues = z.infer<typeof scheduleDaySchema>;

// Schema for updating schedule days
export const updateScheduleDaysSchema = z.object({
    attendanceScheduleId: z.string().min(1, "Schedule ID is required"),
    scheduleDays: z.array(z.object({
        id: z.string().min(1, "Schedule day ID is required"),
        shiftId: z.string().min(1, "Shift is required"),
        isActive: z.boolean().default(true),
        notes: z.string().optional(),
    })).min(1, "At least one schedule day is required"),
});

export type UpdateScheduleDaysFormValues = z.infer<typeof updateScheduleDaysSchema>;

// Utility function to format schedule data for API calls
export const formatSchedulePayload = (formData: FormData): CreateAttendanceScheduleRequest => {
    return {
        employeeId: formData.employeeId,
        startDate: formData.startDate,
        endDate: formData.endDate,
        scheduleType: formData.scheduleType,
        isActive: formData.isActive,
        notes: formData.notes,
        scheduleDays: formData.scheduleDays.map(day => ({
            shiftId: day.shiftId,
            dayOfWeek: day.dayOfWeek ?? 1,
            scheduleDayDate: day.scheduleDayDate,
            isActive: day.isActive,
            notes: day.notes,
        })),
        excludedDates: formData.excludedDates,
    };
};

// Utility function to format schedule data for update API calls
export const formatScheduleUpdatePayload = (
    formData: Partial<FormData>,
    attendanceScheduleId: string = ''
): UpdateAttendanceScheduleRequest => {
    return {
        // Top-level required fields for update request
        employeeId: formData.employeeId || '',
        startDate: formData.startDate || '',
        endDate: formData.endDate || '',
        scheduleType: formData.scheduleType || '',
        isActive: formData.isActive ?? true,
        notes: formData.notes || '',
        // Map schedule days to the expected update shape
        scheduleDays: (formData.scheduleDays || []).map((day) => ({
            // Keep id undefined when not present instead of forcing empty string
            id: day.id || undefined,
            attendanceScheduleId: attendanceScheduleId,
            dayOfWeek: day.dayOfWeek ?? 1,
            scheduleDayDate: day.scheduleDayDate || '',
            shiftId: day.shiftId || '',
            isActive: day.isActive ?? true,
            notes: day.notes || '',
        })),
        excludedDates: formData.excludedDates || [],
    };
};

// Helper to get schedule type display name (re-exported from types)
export { getScheduleTypeDisplayName } from '../types/schedules';

// Helper to format date for display
export const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return "Not available";

    try {
        return moment(dateString).format('YYYY-MM-DD');
    } catch (error) {
        return "Invalid date";
    }
};

// Helper to format date range for display
export const formatDateRange = (startDate: string, endDate?: string): string => {
    const start = formatDate(startDate);
    if (!endDate) {
        return `${start} - Ongoing`;
    }
    const end = formatDate(endDate);
    return `${start} - ${end}`;
};

// Helper to check if schedule is active
export const isScheduleActive = (isActive: boolean): boolean => {
    return isActive;
};

// Helper to get active status text
export const getActiveStatusText = (isActive: boolean): string => {
    return isActive ? "نشط" : "غير نشط";
};

// Helper to validate date format
export const validateDateFormat = (date: string): boolean => {
    return moment(date, 'YYYY-MM-DD', true).isValid();
};

// Helper to generate schedule days array based on selected days
export const generateScheduleDays = (selectedDays: number[], shiftId: string = ''): CreateScheduleDayRequest[] => {
    return selectedDays.map(dayOfWeek => ({
        shiftId,
        dayOfWeek,
        isActive: true,
        notes: '',
    }));
};

// Helper to get selected days from schedule days array
export const getSelectedDays = (scheduleDays: CreateScheduleDayRequest[]): number[] => {
    return scheduleDays
        .filter(day => day.isActive)
        .map(day => day.dayOfWeek);
};

// Helper to validate date range (1-2 weeks)
export const validateDateRange = (startDate: string, endDate?: string): { isValid: boolean; error?: string } => {
    if (!validateDateFormat(startDate)) {
        return { isValid: false, error: "تاريخ البداية غير صحيح" };
    }

    if (endDate && !validateDateFormat(endDate)) {
        return { isValid: false, error: "تاريخ النهاية غير صحيح" };
    }

    if (endDate) {
        const start = moment(startDate);
        const end = moment(endDate);

        if (start.isAfter(end)) {
            return { isValid: false, error: "تاريخ البداية يجب أن يكون قبل تاريخ النهاية" };
        }
    }

    return { isValid: true };
};

// Helper to convert date to backend format
export const toBackendDateFormat = (date: string): string => {
    if (!date) return '';
    try {
        return moment(date).format('YYYY-MM-DD');
    } catch (error) {
        return date;
    }
};

// Helper to convert backend date format to display format
export const fromBackendDateFormat = (dateString: string): string => {
    if (!dateString) return '';
    try {
        return moment(dateString).format('YYYY-MM-DD');
    } catch (error) {
        return dateString;
    }
};

// Helper to get day of week display name
export const getDayOfWeekDisplayName = (dayOfWeek: number): string => {
    const day = DAYS_OF_WEEK.find(d => d.value === dayOfWeek);
    return day?.displayName || day?.label || 'Unknown';
};

// Helper to get schedule type options for form
export const getScheduleTypeOptions = () => {
    return SCHEDULE_TYPE_OPTIONS.map(option => ({
        value: option.value.toString(),
        label: option.displayName,
    }));
};

// Helper to get day of week options for form
export const getDayOfWeekOptions = () => {
    return DAYS_OF_WEEK.map(day => ({
        value: day.value,
        label: day.displayName,
    }));
};

// Helper to check if schedule has conflicts
export const hasScheduleConflicts = (scheduleDays: CreateScheduleDayRequest[]): boolean => {
    const dayCounts = new Map<number, number>();

    for (const day of scheduleDays) {
        if (day.isActive) {
            const count = dayCounts.get(day.dayOfWeek) || 0;
            dayCounts.set(day.dayOfWeek, count + 1);
        }
    }

    // Check if any day has more than one active schedule
    for (const count of Array.from(dayCounts.values())) {
        if (count > 1) return true;
    }

    return false;
};

// Helper to get conflicting days
export const getConflictingDays = (scheduleDays: CreateScheduleDayRequest[]): number[] => {
    const dayCounts = new Map<number, number>();
    const conflicts: number[] = [];

    for (const day of scheduleDays) {
        if (day.isActive) {
            const count = dayCounts.get(day.dayOfWeek) || 0;
            dayCounts.set(day.dayOfWeek, count + 1);
        }
    }

    for (const [dayOfWeek, count] of Array.from(dayCounts.entries())) {
        if (count > 1) {
            conflicts.push(dayOfWeek);
        }
    }

    return conflicts;
};

// Helper to check for duplicate days
export const hasDuplicateDays = (scheduleDays: CreateScheduleDayRequest[]): boolean => {
    const dayCounts = new Map<number, number>();

    for (const day of scheduleDays) {
        if (day.isActive) {
            const count = dayCounts.get(day.dayOfWeek) || 0;
            dayCounts.set(day.dayOfWeek, count + 1);
        }
    }

    // Check if any day has more than one active schedule
    for (const count of Array.from(dayCounts.values())) {
        if (count > 1) return true;
    }

    return false;
};

// Helper to get duplicate days
export const getDuplicateDays = (scheduleDays: CreateScheduleDayRequest[]): number[] => {
    const dayCounts = new Map<number, number>();
    const duplicates: number[] = [];

    for (const day of scheduleDays) {
        if (day.isActive) {
            const count = dayCounts.get(day.dayOfWeek) || 0;
            dayCounts.set(day.dayOfWeek, count + 1);
        }
    }

    for (const [dayOfWeek, count] of Array.from(dayCounts.entries())) {
        if (count > 1) {
            duplicates.push(dayOfWeek);
        }
    }

    return duplicates;
};

// Helper to format excluded dates for display
export const formatExcludedDates = (excludedDates: string[]): string => {
    if (!excludedDates || excludedDates.length === 0) {
        return "لا توجد تواريخ مستثناة";
    }

    const formattedDates = excludedDates.map(date => formatDate(date));
    return formattedDates.join(", ");
};

// Helper to validate schedule days
export const validateScheduleDays = (scheduleDays: CreateScheduleDayRequest[]): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (!scheduleDays || scheduleDays.length === 0) {
        errors.push("At least one schedule day is required");
        return { isValid: false, errors };
    }

    const activeDays = scheduleDays.filter(day => day.isActive);
    if (activeDays.length === 0) {
        errors.push("At least one active schedule day is required");
    }

    const conflicts = getConflictingDays(scheduleDays);
    if (conflicts.length > 0) {
        const conflictDayNames = conflicts.map(day => getDayOfWeekDisplayName(day));
        errors.push(`Conflicts found for: ${conflictDayNames.join(", ")}`);
    }

    return { isValid: errors.length === 0, errors };
};

// Helper to validate schedule days with individual shifts
export const validateScheduleDaysWithShifts = (scheduleDays: CreateScheduleDayRequest[]): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (!scheduleDays || scheduleDays.length === 0) {
        errors.push("يجب اختيار يوم واحد على الأقل");
        return { isValid: false, errors };
    }

    const activeDays = scheduleDays.filter(day => day.isActive);
    if (activeDays.length === 0) {
        errors.push("يجب اختيار يوم واحد نشط على الأقل");
    }

    // Check for days without shifts
    const daysWithoutShifts = activeDays.filter(day => !day.shiftId);
    if (daysWithoutShifts.length > 0) {
        const dayNames = daysWithoutShifts.map(day => getDayOfWeekDisplayName(day.dayOfWeek));
        errors.push(`يجب اختيار مناوبة للأيام: ${dayNames.join(", ")}`);
    }

    // Check for duplicate days
    const dayCounts = new Map<number, number>();
    for (const day of activeDays) {
        const count = dayCounts.get(day.dayOfWeek) || 0;
        dayCounts.set(day.dayOfWeek, count + 1);
    }

    const duplicates: number[] = [];
    for (const [dayOfWeek, count] of Array.from(dayCounts.entries())) {
        if (count > 1) {
            duplicates.push(dayOfWeek);
        }
    }

    if (duplicates.length > 0) {
        const duplicateDayNames = duplicates.map(day => getDayOfWeekDisplayName(day));
        errors.push(`يوجد تكرار في الأيام: ${duplicateDayNames.join(", ")}`);
    }

    return { isValid: errors.length === 0, errors };
};

// Helper to convert schedule response to form values
export const scheduleResponseToFormValues = (schedule: AttendanceScheduleResponse): FormData => {
    return {
        employeeId: schedule.employeeId,
        startDate: formatDate(schedule.startDate),
        endDate: schedule.endDate ? formatDate(schedule.endDate) : undefined,
        scheduleType: schedule.scheduleType.toString(),
        isActive: schedule.isActive,
        notes: schedule.notes || '',
        scheduleDays: schedule.scheduleDays.map(day => ({
            shiftId: day.shiftId,
            scheduleDayDate: day.scheduleDayDate,
            isActive: day.isActive,
            notes: day.notes,
        })),
        excludedDates: schedule.excludedDates,
    };
};

// Helper to get schedule summary
export const getScheduleSummary = (schedule: AttendanceScheduleResponse): string => {
    const typeOption = SCHEDULE_TYPE_OPTIONS.find(option => option.value === schedule.scheduleType);
    const typeName = typeOption?.displayName || 'Unknown';
    const dateRange = formatDateRange(schedule.startDate, schedule.endDate || '-');
    const activeDays = schedule.scheduleDays.filter(day => day.isActive).length;

    return `${typeName} - ${dateRange} - ${activeDays} active days`;
}; 