import { z } from "zod";
import { Role, UserStatus } from "../types/users-permissions";

// Role enum validation
export const RoleSchema = z.nativeEnum(Role);

// UserStatus enum validation
export const UserStatusSchema = z.nativeEnum(UserStatus);

// UserPermission validation
export const UserPermissionSchema = z.object({
    id: z.string().uuid(),
    username: z.string().min(1, "Username is required"),
    userLogin: z.string().min(1, "User login is required"),
    role: RoleSchema,
    status: z.number().int().min(0),
    isActive: z.boolean(),
    createdAt: z.string().datetime(),
    lastLoginDate: z.string().datetime(),
    organizationalUnitId: z.string().uuid(),
    organizationalUnitName: z.string().min(1, "Organizational unit name is required"),
    organizationalUnitCode: z.string().min(1, "Organizational unit code is required"),
});

// UsersPermissionsResponse validation
export const UsersPermissionsResponseSchema = z.object({
    isSuccess: z.boolean(),
    message: z.string(),
    data: z.array(UserPermissionSchema),
    totalCount: z.number().int().min(0),
    page: z.number().int().min(1),
    pageSize: z.number().int().min(1),
    totalPages: z.number().int().min(0),
    hasNextPage: z.boolean(),
    hasPreviousPage: z.boolean(),
});

// ChangePasswordRequest validation
export const ChangePasswordRequestSchema = z.object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "New password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Confirm password is required"),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

// UpdateUserRoleRequest validation
export const UpdateUserRoleRequestSchema = z.object({
    newRole: RoleSchema,
    updatedBy: z.string().uuid("Invalid user ID format"),
});

// ResetPasswordRequest validation
export const ResetPasswordRequestSchema = z.object({
    userId: z.string().uuid("Invalid user ID format"),
    newPassword: z.string().min(8, "New password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Confirm password is required"),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

// GetUserResponse validation
export const GetUserResponseSchema = z.object({
    id: z.string().uuid(),
    userLogin: z.string().min(1, "User login is required"),
    role: RoleSchema,
    isActive: z.boolean(),
    lastLoginDate: z.string().datetime(),
    status: z.number().int().min(0),
});

// CreateUserRequest validation
export const CreateUserRequestSchema = z.object({
    userLogin: z.string().min(1, "User login is required"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Confirm password is required"),
    role: RoleSchema,
    organizationalUnitId: z.string().uuid("Invalid organizational unit ID format"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

// Form schemas
export const formSchema = (initialData?: any) => {
    const isEditMode = !!initialData;
    
    return z.object({
        username: z.string().min(1, "اسم المستخدم مطلوب"),
        userLogin: z.string().min(1, "اسم المستخدم مطلوب"),
        password: isEditMode 
            ? z.string().optional()
            : z.string().min(8, "كلمة المرور يجب أن تكون 8 أحرف على الأقل"),
        confirmPassword: isEditMode 
            ? z.string().optional()
            : z.string().min(1, "تأكيد كلمة المرور مطلوب"),
        role: z.string().min(1, "الدور مطلوب"),
        status: isEditMode
            ? z.string().min(1, "حالة المستخدم مطلوبة")
            : z.string().optional(),
        organizationalUnitId: z.string().min(1, "الوحدة التنظيمية مطلوبة"),
        isActive: z.boolean().default(true),
    }).refine((data) => {
        // Only validate password match if passwords are provided
        if (isEditMode) {
            // In edit mode, if password is provided, confirmPassword must match
            if (data.password && data.password.length > 0) {
                return data.password === data.confirmPassword;
            }
            // If password is empty, validation passes
            return true;
        }
        // In create mode, passwords must match
        return data.password === data.confirmPassword;
    }, {
        message: "كلمات المرور غير متطابقة",
        path: ["confirmPassword"],
    }).refine((data) => {
        // In edit mode, if password is provided, it must be at least 8 characters
        if (isEditMode && data.password && data.password.length > 0) {
            return data.password.length >= 8;
        }
        return true;
    }, {
        message: "كلمة المرور يجب أن تكون 8 أحرف على الأقل",
        path: ["password"],
    });
};

export const changePasswordFormSchema = z.object({
    currentPassword: z.string().min(1, "كلمة المرور الحالية مطلوبة"),
    newPassword: z.string().min(8, "كلمة المرور الجديدة يجب أن تكون 8 أحرف على الأقل"),
    confirmPassword: z.string().min(1, "تأكيد كلمة المرور مطلوب"),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "كلمات المرور غير متطابقة",
    path: ["confirmPassword"],
});

export const updateRoleFormSchema = z.object({
    newRole: z.string().min(1, "الدور الجديد مطلوب"),
});

export const resetPasswordFormSchema = z.object({
    newPassword: z.string().min(8, "كلمة المرور الجديدة يجب أن تكون 8 أحرف على الأقل"),
    confirmPassword: z.string().min(1, "تأكيد كلمة المرور مطلوب"),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "كلمات المرور غير متطابقة",
    path: ["confirmPassword"],
});

// Form types
export type FormValues = z.infer<ReturnType<typeof formSchema>>;
export type ChangePasswordFormValues = z.infer<typeof changePasswordFormSchema>;
export type UpdateRoleFormValues = z.infer<typeof updateRoleFormSchema>;
export type ResetPasswordFormValues = z.infer<typeof resetPasswordFormSchema>;

// Export types from schemas
export type UserPermissionInput = z.infer<typeof UserPermissionSchema>;
export type UsersPermissionsResponseInput = z.infer<typeof UsersPermissionsResponseSchema>;
export type ChangePasswordRequestInput = z.infer<typeof ChangePasswordRequestSchema>;
export type UpdateUserRoleRequestInput = z.infer<typeof UpdateUserRoleRequestSchema>;
export type ResetPasswordRequestInput = z.infer<typeof ResetPasswordRequestSchema>;
export type GetUserResponseInput = z.infer<typeof GetUserResponseSchema>;
export type CreateUserRequestInput = z.infer<typeof CreateUserRequestSchema>;
