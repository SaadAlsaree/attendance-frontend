import { IResponseList, IResponse, PaginatedResponse, ApiResponse } from '@/types/response';

// Enums
export enum AttendanceStatus {
    Present = 1,
    Absent = 2,
    Break = 3,
    Vacation = 4,
    Holiday = 5,
    Late = 6,
    Early_Out = 7,
    Overtime = 8,
    Shift_Change = 9,
    Shift_Swap = 10,
    Shift_Swap_Request = 11,
    Completed = 12
}

export const AttendanceStatusNames: Record<AttendanceStatus, string> = {
    [AttendanceStatus.Present]: "حضور",
    [AttendanceStatus.Absent]: "غياب",
    [AttendanceStatus.Break]: "راحة",
    [AttendanceStatus.Vacation]: "إجازة",
    [AttendanceStatus.Holiday]: "عطلة",
    [AttendanceStatus.Late]: "تأخير",
    [AttendanceStatus.Early_Out]: "انصراف مبكر",
    [AttendanceStatus.Overtime]: "عمل إضافي",
    [AttendanceStatus.Shift_Change]: "تغيير الوقت",
    [AttendanceStatus.Shift_Swap]: "تبديل الوقت",
    [AttendanceStatus.Shift_Swap_Request]: "طلب تبديل الوقت",
    [AttendanceStatus.Completed]: "مكتمل"
};

export enum LogMethod {
    Mobile_App = 1,
    Web = 2,
    Biometric = 3,
    RFID_Card = 4,
    NFC_Card = 5,
    QR_Card = 6,
    Manual_Entry = 7,
    API = 8
}

export const LogMethodNames: Record<LogMethod, string> = {
    [LogMethod.Mobile_App]: "موبايل",
    [LogMethod.Web]: "ويب",
    [LogMethod.Biometric]: "بيومتريك",
    [LogMethod.RFID_Card]: "بطاقة RFID",
    [LogMethod.NFC_Card]: "بطاقة NFC",
    [LogMethod.QR_Card]: "بطاقة QR",
    [LogMethod.Manual_Entry]: "إدخال يدوي",
    [LogMethod.API]: "API"
};

// Attendance Log Interface
export interface AttendanceLog {
    id: string;
    attendanceId: string;
    timestamp: string;
    method: LogMethod;
    methodName: string;
    notes?: string;
    isVerified: boolean;
}

// Main Attendance Response - Updated to match new data structure
export interface AttendanceResponse {
    id: string;
    employeeId: number;
    organizationId: string;
    organizationalName?: string;
    date: string;
    checkInTime?: string | null;
    checkOutTime?: string | null;
    status: AttendanceStatus;
    shiftId?: string;
    workingMinutes?: number | null;
    breakMinutes?: number | null;
    overtimeMinutes?: number | null;
    lateMinutes?: number | null;
    earlyLeaveMinutes?: number | null;
    notes?: string | null;
    checkInMethod?: LogMethod | null;
    checkOutMethod?: LogMethod | null;
    approvedBy?: string | null;
    approvedAt?: string | null;
    attendanceScheduleId?: string;
    createdAt: string;
    updatedAt?: string | null;

    // Navigation properties from the new response
    fullName?: string;
    code?: string;
    shiftName?: string;
    approverName?: string | null;

    // Legacy navigation properties (kept for backward compatibility)
    employeeName?: string;
    employeeNumber?: string;

    // Attendance logs
    logs?: AttendanceLog[];
}

// Request Types
export interface CreateAttendanceRequest {
    employeeId: number;
    organizationId: string;
    date: string;
    shiftId?: string;
    attendanceScheduleId?: string;
    notes?: string;
}

export interface UpdateAttendanceRequest {
    checkInTime?: string;
    checkOutTime?: string;
    notes?: string;
    status?: string;
}

export interface CheckInRequest {
    employeeId: number;
    attendanceId: string;
    checkInTime: string;
    location?: string;
    latitude?: number;
    longitude?: number;
    workLocationId?: string;
    deviceId?: string;
    logMethod: string;
    notes?: string;
}

export interface CheckOutRequest {
    employeeId: number;
    attendanceId: string;
    checkOutTime: string;
    location?: string;
    latitude?: number;
    longitude?: number;
    workLocationId?: string;
    deviceId?: string;
    logMethod: string;
    notes?: string;
}

export interface ApproveAttendanceRequest {
    approvedBy: string;
    approvalNotes?: string;
}

// Query Types
export interface AttendanceQuery {
    page?: number;
    pageSize?: number;
    employeeId?: number | string;
    organizationId?: string;
    startDate?: string;
    endDate?: string;
    status?: string;
    shiftId?: string;
    searchTerm?: string;
    sortBy?: string;
    sortOrder?: string;
}

// Response Types
export type AttendanceListResponse = IResponseList<AttendanceResponse>;
export type AttendanceDetailResponse = IResponse<AttendanceResponse>;
export type PaginatedAttendanceResponse = PaginatedResponse<AttendanceResponse>;
export type ApiAttendanceResponse = ApiResponse<AttendanceResponse>; 