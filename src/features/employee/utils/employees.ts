import { z } from 'zod';
import moment from 'moment';
import {
    EmployeeFormData,
    Role,
    EmployeeRegistrationRequest,
    EmployeeUpdateRequest,
    ProfileUpdateRequest,
    ChangePasswordRequest,
    UpdateRoleRequest,
    AssignManagerRequest,
    EmployeeData
} from '../types/employees';

// Zod validation schema
export const employeeFormSchema = z.object({
    code: z.string().optional(),
    firstName: z.string()
        .min(2, 'الاسم الأول يجب أن يكون حرفين على الأقل')
        .max(50, 'الاسم الأول يجب أن يكون 50 حرف على الأكثر'),
    secondName: z.string()
        .min(2, 'الاسم الثاني يجب أن يكون حرفين على الأقل')
        .max(50, 'الاسم الثاني يجب أن يكون 50 حرف على الأكثر'),
    thirdName: z.string()
        .max(50, 'الاسم الثالث يجب أن يكون 50 حرف على الأكثر')
        .optional(),
    fourthName: z.string()
        .max(50, 'الاسم الرابع يجب أن يكون 50 حرف على الأكثر')
        .optional(),
    familyName: z.string()
        .min(2, 'اسم العائلة يجب أن يكون حرفين على الأقل')
        .max(50, 'اسم العائلة يجب أن يكون 50 حرف على الأكثر'),
    email: z.string().optional(),
    rfid: z.string()
        .min(1, 'رمز RFID مطلوب')
        .max(50, 'رمز RFID يجب أن يكون 50 حرف على الأكثر'),
    organizationalUnitId: z.string()
        .min(1, 'الوحدة التنظيمية مطلوبة'),
    managerIdString: z.string().optional(),
    isManager: z.boolean().optional(),
    faceImage: z.instanceof(File, {
        message: 'صورة الوجه مطلوبة'
    }).nullable()
});

// Profile update validation schema
export const profileUpdateSchema = z.object({
    phoneNumber: z.string()
        .regex(/^[0-9+\-\s()]+$/, 'رقم الهاتف غير صحيح'),
    address: z.string()
        .max(200, 'العنوان يجب أن يكون 200 حرف على الأكثر')
        .optional(),
    city: z.string()
        .max(50, 'المدينة يجب أن تكون 50 حرف على الأكثر')
        .optional(),
    profileImage: z.string().optional()
});

// Password change validation schema
export const passwordChangeSchema = z.object({
    currentPassword: z.string()
        .min(1, 'كلمة المرور الحالية مطلوبة'),
    newPassword: z.string()
        .min(6, 'كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل')
        .max(100, 'كلمة المرور الجديدة يجب أن تكون 100 حرف على الأكثر'),
    confirmPassword: z.string()
        .min(1, 'تأكيد كلمة المرور مطلوب')
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: 'كلمة المرور الجديدة وتأكيدها غير متطابقين',
    path: ['confirmPassword']
});

// Role update validation schema
export const roleUpdateSchema = z.object({
    userId: z.string().min(1, 'معرف المستخدم مطلوب'),
    newRole: z.nativeEnum(Role, {
        errorMap: () => ({ message: 'الدور مطلوب' })
    }),
    updatedBy: z.string().min(1, 'معرف المحدث مطلوب')
});

// Manager assignment validation schema
export const managerAssignmentSchema = z.object({
    managerId: z.string().min(1, 'معرف المدير مطلوب')
});

// Extended schema with custom validations
export const employeeFormSchemaWithCustomValidations = employeeFormSchema;

// Create a custom validation schema for new employees (files required)
export const newEmployeeFormSchema = employeeFormSchemaWithCustomValidations
    .refine((data) => {
        return data.faceImage !== null;
    }, {
        message: 'صورة الوجه مطلوبة',
        path: ['faceImage']
    });

// Role options for dropdown
export const roleOptions = [
    { value: Role.Admin, label: 'مدير النظام' },
    { value: Role.Manager, label: 'مدير' },
    { value: Role.Employee, label: 'موظف' }
];

