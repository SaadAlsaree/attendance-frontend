export interface DevicePayload {
    id?: string;
    username?: string;
    password?: string;
    location?: string;
    ipAddress: string; // Required field, cannot be empty
    deviceId?: string;
    isupKey?: string;
    port?: string;
    protocol?: string;
    deviceModel?: string;
    serialNumber?: string;
    macAddress?: string;
    firmwareVersion?: string;
    department?: string;
    features?: string;
    isActive: boolean; // Required field
    lastConnected?: string; // ISO timestamp, can be converted to Date if needed
    organizationId?: string; // UUID
    workLocationId?: string; // UUID
}

// Enum equivalent to your C# DeviceStatus
export enum DeviceStatus {
    Online = 0,
    Offline = 1,
    Maintenance = 2,
}

export const DeviceStatusDisplay: Record<DeviceStatus, string> = {
    [DeviceStatus.Online]: "متصل",
    [DeviceStatus.Offline]: "غير متصل",
    [DeviceStatus.Maintenance]: "صيانة",
};

export interface DeviceData {
    id: string; // Guid
    username?: string | null;
    password?: string | null;
    location?: string | null;
    ipAddress: string; // Required field, cannot be empty
    deviceId?: string | null;
    isupKey?: string | null;
    port?: string | null;
    protocol?: string | null;
    deviceModel?: string | null;
    serialNumber?: string | null;
    macAddress?: string | null;
    firmwareVersion?: string | null;
    department?: string | null;
    features?: string | null;
    isActive: boolean; // Required field
    lastConnected?: string | null; // ISO timestamp, can be converted to Date if needed
    organizationId?: string | null; // UUID
    workLocationId?: string | null; // UUID
    createdAt?: string; // ISO timestamp, can be converted to Date if needed
    updatedAt?: string; // ISO timestamp, can be converted to Date if needed

    // Navigation properties
    organizationName?: string | null;
    workLocationName?: string | null;
}

// Main Device Response (paginated)
export interface DeviceResponse {
    data: DeviceData[];
    totalItems: number;
    isSuccess: boolean;
    message: string;
}

// Single Device Response
export interface DeviceDetailResponse {
    data: DeviceData;
    isSuccess: boolean;
    message: string;
}

export interface DeviceQuery {
    page?: number;        // default: 1
    pageSize?: number;    // default: 10
    status?: DeviceStatus | null;
    searchTerm?: string | null;
}

