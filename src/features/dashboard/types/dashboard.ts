// DashboardData.ts

export interface DashboardData {
    quickStats: QuickStats;
    detailedStats: DetailedStats;
    navigation: Navigation;
}

export interface QuickStats {
    date: string;
    totalEmployees: number;
    presentToday: number;
    absentToday: number;
    lateToday: number;
    onLeaveToday: number;
    attendanceRate: number;
    pendingApprovals: number;
    onlineDevices: number;
    offlineDevices: number;
    activeAlerts: number;
    averageWorkingHours: number;
    averageOvertimeHours: number;
    employeesOnLeave: number;
    recentActivities: number;
}

export interface DetailedStats {
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
    deviceStatuses: any[];
    leaveStats: LeaveStats;
    leaveTypeStats: any[];
    performanceMetrics: PerformanceMetrics;
    topPerformers: TopPerformer[];
    recentActivities: RecentActivity[];
    alerts: Alert[];
}

export interface AttendanceStats {
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

export interface AttendanceTrends {
    dailyTrends: DailyTrend[];
    weeklyTrends: any[];
    monthlyTrends: any[];
}

export interface DailyTrend {
    date: string;
    presentCount: number;
    absentCount: number;
    lateCount: number;
    averageWorkingHours: number;
    averageOvertimeHours: number;
}

export interface DepartmentStat {
    departmentId: string;
    departmentName: string;
    totalEmployees: number;
    presentCount: number;
    absentCount: number;
    lateCount: number;
    attendanceRate: number;
    averageWorkingHours: number;
}

export interface DeviceStats {
    totalDevices: number;
    onlineDevices: number;
    offlineDevices: number;
    activeDevices: number;
    inactiveDevices: number;
    devicesWithIssues: number;
    uptimePercentage: number;
}

export interface LeaveStats {
    totalLeaveRequests: number;
    pendingApprovals: number;
    approvedLeaves: number;
    rejectedLeaves: number;
    employeesOnLeave: number;
    averageLeaveDays: number;
}

export interface PerformanceMetrics {
    overallAttendanceRate: number;
    punctualityRate: number;
    productivityScore: number;
    employeeSatisfactionScore: number;
    systemUptime: number;
    dataAccuracyRate: number;
}

export interface TopPerformer {
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

export interface RecentActivity {
    id: string;
    activityType: string;
    description: string;
    employeeName: string;
    timestamp: string;
    status: string;
    location: string;
}

export interface Alert {
    id: string;
    alertType: string;
    title: string;
    message: string;
    severity: string;
    createdAt: string;
    isResolved: boolean;
    resolvedAt: string | null;
}

export interface Navigation {
    quickActions: NavItem[];
    reports: NavItem[];
    management: NavItem[];
}

export interface NavItem {
    title: string;
    description: string;
    route: string;
    icon: string;
    requiresPermission: boolean;
    permission: string | null;
}


export interface DashboardRequest {
    organizationId: string;
    startDate?: Date | null;
    endDate?: Date | null;
    departmentId?: string | null;
    employeeId?: string | null;
}