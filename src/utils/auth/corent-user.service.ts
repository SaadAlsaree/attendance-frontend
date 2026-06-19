import { axiosInstance, axiosClient } from '@/lib/axios';
import { IResponse } from '@/types/response';
import { UserDto } from './auth';
import { UserPermissionData } from '@/features/system/users-permissions/types/users-permissions';

// Use the public var so the CLIENT path (axiosClient → /users/me) resolves the API
// host too. `API_URL` is server-only (not inlined into the browser bundle), so the
// client previously fell back to :7000 and failed CORS. NEXT_PUBLIC_* works on both.
const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:7080';

class CurrentUserService {
  private cache: {
    user: IResponse<UserDto> | null;
    timestamp: number;
  } | null = null;

  private readonly CACHE_TTL = 1 * 60 * 1000; // 1 minutes in milliseconds

  async getCurrentUser(skipCache = false) {
    // Return from cache if it exists and hasn't expired
    if (
      !skipCache &&
      this.cache &&
      Date.now() - this.cache.timestamp < this.CACHE_TTL
    ) {
      return this.cache.user;
    }

    // Fetch fresh data
    try {
      const response = await axiosInstance.get(`${baseUrl}/employees/profile`);
      if (response.status === 400) {
        this.cache = null;
        return null;
      }

      const userData = (response.data as IResponse<UserDto>) || null;

      // Update cache
      this.cache = {
        user: userData,
        timestamp: Date.now()
      };

      return userData;
    } catch (error) {
      this.cache = null;
      throw null;
    }
  }

  clearCache() {
    this.cache = null;
  }

  async getCurrentUserClient() {
    const response = await axiosClient.get(`${baseUrl}/users/me`);

    return (response.data as UserPermissionData) || null;
  }
}

export const currentUserService: CurrentUserService = new CurrentUserService();
