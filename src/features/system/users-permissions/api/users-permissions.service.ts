import { axiosClient, axiosInstance } from '@/lib/axios';
import {
  UserPermission,
  UsersPermissionsResponse,
  ChangePasswordRequest,
  UpdateUserRoleRequest,
  UpdateUserRequest,
  ResetPasswordRequest,
  GetUserResponse,
  CreateUserRequest,
  Role
} from '../types/users-permissions';

const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:7000';

export const usersPermissionsService = {
  // Get users permissions list with pagination and filters
  async getUsersPermissionsList(query?: {
    page?: number;
    pageSize?: number;
    search?: string;
    role?: Role;
    isActive?: boolean;
  }): Promise<UsersPermissionsResponse | null> {
    try {
      const response = await axiosInstance.get(`${baseUrl}/users`, {
        params: query
      });
      if (response.status >= 400) {
        console.error(
          'Error fetching users permissions list:',
          response.statusText
        );
        return null;
      }
      return (response.data as UsersPermissionsResponse) || null;
    } catch (error) {
      console.error('Error fetching users permissions list:', error);
      return null;
    }
  },

  // Get user permission by ID
  async getUserPermissionById(id: string): Promise<UserPermission | null> {
    try {
      const response = await axiosInstance.get(`${baseUrl}/users/${id}`);
      if (response.status >= 400) {
        console.error('Error fetching user permission:', response.statusText);
        return null;
      }
      return (response.data as UserPermission) || null;
    } catch (error) {
      console.error('Error fetching user permission:', error);
      return null;
    }
  },

  // Create new user
  async createUser(data: CreateUserRequest): Promise<UserPermission | null> {
    try {
      const response = await axiosInstance.post(
        `${baseUrl}/users-permissions`,
        data
      );
      if (response.status >= 400) {
        console.error('Error creating user:', response.statusText);
        return null;
      }
      return (response.data as UserPermission) || null;
    } catch (error) {
      console.error('Error creating user:', error);
      return null;
    }
  },

  // Update user role
  async updateUserRole(
    id: string,
    data: UpdateUserRoleRequest
  ): Promise<UserPermission | null> {
    try {
      const response = await axiosInstance.put(
        `${baseUrl}/users-permissions/${id}/role`,
        data
      );
      if (response.status >= 400) {
        console.error('Error updating user role:', response.statusText);
        return null;
      }
      return (response.data as UserPermission) || null;
    } catch (error) {
      console.error('Error updating user role:', error);
      return null;
    }
  },

  // Delete user
  async deleteUser(id: string): Promise<boolean> {
    try {
      const response = await axiosInstance.delete(
        `${baseUrl}/users-permissions/${id}`
      );
      if (response.status >= 400) {
        console.error('Error deleting user:', response.statusText);
        return false;
      }
      return response.status === 204;
    } catch (error) {
      console.error('Error deleting user:', error);
      return false;
    }
  },

  // Get current user
  async getCurrentUser(): Promise<UserPermission | null> {
    try {
      const response = await axiosInstance.get(`${baseUrl}/users/me`);
      if (response.status >= 400) {
        console.error('Error fetching current user:', response.statusText);
        return null;
      }
      return (response.data as UserPermission) || null;
    } catch (error) {
      console.error('Error fetching current user:', error);
      return null;
    }
  },

  // Change password
  async changePassword(
    data: ChangePasswordRequest
  ): Promise<{ success: boolean; message: string } | null> {
    try {
      const response = await axiosInstance.put(
        `${baseUrl}/users-permissions/change-password`,
        data
      );
      if (response.status >= 400) {
        console.error('Error changing password:', response.statusText);
        return null;
      }
      return (response.data as { success: boolean; message: string }) || null;
    } catch (error) {
      console.error('Error changing password:', error);
      return null;
    }
  },

  // Reset password
  async resetPassword(
    data: ResetPasswordRequest
  ): Promise<{ success: boolean; message: string } | null> {
    try {
      const response = await axiosInstance.put(
        `${baseUrl}/users/reset-password`,
        data
      );
      if (response.status >= 400) {
        console.error('Error resetting password:', response.statusText);
        return null;
      }
      return (response.data as { success: boolean; message: string }) || null;
    } catch (error) {
      console.error('Error resetting password:', error);
      return null;
    }
  },

  // Toggle user active status
  async toggleUserStatus(id: string): Promise<UserPermission | null> {
    try {
      const response = await axiosInstance.put(
        `${baseUrl}/users-permissions/${id}/toggle-status`
      );
      if (response.status >= 400) {
        console.error('Error toggling user status:', response.statusText);
        return null;
      }
      return (response.data as UserPermission) || null;
    } catch (error) {
      console.error('Error toggling user status:', error);
      return null;
    }
  },

  // Client-side methods (using axiosClient)
  async getUsersPermissionsListClient(query?: {
    page?: number;
    pageSize?: number;
    search?: string;
    role?: Role;
    isActive?: boolean;
  }): Promise<UsersPermissionsResponse | null> {
    try {
      const response = await axiosClient.get(`${baseUrl}/users-permissions`, {
        params: query
      });
      if (response.status >= 400) {
        console.error(
          'Error fetching users permissions list:',
          response.statusText
        );
        return null;
      }
      return (response.data as UsersPermissionsResponse) || null;
    } catch (error) {
      console.error('Error fetching users permissions list:', error);
      return null;
    }
  },

  async getUserPermissionByIdClient(
    id: string
  ): Promise<UserPermission | null> {
    try {
      const response = await axiosClient.get(
        `${baseUrl}/users-permissions/${id}`
      );
      if (response.status >= 400) {
        console.error('Error fetching user permission:', response.statusText);
        return null;
      }
      return (response.data as UserPermission) || null;
    } catch (error) {
      console.error('Error fetching user permission:', error);
      return null;
    }
  },

  async createUserClient(data: CreateUserRequest): Promise<boolean> {
    try {
      const response = await axiosClient.post(`${baseUrl}/users/new`, data);
      if (response.status >= 400) {
        console.error('Error creating user:', response.statusText);
        return false;
      }
      return response.status >= 200 && response.status < 300;
    } catch (error) {
      console.error('Error creating user:', error);
      return false;
    }
  },

  async updateUserRoleClient(
    id: string,
    data: UpdateUserRoleRequest
  ): Promise<UserPermission | null> {
    try {
      const response = await axiosClient.put(
        `${baseUrl}/users-permissions/${id}/role`,
        data
      );
      if (response.status >= 400) {
        console.error('Error updating user role:', response.statusText);
        return null;
      }
      return (response.data as UserPermission) || null;
    } catch (error) {
      console.error('Error updating user role:', error);
      return null;
    }
  },

  async deleteUserClient(id: string): Promise<boolean> {
    try {
      const response = await axiosClient.delete(
        `${baseUrl}/users-permissions/${id}`
      );
      if (response.status >= 400) {
        console.error('Error deleting user:', response.statusText);
        return false;
      }
      return response.status === 204;
    } catch (error) {
      console.error('Error deleting user:', error);
      return false;
    }
  },

  async getCurrentUserClient(): Promise<GetUserResponse | null> {
    try {
      const response = await axiosClient.get(`${baseUrl}/users-permissions/me`);
      if (response.status >= 400) {
        console.error('Error fetching current user:', response.statusText);
        return null;
      }
      return (response.data as GetUserResponse) || null;
    } catch (error) {
      console.error('Error fetching current user:', error);
      return null;
    }
  },

  async changePasswordClient(data: ChangePasswordRequest): Promise<boolean> {
    try {
      const response = await axiosClient.post(
        `${baseUrl}/users/change-password`,
        data
      );
      if (response.status >= 400) {
        console.error('Error changing password:', response.statusText);
        return false;
      }
      return response.status >= 200 && response.status < 300;
    } catch (error) {
      console.error('Error changing password:', error);
      return false;
    }
  },

  async resetPasswordClient(data: ResetPasswordRequest): Promise<boolean> {
    try {
      const response = await axiosClient.post(
        `${baseUrl}/users/reset-password`,
        data
      );
      if (response.status >= 400) {
        console.error('Error resetting password:', response.statusText);
        return false;
      }
      return response.status >= 200 && response.status < 300;
    } catch (error) {
      console.error('Error resetting password:', error);
      return false;
    }
  },

  async toggleUserStatusClient(id: string): Promise<UserPermission | null> {
    try {
      const response = await axiosClient.put(
        `${baseUrl}/users-permissions/${id}/toggle-status`
      );
      if (response.status >= 400) {
        console.error('Error toggling user status:', response.statusText);
        return null;
      }
      return (response.data as UserPermission) || null;
    } catch (error) {
      console.error('Error toggling user status:', error);
      return null;
    }
  },

  // Update user
  async updateUserClient(id: string, data: UpdateUserRequest) {
    try {
      const response = await axiosClient.put(`${baseUrl}/users/${id}`, data);
      if (response.status >= 400) {
        console.error('Error updating user:', response.statusText);
        return null;
      }
      return response;
    } catch (error) {
      console.error('Error updating user:', error);
      return null;
    }
  }
};
