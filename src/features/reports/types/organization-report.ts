export interface EmployeeDetail {
    employeeId: number;
    employeeName: string;
    employeeCode: string;
    organizationalUnitId: string;
    organizationalUnitName: string;
    date: string;
    checkInTime: string;
    checkOutTime: string | null;
    isLate: boolean;
    isEarlyLeave: boolean;
    isOnLeave: boolean;
    isAbsent: boolean;
    overtimeDuration: string | null;
}

export interface Unit {
    unitId: string;
    unitName: string;
    unitCode: string;
    parentUnitId: string | null;
    parentUnitName: string | null;
    totalEmployees: number;
    totalShifts: number;
    totalAttendances: number;
    totalNotAttendances: number;
    totalLate: number;
    totalLeaves: number;
    totalOvertime: number;
    employeeDetails: EmployeeDetail[];
}

export interface OrganizationalReportData {
    date: string;
    generatedAt: string;
    totalEmployees: number | 0;
    totalAttendances: number | 0;
    totalNotAttendances: number | 0;
    totalLate: number | 0;
    totalLeaves: number | 0;
    totalOvertime: number;
    units: Unit[];
}

export interface OrganizationalReportResponse {
    isSuccess: boolean;
    message: string;
    data: OrganizationalReportData;
}

export interface OrganizationalReportRequest {
    organizationalUnitId?: string;
    startDate?: string;
    endDate?: string;
    shiftId?: string;
    includeSubUnits?: boolean;
    searchTerm?: string;
    page?: number;
    pageSize?: number;
}

export interface OrganizationalReportQuery {
    organizationalUnitId: string; // Guid - required
    startDate?: string | null; // DateTime? - nullable
    endDate?: string | null; // DateTime? - nullable
    shiftId?: string | null; // Guid? - nullable
    includeSubUnits?: boolean; // bool - default true
}