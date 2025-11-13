'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import {
  AlertTriangle,
  RefreshCw,
  BarChart3,
  Calendar,
  Bell,
  Target,
  Activity as ActivityIcon
} from 'lucide-react';
import { QuickStatsCard } from './quick-stats-card';
import { AttendanceTrendsCard } from './attendance-trends-card';
import { DepartmentStatsCard } from './department-stats-card';
import { TopPerformersCard } from './top-performers-card';
import { RecentActivitiesCard } from './recent-activities-card';
import { NavigationCard } from './navigation-card';
import { AlertsCard } from './alerts-card';
import { PerformanceMetricsCard } from './performance-metrics-card';
import { DeviceStatusCard } from './device-status-card';
import { DashboardData } from '../types/dashboard';
import { ApiResponse } from '../types/quick-stats';
import { DashboardStatsData } from '../types/dashboard-stats';

interface DashboardProps {
  dashboardData: DashboardData | null;
  quickStats: ApiResponse | null;
  detailedStats: DashboardStatsData | null;
  isLoading?: boolean;
  onRefresh?: () => void;
}

export function Dashboard({
  dashboardData,
  quickStats,
  detailedStats,
  isLoading = false,
  onRefresh
}: DashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Check for errors in the data
  const hasError = !dashboardData && !quickStats && !detailedStats;
  const hasData = dashboardData || quickStats || detailedStats;

  const handleRefresh = async () => {
    if (onRefresh) {
      setIsRefreshing(true);
      await onRefresh();
      setIsRefreshing(false);
    }
  };

  if (hasError) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Alert variant='destructive' className='mb-6'>
          <AlertTriangle className='h-4 w-4' />
          <AlertDescription>
            لا تتوفر بيانات لوحة المعلومات. يُرجى المحاولة لاحقًا.
          </AlertDescription>
        </Alert>
      </motion.div>
    );
  }

  if (!hasData && !isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Alert>
          <AlertTriangle className='h-4 w-4' />
          <AlertDescription>لا تتوفر بيانات لوحة المعلومات.</AlertDescription>
        </Alert>
      </motion.div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Header with Refresh Button */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className='flex items-center justify-between'
      >
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>الرئيسية</h1>
          <p className='text-muted-foreground'>
            نظرة عامة على موقف الموظفين والإحصائيات
          </p>
        </div>
        <Button
          onClick={handleRefresh}
          disabled={isRefreshing || isLoading}
          variant='outline'
          size='sm'
          className='flex items-center gap-2'
        >
          <RefreshCw
            className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`}
          />
          تحديث
        </Button>
      </motion.div>

      {/* Quick Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6'
      >
        <QuickStatsCard stats={quickStats} isLoading={isLoading} />
      </motion.div>

      {/* Main Content with Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className='space-y-4'
        >
          <TabsList className='grid w-full grid-cols-4 lg:w-auto lg:grid-cols-4'>
            <TabsTrigger value='overview' className='flex items-center gap-2'>
              <BarChart3 className='h-4 w-4' />
              نظرة عامة
            </TabsTrigger>
            <TabsTrigger
              value='performance'
              className='flex items-center gap-2'
            >
              <Target className='h-4 w-4' />
              الأداء
            </TabsTrigger>
            <TabsTrigger value='activities' className='flex items-center gap-2'>
              <ActivityIcon className='h-4 w-4' />
              الأنشطة
            </TabsTrigger>
            <TabsTrigger value='alerts' className='flex items-center gap-2'>
              <Bell className='h-4 w-4' />
              التنبيهات
            </TabsTrigger>
          </TabsList>

          <TabsContent value='overview' className='space-y-6'>
            <div className='grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3'>
              {/* Attendance Trends */}
              <div className='lg:col-span-2'>
                <AttendanceTrendsCard
                  trends={detailedStats?.attendanceTrends}
                  isLoading={isLoading}
                />
              </div>

              {/* Department Stats */}
              <div className='lg:col-span-2 xl:col-span-1'>
                <DepartmentStatsCard
                  stats={detailedStats?.departmentStats}
                  isLoading={isLoading}
                />
              </div>

              {/* Device Status */}
              <div className='lg:col-span-2 xl:col-span-1'>
                <DeviceStatusCard
                  deviceStats={detailedStats?.deviceStats}
                  deviceStatuses={detailedStats?.deviceStatuses}
                  isLoading={isLoading}
                />
              </div>

              {/* Navigation */}
              <div className='lg:col-span-2 xl:col-span-1'>
                <NavigationCard
                  navigation={
                    dashboardData?.navigation || {
                      quickActions: [],
                      reports: [],
                      management: []
                    }
                  }
                  isLoading={isLoading}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value='performance' className='space-y-6'>
            <div className='grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3'>
              {/* Performance Metrics */}
              <div className='lg:col-span-2'>
                <PerformanceMetricsCard
                  metrics={detailedStats?.performanceMetrics}
                  isLoading={isLoading}
                />
              </div>

              {/* Top Performers */}
              <div className='lg:col-span-2 xl:col-span-1'>
                <TopPerformersCard
                  performers={detailedStats?.topPerformers}
                  isLoading={isLoading}
                />
              </div>

              {/* Leave Stats */}
              <div className='lg:col-span-2 xl:col-span-1'>
                <Card>
                  <CardHeader>
                    <CardTitle className='flex items-center gap-2'>
                      <Calendar className='h-5 w-5' />
                      احصائيات الإجازات
                    </CardTitle>
                    <CardDescription>
                      الإجازات الحالية والموافقات
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <div className='space-y-4'>
                        <Skeleton className='h-4 w-full' />
                        <Skeleton className='h-4 w-3/4' />
                        <Skeleton className='h-4 w-1/2' />
                      </div>
                    ) : detailedStats?.leaveStats ? (
                      <div className='space-y-4'>
                        <div className='grid grid-cols-2 gap-4'>
                          <div className='text-center'>
                            <div className='text-primary text-2xl font-bold'>
                              {detailedStats.leaveStats.totalLeaveRequests}
                            </div>
                            <div className='text-muted-foreground text-sm'>
                              إجمالي الطلبات
                            </div>
                          </div>
                          <div className='text-center'>
                            <div className='text-2xl font-bold text-yellow-600'>
                              {detailedStats.leaveStats.pendingApprovals}
                            </div>
                            <div className='text-muted-foreground text-sm'>
                              قيد المعالجة
                            </div>
                          </div>
                        </div>
                        <div className='space-y-2'>
                          <div className='flex justify-between text-sm'>
                            <span>موافقة</span>
                            <span className='font-medium'>
                              {detailedStats.leaveStats.approvedLeaves}
                            </span>
                          </div>
                          <div className='flex justify-between text-sm'>
                            <span>رفض</span>
                            <span className='font-medium'>
                              {detailedStats.leaveStats.rejectedLeaves}
                            </span>
                          </div>
                          <div className='flex justify-between text-sm'>
                            <span>في الإجازة</span>
                            <span className='font-medium'>
                              {detailedStats.leaveStats.employeesOnLeave}
                            </span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className='text-muted-foreground py-8 text-center'>
                        لا يوجد بيانات إجازات
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value='activities' className='space-y-6'>
            <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
              {/* Recent Activities */}
              <div className='lg:col-span-2'>
                <RecentActivitiesCard
                  activities={detailedStats?.recentActivities}
                  isLoading={isLoading}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value='alerts' className='space-y-6'>
            <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
              {/* Alerts */}
              <div className='lg:col-span-2'>
                <AlertsCard
                  alerts={detailedStats?.alerts}
                  isLoading={isLoading}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}
