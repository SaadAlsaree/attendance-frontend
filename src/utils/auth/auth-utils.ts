import { UserPermission, Role } from '@/features/system/users-permissions/types/users-permissions';

/**
 * Minimal role-bearing shape, so these helpers accept both `UserPermission`
 * (server, role: Role) and `UserPermissionData` (client hook, role: number).
 */
type RoleBearer = { role: Role | number } | null | undefined;

/**
 * Check if the user has a specific role
 * @param user - The user to check
 * @param role - The role to check (Role enum or numeric value)
 * @returns boolean indicating if the user has the role
 */
export function hasRole(user: RoleBearer, role: Role | number): boolean {
    if (!user) {
        return false;
    }

    return user.role === role;
}

/**
 * Check if the user has any of the specified roles
 * @param user - The user to check
 * @param roles - Array of roles (Role enum or numeric values)
 * @returns boolean indicating if the user has any of the roles
 */
export function hasAnyRole(user: RoleBearer, roles: (Role | number)[]): boolean {
    if (!user || !roles.length) {
        return false;
    }

    return roles.includes(user.role);
}

/**
 * Check if the user has all of the specified roles
 * @param user - The user to check
 * @param roles - Array of roles (Role enum or numeric values)
 * @returns boolean indicating if the user has all the roles
 */
export function hasAllRoles(user: RoleBearer, roles: (Role | number)[]): boolean {
    if (!user || !roles.length) {
        return false;
    }

    // Since a user currently has only one role in the new structure,
    // hasAllRoles only returns true if the array has one role and it matches the user's role.
    if (roles.length > 1) {
        return false;
    }

    return roles.every(role => user.role === role);
}

/**
 * Roles that are strictly view-only (عرض فقط) and must never see write/create/edit
 * affordances. Security officers (ضباط الامن) are monitoring-only.
 */
export const VIEW_ONLY_ROLES: (Role | number)[] = [Role.SecurityOfficer];

/**
 * Whether the user is a view-only role (e.g. security officer).
 */
export function isViewOnly(user: RoleBearer): boolean {
    return !!user && VIEW_ONLY_ROLES.includes(user.role);
}

/**
 * Whether the user is allowed to perform write actions (create/update/delete).
 * View-only roles return false. Used to gate create/edit buttons across the app.
 */
export function canWrite(user: RoleBearer): boolean {
    return !!user && !isViewOnly(user);
}

/**
 * Check if the user has a specific permission
 * @param user - The user to check
 * @param permissionValue - The permission value to check
 * @returns boolean indicating if the user has the permission
 * @note In the current structure, permissions are not explicitly defined.
 * 		 This function currently returns false or can be extended if a permission system is added.
 */
export function hasPermission(_user: UserPermission | null | undefined, _permissionValue: string): boolean {
    // Placeholder for when permissions are added to UserPermission structure
    return false;
}

/**
 * Check if the user has any of the specified permissions
 * @param user - The user to check
 * @param permissionValues - Array of permission values
 * @returns boolean indicating if the user has any of the permissions
 */
export function hasAnyPermission(user: UserPermission | null | undefined, permissionValues: string[]): boolean {
    if (!user || !permissionValues.length) {
        return false;
    }

    return permissionValues.some(permission => hasPermission(user, permission));
}

/**
 * Check if the user has all of the specified permissions
 * @param user - The user to check
 * @param permissionValues - Array of permission values
 * @returns boolean indicating if the user has all the permissions
 */
export function hasAllPermissions(user: UserPermission | null | undefined, permissionValues: string[]): boolean {
    if (!user || !permissionValues.length) {
        return false;
    }

    return permissionValues.every(permission => hasPermission(user, permission));
}

/**
 * Get the current role for a user
 * @param user - The user to get the role for
 * @returns The user's role
 */
export function getUserRole(user: RoleBearer): Role | number | undefined {
    return user?.role;
}

/**
 * Get all role values for a user (as an array for compatibility)
 * @param user - The user to get roles for
 * @returns Array containing the's role
 */
export function getUserRoles(user: RoleBearer): (Role | number)[] {
    if (!user) {
        return [];
    }

    return [user.role];
}

/**
 * Checks if the user is authenticated (has a valid id and is active)
 * @param user - The user to check
 * @returns boolean indicating if the user is authenticated
 */
export function isAuthenticated(user: UserPermission | null | undefined): boolean {
    return !!user && !!user.id && user.isActive;
}

/**
 * Check if the user belongs to a specific organizational unit
 * @param user - The user to check
 * @param organizationalUnitId - The organizational unit ID
 * @returns boolean indicating if the user belongs to the organizational unit
 */
export function isInOrganizationalUnit(user: UserPermission | null | undefined, organizationalUnitId: string): boolean {
    if (!user) {
        return false;
    }

    return user.organizationalUnitId === organizationalUnitId;
}
