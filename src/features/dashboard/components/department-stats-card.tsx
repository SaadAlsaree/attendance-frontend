'use client';

import React from 'react';
import { motion } from 'motion/react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Building2,
  Users,
  UserCheck,
  UserX,
  Clock,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface DepartmentStat {
  departmentId: string;
  departmentName: string;
  totalEmployees: number;
  presentCount: number;
  absentCount: number;
  lateCount: number;
  attendanceRate: number;
  averageWorkingHours: number;
}

interface DepartmentStatsCardProps {
  stats: DepartmentStat[] | undefined;
  isLoading?: boolean;
}

const DepartmentCard: React.FC<{ dept: DepartmentStat; rank: number }> = ({
  dept,
  rank
}) => {
  const getAttendanceColor = (rate: number) => {
    if (rate >= 90) return 'text-green-600';
    if (rate >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getProgressColor = (rate: number) => {
    if (rate >= 90) return 'bg-green-500';
    if (rate >= 75) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: rank * 0.1 }}
      className='space-y-3'
    >
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <Building2 className='text-muted-foreground h-4 w-4' />
          <h4 className='text-sm font-medium'>{dept.departmentName}</h4>
          {rank <= 2 && (
            <Badge variant='secondary' className='text-xs'>
              {rank === 0 ? '🥇' : rank === 1 ? '🥈' : '🥉'}
            </Badge>
          )}
        </div>
        <span
          className={cn(
            'text-sm font-bold',
            getAttendanceColor(dept.attendanceRate)
          )}
        >
          {dept.attendanceRate.toFixed(1)}%
        </span>
      </div>

      <Progress
        value={dept.attendanceRate}
        className='h-2'
        // Apply custom color via CSS variables
        style={
          {
            '--progress-foreground': getProgressColor(dept.attendanceRate)
          } as React.CSSProperties
        }
      />

      <div className='grid grid-cols-3 gap-3 text-xs'>
        <div className='text-center'>
          <div className='mb-1 flex items-center justify-center gap-1'>
            <Users className='h-3 w-3 text-blue-500' />
            <span className='text-muted-foreground'>الكل</span>
          </div>
          <div className='font-semibold'>{dept.totalEmployees}</div>
        </div>
        <div className='text-center'>
          <div className='mb-1 flex items-center justify-center gap-1'>
            <UserCheck className='h-3 w-3 text-green-500' />
            <span className='text-muted-foreground'>حاضر</span>
          </div>
          <div className='font-semibold text-green-600'>
            {dept.presentCount}
          </div>
        </div>
        <div className='text-center'>
          <div className='mb-1 flex items-center justify-center gap-1'>
            <UserX className='h-3 w-3 text-red-500' />
            <span className='text-muted-foreground'>غائب</span>
          </div>
          <div className='font-semibold text-red-600'>{dept.absentCount}</div>
        </div>
      </div>

      <div className='text-muted-foreground flex items-center justify-between text-xs'>
        <div className='flex items-center gap-1'>
          <Clock className='h-3 w-3' />
          <span>متأخر: {dept.lateCount}</span>
        </div>
        <div>ساعات: {dept.averageWorkingHours.toFixed(1)}</div>
      </div>
    </motion.div>
  );
};

