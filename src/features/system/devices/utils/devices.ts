import { z } from "zod";
import { DevicePayload, DeviceData } from "../types/devices";

// Form schema for device creation/editing
export const formSchema = (initialData: DeviceData | null) => {
    return z.object({
        username: z.string().min(1, "Username is required"),
        password: z.string().min(1, "Password is required"),
        location: z.string().min(1, "Location is required"),
        ipAddress: z.string().min(1, "IP address is required"),
        deviceId: z.string().min(1, "Device ID is required"),
        isupKey: z.string().min(1, "ISUP Key is required"),
        port: z.string().min(1, "Port is required"),
        protocol: z.string().min(1, "Protocol is required"),
        deviceModel: z.string().min(1, "Device Model is required"),
        serialNumber: z.string().min(1, "Serial Number is required"),
        macAddress: z.string().min(1, "MAC Address is required"),
        firmwareVersion: z.string().min(1, "Firmware Version is required"),
        department: z.string().min(1, "Department is required"),
        features: z.string().optional(),
        isActive: z.boolean().default(true),
        organizationId: z.string().min(1, "Organization is required"),
    });
};

// Define the form values type based on the schema
export type DeviceFormValues = z.infer<ReturnType<typeof formSchema>>;

// Utility function to format device data for API calls
export const formatDevicePayload = (formData: DeviceFormValues): DevicePayload => {
    return {
        username: formData.username,
        password: formData.password,
        location: formData.location,
        ipAddress: formData.ipAddress,
        deviceId: formData.deviceId,
        isupKey: formData.isupKey,
        port: formData.port,
        protocol: formData.protocol,
        deviceModel: formData.deviceModel,
        serialNumber: formData.serialNumber,
        macAddress: formData.macAddress,
        firmwareVersion: formData.firmwareVersion,
        department: formData.department,
        features: formData.features,
        isActive: formData.isActive,
        organizationId: formData.organizationId,
    };
};

// Helper to get device status display name
export const getDeviceStatusDisplay = (isActive: boolean): string => {
    return isActive ? "نشط" : "غير نشط";
};

// Helper to check if device is active
export const isDeviceActive = (isActive: boolean): boolean => {
    return isActive;
};

// Helper to get active status text
export const getActiveStatusText = (isActive: boolean): string => {
    return isActive ? "نشط" : "غير نشط";
};

// Helper to format date for display
export const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return "غير متاح";

    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('ar-SA', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch (error) {
        return "تاريخ غير صحيح";
    }
};

// Helper to validate IP address format
export const validateIpAddress = (ip: string): boolean => {
    const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    return ipRegex.test(ip);
};

// Helper to validate port number
export const validatePort = (port: string): boolean => {
    const portNum = parseInt(port, 10);
    return portNum >= 1 && portNum <= 65535;
};

// Helper to validate MAC address format
export const validateMacAddress = (mac: string): boolean => {
    const macRegex = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/;
    return macRegex.test(mac);
};

// Helper to get device status color for UI
export const getDeviceStatusColor = (isActive: boolean): string => {
    return isActive ? "text-green-600" : "text-red-600";
};

// Helper to get device status badge variant
export const getDeviceStatusVariant = (isActive: boolean): "default" | "secondary" | "destructive" | "outline" => {
    return isActive ? "default" : "destructive";
};





