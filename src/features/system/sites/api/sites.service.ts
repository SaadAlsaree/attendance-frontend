import { axiosInstance, axiosClient } from '@/lib/axios';
import { getApiBaseUrl } from '@/lib/api-url';
import {
  ISite,
  ISiteDetails,
  ISiteQuery,
  CreateSitePayload,
  UpdateSitePayload,
  SetSiteUnitsPayload
} from '../types/sites';

const baseUrl = getApiBaseUrl();

export const sitesService = {
  // Get all sites (Server-side)
  async getSites(filters?: ISiteQuery): Promise<ISite[] | null> {
    try {
      const response = await axiosInstance.get(`${baseUrl}/sites`, {
        params: filters
      });

      if (response.status >= 400) {
        console.error('Error fetching sites:', response.statusText);
        return null;
      }

      return (response.data as ISite[]) || null;
    } catch (error) {
      console.error('Error fetching sites:', error);
      return null;
    }
  },

  // Get all sites (Client-side)
  async getSitesClient(filters?: ISiteQuery): Promise<ISite[] | null> {
    try {
      const response = await axiosClient.get(`${baseUrl}/sites`, {
        params: filters
      });

      return (response.data as ISite[]) || null;
    } catch (error) {
      console.error('Error fetching sites:', error);
      return null;
    }
  },

  // Get a single site with its assigned units (Server-side)
  async getSiteById(id: string): Promise<ISiteDetails | null> {
    try {
      const response = await axiosInstance.get(`${baseUrl}/sites/${id}`);

      if (response.status >= 400) {
        console.error('Error fetching site:', response.statusText);
        return null;
      }

      return (response.data as ISiteDetails) || null;
    } catch (error) {
      console.error('Error fetching site:', error);
      return null;
    }
  },

  // Get a single site with its assigned units (Client-side)
  async getSiteByIdClient(id: string): Promise<ISiteDetails | null> {
    try {
      const response = await axiosClient.get(`${baseUrl}/sites/${id}`);

      return (response.data as ISiteDetails) || null;
    } catch (error) {
      console.error('Error fetching site:', error);
      return null;
    }
  },

  async createSiteClient(payload: CreateSitePayload): Promise<string | null> {
    const response = await axiosClient.post(`${baseUrl}/sites`, payload);

    return (response.data as string) || null;
  },

  async updateSiteClient(
    id: string,
    payload: UpdateSitePayload
  ): Promise<boolean> {
    await axiosClient.put(`${baseUrl}/sites/${id}`, payload);

    return true;
  },

  async deleteSiteClient(id: string): Promise<boolean> {
    await axiosClient.delete(`${baseUrl}/sites/${id}`);

    return true;
  },

  /**
   * Replaces the site's unit membership wholesale. Send exactly the units that should belong to
   * the site — child units of a listed unit are NOT added implicitly, by design.
   */
  async setSiteUnitsClient(
    id: string,
    payload: SetSiteUnitsPayload
  ): Promise<boolean> {
    await axiosClient.put(`${baseUrl}/sites/${id}/units`, payload);

    return true;
  }
};
