import { z } from 'zod';
import {
  IOrganizationalUnitDetails,
  CreateOrganizationalUnitPayload
} from '../types/organizationsunits';

// Define the OrganizationalUnitStatus enum
export enum OrganizationalUnitStatus {
  Active = 1,
  Inactive = 2,
  Deleted = 4
}

// Status label configuration for UI display
export const statusLabels: Record<
  OrganizationalUnitStatus,
  { label: string; variant: 'default' | 'destructive' | 'outline' | 'secondary' }
> = {
  [OrganizationalUnitStatus.Active]: { label: 'نشط', variant: 'default' },
  [OrganizationalUnitStatus.Inactive]: {
    label: 'غير نشط',
    variant: 'outline'
  },
  [OrganizationalUnitStatus.Deleted]: {
    label: 'محذوف',
    variant: 'destructive'
  }
};

// Updated form schema to match API structure
export const formSchema = (initialData?: IOrganizationalUnitDetails | null) => {
  return z.object({
    unitName: z.string().min(1, 'اسم الوحدة / الجهة مطلوب'),
    unitCode: z.string().min(1, 'رمز الوحدة مطلوب'),
    unitDescription: z.string().optional().nullable(),
    parentUnitId: z.string().optional().nullable(),
    email: z
      .string()
      .email('صيغة البريد الإلكتروني غير صحيحة')
      .optional()
      .or(z.literal(''))
      .nullable(),
    phoneNumber: z.string().optional().nullable(),
    address: z.string().optional().nullable(),
    postalCode: z.string().optional().nullable(),
    unitLogo: z.string().optional().nullable(),
    unitLevel: z
      .number()
      .int()
      .min(1, 'يجب أن يكون المستوى 1 على الأقل')
      .optional()
      .nullable(),
    managerId: z.string().optional().nullable()
  });
};

// Define the form values type based on the schema
export type OrganizationalUnitFormValues = z.infer<
  ReturnType<typeof formSchema>
>;

// Utility function to format organizational unit data for API calls
export const formatOrganizationalUnitPayload = (
  formData: OrganizationalUnitFormValues
): CreateOrganizationalUnitPayload => {
  return {
    unitName: formData.unitName,
    unitCode: formData.unitCode,
    unitDescription: formData.unitDescription || undefined,
    parentUnitId: formData.parentUnitId || undefined,
    email: formData.email || undefined,
    phoneNumber: formData.phoneNumber || undefined,
    address: formData.address || undefined,
    postalCode: formData.postalCode || undefined,
    unitLogo: formData.unitLogo || undefined,
    unitLevel: formData.unitLevel || undefined,
    managerId: formData.managerId || undefined
  };
};

// Helper to check if an organizational unit is active
export const isOrganizationalUnitActive = (status: number): boolean => {
  return status === OrganizationalUnitStatus.Active;
};

// Helper to get status text for display
export const getOrganizationalUnitStatusText = (status: number): string => {
  return statusLabels[status as OrganizationalUnitStatus]?.label || 'غير محدد';
};

// Format date for display
export const formatDate = (dateString: string | undefined): string => {
  if (!dateString) return '-';

  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-IQ', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  } catch (error) {
    return dateString;
  }
};

// Helper to format employee count for display
export const formatEmployeeCount = (count: number): string => {
  return (count || 0).toString();
};

// Helper to format child unit count for display
export const formatChildUnitCount = (count: number): string => {
  return (count || 0).toString();
};

// Helper to get unit level display text
export const getUnitLevelText = (level?: number): string => {
  if (!level) return '-';
  return `المستوى ${level}`;
};

// Helper to check if unit has manager
export const hasManager = (
  managerId?: string,
  managerName?: string
): boolean => {
  return !!(managerId && managerName);
};

// Helper to get manager display text
export const getManagerText = (managerName?: string): string => {
  return managerName || 'غير محدد';
};
