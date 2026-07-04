export interface UserPermission {
    id: string;
    username: string;
    userLogin: string;
    role: Role;
    status: number;
    isActive: boolean;
    createdAt: string;
    lastLoginDate: string;
    organizationalUnitId: string;
    organizationalUnitName: string;
    organizationalUnitCode: string;
}

export interface UsersPermissionsResponse {
    isSuccess: boolean;
    message: string;
    data: UserPermission[];
    totalCount: number;
    page: number;
    pageSize: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

export interface ChangePasswordRequest {
    userId: string;
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

export interface UpdateUserRoleRequest {
    newRole: Role;
    updatedBy: string;
}

export interface UpdateUserRequest {
    username: string;
    userLogin: string;
    role: Role;
    status: UserStatus;
    isActive: boolean;
    organizationalUnitId?: string;
}

export interface ResetPasswordRequest {
    userId: string;
    newPassword: string;
    confirmPassword: string;
}

export interface GetUserResponse {
    id: string;
    username: string;
    userLogin: string;
    role: Role;
    isActive: boolean;
    lastLoginDate: string;
    status: number;
}

export interface CreateUserRequest {
    username: string;
    userLogin: string;
    password: string;
    confirmPassword: string;
    role: Role;
    organizationalUnitId: string;
}

export interface UserPermissionData {
    id: string;
    username: string;
    userLogin: string;
    role: number;
    roleName: string;
    isActive: boolean;
    lastLoginDate: string;
    status: number;
    organizationalUnitId: string;
    organizationalUnitName: string;
}

export enum Role {
    Admin = 1,
    User = 2,
    Manager = 3,
    Employee = 4,
    Guest = 5,
    HR_Manager = 6,
    Viewer = 7,
    SuperAdmin = 8,
    SystemUser = 9,
    SystemManager = 10,
    SecurityOfficer = 11,
    OrgSupervisor = 12,
}

export enum UserStatus {
    Active = 1,
    Inactive = 2,
    Suspended = 3,
    Terminated = 4,
}

export const UserStatusDisplayNames: Record<UserStatus, string> = {
    [UserStatus.Active]: "نشط",
    [UserStatus.Inactive]: "غير نشط",
    [UserStatus.Suspended]: "معلق",
    [UserStatus.Terminated]: "منتهي",
};

export function getUserStatusDisplayName(status: UserStatus): string {
    return UserStatusDisplayNames[status] || "غير محدد";
}

export const RoleDisplayNames: Record<Role, string> = {
    [Role.Admin]: "مسؤل",
    [Role.User]: "مستخدم",
    [Role.Manager]: "مدير",
    [Role.Employee]: "موظف",
    [Role.Guest]: "زائر",
    [Role.HR_Manager]: "مدير الموارد البشرية",
    [Role.Viewer]: "مشاهد",
    [Role.SuperAdmin]: "مدير النظام",
    [Role.SystemUser]: "مستخدم النظام",
    [Role.SystemManager]: "مدير النظام",
    [Role.SecurityOfficer]: "ضابط أمن",
    [Role.OrgSupervisor]: "مشرف جهة",
};

export function getRoleDisplayName(role: Role): string {
    return RoleDisplayNames[role] || "غير محدد";
}

// Helper function to get valid role options
export function getValidRoles(): Array<{ value: string; label: string }> {
    return Object.entries(Role)
        .filter(([key]) => isNaN(Number(key))) // Filter out numeric keys
        .map(([, value]) => ({
            value: value.toString(),
            label: getRoleDisplayName(value as Role)
        }))
        .filter(option => option.label !== "غير محدد"); // Filter out undefined roles
}
