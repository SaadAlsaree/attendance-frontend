import { axiosInstance, axiosClient } from '@/lib/axios';
import { getApiBaseUrl } from '@/lib/api-base';
import {
  IOrganizationalUnitList,
  IOrganizationalUnitDetails,
  CreateOrganizationalUnitPayload,
  IOrganizationalUnitTree,
  IOrganizationalUnitQuery
} from '../types/organizationsunits';

const baseUrl = getApiBaseUrl();

export const organizationsUnitsService = {
  // Get all organizational units (Server-side)
  async getOrganizationalUnits(filters?: IOrganizationalUnitQuery) {
    try {
      const response = await axiosInstance.get(
        `${baseUrl}/organizational-units`,
        { params: filters }
      );

      if (response.status >= 400) {
        console.error(
          'Error fetching organizational units:',
          response.statusText
        );
        return null;
      }

      return response || null;
    } catch (error) {
      console.error('Error fetching organizational units:', error);
      return null;
    }
  },

  // Get all organizational units (Client-side)
  async getOrganizationalUnitsClient(
    filters?: IOrganizationalUnitQuery
  ): Promise<IOrganizationalUnitList[] | null> {
    try {
      const response = await axiosClient.get(
        `${baseUrl}/organizational-units`,
        { params: filters }
      );

      if (response.status >= 400) {
        return null;
      }

      return (response.data as IOrganizationalUnitList[]) || null;
    } catch (error) {
      console.error('Error fetching organizational units client:', error);
      return null;
    }
  },

  // Get organizational unit by ID (Server-side)
  async getOrganizationalUnitById(
    id: string
  ): Promise<IOrganizationalUnitDetails | null> {
    try {
      if (!id) {
        return null;
      }

      const response = await axiosInstance.get(
        `${baseUrl}/organizational-units/${id}`
      );

      if (response.status >= 400) {
        return null;
      }

      return (response.data as IOrganizationalUnitDetails) || null;
    } catch (error) {
      console.error('Error fetching organizational unit by ID:', error);
      return null;
    }
  },

  // Get organizational unit by ID (Client-side)
  async getOrganizationalUnitByIdClient(
    id: string
  ): Promise<IOrganizationalUnitDetails | null> {
    try {
      if (!id) {
        return null;
      }

      const response = await axiosClient.get(
        `${baseUrl}/organizational-units/${id}`
      );

      if (response.status >= 400) {
        return null;
      }

      return (response.data as IOrganizationalUnitDetails) || null;
    } catch (error) {
      console.error('Error fetching organizational unit by ID client:', error);
      return null;
    }
  },

  // Create new organizational unit (Client-side)
  async createOrganizationalUnit(
    unit: CreateOrganizationalUnitPayload
  ): Promise<string | null> {
    try {
      const response = await axiosClient.post(
        `${baseUrl}/organizational-units`,
        unit
      );

      if (response.status >= 400) {
        return null;
      }

      return (response.data as string) || null;
    } catch (error) {
      console.error('Error creating organizational unit:', error);
      return null;
    }
  },

  // Update organizational unit (Client-side)
  async updateOrganizationalUnit(
    id: string,
    unit: CreateOrganizationalUnitPayload
  ): Promise<boolean> {
    try {
      if (!id) {
        return false;
      }

      const response = await axiosClient.put(
        `${baseUrl}/organizational-units/${id}`,
        unit
      );

      if (response.status >= 400) {
        return false;
      }

      return response.status >= 200 && response.status < 300;
    } catch (error) {
      console.error('Error updating organizational unit:', error);
      return false;
    }
  },

  // Delete organizational unit (Client-side)
  async deleteOrganizationalUnit(id: string): Promise<boolean> {
    try {
      if (!id) {
        return false;
      }

      const response = await axiosClient.delete(
        `${baseUrl}/organizational-units/${id}`
      );

      if (response.status >= 400) {
        return false;
      }

      return response.status === 200 || response.status === 204;
    } catch (error) {
      console.error('Error deleting organizational unit:', error);
      return false;
    }
  },

  // Get organizational unit tree (Server-side)
  async getOrganizationalUnitTree(): Promise<IOrganizationalUnitTree[] | null> {
    try {
      const response = await axiosInstance.get(
        `${baseUrl}/organizational-units/tree`
      );

      if (response.status >= 400) {
        return null;
      }

      return (response.data as IOrganizationalUnitTree[]) || null;
    } catch (error) {
      console.error('Error fetching organizational unit tree:', error);
      return null;
    }
  },

  // Get organizational unit tree (Client-side)
  async getOrganizationalUnitTreeClient(): Promise<
    IOrganizationalUnitTree[] | null
  > {
    try {
      const response = await axiosClient.get(
        `${baseUrl}/organizational-units/tree`
      );

      if (response.status >= 400) {
        return null;
      }

      return (response.data as IOrganizationalUnitTree[]) || null;
    } catch (error) {
      console.error('Error fetching organizational unit tree client:', error);
      return null;
    }
  }
};

// Aliases for backward compatibility
export const organizationalService = organizationsUnitsService;
export const organizationsunitsService = organizationsUnitsService;