export function DepartmentStatsCard({
  stats,
  isLoading = false
}: DepartmentStatsCardProps) {
  if (isLoading) {
    return (
      <Card className='w-full'>
        <CardHeader>
          <div className='flex items-center gap-2'>
            <Skeleton className='h-5 w-5' />
            <Skeleton className='h-6 w-32' />
          </div>
          <Skeleton className='h-4 w-48' />
        </CardHeader>
        <CardContent>
          <div className='space-y-6'>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className='space-y-3'>
                <div className='flex items-center justify-between'>
                  <Skeleton className='h-4 w-24' />
                  <Skeleton className='h-4 w-12' />
                </div>
                <Skeleton className='h-2 w-full' />
                <div className='grid grid-cols-3 gap-3'>
                  <Skeleton className='h-8 w-full' />
                  <Skeleton className='h-8 w-full' />
                  <Skeleton className='h-8 w-full' />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!stats?.length) {
    return (
      <Card className='w-full'>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Building2 className='h-5 w-5' />
            إحصائيات الأقسام
          </CardTitle>
          <CardDescription>أداء الحضور حسب الأقسام</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='text-muted-foreground flex h-[200px] items-center justify-center'>
            لا تتوفر بيانات إحصائيات الأقسام
          </div>
        </CardContent>
      </Card>
    );
  }

  // Sort departments by attendance rate (highest first)
  const sortedStats = [...stats].sort(
    (a, b) => b.attendanceRate - a.attendanceRate
  );

  // Calculate overall statistics
  const totalEmployees = stats.reduce(
    (sum, dept) => sum + dept.totalEmployees,
    0
  );
  const totalPresent = stats.reduce((sum, dept) => sum + dept.presentCount, 0);
  const totalAbsent = stats.reduce((sum, dept) => sum + dept.absentCount, 0);
  const overallAttendanceRate =
    totalEmployees > 0 ? (totalPresent / totalEmployees) * 100 : 0;
  const averageWorkingHours =
    stats.reduce((sum, dept) => sum + dept.averageWorkingHours, 0) /
    stats.length;

  const topPerformer = sortedStats[0];
  const leastPerformer = sortedStats[sortedStats.length - 1];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className='w-full'>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <div>
              <CardTitle className='flex items-center gap-2'>
                <Building2 className='h-5 w-5' />
                إحصائيات الأقسام
              </CardTitle>
              <CardDescription>
                أداء الحضور لـ {stats.length} قسم ({totalEmployees} موظف)
              </CardDescription>
            </div>
            <Badge variant='outline' className='text-sm'>
              معدل عام: {overallAttendanceRate.toFixed(1)}%
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className='space-y-6'>
            {/* Summary Stats */}
            <div className='bg-muted/50 grid grid-cols-2 gap-4 rounded-lg p-4 md:grid-cols-4'>
              <div className='text-center'>
                <div className='text-lg font-bold text-blue-600'>
                  {totalEmployees}
                </div>
                <div className='text-muted-foreground text-xs'>
                  إجمالي الموظفين
                </div>
              </div>
              <div className='text-center'>
                <div className='text-lg font-bold text-green-600'>
                  {totalPresent}
                </div>
                <div className='text-muted-foreground text-xs'>الحاضرون</div>
              </div>
              <div className='text-center'>
                <div className='text-lg font-bold text-red-600'>
                  {totalAbsent}
                </div>
                <div className='text-muted-foreground text-xs'>الغائبون</div>
              </div>
              <div className='text-center'>
                <div className='text-lg font-bold text-purple-600'>
                  {averageWorkingHours.toFixed(1)}
                </div>
                <div className='text-muted-foreground text-xs'>
                  متوسط ساعات العمل
                </div>
              </div>
            </div>

            {/* Top and Bottom Performers */}
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              <div className='rounded-lg border bg-green-50 p-3 dark:bg-green-950'>
                <div className='mb-2 flex items-center gap-2'>
                  <TrendingUp className='h-4 w-4 text-green-600' />
                  <span className='text-sm font-medium text-green-700 dark:text-green-300'>
                    أفضل أداء
                  </span>
                </div>
                <div className='text-sm'>
                  <div className='font-medium'>
                    {topPerformer.departmentName}
                  </div>
                  <div className='font-bold text-green-600'>
                    {topPerformer.attendanceRate.toFixed(1)}% حضور
                  </div>
                </div>
              </div>

              <div className='rounded-lg border bg-red-50 p-3 dark:bg-red-950'>
                <div className='mb-2 flex items-center gap-2'>
                  <TrendingDown className='h-4 w-4 text-red-600' />
                  <span className='text-sm font-medium text-red-700 dark:text-red-300'>
                    يحتاج تحسين
                  </span>
                </div>
                <div className='text-sm'>
                  <div className='font-medium'>
                    {leastPerformer.departmentName}
                  </div>
                  <div className='font-bold text-red-600'>
                    {leastPerformer.attendanceRate.toFixed(1)}% حضور
                  </div>
                </div>
              </div>
            </div>

            {/* Department List */}
            <div className='space-y-4'>
              <h4 className='flex items-center gap-2 text-sm font-medium'>
                <Building2 className='h-4 w-4' />
                تفاصيل الأقسام
              </h4>
              <div className='max-h-[400px] space-y-4 overflow-y-auto pr-2'>
                {sortedStats.map((dept, index) => (
                  <div
                    key={dept.departmentId}
                    className='rounded-lg border p-3'
                  >
                    <DepartmentCard dept={dept} rank={index} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
