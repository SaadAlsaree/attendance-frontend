export interface EmployeeReportDay {
    date: string;
    checkInTime: string | null;
    checkOutTime: string | null;
    statusName: string;
    lateMinutes: number;
    earlyLeaveMinutes: number;
    overtimeMinutes: number;
    isNonFingerprinted: boolean;
}

export interface EmployeeReportData {
    employeeId: string;
    employeeName: string;
    employeeCode: string | null;
    organizationalUnitName: string;
    fromDate: string;
    toDate: string;
    generatedAt: string;
    totalDays: number;
    presentDays: number;
    absentDays: number;
    lateDays: number;
    earlyLeaveDays: number;
    leaveDays: number;
    totalOvertimeHours: number;
    days: EmployeeReportDay[];
}

export interface EmployeeReportResponse {
    isSuccess: boolean;
    message: string;
    data: EmployeeReportData;
}

export interface EmployeeReportRequest {
    employeeId: string; // Guid - required
    fromDate: string; // DateOnly (YYYY-MM-DD) - required
    toDate: string; // DateOnly (YYYY-MM-DD) - required
}
