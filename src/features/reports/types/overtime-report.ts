// Mirrors backend OvertimeReportResponse (GetOvertimeReport endpoint, returned directly — no isSuccess/data wrapper).
// Cost and overtime-type fields are placeholders in the backend handler, so they are intentionally omitted here.

export interface OvertimeStatistics {
  totalEmployees: number;
  employeesWithOvertime: number;
  totalOvertimeHours: number;
  averageOvertimeHours: number;
}

export interface EmployeeOvertimeSummary {
  employeeId: string;
  employeeName: string;
  departmentName: string;
  totalOvertimeHours: number;
  overtimeDays: number;
  averageOvertimePerDay: number;
}

export interface DepartmentOvertimeSummary {
  departmentId: string;
  departmentName: string;
  totalEmployees: number;
  employeesWithOvertime: number;
  totalOvertimeHours: number;
  averageOvertimeHours: number;
}

export interface OvertimeReportResponse {
  startDate: string;
  endDate: string;
  reportType: number | string;
  statistics: OvertimeStatistics;
  employeeSummaries: EmployeeOvertimeSummary[];
  departmentSummaries: DepartmentOvertimeSummary[];
  generatedAt: string;
}

export interface OvertimeReportRequest {
  StartDate: string; // YYYY-MM-DD - required (من)
  EndDate: string; // YYYY-MM-DD - required (إلى) - may span previous months
  OrganizationalUnitId?: string; // Guid - optional
  EmployeeId?: string; // Guid - optional
}
