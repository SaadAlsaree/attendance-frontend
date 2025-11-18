import { axiosClient, axiosInstance } from '@/lib/axios';
import { DevicePayload, DeviceQuery, DeviceResponse, DeviceDetailResponse, DeviceData } from '../types/devices';

const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://fp28-back.inss.local:7000';

export const devicesService = {
    // Get devices list with pagination and filters (server-side)
    async getDevicesList(query: DeviceQuery): Promise<DeviceResponse | null> {
        try {
            const response = await axiosInstance.get(`${baseUrl}/devices`, { params: query });
            if (response.status >= 400) {
                console.error('Error fetching devices list:', response.statusText);
                return null;
            }
            return response.data as DeviceResponse;
        } catch (error) {
            console.error('Error fetching devices list:', error);
            return null;
        }
    },

    // Get device by ID (server-side)
    async getDeviceById(id: string): Promise<DeviceData | null> {
        try {
            const response = await axiosInstance.get(`${baseUrl}/devices/${id}`);
            if (response.status >= 400) {
                console.error('Error fetching device by id:', response.statusText);
                return null;
            }
            return response.data as DeviceData;
        } catch (error) {
            console.error('Error fetching device by id:', error);
            return null;
        }
    },

    // Create device (client-side)
    async createDevice(data: DevicePayload): Promise<boolean> {
        try {
            const response = await axiosClient.post(`${baseUrl}/devices`, data);
            if (response.status >= 400) {
                console.error('Error creating device:', response.statusText);
                return false;
            }
            return true;
        } catch (error) {
            console.error('Error creating device:', error);
            return false;
        }
    },

    // Update device (client-side)
    async updateDevice(id: string, data: DevicePayload): Promise<boolean> {
        try {
            const response = await axiosClient.put(`${baseUrl}/devices/${id}`, data);
            if (response.status >= 400) {
                console.error('Error updating device:', response.statusText);
                return false;
            }
            return true;
        } catch (error) {
            console.error('Error updating device:', error);
            return false;
        }
    },

    // Delete device (client-side)
    async deleteDevice(id: string): Promise<boolean> {
        try {
            const response = await axiosClient.delete(`${baseUrl}/devices/${id}`);
            if (response.status >= 400) {
                console.error('Error deleting device:', response.statusText);
                return false;
            }
            return response.status === 204;
        } catch (error) {
            console.error('Error deleting device:', error);
            return false;
        }
    },

    // Client-side methods (using axiosClient)
    async getDevicesListClient(query: DeviceQuery): Promise<DeviceResponse | null> {
        try {
            const response = await axiosClient.get(`${baseUrl}/devices`, { params: query });
            if (response.status >= 400) {
                console.error('Error fetching devices list:', response.statusText);
                return null;
            }
            return response.data as DeviceResponse;
        } catch (error) {
            console.error('Error fetching devices list:', error);
            return null;
        }
    },

    async getDeviceByIdClient(id: string): Promise<DeviceDetailResponse | null> {
        try {
            const response = await axiosClient.get(`${baseUrl}/devices/${id}`);
            if (response.status >= 400) {
                console.error('Error fetching device by id:', response.statusText);
                return null;
            }
            return response.data as DeviceDetailResponse;
        } catch (error) {
            console.error('Error fetching device by id:', error);
            return null;
        }
    },

    async createDeviceClient(data: DevicePayload): Promise<DeviceDetailResponse | null> {
        try {
            const response = await axiosClient.post(`${baseUrl}/devices`, data);
            if (response.status >= 400) {
                console.error('Error creating device:', response.statusText);
                return null;
            }
            return response.data as DeviceDetailResponse;
        } catch (error) {
            console.error('Error creating device:', error);
            return null;
        }
    },

    async updateDeviceClient(id: string, data: DevicePayload): Promise<DeviceDetailResponse | null> {
        try {
            const response = await axiosClient.put(`${baseUrl}/devices/${id}`, data);
            if (response.status >= 400) {
                console.error('Error updating device:', response.statusText);
                return null;
            }
            return response.data as DeviceDetailResponse;
        } catch (error) {
            console.error('Error updating device:', error);
            return null;
        }
    },

    async deleteDeviceClient(id: string): Promise<boolean> {
        try {
            const response = await axiosClient.delete(`${baseUrl}/devices/${id}`);
            if (response.status >= 400) {
                console.error('Error deleting device:', response.statusText);
                return false;
            }
            return response.status === 204;
        } catch (error) {
            console.error('Error deleting device:', error);
            return false;
        }
    }
};