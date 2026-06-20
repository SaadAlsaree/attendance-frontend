import { IResponse, PaginatedResponse, ApiResponse } from '@/types/response';

// Enums
export enum ScheduleType {
    Regular = 1,
    Flexible = 2,
    Custom = 3,
    Rotating = 4,
    PartTime = 5,
    FullTime = 6
}

export const ScheduleTypeNames: Record<ScheduleType, string> = {
    [ScheduleType.Regular]: "عادي",
    [ScheduleType.Flexible]: "مرن",
    [ScheduleType.Custom]: "مخصص",
    [ScheduleType.Rotating]: "دوار",
    [ScheduleType.PartTime]: "دوام جزئي",
    [ScheduleType.FullTime]: "دوام كامل"
};



export interface AttendanceScheduleResponse {
    id: string;
    employeeId: string;
    employeeName: string | null;
    employeeEmail: string | null;
    employeeOrganizationId: string | null;
    employeeOrganizationName: string | null;
    startDate: string; // DateOnly in C# will be string in TypeScript (YYYY-MM-DD format)
    endDate: string | null; // DateOnly? in C#
    scheduleType: ScheduleType;
    isActive: boolean;
    notes: string | null;
    excludedDates: string[]; // Array of DateOnly strings (YYYY-MM-DD)
    scheduleDays: ScheduleDayResponse[];
    createdAt: string; // DateTime in C# will be ISO string
    lastUpdatedAt: string | null; // DateTime? in C#
}

export interface Employee {
    id: string
    name: string
}

export interface Shift {
    id: string
    name: string
    time: string
}


export interface ScheduleDay {
    shiftId: string
    dayOfWeek: number
    isActive: boolean
    notes?: string
}


// Schedule Day Types
export interface ScheduleDayResponse {
    id: string;
    attendanceScheduleId: string;
    shiftId: string;
    shiftName: string;
    dayOfWeek: number;
    scheduleDayDate: string;
    dayName: string;
    isActive: boolean;
    notes?: string;
    createdAt: string;
}

export interface CreateScheduleDayRequest {
    shiftId: string;
    dayOfWeek: number;
    // "YYYY-MM-DD" — the date-range create form always supplies this and the backend
    // validator requires it. Optional here only so the legacy day-of-week helpers compile.
    scheduleDayDate?: string;
    isActive: boolean;
    notes?: string;
}

export interface UpdateScheduleDayRequest {
    id: string;
    shiftId: string;
    isActive: boolean;
    notes?: string;
}


// Request Types
export interface CreateAttendanceScheduleRequest {
    employeeId: string;
    startDate: string; // "YYYY-MM-DD" format
    endDate?: string; // "YYYY-MM-DD" format
    scheduleType: string; // ScheduleType enum as string
    isActive: boolean;
    notes?: string;
    scheduleDays: CreateScheduleDayRequest[];
    excludedDates: string[]; // Array of "YYYY-MM-DD" dates
}

export interface UpdateAttendanceScheduleRequest {
    employeeId: string;
    startDate: string; // "YYYY-MM-DD" format
    endDate?: string; // "YYYY-MM-DD" format
    scheduleType: string;
    isActive: boolean;
    notes?: string;
    scheduleDays?: {
        id?: string; // Optional for new days
        attendanceScheduleId: string;
        dayOfWeek: number;
        scheduleDayDate: string;
        shiftId: string;
        isActive: boolean;
        notes?: string;
    }[];
    excludedDates: string[]; // Array of "YYYY-MM-DD" dates
}

export interface UpdateScheduleDaysRequest {
    attendanceScheduleId: string;
    scheduleDays: UpdateScheduleDayRequest[];
}

// Query Types
export interface AttendanceScheduleQuery {
    page?: number;
    pageSize?: number;
    employeeId?: string;
    scheduleType?: string;
    isActive?: boolean;
    searchTerm?: string;
    sortBy?: string;
    sortOrder?: string;
}

export interface MySchedulesQuery {
    page?: number;
    pageSize?: number;
    scheduleType?: string;
    isActive?: boolean;
    sortBy?: string;
    sortOrder?: string;
}

// Response Types
export type AttendanceScheduleListResponse = PaginatedResponse<AttendanceScheduleResponse>;
export type AttendanceScheduleDetailResponse = IResponse<AttendanceScheduleResponse>;
export type ApiAttendanceScheduleResponse = ApiResponse<AttendanceScheduleResponse>;

// Utility Types
export interface ScheduleTypeOption {
    value: ScheduleType;
    label: string;
    displayName: string;
}

export const SCHEDULE_TYPE_OPTIONS: ScheduleTypeOption[] = [
    { value: ScheduleType.Regular, label: 'Regular', displayName: 'عادي' },
    { value: ScheduleType.Flexible, label: 'Flexible', displayName: 'مرن' },
    { value: ScheduleType.Custom, label: 'Custom', displayName: 'مخصص' },
    { value: ScheduleType.Rotating, label: 'Rotating', displayName: 'دوار' },
    { value: ScheduleType.PartTime, label: 'PartTime', displayName: 'دوام جزئي' },
    { value: ScheduleType.FullTime, label: 'FullTime', displayName: 'دوام كامل' },
];

export const getScheduleTypeDisplayName = (scheduleType: ScheduleType): string => {
    const option = SCHEDULE_TYPE_OPTIONS.find(opt => opt.value === scheduleType);
    return option?.displayName || option?.label || 'Unknown';
};

export const getScheduleTypeByValue = (value: number): ScheduleType | undefined => {
    return SCHEDULE_TYPE_OPTIONS.find(opt => opt.value === value)?.value;
};

// Day of week constants
export const DAYS_OF_WEEK = [
    { value: 1, label: 'Sunday', displayName: 'الأحد' },
    { value: 2, label: 'Monday', displayName: 'الاثنين' },
    { value: 3, label: 'Tuesday', displayName: 'الثلاثاء' },
    { value: 4, label: 'Wednesday', displayName: 'الأربعاء' },
    { value: 5, label: 'Thursday', displayName: 'الخميس' },
    { value: 6, label: 'Friday', displayName: 'الجمعة' },
    { value: 7, label: 'Saturday', displayName: 'السبت' },
];

export const getDayOfWeekDisplayName = (dayOfWeek: number): string => {
    const day = DAYS_OF_WEEK.find(d => d.value === dayOfWeek);
    return day?.displayName || day?.label || 'Unknown';
};
