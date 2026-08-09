import { IResponse, PaginatedResponse, ApiResponse } from '@/types/response';

// Enums
export enum ShiftType {
    Morning = 1,
    Afternoon = 2,
    Evening = 3,
    Night = 4,
    Flexible = 5,
    Custom = 6
}

export const ShiftTypeNames: Record<ShiftType, string> = {
    [ShiftType.Morning]: "صباحي",
    [ShiftType.Afternoon]: "مسائي",
    [ShiftType.Evening]: "بعد الظهر",
    [ShiftType.Night]: "خفر",
    [ShiftType.Flexible]: "مرن",
    [ShiftType.Custom]: "مخصص"
};


export interface ShiftData {
    id: string;
    name: string;
    description: string;
    shiftType: ShiftType;
    shiftTypeName: string;
    startTime: string; // TimeSpan format from backend
    endTime: string; // TimeSpan format from backend
    gracePeriodMinutes?: number;
    maxLateMinutes?: number;
    allowEarlyCheckIn: boolean;
    allowLateCheckOut: boolean;
    isActive: boolean;
    createdAt: string;
}
// Main Shift Response
export interface ShiftResponse {
    data: ShiftData;
    totalItems: number;
    isSuccess: boolean;
    message: string;
}

// Request Types
export interface CreateShiftRequest {
    name: string;
    startTime: string; // "hh:mm tt" format
    endTime: string; // "hh:mm tt" format
    shiftType: string; // ShiftType enum as string
    isActive: boolean;
    description?: string;
    gracePeriodMinutes?: number;
    maxLateMinutes?: number;
    allowEarlyCheckIn: boolean;
    allowLateCheckOut: boolean;
}

export interface UpdateShiftRequest {
    name: string;
    startTime?: string; // "hh:mm tt" format
    endTime?: string; // "hh:mm tt" format
    shiftType?: string; // ShiftType enum as string
    isActive?: boolean;
    description?: string;
    gracePeriodMinutes?: number;
    maxLateMinutes?: number;
    allowEarlyCheckIn: boolean;
    allowLateCheckOut: boolean;
}

// Query Types
export interface ShiftQuery {
    page?: number;
    pageSize?: number;
    shiftType?: string;
    isActive?: boolean;
    searchTerm?: string;
    sortBy?: string;
}

// Response Types
export type ShiftListResponse = PaginatedResponse<ShiftData>;
export type ShiftDetailResponse = IResponse<ShiftData>;
export type ApiShiftResponse = ApiResponse<ShiftData>;

// Utility Types
export interface ShiftTypeOption {
    value: ShiftType;
    label: string;
    displayName: string;
}

export const SHIFT_TYPE_OPTIONS: ShiftTypeOption[] = [
    { value: ShiftType.Morning, label: 'Morning', displayName: 'صباحي' },
    { value: ShiftType.Afternoon, label: 'Afternoon', displayName: 'مسائي' },
    { value: ShiftType.Evening, label: 'Evening', displayName: 'بعد الظهر' },
    { value: ShiftType.Night, label: 'Night', displayName: 'خفر' },
    { value: ShiftType.Flexible, label: 'Flexible', displayName: 'مرن' },
    { value: ShiftType.Custom, label: 'Custom', displayName: 'مخصص' },
];

export const getShiftTypeDisplayName = (shiftType: ShiftType): string => {
    const option = SHIFT_TYPE_OPTIONS.find(opt => opt.value === shiftType);
    return option?.displayName || option?.label || 'Unknown';
};

export const getShiftTypeByValue = (value: number): ShiftType | undefined => {
    return SHIFT_TYPE_OPTIONS.find(opt => opt.value === value)?.value;
};
