'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { dashboardService } from '../api/dashboard.service';
import { Dashboard } from './dashboard';
import { DashboardToolbar, DashboardFilters } from './dashboard-toolbar';
import { useDashboardFilters } from '../hooks/use-dashboard-filters';
import PageContainer from '@/components/layout/page-container';
import { useAuthApi } from '@/hooks/use-auth-api';
import { DashboardData, DashboardRequest } from '../types/dashboard';
import { DashboardStatsData } from '../types/dashboard-stats';
import { ApiResponse } from '../types/quick-stats';

interface DashboardPageProps {
  organizationId: string;
  date?: string;
  startDate?: string;
  endDate?: string;
  departmentId?: string;
  employeeId?: string;
}

export function DashboardPage({
  organizationId,
  date,
  startDate,
  endDate,
  departmentId,
  employeeId
}: DashboardPageProps) {
  const { authApiCall } = useAuthApi();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [quickStats, setQuickStats] = useState<ApiResponse | null>(null);
  const [detailedStats, setDetailedStats] = useState<DashboardStatsData | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<DashboardFilters>({
    organizationId: organizationId || '0197db37-8fa3-7438-91aa-bea53960eeea',
    date: date,
    startDate,
    endDate,
    departmentId,
    employeeId
  });

  // Fetch filter data using the hook
  const {
    organizations,
    employees,
    departments,
    isLoading: filtersLoading,
    error: filtersError,
    refreshFilters
  } = useDashboardFilters(filters.organizationId);

  const request = {
    organizationId: filters.organizationId,
    date: filters.date,
    startDate: filters.startDate,
    endDate: filters.endDate,
    departmentId: filters.departmentId,
    employeeId: filters.employeeId
  };

  const fetchDashboardData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Fetch all dashboard data
      const [dashboardResult, quickStatsResult, detailedStatsResult] =
        await Promise.all([
          authApiCall(
            async () =>
              await dashboardService.getDashboardClient(
                request as DashboardRequest
              )
          ),
          authApiCall(
            async () => await dashboardService.getQuickStatsClient(request)
          ),
          authApiCall(
            async () =>
              await dashboardService.getDashboardStatsClient(request as any)
          )
        ]);

      setDashboardData(dashboardResult);
      setQuickStats(quickStatsResult);
      setDetailedStats(detailedStatsResult);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to fetch dashboard data'
      );
      console.error('Dashboard data fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFiltersChange = (newFilters: DashboardFilters) => {
    setFilters(newFilters);
  };

  const handleRefresh = async () => {
    await fetchDashboardData();
    refreshFilters();
  };

  // Initial data fetch
  useEffect(() => {
    fetchDashboardData();
  }, [filters]);

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(
      () => {
        fetchDashboardData();
      },
      5 * 60 * 1000
    ); // 5 minutes

    return () => clearInterval(interval);
  }, []);

  return (
    <PageContainer>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <DashboardToolbar
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onRefresh={handleRefresh}
          isLoading={isLoading || filtersLoading}
          organizations={organizations}
          employees={employees}
          departments={departments}
        />

        <Dashboard
          dashboardData={dashboardData}
          quickStats={quickStats}
          detailedStats={detailedStats}
          isLoading={isLoading}
          onRefresh={handleRefresh}
        />
      </motion.div>
    </PageContainer>
  );
}
