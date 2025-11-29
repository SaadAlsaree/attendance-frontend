import { axiosClient, axiosInstance } from '@/lib/axios';
import {
  CreateAttendanceRequest,
  UpdateAttendanceRequest,
  CheckInRequest,
  CheckOutRequest,
  ApproveAttendanceRequest,
  AttendanceQuery,
  AttendanceListResponse,
  AttendanceDetailResponse,
  ApiAttendanceResponse
} from '../types/attendance';

const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:7000/';

export const attendanceService = {
  // Get attendance list with pagination and filters
  async getAttendanceList(
    query: AttendanceQuery
  ): Promise<AttendanceListResponse | null> {
    try {
      const response = await axiosInstance.get(`${baseUrl}/attendance`, {
        params: query
      });
      if (response.status >= 400) {
        console.error('Error fetching attendance list:', response.statusText);
        return null;
      }
      return (response.data as AttendanceListResponse) || null;
    } catch (error) {
      console.error('Error fetching attendance list:', error);
      return null;
    }
  },

  // Get attendance by ID
  async getAttendanceById(id: string): Promise<ApiAttendanceResponse | null> {
    try {
      const response = await axiosInstance.get(`${baseUrl}/attendance/${id}`);
      if (response.status >= 400) {
        console.error('Error fetching attendance:', response.statusText);
        return null;
      }
      return (response.data as ApiAttendanceResponse) || null;
    } catch (error) {
      console.error('Error fetching attendance:', error);
      return null;
    }
  },

  // Create new attendance record
  async createAttendance(
    data: CreateAttendanceRequest
  ): Promise<AttendanceDetailResponse | null> {
    try {
      const response = await axiosInstance.post(`${baseUrl}/attendance`, data);
      if (response.status >= 400) {
        console.error('Error creating attendance:', response.statusText);
        return null;
      }
      return (response.data as AttendanceDetailResponse) || null;
    } catch (error) {
      console.error('Error creating attendance:', error);
      return null;
    }
  },

  // Update attendance record
  async updateAttendance(
    id: string,
    data: UpdateAttendanceRequest
  ): Promise<AttendanceDetailResponse | null> {
    try {
      const response = await axiosInstance.put(
        `${baseUrl}/attendance/${id}`,
        data
      );
      if (response.status >= 400) {
        console.error('Error updating attendance:', response.statusText);
        return null;
      }
      return (response.data as AttendanceDetailResponse) || null;
    } catch (error) {
      console.error('Error updating attendance:', error);
      return null;
    }
  },

  // Delete attendance record
  async deleteAttendance(id: string): Promise<boolean> {
    try {
      const response = await axiosInstance.delete(
        `${baseUrl}/attendance/${id}`
      );
      if (response.status >= 400) {
        console.error('Error deleting attendance:', response.statusText);
        return false;
      }
      return response.status === 204;
    } catch (error) {
      console.error('Error deleting attendance:', error);
      return false;
    }
  },

  // Check in attendance
  async checkIn(
    data: CheckInRequest
  ): Promise<AttendanceDetailResponse | null> {
    try {
      const response = await axiosInstance.post(
        `${baseUrl}/attendance/check-in`,
        data
      );
      if (response.status >= 400) {
        console.error('Error checking in attendance:', response.statusText);
        return null;
      }
      return (response.data as AttendanceDetailResponse) || null;
    } catch (error) {
      console.error('Error checking in attendance:', error);
      return null;
    }
  },

  // Check out attendance
  async checkOut(
    data: CheckOutRequest
  ): Promise<AttendanceDetailResponse | null> {
    try {
      const response = await axiosInstance.post(
        `${baseUrl}/attendance/check-out`,
        data
      );
      if (response.status >= 400) {
        console.error('Error checking out attendance:', response.statusText);
        return null;
      }
      return (response.data as AttendanceDetailResponse) || null;
    } catch (error) {
      console.error('Error checking out attendance:', error);
      return null;
    }
  },

  // Approve attendance
  async approveAttendance(
    id: string,
    data: ApproveAttendanceRequest
  ): Promise<AttendanceDetailResponse | null> {
    try {
      const response = await axiosInstance.post(
        `${baseUrl}/attendance/${id}/approve`,
        data
      );
      if (response.status >= 400) {
        console.error('Error approving attendance:', response.statusText);
        return null;
      }
      return (response.data as AttendanceDetailResponse) || null;
    } catch (error) {
      console.error('Error approving attendance:', error);
      return null;
    }
  },

  // Client-side methods (using axiosClient)
  async getAttendanceListClient(
    query: AttendanceQuery
  ): Promise<AttendanceListResponse | null> {
    try {
      const response = await axiosClient.get(`${baseUrl}/attendance`, {
        params: query
      });
      if (response.status >= 400) {
        console.error('Error fetching attendance list:', response.statusText);
        return null;
      }
      return (response.data as AttendanceListResponse) || null;
    } catch (error) {
      console.error('Error fetching attendance list:', error);
      return null;
    }
  },

  async getAttendanceByIdClient(
    id: string
  ): Promise<ApiAttendanceResponse | null> {
    try {
      const response = await axiosClient.get(`${baseUrl}/attendance/${id}`);
      if (response.status >= 400) {
        console.error('Error fetching attendance:', response.statusText);
        return null;
      }
      return (response.data as ApiAttendanceResponse) || null;
    } catch (error) {
      console.error('Error fetching attendance:', error);
      return null;
    }
  },

  async createAttendanceClient(
    data: CreateAttendanceRequest
  ): Promise<AttendanceDetailResponse | null> {
    try {
      const response = await axiosClient.post(`${baseUrl}/attendance`, data);
      if (response.status >= 400) {
        console.error('Error creating attendance:', response.statusText);
        return null;
      }
      return (response.data as AttendanceDetailResponse) || null;
    } catch (error) {
      console.error('Error creating attendance:', error);
      return null;
    }
  },

  async updateAttendanceClient(
    id: string,
    data: UpdateAttendanceRequest
  ): Promise<AttendanceDetailResponse | null> {
    try {
      const response = await axiosClient.put(
        `${baseUrl}/attendance/${id}`,
        data
      );
      if (response.status >= 400) {
        console.error('Error updating attendance:', response.statusText);
        return null;
      }
      return (response.data as AttendanceDetailResponse) || null;
    } catch (error) {
      console.error('Error updating attendance:', error);
      return null;
    }
  },

  async deleteAttendanceClient(id: string): Promise<boolean> {
    try {
      const response = await axiosClient.delete(`${baseUrl}/attendance/${id}`);
      if (response.status >= 400) {
        console.error('Error deleting attendance:', response.statusText);
        return false;
      }
      return response.status === 204;
    } catch (error) {
      console.error('Error deleting attendance:', error);
      return false;
    }
  },

  async checkInClient(
    data: CheckInRequest
  ): Promise<AttendanceDetailResponse | null> {
    try {
      const response = await axiosClient.post(
        `${baseUrl}/attendance/check-in`,
        data
      );
      if (response.status >= 400) {
        console.error('Error checking in attendance:', response.statusText);
        return null;
      }
      return (response.data as AttendanceDetailResponse) || null;
    } catch (error) {
      console.error('Error checking in attendance:', error);
      return null;
    }
  },

  async checkOutClient(
    data: CheckOutRequest
  ): Promise<AttendanceDetailResponse | null> {
    try {
      const response = await axiosClient.post(
        `${baseUrl}/attendance/check-out`,
        data
      );
      if (response.status >= 400) {
        console.error('Error checking out attendance:', response.statusText);
        return null;
      }
      return (response.data as AttendanceDetailResponse) || null;
    } catch (error) {
      console.error('Error checking out attendance:', error);
      return null;
    }
  },

  async approveAttendanceClient(
    id: string,
    data: ApproveAttendanceRequest
  ): Promise<AttendanceDetailResponse | null> {
    try {
      const response = await axiosClient.post(
        `${baseUrl}/attendance/${id}/approve`,
        data
      );
      if (response.status >= 400) {
        console.error('Error approving attendance:', response.statusText);
        return null;
      }
      return (response.data as AttendanceDetailResponse) || null;
    } catch (error) {
      console.error('Error approving attendance:', error);
      return null;
    }
  }
};
