// useEmployees.ts
'use client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { employeeService } from '@/features/employee/api/employees.service';
import { EmployeeListApiResponse } from '@/features/employee/types/employees';
import { useAuthApi } from './use-auth-api';

export interface UseEmployeesParams {
    page?: number;
    pageSize?: number;
    searchTerm?: string;
    organizationalUnitId?: string;
    isManager?: boolean;
}

export function useEmployees(params: UseEmployeesParams = {}) {
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
    } = useQuery<EmployeeListApiResponse | null, Error>({
        queryKey: ['employees', mergedParams],
        queryFn: () => authApiCall(() => employeeService.getEmployeesClient(mergedParams)),
        staleTime: 1 * 60 * 1000, // 1 minute
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
    });

    // const refreshEmployees = useMutation({
    //     mutationFn: () => authApiCall(() => employeeService.getEmployeesClient(mergedParams)),
    //     onSuccess: (newData) => {
    //         queryClient.setQueryData(['employees', mergedParams], newData);
    //     },
    // });

    // const clearEmployeesCache = () => {
    //     queryClient.invalidateQueries({ queryKey: ['employees'] });
    // };

    // The /employees endpoint returns { data: [...], totalCount, page, ... } (the
    // employee array directly on `data`, pagination fields at the top level). Accept
    // that shape and the older nested { data: { data: [...], totalCount } } one.
    const body = data as any;
    return {
        employees: (Array.isArray(body?.data) ? body.data : body?.data?.data) ?? [],
        totalCount: body?.totalCount ?? body?.data?.totalCount ?? 0,
        page: body?.page ?? body?.data?.page ?? 1,
        pageSize: body?.pageSize ?? body?.data?.pageSize ?? 10,
        totalPages: body?.totalPages ?? body?.data?.totalPages ?? 1,
        isLoading,
        error,
        refetch,
        // refreshEmployees: refreshEmployees.mutate,
        // clearEmployeesCache,
    };
} 