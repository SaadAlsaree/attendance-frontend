interface AttendanceStats {
    totalCheckIns: number;
    totalCheckOuts: number;
    pendingApprovals: number;
    verifiedLogs: number;
    rejectedLogs: number;
    averageWorkingHours: number;
    averageOvertimeHours: number;
    averageLateMinutes: number;
    averageEarlyLeaveMinutes: number;
}

interface DailyTrend {
    date: string;
    presentCount: number;
    absentCount: number;
    lateCount: number;
    averageWorkingHours: number;
    averageOvertimeHours: number;
}

interface AttendanceTrends {
    dailyTrends: DailyTrend[];
    weeklyTrends: any[]; // Could be more specific if weekly trend structure is known
    monthlyTrends: any[]; // Could be more specific if monthly trend structure is known
}

interface DepartmentStat {
    departmentId: string;
    departmentName: string;
    totalEmployees: number;
    presentCount: number;
    absentCount: number;
    lateCount: number;
    attendanceRate: number;
    averageWorkingHours: number;
}

interface DeviceStats {
    totalDevices: number;
    onlineDevices: number;
    offlineDevices: number;
    activeDevices: number;
    inactiveDevices: number;
    devicesWithIssues: number;
    uptimePercentage: number;
}

interface LeaveStats {
    totalLeaveRequests: number;
    pendingApprovals: number;
    approvedLeaves: number;
    rejectedLeaves: number;
    employeesOnLeave: number;
    averageLeaveDays: number;
}

interface PerformanceMetrics {
    overallAttendanceRate: number;
    punctualityRate: number;
    productivityScore: number;
    employeeSatisfactionScore: number;
    systemUptime: number;
    dataAccuracyRate: number;
}

interface TopPerformer {
    employeeId: string;
    employeeName: string;
    employeeNumber: string;
    department: string;
    attendanceRate: number;
    punctualityRate: number;
    averageWorkingHours: number;
    overtimeHours: number;
    lateCount: number;
    absentCount: number;
}

interface RecentActivity {
    id: string;
    activityType: string;
    description: string;
    employeeName: string;
    timestamp: string;
    status: string;
    location: string;
}

interface Alert {
    id: string;
    alertType: string;
    title: string;
    message: string;
    severity: string;
    createdAt: string;
    isResolved: boolean;
    resolvedAt: string | null;
}

export interface DashboardStatsData {
    totalEmployees: number;
    activeEmployees: number;
    presentToday: number;
    absentToday: number;
    lateToday: number;
    onLeaveToday: number;
    remoteWorkToday: number;
    attendanceStats: AttendanceStats;
    attendanceTrends: AttendanceTrends;
    departmentStats: DepartmentStat[];
    deviceStats: DeviceStats;
    deviceStatuses: any[]; // Could be more specific if device status structure is known
    leaveStats: LeaveStats;
    leaveTypeStats: any[]; // Could be more specific if leave type stat structure is known
    performanceMetrics: PerformanceMetrics;
    topPerformers: TopPerformer[];
    recentActivities: RecentActivity[];
    alerts: Alert[];
}


export interface DashboardStatsRequest {
    organizationId: string;
    startDate?: Date | null;
    endDate?: Date | null;
    departmentId?: string | null;
    employeeId?: string | null;

}