import { axiosClient, axiosInstance } from '@/lib/axios';

// Import types from individual files
import {
  GetAttendanceReportQuery,
  AttendanceReportResponse
} from '../types/attendance-reports';
import {
  OrganizationalSummaryQuery,
  OrganizationalSummaryResponse
} from '../types/organizational-summary';
import { OrganizationalReportRequest } from '../types/organization-report';

const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://fp28-back.inss.local:7000';

export const reportsService = {
  // Get attendance report
  async getAttendanceSummary(
    query?: GetAttendanceReportQuery
  ): Promise<AttendanceReportResponse | null> {
    try {
      const response = await axiosInstance.get(
        `${baseUrl}/reports/attendance-summary`,
        { params: query }
      );
      if (response.status >= 400) {
        console.error('Error fetching attendance report:', response.statusText);
        return null;
      }
      return response.data as AttendanceReportResponse;
    } catch (error) {
      console.error('Error fetching attendance report:', error);
      return null;
    }
  },

  // reports/organizational-summary
  async getOrganizationalSummary(query?: OrganizationalSummaryQuery) {
    try {
      const response = await axiosInstance.get(
        `${baseUrl}/reports/organizational-summary`,
        { params: query }
      );
      if (response.status >= 400) {
        console.error(
          'Error fetching comprehensive attendance report:',
          response.statusText
        );
        return null;
      }
      return response.data;
    } catch (error) {
      console.error('Error fetching comprehensive attendance report:', error);
      return null;
    }
  },

  // Client-side methods (using axiosClient)
  async getAttendanceSummaryClient(
    query: GetAttendanceReportQuery
  ): Promise<AttendanceReportResponse | null> {
    try {
      const response = await axiosClient.get(
        `${baseUrl}/reports/attendance-summary`,
        { params: query }
      );
      if (response.status >= 400) {
        console.error('Error fetching attendance report:', response.statusText);
        return null;
      }
      return response.data as AttendanceReportResponse;
    } catch (error) {
      console.error('Error fetching attendance report:', error);
      return null;
    }
  },

  async getOrganizationalSummaryClient(
    query: OrganizationalSummaryQuery
  ): Promise<OrganizationalSummaryResponse | null> {
    try {
      const response = await axiosClient.get(
        `${baseUrl}/reports/organizational-summary`,
        { params: query }
      );
      if (response.status >= 400) {
        console.error(
          'Error fetching comprehensive attendance report:',
          response.statusText
        );
        return null;
      }
      return response.data as OrganizationalSummaryResponse;
    } catch (error) {
      console.error('Error fetching comprehensive attendance report:', error);
      return null;
    }
  },

  // reports/organization
  async getOrganization(
    query: OrganizationalReportRequest
  ): Promise<OrganizationalSummaryResponse | null> {
    try {
      const response = await axiosInstance.get(
        `${baseUrl}/reports/organization`,
        { params: query }
      );
      if (response.status >= 400) {
        console.error('Error fetching organization:', response.statusText);
        return null;
      }
      return response.data as OrganizationalSummaryResponse;
    } catch (error) {
      console.error('Error fetching organization:', error);
      return null;
    }
  },

  async getOrganizationClient(
    query: OrganizationalReportRequest
  ): Promise<OrganizationalSummaryResponse | null> {
    try {
      const response = await axiosClient.get(
        `${baseUrl}/reports/organization`,
        { params: query }
      );
      if (response.status >= 400) {
        console.error('Error fetching organization:', response.statusText);
        return null;
      }
      return response.data as OrganizationalSummaryResponse;
    } catch (error) {
      console.error('Error fetching organization:', error);
      return null;
    }
  }
};
