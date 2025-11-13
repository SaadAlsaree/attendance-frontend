export interface LeaveResponse {
    isSuccess: boolean;
    message: string;
    data: LeaveItem[];
    totalCount: number;
    page: number;
    pageSize: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

export interface LeaveItem {
    id: string;
    employeeId: string;
    leaveType: LeaveType;
    startDate: string; // ISO Date string
    endDate: string;   // ISO Date string
    reason: string;
    status: number;
    fullName?: string;
    code?: string;
    approvedBy: string | null;
    approverName: string | null;
    approvedAt: string | null;
    rejectionReason: string | null;
    createdAt: string; // ISO Date string
    lastUpdatedAt: string | null;
}

export interface LeaveFilter {
    pageNumber?: number;   // default = 1
    pageSize?: number;     // default = 10
    employeeId?: number | null;
    managerId?: number | null;
    startDate?: string | null;  // ISO string
    endDate?: string | null;    // ISO string
    leaveType?: LeaveType | null;
    status?: number | null;
    searchTerm?: string | null;
    sortBy?: string | null;
}


export enum LeaveType {
    Ordinary = 1,       // إجازة أعتيادية
    Sick = 2,           // إجازة مرضية
    Emergency = 3,      // إجازة طارئة
    Maternity = 4,      // إجازة أمومة
    TimeOff = 5,        // إجازة زمنية
    Hajj = 6,           // إجازة حج
    Umrah = 7,          // إجازة عمرة
    Study = 8,          // إجازة دراسية
    Unpaid = 9,         // إجازة بدون راتب
    Compensatory = 10,   // إجازة تعويضية
    Duty = 11,      //  واجب
    Night_Break = 12, //  استراحة خفر
    Permitted = 13, //   تنسيب
}

// خريطة لعرض الاسم المقابل لكل نوع
export const LeaveTypeDisplay: Record<LeaveType, string> = {
    [LeaveType.Ordinary]: "إجازة أعتيادية",
    [LeaveType.Sick]: "إجازة مرضية",
    [LeaveType.Emergency]: "إجازة طارئة",
    [LeaveType.Maternity]: "إجازة أمومة",
    [LeaveType.TimeOff]: "إجازة زمنية",
    [LeaveType.Hajj]: "إجازة حج",
    [LeaveType.Umrah]: "إجازة عمرة",
    [LeaveType.Study]: "إجازة دراسية",
    [LeaveType.Unpaid]: "إجازة بدون راتب",
    [LeaveType.Compensatory]: "إجازة تعويضية",
    [LeaveType.Duty]: "واجب",
    [LeaveType.Night_Break]: "استراحة خفر",
    [LeaveType.Permitted]: "تنسيب",
};

