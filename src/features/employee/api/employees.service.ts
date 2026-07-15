import { axiosClient, axiosInstance } from '@/lib/axios';
import {
  EmployeeRegistrationRequest,
  EmployeeRegistrationApiResponse,
  EmployeeListApiResponse,
  EmployeeDetailApiResponse,
  OrganizationalUnitsApiResponse,
  ManagersApiResponse,
  ProfileUpdateRequest,
  ChangePasswordRequest,
  UpdateRoleRequest,
  AssignManagerRequest,
  AssignWeeklyShiftsRequest,
  ProfileResponse,
  EmployeeUpdateRequest
} from '../types/employees';

const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://fp28-back.inss.local:7000';

export const employeeService = {
  // Register new employee
  async registerEmployee(
    data: EmployeeRegistrationRequest
  ): Promise<EmployeeRegistrationApiResponse | null> {
    try {
      // Create FormData for multipart/form-data
      const formData = new FormData();

      // Employee information
      formData.append('EmpId', data.empId);
      formData.append('FirstName', data.firstName);
      formData.append('SecondName', data.secondName);
      formData.append('ThirdName', data.thirdName);
      formData.append('FourthName', data.fourthName);
      formData.append('FamilyName', data.familyName);
      formData.append('RFID', data.rfid);
      formData.append('OrganizationalUnitId', data.organizationalUnitId);

      if (data.managerId) {
        formData.append('ManagerId', data.managerId);
      }

      formData.append('IsManager', data.isManager.toString());
      formData.append('Role', data.role);

      // File uploads
      if (data.faceImage) {
        formData.append('FaceImage', data.faceImage);
      }

      const response = await axiosInstance.post(
        `${baseUrl}/auth/register`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.status >= 400) {
        console.error('Error registering employee:', response.statusText);
        return null;
      }

      return (response.data as EmployeeRegistrationApiResponse) || null;
    } catch (error) {
      console.error('Error registering employee:', error);
      return null;
    }
  },

  // Client-side methods (using axiosClient)
  async registerEmployeeClient(
    data: EmployeeRegistrationRequest
  ): Promise<EmployeeRegistrationApiResponse | null> {
    try {
      const formData = new FormData();

      // Employee information
      formData.append('EmpId', data.empId);
      formData.append('FirstName', data.firstName);
      formData.append('SecondName', data.secondName);
      formData.append('ThirdName', data.thirdName);
      formData.append('FourthName', data.fourthName);
      formData.append('FamilyName', data.familyName);
      formData.append('RFID', data.rfid);
      formData.append('OrganizationalUnitId', data.organizationalUnitId);

      if (data.managerId) {
        formData.append('ManagerId', data.managerId);
      }

      formData.append('IsManager', data.isManager.toString());
      formData.append('Role', data.role);

      // File uploads
      if (data.faceImage) {
        formData.append('FaceImage', data.faceImage);
      }

      const response = await axiosClient.post(
        `${baseUrl}/auth/register`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.status >= 400) {
        console.error('Error registering employee:', response.statusText);
        return null;
      }

      return (response.data as EmployeeRegistrationApiResponse) || null;
    } catch (error) {
      console.error('Error registering employee:', error);
      return null;
    }
  },

  // Get all employees (server-side)
  async getEmployees(params?: Record<string, any>) {
    try {
      const queryParams = new URLSearchParams(
        params || ({} as Record<string, string>)
      );

      const response = await axiosInstance.get(
        `${baseUrl}/employees?${queryParams.toString()}`
      );

      return response as unknown as EmployeeListApiResponse;
    } catch (error) {
      console.error('Error getting employees:', error);
      return null;
    }
  },

  // Get all employees (client-side)
  async getEmployeesClient(
    params?: Record<string, any>
  ): Promise<EmployeeListApiResponse | null> {
    try {
      const queryParams = new URLSearchParams(
        params || ({} as Record<string, string>)
      ).toString();
      const response = await axiosClient.get(
        `${baseUrl}/employees?${queryParams}`
      );
      return response.data as EmployeeListApiResponse;
    } catch (error) {
      console.error('Error getting employees:', error);
      return null;
    }
  },

  // Get employee by ID (server-side)
  async getEmployeeById(id: string): Promise<EmployeeDetailApiResponse | null> {
    try {
      const response = await axiosInstance.get(`${baseUrl}/employees/${id}`);
      return response.data as EmployeeDetailApiResponse;
    } catch (error) {
      console.error('Error getting employee:', error);
      return null;
    }
  },

  // Get employee by ID (client-side)
  async getEmployeeByIdClient(
    id: string
  ): Promise<EmployeeDetailApiResponse | null> {
    try {
      const response = await axiosClient.get(`${baseUrl}/employees/${id}`);
      return response.data as EmployeeDetailApiResponse;
    } catch (error) {
      console.error('Error getting employee:', error);
      return null;
    }
  },

  // Update employee (server-side)
  async updateEmployee(
    id: string,
    data: EmployeeUpdateRequest
  ): Promise<boolean> {
    try {
      const response = await axiosInstance.put(
        `${baseUrl}/employees/${id}`,
        data
      );
      return response.status === 204;
    } catch (error) {
      console.error('Error updating employee:', error);
      return false;
    }
  },

  // Update employee (client-side)
  async updateEmployeeClient(id: string, data: EmployeeUpdateRequest) {
    try {
      const response = await axiosClient.put(
        `${baseUrl}/employees/${id}`,
        data
      );
      return response.status === 204;
    } catch (error) {
      console.error('Error updating employee:', error);
      return false;
    }
  },

  // Delete employee (server-side)
  async deleteEmployee(id: string): Promise<boolean> {
    try {
      const response = await axiosInstance.delete(`${baseUrl}/employees/${id}`);
      return response.status === 204;
    } catch (error) {
      console.error('Error deleting employee:', error);
      return false;
    }
  },

  // Delete employee (client-side)
  async deleteEmployeeClient(id: string): Promise<boolean> {
    try {
      const response = await axiosClient.delete(`${baseUrl}/employees/${id}`);
      return response.status === 204;
    } catch (error) {
      console.error('Error deleting employee:', error);
      return false;
    }
  },

  // Get current user's profile (server-side)
  async getProfile(): Promise<ProfileResponse | null> {
    try {
      const response = await axiosInstance.get(`${baseUrl}/employees/profile`);
      return response.data as ProfileResponse;
    } catch (error) {
      console.error('Error getting profile:', error);
      return null;
    }
  },

  // Get current user's profile (client-side)
  async getProfileClient(): Promise<ProfileResponse | null> {
    try {
      const response = await axiosClient.get(`${baseUrl}/employees/profile`);
      return response.data as ProfileResponse;
    } catch (error) {
      console.error('Error getting profile:', error);
      return null;
    }
  },

  // Update current user's profile (server-side)
  async updateProfile(data: ProfileUpdateRequest): Promise<boolean> {
    try {
      const response = await axiosInstance.put(
        `${baseUrl}/employees/profile`,
        data
      );
      return response.status === 204;
    } catch (error) {
      console.error('Error updating profile:', error);
      return false;
    }
  },

  // Update current user's profile (client-side)
  async updateProfileClient(data: ProfileUpdateRequest): Promise<boolean> {
    try {
      const response = await axiosClient.put(
        `${baseUrl}/employees/profile`,
        data
      );
      return response.status === 204;
    } catch (error) {
      console.error('Error updating profile:', error);
      return false;
    }
  },

  // Change password (server-side)
  async changePassword(data: ChangePasswordRequest): Promise<boolean> {
    try {
      const response = await axiosInstance.post(
        `${baseUrl}/employees/change-password`,
        data
      );
      return response.status === 204;
    } catch (error) {
      console.error('Error changing password:', error);
      return false;
    }
  },

  // Change password (client-side)
  async changePasswordClient(data: ChangePasswordRequest): Promise<boolean> {
    try {
      const response = await axiosClient.post(
        `${baseUrl}/employees/change-password`,
        data
      );
      return response.status === 204;
    } catch (error) {
      console.error('Error changing password:', error);
      return false;
    }
  },

  // Update user role (server-side)
  async updateRole(id: string, data: UpdateRoleRequest): Promise<boolean> {
    try {
      const response = await axiosInstance.put(
        `${baseUrl}/employees/${id}/role`,
        data
      );
      return response.status === 204;
    } catch (error) {
      console.error('Error updating role:', error);
      return false;
    }
  },

  // Update user role (client-side)
  async updateRoleClient(
    id: string,
    data: UpdateRoleRequest
  ): Promise<boolean> {
    try {
      const response = await axiosClient.put(
        `${baseUrl}/employees/${id}/role`,
        data
      );
      return response.status === 204;
    } catch (error) {
      console.error('Error updating role:', error);
      return false;
    }
  },

  // Assign manager (server-side)
  async assignManager(
    id: string,
    data: AssignManagerRequest
  ): Promise<boolean> {
    try {
      const response = await axiosInstance.put(
        `${baseUrl}/employees/${id}/manager`,
        data
      );
      return response.status === 204;
    } catch (error) {
      console.error('Error assigning manager:', error);
      return false;
    }
  },

  // Assign manager (client-side)
  async assignManagerClient(
    id: string,
    data: AssignManagerRequest
  ): Promise<boolean> {
    try {
      const response = await axiosClient.put(
        `${baseUrl}/employees/${id}/manager`,
        data
      );
      return response.status === 204;
    } catch (error) {
      console.error('Error assigning manager:', error);
      return false;
    }
  },

  // Assign weekly fixed-shift pattern — feature 14 (client-side, full replace)
  async assignWeeklyShiftsClient(
    id: string,
    data: AssignWeeklyShiftsRequest
  ): Promise<boolean> {
    try {
      const response = await axiosClient.put(
        `${baseUrl}/employees/${id}/weekly-shifts`,
        data
      );
      return response.status === 204;
    } catch (error) {
      console.error('Error assigning weekly shifts:', error);
      return false;
    }
  },

  // Get organizational units for dropdown (server-side)
  async getOrganizationalUnits(): Promise<OrganizationalUnitsApiResponse | null> {
    try {
      const response = await axiosInstance.get(
        `${baseUrl}/organizational-units`
      );
      return response.data as OrganizationalUnitsApiResponse;
    } catch (error) {
      console.error('Error getting organizational units:', error);
      return null;
    }
  },

  // Get organizational units for dropdown (client-side)
  async getOrganizationalUnitsClient(): Promise<OrganizationalUnitsApiResponse | null> {
    try {
      const response = await axiosClient.get(`${baseUrl}/organizational-units`);
      return response.data as OrganizationalUnitsApiResponse;
    } catch (error) {
      console.error('Error getting organizational units:', error);
      return null;
    }
  },

  // Get managers for dropdown (server-side)
  async getManagers(): Promise<ManagersApiResponse | null> {
    try {
      const response = await axiosInstance.get(
        `${baseUrl}/employees?isManager=true&pageSize=100`
      );
      return response.data as ManagersApiResponse;
    } catch (error) {
      console.error('Error getting managers:', error);
      return null;
    }
  },

  // Get managers for dropdown (client-side)
  async getManagersClient(): Promise<ManagersApiResponse | null> {
    try {
      const response = await axiosClient.get(
        `${baseUrl}/employees?isManager=true&pageSize=100`
      );
      return response.data as ManagersApiResponse;
    } catch (error) {
      console.error('Error getting managers:', error);
      return null;
    }
  }
};
