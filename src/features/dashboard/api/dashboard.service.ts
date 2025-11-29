import { axiosClient, axiosInstance } from '@/lib/axios';
import { DashboardData, DashboardRequest } from '../types/dashboard';
import { ApiResponse, QuickStatsRequest } from '../types/quick-stats';
import {
  DashboardStatsData,
  DashboardStatsRequest
} from '../types/dashboard-stats';

const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:7000/';

export const dashboardService = {
  // Get complete dashboard data
  async getDashboard(request: DashboardRequest): Promise<DashboardData | null> {
    try {
      const response = await axiosInstance.get(`${baseUrl}/dashboard`, {
        params: request
      });

      if (response.status >= 400) {
        console.error('Error fetching dashboard:', response.statusText);
        return null;
      }

      return (response.data as DashboardData) || null;
    } catch (error) {
      console.error('Error fetching dashboard:', error);
      return null;
    }
  },

  // Get quick stats only
  async getQuickStats(request: QuickStatsRequest): Promise<ApiResponse | null> {
    try {
      const response = await axiosInstance.get(
        `${baseUrl}/dashboard/quick-stats`,
        {
          params: request
        }
      );

      if (response.status >= 400) {
        console.error('Error fetching quick stats:', response.statusText);
        return null;
      }

      return (response.data as ApiResponse) || null;
    } catch (error) {
      console.error('Error fetching quick stats:', error);
      return null;
    }
  },

  // Get detailed dashboard stats
  async getDashboardStats(
    request: DashboardStatsRequest
  ): Promise<DashboardStatsData | null> {
    try {
      const response = await axiosInstance.get(`${baseUrl}/dashboard/stats`, {
        params: request
      });

      if (response.status >= 400) {
        console.error('Error fetching dashboard stats:', response.statusText);
        return null;
      }

      return (response.data as DashboardStatsData) || null;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      return null;
    }
  },

  // Client-side methods (using axiosClient)
  async getDashboardClient(
    request: DashboardRequest
  ): Promise<DashboardData | null> {
    try {
      const response = await axiosClient.get(`${baseUrl}/dashboard`, {
        params: request
      });

      if (response.status >= 400) {
        console.error('Error fetching dashboard:', response.statusText);
        return null;
      }

      return (response.data as DashboardData) || null;
    } catch (error) {
      console.error('Error fetching dashboard:', error);
      return null;
    }
  },

  async getQuickStatsClient(
    request: QuickStatsRequest
  ): Promise<ApiResponse | null> {
    try {
      const response = await axiosClient.get(
        `${baseUrl}/dashboard/quick-stats`,
        {
          params: request
        }
      );

      if (response.status >= 400) {
        console.error('Error fetching quick stats:', response.statusText);
        return null;
      }

      return (response.data as ApiResponse) || null;
    } catch (error) {
      console.error('Error fetching quick stats:', error);
      return null;
    }
  },

  async getDashboardStatsClient(
    request: DashboardStatsRequest
  ): Promise<DashboardStatsData | null> {
    try {
      const response = await axiosClient.get(`${baseUrl}/dashboard/stats`, {
        params: request
      });

      if (response.status >= 400) {
        console.error('Error fetching dashboard stats:', response.statusText);
        return null;
      }

      return (response.data as DashboardStatsData) || null;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      return null;
    }
  }
};