// File validation
export const validateFile = (file: File, maxSize: number = 5 * 1024 * 1024): string | null => {
    // Check file size (5MB default)
    if (file.size > maxSize) {
        return `حجم الملف يجب أن يكون أقل من ${Math.round(maxSize / 1024 / 1024)}MB`;
    }

    // Check file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
        return 'نوع الملف غير مدعوم. يرجى استخدام JPG, PNG, أو WebP';
    }

    return null;
};

// Transform form data to API request
export const transformFormDataToRequest = (formData: EmployeeFormData): EmployeeRegistrationRequest => {
    return {
        code: formData.code,
        firstName: formData.firstName,
        secondName: formData.secondName,
        thirdName: formData.thirdName || '',
        fourthName: formData.fourthName || '',
        familyName: formData.familyName,
        email: formData.email,
        rfid: formData.rfid,
        organizationalUnitId: formData.organizationalUnitId,
        managerIdString: formData.managerIdString || undefined,
        isManager: formData.isManager,
        faceImage: formData.faceImage!
    };
};

// Transform employee data to update request
export const transformEmployeeDataToUpdateRequest = (employee: EmployeeData): EmployeeUpdateRequest => {
    return {
        employeeId: employee.id.toString(),
        firstName: employee.firstName,
        secondName: employee.secondName,
        thirdName: employee.thirdName,
        fourthName: employee.fourthName,
        familyName: employee.familyName,
        email: employee.email,
        code: employee.code,
        rfid: employee.rfid,
        organizationalUnitId: employee.organizationalUnitId,
        isManager: employee.isManager
    };
};

// Transform form data to profile update request
export const transformFormDataToProfileUpdateRequest = (data: {
    phoneNumber: string;
    address?: string;
    city?: string;
    profileImage?: string;
}): ProfileUpdateRequest => {
    return {
        phoneNumber: data.phoneNumber,
        address: data.address,
        city: data.city,
        profileImage: data.profileImage
    };
};

// Transform form data to password change request
export const transformFormDataToPasswordChangeRequest = (data: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}): ChangePasswordRequest => {
    return {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword
    };
};

// Transform form data to role update request
export const transformFormDataToRoleUpdateRequest = (data: {
    userId: string;
    newRole: Role;
    updatedBy: string;
}): UpdateRoleRequest => {
    return {
        userId: data.userId,
        newRole: data.newRole,
        updatedBy: data.updatedBy
    };
};

// Transform form data to manager assignment request
export const transformFormDataToManagerAssignmentRequest = (data: {
    managerId: string;
}): AssignManagerRequest => {
    return {
        managerId: data.managerId
    };
};

// Format date for display
export const formatDate = (dateString: string): string => {
    return moment(dateString).format('YYYY-MM-DD');
};

// Format date for input (YYYY-MM-DD)
export const formatDateForInput = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
};

// Get full name from employee data
export const getFullName = (employee: {
    firstName: string;
    secondName: string;
    thirdName?: string;
    fourthName?: string;
    familyName: string;
}): string => {
    const names = [
        employee.firstName,
        employee.secondName,
        employee.thirdName,
        employee.fourthName,
        employee.familyName
    ].filter(Boolean);

    return names.join(' ');
};

// Get role display name
export const getRoleDisplayName = (role: Role): string => {
    switch (role) {
        case Role.Admin:
            return 'مدير النظام';
        case Role.Manager:
            return 'مدير';
        case Role.Employee:
            return 'موظف';
        default:
            return 'غير محدد';
    }
};

// Get role badge variant
export const getRoleBadgeVariant = (role: Role): 'default' | 'secondary' | 'destructive' | 'outline' => {
    switch (role) {
        case Role.Admin:
            return 'destructive';
        case Role.Manager:
            return 'default';
        case Role.Employee:
            return 'secondary';
        default:
            return 'outline';
    }
};

