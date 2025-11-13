import { IResponse } from '@/types/response';

// Employee registration request types
export interface EmployeeRegistrationRequest {
    // Employee information
    code: string;
    firstName: string;
    secondName: string;
    thirdName: string;
    fourthName: string;
    familyName: string;
    email: string;
    rfid: string;
    organizationalUnitId: string; // Guid
    managerIdString?: string; // Optional manager ID
    isManager: boolean;

    // File inputs
    faceImage: File;
}

// Employee update request types (for PUT /employees/{id})
export interface EmployeeUpdateRequest {
    employeeId: string;
    firstName: string;
    secondName: string;
    thirdName: string;
    fourthName: string;
    familyName: string;
    email: string;
    code: string;
    isManager: boolean;
    rfid: string;
    organizationalUnitId: string; // Guid
    managerIdString?: string; // Optional manager ID
}

// Profile update request types (for PUT /employees/profile)
export interface ProfileUpdateRequest {
    phoneNumber: string;
    address?: string;
    city?: string;
    profileImage?: string;
}

// Change password request types (for POST /employees/change-password)
export interface ChangePasswordRequest {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

// Update role request types (for PUT /employees/{id}/role)
export interface UpdateRoleRequest {
    userId: string;
    newRole: Role;
    updatedBy: string;
}

// Assign manager request types (for PUT /employees/{id}/manager)
export interface AssignManagerRequest {
    managerId: string;
}

// Employee registration response
export interface EmployeeRegistrationResponse {
    id: string; // Guid of created employee
}

// Employee data for display/editing (matches backend EmployeeResponse)
export interface EmployeeData {
    id: string;
    code: string;
    userId: string;
    firstName: string;
    secondName: string;
    thirdName: string;
    fourthName: string;
    familyName: string;
    fullName: string;
    email: string;
    rfid: string;
    organizationalUnitId: string;
    organizationalUnitName: string;
    managerId?: string;
    managerName?: string;
    isManager: boolean;
    role: Role;
    userLogin: string;
    status: UserStatus;
    createdAt: string;
    faceImageUrl?: string;
    roleName: string;
    statusName: string;
}

// Profile response (matches backend ProfileResponse)
export interface ProfileResponse {
    id: string;
    employeeNumber: string;
    firstName: string;
    secondName: string;
    thirdName?: string;
    fourthName?: string;
    familyName: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    address?: string;
    city?: string;
    position?: string;
    jobTitle?: string;
    birthDate?: string;
    hireDate?: string;
    managerId?: string;
    managerName?: string;
    organizationalUnitId?: string;
    organizationalUnitName?: string;
    profileImage?: string;
    createdAt: string;
}

// Organizational unit for dropdown
export interface OrganizationalUnit {
    id: string;
    name: string;
    code: string;
}

// Manager for dropdown
export interface Manager {
    id: string;
    fullName: string;
    employeeNumber: string;
}

// Role enum (matches backend Role enum)
export enum Role {
    Admin = 'Admin',
    Manager = 'Manager',
    Employee = 'Employee'
}

// User status enum (matches backend UserStatus enum)
export enum UserStatus {
    Active = 'Active',
    Inactive = 'Inactive',
    Suspended = 'Suspended',
    Terminated = 'Terminated'
}

// Form validation schema
export interface EmployeeFormData {
    // Employee information
    code: string;
    firstName: string;
    secondName: string;
    thirdName?: string;
    fourthName?: string;
    familyName: string;
    email: string;
    rfid: string;
    organizationalUnitId: string;
    managerIdString?: string;
    isManager: boolean;

    // File inputs
    faceImage: File | null;
}

// Paginated response wrapper
export interface PaginatedResponse<T> {
    data: T[];
    totalCount: number;
    page: number;
    pageSize: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

// API Response types
export type EmployeeRegistrationApiResponse = IResponse<EmployeeRegistrationResponse>;
export type EmployeeListApiResponse = IResponse<PaginatedResponse<EmployeeData>>;
export type EmployeeDetailApiResponse = IResponse<EmployeeData>;
export type OrganizationalUnitsApiResponse = IResponse<OrganizationalUnit[]>;
export type ManagersApiResponse = IResponse<Manager[]>;
