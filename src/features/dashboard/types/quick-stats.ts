interface DashboardSummaryData {
    date: string;
    totalEmployees: number;
    presentToday: number;
    absentToday: number;
    lateToday: number;
    onLeaveToday: number;
    attendanceRate: number;
    pendingApprovals: number;
    onlineDevices: number;  // Note: Fixed typo from "onlineDevices" in JSON
    offlineDevices: number;
    activeAlerts: number;
    averageWorkingHours: number;
    averageOvertimeHours: number;
    employeesOnLeave: number;
    recentActivities: number;
}

export interface ApiResponse {
    isSuccess: boolean;
    message: string;
    data: DashboardSummaryData;
}

export interface QuickStatsRequest {
    organizationId: string;
    date?: string;

}