// Validate profile update data
export const validateProfileUpdateData = (data: ProfileUpdateRequest): { isValid: boolean; errors: Record<string, string> } => {
    try {
        profileUpdateSchema.parse(data);
        return { isValid: true, errors: {} };
    } catch (error) {
        if (error instanceof z.ZodError) {
            const errors: Record<string, string> = {};
            error.errors.forEach((err) => {
                if (err.path[0]) {
                    errors[err.path[0] as string] = err.message;
                }
            });
            return { isValid: false, errors };
        }
        return { isValid: false, errors: { general: 'خطأ في التحقق من البيانات' } };
    }
};

// Validate password change data
export const validatePasswordChangeData = (data: ChangePasswordRequest): { isValid: boolean; errors: Record<string, string> } => {
    try {
        passwordChangeSchema.parse(data);
        return { isValid: true, errors: {} };
    } catch (error) {
        if (error instanceof z.ZodError) {
            const errors: Record<string, string> = {};
            error.errors.forEach((err) => {
                if (err.path[0]) {
                    errors[err.path[0] as string] = err.message;
                }
            });
            return { isValid: false, errors };
        }
        return { isValid: false, errors: { general: 'خطأ في التحقق من البيانات' } };
    }
};

// Validate role update data
export const validateRoleUpdateData = (data: UpdateRoleRequest): { isValid: boolean; errors: Record<string, string> } => {
    try {
        roleUpdateSchema.parse(data);
        return { isValid: true, errors: {} };
    } catch (error) {
        if (error instanceof z.ZodError) {
            const errors: Record<string, string> = {};
            error.errors.forEach((err) => {
                if (err.path[0]) {
                    errors[err.path[0] as string] = err.message;
                }
            });
            return { isValid: false, errors };
        }
        return { isValid: false, errors: { general: 'خطأ في التحقق من البيانات' } };
    }
};

// Validate manager assignment data
export const validateManagerAssignmentData = (data: AssignManagerRequest): { isValid: boolean; errors: Record<string, string> } => {
    try {
        managerAssignmentSchema.parse(data);
        return { isValid: true, errors: {} };
    } catch (error) {
        if (error instanceof z.ZodError) {
            const errors: Record<string, string> = {};
            error.errors.forEach((err) => {
                if (err.path[0]) {
                    errors[err.path[0] as string] = err.message;
                }
            });
            return { isValid: false, errors };
        }
        return { isValid: false, errors: { general: 'خطأ في التحقق من البيانات' } };
    }
};

// Validate form data using Zod
export const validateFormData = (data: EmployeeFormData): { isValid: boolean; errors: Record<string, string> } => {
    try {
        employeeFormSchemaWithCustomValidations.parse(data);
        return { isValid: true, errors: {} };
    } catch (error) {
        if (error instanceof z.ZodError) {
            const errors: Record<string, string> = {};
            error.errors.forEach((err) => {
                const field = err.path[0] as string;
                errors[field] = err.message;
            });
            return { isValid: false, errors };
        }
        return { isValid: false, errors: { general: 'خطأ في التحقق من البيانات' } };
    }
};

// Generate employee code
export const generateEmployeeCode = (): string => {
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `EMP${timestamp.slice(-6)}${random}`;
};

// Check if date is valid
export const isValidDate = (dateString: string): boolean => {
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date.getTime());
};

// Check if birth date is reasonable (person should be at least 18 years old)
export const validateBirthDate = (birthDate: string): string | null => {
    const birth = new Date(birthDate);
    const today = new Date();
    const age = today.getFullYear() - birth.getFullYear();

    if (age < 18) {
        return 'يجب أن يكون عمر الموظف 18 سنة على الأقل';
    }

    if (age > 100) {
        return 'تاريخ الميلاد غير صحيح';
    }

    return null;
};

// Check if hire date is after birth date
export const validateHireDate = (birthDate: string, hireDate: string): string | null => {
    const birth = new Date(birthDate);
    const hire = new Date(hireDate);

    if (hire <= birth) {
        return 'تاريخ التعيين يجب أن يكون بعد تاريخ الميلاد';
    }

    return null;
};

// Type for the validated form data
export type ValidatedEmployeeFormData = z.infer<typeof employeeFormSchemaWithCustomValidations>;
