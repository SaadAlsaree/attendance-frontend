'use client';
import { useState, useEffect } from 'react';
import { useAuthApi } from '@/hooks/use-auth-api';

interface Organization {
    id: string;
    name: string;
}

interface Employee {
    id: string;
    name: string;
    employeeNumber: string;
}

interface Department {
    id: string;
    name: string;
}

interface DashboardFiltersData {
    organizations: Organization[];
    employees: Employee[];
    departments: Department[];
}

export function useDashboardFilters(organizationId?: string) {
    const { authApiCall } = useAuthApi();
    const [filtersData, setFiltersData] = useState<DashboardFiltersData>({
        organizations: [],
        employees: [],
        departments: []
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchFiltersData = async () => {
        setIsLoading(true);
        setError(null);

        try {
            // In a real application, these would be actual API calls
            // For now, we'll use mock data with Arabic names
            const mockData: DashboardFiltersData = {
                organizations: [
                    { id: '0197db37-8fa3-7438-91aa-bea53960eeea', name: 'المنظمة الرئيسية' },
                    { id: 'org-2', name: 'الفرع الأول' },
                    { id: 'org-3', name: 'الفرع الثاني' }
                ],
                employees: [
                    { id: 'emp-1', name: 'أحمد محمد', employeeNumber: 'EMP001' },
                    { id: 'emp-2', name: 'فاطمة علي', employeeNumber: 'EMP002' },
                    { id: 'emp-3', name: 'محمد حسن', employeeNumber: 'EMP003' },
                    { id: 'emp-4', name: 'عائشة أحمد', employeeNumber: 'EMP004' },
                    { id: 'emp-5', name: 'علي محمود', employeeNumber: 'EMP005' }
                ],
                departments: [
                    { id: 'dept-1', name: 'الهندسة' },
                    { id: 'dept-2', name: 'التسويق' },
                    { id: 'dept-3', name: 'المبيعات' },
                    { id: 'dept-4', name: 'الموارد البشرية' },
                    { id: 'dept-5', name: 'المالية' },
                    { id: 'dept-6', name: 'العمليات' }
                ]
            };

            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 500));

            setFiltersData(mockData);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'فشل في جلب بيانات المرشحات');
            console.error('Filter data fetch error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchFiltersData();
    }, [organizationId]);

    const refreshFilters = () => {
        fetchFiltersData();
    };

    return {
        ...filtersData,
        isLoading,
        error,
        refreshFilters
    };
} 