// Enums (define these based on your actual C# enum values)

// Query Interface
export interface GetAttendanceReportQuery {
    OrganizationalUnitId: string;
    StartDate?: Date | null;
    EndDate?: Date | null;
    ShiftId?: string | null;
    IncludeSubUnits?: boolean;
}

// Response Interfaces
export interface AttendanceReportResponse {
    isSuccess: boolean;
    message: string;
    data: AttendanceReportData;
}

export interface AttendanceReportData {
    organizationalUnitId: string;
    organizationalUnitName: string;
    startDate: string;
    endDate: string;
    generatedAt: string;
    generalStats: GeneralStats;
    shiftStats: ShiftStats[];
    subUnitStats: SubUnitStats[];
    leaveStats: LeaveStats;
}

export interface GeneralStats {
    totalEmployees: number;
    totalShifts: number;
    totalPresent: number;
    totalAbsent: number;
    totalLate: number;
    totalEarlyLeave: number;
    totalOvertime: number;
    totalNoCheckIn: number;
    totalNoCheckOut: number;
    totalOnLeave: number;
    attendanceRate: number;
    absenceRate: number;
    lateRate: number;
    earlyLeaveRate: number;
    overtimeRate: number;
    leaveRate: number;
}

export interface ShiftStats {
    shiftId: string;
    shiftName: string;
    startTime: string;
    endTime: string;
    totalEmployees: number;
    presentCount: number;
    absentCount: number;
    lateCount: number;
    earlyLeaveCount: number;
    overtimeCount: number;
    noCheckInCount: number;
    noCheckOutCount: number;
    onLeaveCount: number;
    attendanceRate: number;
    absenceRate: number;
    lateRate: number;
    earlyLeaveRate: number;
    overtimeRate: number;
    leaveRate: number;
}

export interface SubUnitStats {
    // Define based on actual sub-unit structure if needed
    [key: string]: any;
}

export interface LeaveStats {
    totalLeaves: number;
    approvedLeaves: number;
    pendingLeaves: number;
    rejectedLeaves: number;
    leaveTypeStats: LeaveTypeStats[];
    approvalRate: number;
    rejectionRate: number;
    pendingRate: number;
}

export interface LeaveTypeStats {
    // Define based on actual leave type structure if needed
    [key: string]: any;
}