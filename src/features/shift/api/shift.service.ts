import { axiosClient, axiosInstance } from '@/lib/axios';
import {
    CreateShiftRequest,
    UpdateShiftRequest,
    ShiftQuery,
    ShiftListResponse,
    ShiftDetailResponse,
    ApiShiftResponse,
    ShiftResponse,
} from '../types/shift';

const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://fp28-back.inss.local:7000';

export const shiftService = {
    // Get shifts list with pagination and filters
    async getShiftsList(query: ShiftQuery): Promise<ShiftResponse | null> {
        try {
            const response = await axiosInstance.get(`${baseUrl}/shifts`, { params: query });
            if (response.status >= 400) {
                console.error('Error fetching shifts list:', response.statusText);
                return null;
            }
            return response.data as ShiftResponse;
        } catch (error) {
            console.error('Error fetching shifts list:', error);
            return null;
        }
    },

    // Get shift by ID
    async getShiftById(id: string): Promise<ApiShiftResponse | null> {
        try {
            const response = await axiosInstance.get(`${baseUrl}/shifts/${id}`);
            if (response.status >= 400) {
                console.error('Error fetching shift:', response.statusText);
                return null;
            }
            return response.data as ApiShiftResponse || null;
        } catch (error) {
            console.error('Error fetching shift:', error);
            return null;
        }
    },

    // Create new shift
    async createShift(data: CreateShiftRequest): Promise<ShiftDetailResponse | null> {
        try {
            const response = await axiosInstance.post(`${baseUrl}/shifts`, data);
            if (response.status >= 400) {
                console.error('Error creating shift:', response.statusText);
                return null;
            }
            return response.data as ShiftDetailResponse || null;
        } catch (error) {
            console.error('Error creating shift:', error);
            return null;
        }
    },

    // Update shift
    async updateShift(id: string, data: UpdateShiftRequest): Promise<ShiftDetailResponse | null> {
        try {
            const response = await axiosInstance.put(`${baseUrl}/shifts/${id}`, data);
            if (response.status >= 400) {
                console.error('Error updating shift:', response.statusText);
                return null;
            }
            return response.data as ShiftDetailResponse || null;
        } catch (error) {
            console.error('Error updating shift:', error);
            return null;
        }
    },

    // Delete shift
    async deleteShift(id: string): Promise<boolean> {
        try {
            const response = await axiosInstance.delete(`${baseUrl}/shifts/${id}`);
            if (response.status >= 400) {
                console.error('Error deleting shift:', response.statusText);
                return false;
            }
            return response.status === 204;
        } catch (error) {
            console.error('Error deleting shift:', error);
            return false;
        }
    },

    // Client-side methods (using axiosClient)
    async getShiftsListClient(query: ShiftQuery): Promise<ShiftListResponse | null> {
        try {
            const response = await axiosClient.get(`${baseUrl}/shifts`, { params: query });
            if (response.status >= 400) {
                console.error('Error fetching shifts list:', response.statusText);
                return null;
            }
            return response.data as ShiftListResponse || null;
        } catch (error) {
            console.error('Error fetching shifts list:', error);
            return null;
        }
    },

    async getShiftByIdClient(id: string): Promise<ApiShiftResponse | null> {
        try {
            const response = await axiosClient.get(`${baseUrl}/shifts/${id}`);
            if (response.status >= 400) {
                console.error('Error fetching shift:', response.statusText);
                return null;
            }
            return response.data as ApiShiftResponse || null;
        } catch (error) {
            console.error('Error fetching shift:', error);
            return null;
        }
    },

    async createShiftClient(data: CreateShiftRequest): Promise<ShiftDetailResponse | null> {
        try {
            const response = await axiosClient.post(`${baseUrl}/shifts`, data);
            if (response.status >= 400) {
                console.error('Error creating shift:', response.statusText);
                return null;
            }
            return response.data as ShiftDetailResponse || null;
        } catch (error) {
            console.error('Error creating shift:', error);
            return null;
        }
    },

    async updateShiftClient(id: string, data: UpdateShiftRequest): Promise<ShiftDetailResponse | null> {
        try {
            const response = await axiosClient.put(`${baseUrl}/shifts/${id}`, data);
            if (response.status >= 400) {
                console.error('Error updating shift:', response.statusText);
                return null;
            }
            return response.data as ShiftDetailResponse || null;
        } catch (error) {
            console.error('Error updating shift:', error);
            return null;
        }
    },

    async deleteShiftClient(id: string): Promise<boolean> {
        try {
            const response = await axiosClient.delete(`${baseUrl}/shifts/${id}`);
            if (response.status >= 400) {
                console.error('Error deleting shift:', response.statusText);
                return false;
            }
            return response.status === 204;
        } catch (error) {
            console.error('Error deleting shift:', error);
            return false;
        }
    },
};
