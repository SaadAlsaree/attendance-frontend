import { IResponseList, IResponse, PaginatedResponse, ApiResponse } from '@/types/response';

// Enums based on the new data structure

export enum Direct {
    IN = 1,
    OUT = 2,
}


export const directName: Record<Direct, string> = {
    [Direct.IN]: 'دخول',
    [Direct.OUT]: 'خروج',
};

// Navigation Properties
export interface EmployeeResponse {
    id: string;
    fullName: string;
    code: string;
    rfid: string;
    organizationalUnitId: string;
    organizationalUnitName: string;
    organizationalUnitCode: string;
}

// Main Attendance Log Response - API structure
export interface AttendanceLogResponse {
    id: string;
    dateTimeAttend: string;
    cardNo: string;
    empID: string;
    dateWork: string;
    timeAttend: string;
    direct: Direct;
    deviceName: string;
    deviceNo: string;
    empName: string;
    employee?: EmployeeResponse;
}

// Request Types
export interface CreateAttendanceLogRequest {
    employeeId: number;
    organizationId: string;
    attendanceId?: string;
    major: number;
    minor: number;
    time: string;
    cardNo: string;
    name: string;
    cardReaderNo: number;
    doorNo: number;
    employeeNoString: string;
    serialNo: number;

}

export interface UpdateAttendanceLogRequest {
    pictureURL?: string;
    label?: string;
    attendanceId?: string;
}

// Query Types
export interface AttendanceLogQuery {
    page: number;
    pageSize: number;
    employeeId?: number | string;
    organizationId?: string;
    startDate?: string;
    endDate?: string;
    searchTerm?: string;
    sortBy?: string;
    sortOrder?: string;
}

// Response Types
export type AttendanceLogListResponse = IResponseList<AttendanceLogResponse>;
export type AttendanceLogDetailResponse = IResponse<AttendanceLogResponse>;
export type PaginatedAttendanceLogResponse = PaginatedResponse<AttendanceLogResponse>;
export type ApiAttendanceLogResponse = ApiResponse<AttendanceLogResponse>;
