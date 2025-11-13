import { z } from "zod";
import { IOrganizationalUnitDetails, CreateOrganizationalUnitPayload } from "../types/organizational";

// Define the OrganizationalUnitStatus enum (kept for backward compatibility)
export enum OrganizationalUnitStatus {
    Active = 1,
    Inactive = 2,
    Deleted = 4,
}

// Status label configuration for UI display with proper variant types
export const statusLabels: Record<OrganizationalUnitStatus, { label: string; variant: "default" | "destructive" | "outline" | "secondary" }> = {
    [OrganizationalUnitStatus.Active]: { label: "Active", variant: "default" },
    [OrganizationalUnitStatus.Inactive]: { label: "Inactive", variant: "outline" },
    [OrganizationalUnitStatus.Deleted]: { label: "Deleted", variant: "destructive" },
};

// Updated form schema to match new API structure
export const formSchema = (initialData: IOrganizationalUnitDetails | null) => {
    return z.object({
        unitName: z.string().min(1, "Unit name is required"),
        unitCode: z.string().min(1, "Unit code is required"),
        unitDescription: z.string().optional(),
        parentUnitId: z.string().optional(),
        email: z.string().email("Invalid email format").optional().or(z.literal("")),
        phoneNumber: z.string().optional(),
        address: z.string().optional(),
        postalCode: z.string().optional(),
        unitLogo: z.string().optional(),
        unitLevel: z.number().int().min(1, "Unit level must be at least 1").optional(),
        managerId: z.string().optional(),
    });
};

// Define the form values type based on the schema
export type OrganizationalUnitFormValues = z.infer<ReturnType<typeof formSchema>>;

// Utility function to format organizational unit data for API calls
export const formatOrganizationalUnitPayload = (formData: OrganizationalUnitFormValues): CreateOrganizationalUnitPayload => {
    return {
        unitName: formData.unitName,
        unitCode: formData.unitCode,
        unitDescription: formData.unitDescription,
        parentUnitId: formData.parentUnitId,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        address: formData.address,
        postalCode: formData.postalCode,
        unitLogo: formData.unitLogo,
        unitLevel: formData.unitLevel,
        managerId: formData.managerId,
    };
};

// Helper to check if an organizational unit is active (legacy - can be removed if not needed)
export const isOrganizationalUnitActive = (status: number): boolean => {
    return status === OrganizationalUnitStatus.Active;
};

// Helper to get status text for display (legacy - can be removed if not needed)
export const getOrganizationalUnitStatusText = (status: number): string => {
    return statusLabels[status as OrganizationalUnitStatus]?.label || "Unknown";
};

// Format date for display
export const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return "Not available";

    try {
        const date = new Date(dateString);
        return date.toLocaleDateString();
    } catch (error) {
        return "Invalid date";
    }
};

// Helper to format employee count for display
export const formatEmployeeCount = (count: number): string => {
    return count.toString();
};

// Helper to format child unit count for display
export const formatChildUnitCount = (count: number): string => {
    return count.toString();
};

// Helper to get unit level display text
export const getUnitLevelText = (level?: number): string => {
    if (!level) return "Not specified";
    return `Level ${level}`;
};

// Helper to check if unit has manager
export const hasManager = (managerId?: string, managerName?: string): boolean => {
    return !!(managerId && managerName);
};

// Helper to get manager display text
export const getManagerText = (managerName?: string): string => {
    return managerName || "No manager assigned";
};
