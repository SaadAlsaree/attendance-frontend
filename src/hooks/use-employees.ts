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

    return {
        employees: data?.data?.data ?? [],
        totalCount: data?.data?.totalCount ?? 0,
        page: data?.data?.page ?? 1,
        pageSize: data?.data?.pageSize ?? 10,
        totalPages: data?.data?.totalPages ?? 1,
        isLoading,
        error,
        refetch,
        // refreshEmployees: refreshEmployees.mutate,
        // clearEmployeesCache,
    };
} 