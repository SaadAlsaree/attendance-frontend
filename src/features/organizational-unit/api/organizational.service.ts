import { axiosInstance, axiosClient } from '@/lib/axios';
import { IResponseList, IResponse } from '@/types/response';
import {
  IOrganizationalUnitResponse,
  IOrganizationalUnitDetails,
  CreateOrganizationalUnitPayload,
  IOrganizationalUnitList,
  IOrganizationalUnitTree,
  IOrganizationalUnitQuery
} from '@/features/organizational-unit/types/organizational';

const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:7000';

export const organizationalService = {
  // Get all organizational units
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

  // Get all organizational units client
  async getOrganizationalUnitsClient(filters?: IOrganizationalUnitQuery) {
    try {
      const response = await axiosClient.get(
        `${baseUrl}/organizational-units`,
        { params: filters }
      );

      if (response.status >= 400) {
        return null;
      }

      return response.data || null;
    } catch (error) {
      return null;
    }
  },

  // Get organizational unit by ID
  async getOrganizationalUnitById(id: string) {
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

      return (response.data as IResponse<IOrganizationalUnitDetails>) || null;
    } catch (error) {
      return null;
    }
  },

  // Create new organizational unit
  async createOrganizationalUnit(unit: CreateOrganizationalUnitPayload) {
    try {
      const response = await axiosClient.post(
        `${baseUrl}/organizational-units`,
        unit
      );

      if (response.status >= 400) {
        return null;
      }

      return (response.data as string) || null; // Returns the created unit ID
    } catch (error) {
      return null;
    }
  },

  // Update organizational unit
  async updateOrganizationalUnit(
    id: string,
    unit: CreateOrganizationalUnitPayload
  ) {
    try {
      if (!id) {
        return null;
      }

      const response = await axiosClient.put(
        `${baseUrl}/organizational-units/${id}`,
        unit
      );

      if (response.status >= 400) {
        return null;
      }

      return response;
    } catch (error) {
      return null;
    }
  },

  // Delete organizational unit
  async deleteOrganizationalUnit(id: string) {
    try {
      if (!id) {
        return null;
      }

      const response = await axiosClient.delete(
        `${baseUrl}/organizational-units/${id}`
      );

      if (response.status >= 400) {
        return null;
      }

      return (response.data as boolean) || null;
    } catch (error) {
      return null;
    }
  },

  // Get organizational unit tree
  async getOrganizationalUnitTree() {
    try {
      const response = await axiosInstance.get(
        `${baseUrl}/organizational-units/tree`
      );

      if (response.status >= 400) {
        return null;
      }

      return (response.data as IOrganizationalUnitTree[]) || null;
    } catch (error) {
      return null;
    }
  },

  // Legacy methods for backward compatibility (can be removed later)
  async getOrganizationalUnitListById(includeInactive: boolean) {
    try {
      const response = await axiosInstance.get(
        `${baseUrl}/OrganizationalUnit/GetOrganizationalUnitListById`,
        {
          params: { includeInactive }
        }
      );

      if (response.status >= 400) {
        return null;
      }

      return (
        (response.data as IResponseList<IOrganizationalUnitResponse>) || null
      );
    } catch (error) {
      return null;
    }
  },

  async getOrganizationalUnitListByIdClient(includeInactive: boolean) {
    try {
      const response = await axiosClient.get(
        `${baseUrl}/OrganizationalUnit/GetOrganizationalUnitList`,
        {
          params: { includeInactive }
        }
      );

      if (response.status >= 400) {
        return null;
      }

      return (response.data as IResponseList<IOrganizationalUnitList>) || null;
    } catch (error) {
      return null;
    }
  },

  // Legacy status update method (can be removed if not needed)
  async updateOrganizationalUnitStatus(id: string, status: number) {
    try {
      if (!id) {
        return null;
      }

      const request = {
        id: id,
        statusId: status,
        tableName: 2
      };

      const response = await axiosClient.patch(
        `${baseUrl}/ChangeStatus/ChangeStatus`,
        request
      );

      if (response.status >= 400) {
        return null;
      }

      return (response.data as IResponse<boolean>) || null;
    } catch (error) {
      return null;
    }
  }
};
