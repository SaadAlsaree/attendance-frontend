import { axiosClient, axiosInstance } from '@/lib/axios';
import {
    CreateAttendanceScheduleRequest,
    UpdateAttendanceScheduleRequest,
    UpdateScheduleDaysRequest,
    AttendanceScheduleQuery,
    MySchedulesQuery,
    AttendanceScheduleListResponse,
    AttendanceScheduleDetailResponse,
    ApiAttendanceScheduleResponse
} from '../types/schedules';

const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:7000';

export const scheduleService = {
    // Get schedules list with pagination and filters
    async getSchedulesList(query: AttendanceScheduleQuery): Promise<AttendanceScheduleListResponse | null> {
        try {
            const response = await axiosInstance.get(`${baseUrl}/attendance-schedules`, { params: query });
            if (response.status >= 400) {
                console.error('Error fetching schedules list:', response.statusText);
                return null;
            }
            return response.data as AttendanceScheduleListResponse || null;
        } catch (error) {
            console.error('Error fetching schedules list:', error);
            return null;
        }
    },

    // Get schedule by ID
    async getScheduleById(id: string): Promise<ApiAttendanceScheduleResponse | null> {
        try {
            const response = await axiosInstance.get(`${baseUrl}/attendance-schedules/${id}`);
            if (response.status >= 400) {
                console.error('Error fetching schedule:', response.statusText);
                return null;
            }
            return response.data as ApiAttendanceScheduleResponse || null;
        } catch (error) {
            console.error('Error fetching schedule:', error);
            return null;
        }
    },

    // Create new schedule
    async createSchedule(data: CreateAttendanceScheduleRequest): Promise<AttendanceScheduleDetailResponse | null> {
        try {
            const response = await axiosInstance.post(`${baseUrl}/attendance-schedules`, data);
            if (response.status >= 400) {
                console.error('Error creating schedule:', response.statusText);
                return null;
            }
            return response.data as AttendanceScheduleDetailResponse || null;
        } catch (error) {
            console.error('Error creating schedule:', error);
            return null;
        }
    },

    // Update schedule
    async updateSchedule(id: string, data: UpdateAttendanceScheduleRequest): Promise<AttendanceScheduleDetailResponse | null> {
        try {
            const response = await axiosInstance.put(`${baseUrl}/attendance-schedules/${id}`, data);
            if (response.status >= 400) {
                console.error('Error updating schedule:', response.statusText);
                return null;
            }
            return response.data as AttendanceScheduleDetailResponse || null;
        } catch (error) {
            console.error('Error updating schedule:', error);
            return null;
        }
    },

    // Delete schedule
    async deleteSchedule(id: string): Promise<boolean> {
        try {
            const response = await axiosInstance.delete(`${baseUrl}/attendance-schedules/${id}`);
            if (response.status >= 400) {
                console.error('Error deleting schedule:', response.statusText);
                return false;
            }
            return response.status === 204;
        } catch (error) {
            console.error('Error deleting schedule:', error);
            return false;
        }
    },

    // Get my schedules (for current user)
    async getMySchedules(query: MySchedulesQuery): Promise<AttendanceScheduleListResponse | null> {
        try {
            const response = await axiosInstance.get(`${baseUrl}/attendance-schedules/my-schedules`, { params: query });
            if (response.status >= 400) {
                console.error('Error fetching my schedules:', response.statusText);
                return null;
            }
            return response.data as AttendanceScheduleListResponse || null;
        } catch (error) {
            console.error('Error fetching my schedules:', error);
            return null;
        }
    },

    // Update schedule days
    async updateScheduleDays(data: UpdateScheduleDaysRequest): Promise<{ success: boolean; message: string } | null> {
        try {
            const response = await axiosInstance.put(`${baseUrl}/attendance-schedules/${data.attendanceScheduleId}/schedule-days`, data);
            if (response.status >= 400) {
                console.error('Error updating schedule days:', response.statusText);
                return null;
            }
            return response.data as { success: boolean; message: string } || null;
        } catch (error) {
            console.error('Error updating schedule days:', error);
            return null;
        }
    },

    // Client-side methods (using axiosClient)
    async getSchedulesListClient(query: AttendanceScheduleQuery): Promise<AttendanceScheduleListResponse | null> {
        try {
            const response = await axiosClient.get(`${baseUrl}/attendance-schedules`, { params: query });
            if (response.status >= 400) {
                console.error('Error fetching schedules list:', response.statusText);
                return null;
            }
            return response.data as AttendanceScheduleListResponse || null;
        } catch (error) {
            console.error('Error fetching schedules list:', error);
            return null;
        }
    },

    async getScheduleByIdClient(id: string): Promise<ApiAttendanceScheduleResponse | null> {
        try {
            const response = await axiosClient.get(`${baseUrl}/attendance-schedules/${id}`);
            if (response.status >= 400) {
                console.error('Error fetching schedule:', response.statusText);
                return null;
            }
            return response.data as ApiAttendanceScheduleResponse || null;
        } catch (error) {
            console.error('Error fetching schedule:', error);
            return null;
        }
    },

    async createScheduleClient(data: CreateAttendanceScheduleRequest) {
        try {
            const response = await axiosClient.post(`${baseUrl}/attendance-schedules`, data);
            return response
        } catch (error) {
            console.error('Error creating schedule:', error);
            return false;
        }
    },

    async updateScheduleClient(id: string, data: UpdateAttendanceScheduleRequest) {
        try {
            const response = await axiosClient.put(`${baseUrl}/attendance-schedules/${id}`, data);
            if (response.status >= 400) {
                console.error('Error updating schedule:', response.statusText);
                return null;
            }
            return response.data as AttendanceScheduleDetailResponse || null;
        } catch (error) {
            console.error('Error updating schedule:', error);
            return null;
        }
    },

    async deleteScheduleClient(id: string): Promise<boolean> {
        try {
            const response = await axiosClient.delete(`${baseUrl}/attendance-schedules/${id}`);
            if (response.status >= 400) {
                console.error('Error deleting schedule:', response.statusText);
                return false;
            }
            return response.status === 204;
        } catch (error) {
            console.error('Error deleting schedule:', error);
            return false;
        }
    },

    async getMySchedulesClient(query: MySchedulesQuery): Promise<AttendanceScheduleListResponse | null> {
        try {
            const response = await axiosClient.get(`${baseUrl}/attendance-schedules/my-schedules`, { params: query });
            if (response.status >= 400) {
                console.error('Error fetching my schedules:', response.statusText);
                return null;
            }
            return response.data as AttendanceScheduleListResponse || null;
        } catch (error) {
            console.error('Error fetching my schedules:', error);
            return null;
        }
    },

    async updateScheduleDaysClient(data: UpdateScheduleDaysRequest): Promise<{ success: boolean; message: string } | null> {
        try {
            const response = await axiosClient.put(`${baseUrl}/attendance-schedules/${data.attendanceScheduleId}/schedule-days`, data);
            if (response.status >= 400) {
                console.error('Error updating schedule days:', response.statusText);
                return null;
            }
            return response.data as { success: boolean; message: string } || null;
        } catch (error) {
            console.error('Error updating schedule days:', error);
            return null;
        }
    },
}; 