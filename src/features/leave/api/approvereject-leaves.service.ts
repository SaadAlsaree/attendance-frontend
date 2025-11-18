import { axiosInstance, axiosClient } from '@/lib/axios';
import { LeaveFilter, LeaveItem, LeaveResponse } from '../types/leaves';


const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://fp28-back.inss.local:7000';

export const LeavesService = {

    ///leaves 
    async getLeaves(query: LeaveFilter): Promise<LeaveResponse | null> {
        try {
            const response = await axiosInstance.get(`${baseUrl}/leaves`, { params: query });

            if (response.status >= 400) {
                return null;
            }

            return response.data || null;
        } catch (error) {
            return null;
        }
    },

    // get leave by id
    async getLeaveById(id: string): Promise<LeaveItem | null> {
        try {
            const response = await axiosInstance.get(`${baseUrl}/leaves/${id}`);


            if (response.status >= 400) {
                return null;
            }

            return response.data || null;
        } catch (error) {
            return null;
        }
    },

    // create leave
    async createLeave(leave: LeaveItem) {
        try {
            const response = await axiosClient.post(`${baseUrl}/leaves`, leave);


            if (response.status >= 400) {
                return null;
            }

            return response.data || null;
        } catch (error) {
            return null;
        }
    },

    // update leave
    async updateLeave(id: string, leave: LeaveItem) {
        try {
            const response = await axiosClient.put(`${baseUrl}/leaves/${id}`, leave);

            if (response.status >= 400) {
                return null;
            }

            return response.data || null;
        } catch (error) {
            return null;
        }
    },

    // delete leave
    async deleteLeave(id: string) {
        try {
            const response = await axiosClient.delete(`${baseUrl}/leaves/${id}`);

            if (response.status >= 400) {
                return null;
            }

            return response.data || null;
        } catch (error) {
            return null;
        }
    },

    // approve leave
    async approveLeave(id: string, approvalData: any) {
        try {
            const response = await axiosClient.put(`${baseUrl}/leaves/${id}/approve`, approvalData);

            if (response.status >= 400) {
                return null;
            }

            return response.data || null;
        } catch (error) {
            return null;
        }
    },

    // reject leave
    async rejectLeave(id: string, rejectionData: any) {
        try {
            const response = await axiosClient.put(`${baseUrl}/leaves/${id}/reject`, rejectionData);

            if (response.status >= 400) {
                return null;
            }

            return response.data || null;
        } catch (error) {
            return null;
        }
    },

    // cancel leave
    async cancelLeave(id: string, cancellationData: any) {
        try {
            const response = await axiosClient.put(`${baseUrl}/leaves/${id}/cancel`, cancellationData);

            if (response.status >= 400) {
                return null;
            }

            return response.data || null;
        } catch (error) {
            return null;
        }
    }

}