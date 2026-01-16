import { axiosClient, axiosInstance } from '@/lib/axios';
import {
  CreateAttendanceLogRequest,
  UpdateAttendanceLogRequest,
  AttendanceLogQuery,
  AttendanceLogListResponse,
  AttendanceLogDetailResponse
} from '../types/attendance-logs';

const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:7000';

export const attendanceLogService = {
  // Get attendance logs list with pagination and filters
  async getAttendanceLogsList(
    query?: AttendanceLogQuery
  ): Promise<AttendanceLogListResponse | null> {
    try {
      const response = await axiosInstance.get(`${baseUrl}/attendance-logs`, {
        params: query
      });
      if (response.status >= 400) {
        console.error('Error fetching attendance logs:', response.statusText);
        return null;
      }
      return (response.data as AttendanceLogListResponse) || null;
    } catch (error) {
      console.error('Error fetching attendance logs:', error);
      return null;
    }
  },

  // Get attendance log by ID
  async getAttendanceLogById(id: string) {
    try {
      const response = await axiosInstance.get(
        `${baseUrl}/attendance-logs/${id}`
      );
      if (response.status >= 400) {
        console.error('Error fetching attendance log:', response.statusText);
        return null;
      }
      return response.data;
    } catch (error) {
      console.error('Error fetching attendance log:', error);
      return null;
    }
  },

  // Create new attendance log
  async createAttendanceLog(
    data: CreateAttendanceLogRequest
  ): Promise<{ id: string } | null> {
    try {
      const response = await axiosInstance.post(
        `${baseUrl}/attendance-logs`,
        data
      );
      if (response.status >= 400) {
        console.error('Error creating attendance log:', response.statusText);
        return null;
      }
      return { id: response.data };
    } catch (error) {
      console.error('Error creating attendance log:', error);
      return null;
    }
  },

  // Update attendance log
  async updateAttendanceLog(
    id: string,
    data: UpdateAttendanceLogRequest
  ): Promise<AttendanceLogDetailResponse | null> {
    try {
      const response = await axiosInstance.put(
        `${baseUrl}/attendance-logs/${id}`,
        data
      );
      if (response.status >= 400) {
        console.error('Error updating attendance log:', response.statusText);
        return null;
      }
      return (response.data as AttendanceLogDetailResponse) || null;
    } catch (error) {
      console.error('Error updating attendance log:', error);
      return null;
    }
  },

  // Delete attendance log
  async deleteAttendanceLog(id: string): Promise<boolean> {
    try {
      const response = await axiosInstance.delete(
        `${baseUrl}/attendance-logs/${id}`
      );
      if (response.status >= 400) {
        console.error('Error deleting attendance log:', response.statusText);
        return false;
      }
      return response.status === 204;
    } catch (error) {
      console.error('Error deleting attendance log:', error);
      return false;
    }
  },

  // Client-side methods (using axiosClient)
  async getAttendanceLogsListClient(
    query: AttendanceLogQuery
  ): Promise<AttendanceLogListResponse | null> {
    try {
      const response = await axiosClient.get(`${baseUrl}/attendance-logs`, {
        params: query
      });
      if (response.status >= 400) {
        console.error('Error fetching attendance logs:', response.statusText);
        return null;
      }
      return (response.data as AttendanceLogListResponse) || null;
    } catch (error) {
      console.error('Error fetching attendance logs:', error);
      return null;
    }
  },

  async getAttendanceLogByIdClient(
    id: string
  ): Promise<AttendanceLogDetailResponse | null> {
    try {
      const response = await axiosClient.get(
        `${baseUrl}/attendance-logs/${id}`
      );
      if (response.status >= 400) {
        console.error('Error fetching attendance log:', response.statusText);
        return null;
      }
      return (response.data as AttendanceLogDetailResponse) || null;
    } catch (error) {
      console.error('Error fetching attendance log:', error);
      return null;
    }
  },

  async createAttendanceLogClient(
    data: CreateAttendanceLogRequest
  ): Promise<{ id: string } | null> {
    try {
      const response = await axiosClient.post(
        `${baseUrl}/attendance-logs`,
        data
      );
      if (response.status >= 400) {
        console.error('Error creating attendance log:', response.statusText);
        return null;
      }
      return { id: response.data };
    } catch (error) {
      console.error('Error creating attendance log:', error);
      return null;
    }
  },

  async updateAttendanceLogClient(
    id: string,
    data: UpdateAttendanceLogRequest
  ): Promise<AttendanceLogDetailResponse | null> {
    try {
      const response = await axiosClient.put(
        `${baseUrl}/attendance-logs/${id}`,
        data
      );
      if (response.status >= 400) {
        console.error('Error updating attendance log:', response.statusText);
        return null;
      }
      return (response.data as AttendanceLogDetailResponse) || null;
    } catch (error) {
      console.error('Error updating attendance log:', error);
      return null;
    }
  },

  async deleteAttendanceLogClient(id: string): Promise<boolean> {
    try {
      const response = await axiosClient.delete(
        `${baseUrl}/attendance-logs/${id}`
      );
      if (response.status >= 400) {
        console.error('Error deleting attendance log:', response.statusText);
        return false;
      }
      return response.status === 204;
    } catch (error) {
      console.error('Error deleting attendance log:', error);
      return false;
    }
  }
};
