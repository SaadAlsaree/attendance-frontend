
export interface OrganizationalUnitSummary {
    unitId: string;
    unitName: string;
    unitCode: string;
    parentUnitId: string | null;
    parentUnitName: string | null;
    totalEmployees: number;
    totalShifts: number;
    tottalAttendances: number;
    tottalNotAttendances: number;
    totalLate: number;
    totalLeaves: number;
    totalOvertime: number;
}

export interface GeneralStats {
    totaleEmployees: number;
    tottalAttendances: number;
    tottalNotAttendances: number;
    totalLate: number;
    totalLeaves: number;
    totalOvertime: number;
}

export interface OrganizationalSummaryData {
    date: string;
    generatedAt: string;
    units: OrganizationalUnitSummary[];
    totaleEmployees: number;
    tottalAttendances: number;
    tottalNotAttendances: number;
    totalLate: number;
    totalLeaves: number;
    totalOvertime: number;
}

export interface OrganizationalSummaryResponse {
    isSuccess: boolean;
    message: string;
    data: OrganizationalSummaryData;
}

// Query Parameters for Organizational Summary
export interface OrganizationalSummaryQuery {
    organizationalUnitId?: string; // Guid as string
    includeSubUnits?: boolean;
    date?: string; // DateTime as ISO string
}
