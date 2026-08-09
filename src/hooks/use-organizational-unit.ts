// useEmployees.ts
'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthApi } from './use-auth-api';
import { OrganizationalUnitsApiResponse } from '@/features/employee/types/employees';
import { organizationalService } from '@/features/organizational-unit/api/organizational.service';

export interface UseOrganizationalUnitParams {
    page?: number;
    pageSize?: number;
    searchTerm?: string;
    organizationalUnitId?: string;
    isManager?: boolean;
}

export function useOrganizationalUnits(params: UseOrganizationalUnitParams = {}) {
    const queryClient = useQueryClient();
    const { authApiCall } = useAuthApi();

    // Set default values for page and pageSize
    const mergedParams = {
        page: 1,
        pageSize: 100,
        ...params,
    };

    const {
        data,
        error,
        isLoading,
        refetch,
    } = useQuery<OrganizationalUnitsApiResponse | null, Error>({
        queryKey: ['organizationalUnits', mergedParams],
        queryFn: () => authApiCall(() => organizationalService.getOrganizationalUnitsClient(mergedParams)),
        staleTime: 1 * 60 * 1000, // 1 minute
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
    });

    const refreshOrganizationalUnits = useMutation({
        mutationFn: () => authApiCall(() => organizationalService.getOrganizationalUnitsClient(mergedParams)),
        onSuccess: (newData) => {
            queryClient.setQueryData(['organizationalUnits', mergedParams], newData);
        },
    });

    const clearOrganizationalUnitsCache = () => {
        queryClient.invalidateQueries({ queryKey: ['organizationalUnits'] });
    };

    return {
        // The /organizational-units endpoint returns a flat array (not the paginated
        // { data: [...] } envelope other endpoints use), so accept either shape.
        organizationalUnits: (Array.isArray(data) ? data : data?.data) ?? [],
        isLoading,
        error,
        refetch,
        refreshOrganizationalUnits: refreshOrganizationalUnits.mutate,
        clearOrganizationalUnitsCache,
    };
} 