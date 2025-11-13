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
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent
} from '@/components/ui/chart';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  Users,
  UserCheck,
  UserX,
  Clock
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { ar } from 'date-fns/locale';

interface AttendanceTrend {
  date: string;
  presentCount: number;
  absentCount: number;
  lateCount: number;
  averageWorkingHours: number;
  averageOvertimeHours: number;
}

interface AttendanceTrends {
  dailyTrends: AttendanceTrend[];
  weeklyTrends: any[];
  monthlyTrends: any[];
}

interface AttendanceTrendsCardProps {
  trends: AttendanceTrends | undefined;
  isLoading?: boolean;
}

const chartConfig = {
  presentCount: {
    label: 'الحاضرون',
    color: 'hsl(var(--chart-1))'
  },
  absentCount: {
    label: 'الغائبون',
    color: 'hsl(var(--chart-2))'
  },
  lateCount: {
    label: 'المتأخرون',
    color: 'hsl(var(--chart-3))'
  },
  averageWorkingHours: {
    label: 'متوسط ساعات العمل',
    color: 'hsl(var(--chart-4))'
  }
};

export function AttendanceTrendsCard({
  trends,
  isLoading = false
}: AttendanceTrendsCardProps) {
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
          <div className='space-y-4'>
            <Skeleton className='h-4 w-full' />
            <Skeleton className='h-[200px] w-full' />
            <div className='flex gap-4'>
              <Skeleton className='h-4 w-20' />
              <Skeleton className='h-4 w-20' />
              <Skeleton className='h-4 w-20' />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!trends?.dailyTrends?.length) {
    return (
      <Card className='w-full'>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <TrendingUp className='h-5 w-5' />
            اتجاهات الحضور
          </CardTitle>
          <CardDescription>اتجاهات الحضور اليومية للموظفين</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='text-muted-foreground flex h-[200px] items-center justify-center'>
            لا تتوفر بيانات اتجاهات الحضور
          </div>
        </CardContent>
      </Card>
    );
  }

  // Process data for chart
  const chartData = trends.dailyTrends.map((day) => ({
    ...day,
    date: format(parseISO(day.date), 'dd/MM', { locale: ar }),
    totalEmployees: day.presentCount + day.absentCount,
    attendanceRate: (
      (day.presentCount / (day.presentCount + day.absentCount)) *
      100
    ).toFixed(1)
  }));

  // Calculate summary stats
  const totalDays = chartData.length;
  const avgPresent =
    chartData.reduce((sum, day) => sum + day.presentCount, 0) / totalDays;
  const avgAbsent =
    chartData.reduce((sum, day) => sum + day.absentCount, 0) / totalDays;
  const avgLate =
    chartData.reduce((sum, day) => sum + day.lateCount, 0) / totalDays;
  const avgWorkingHours =
    chartData.reduce((sum, day) => sum + day.averageWorkingHours, 0) /
    totalDays;

  // Calculate trends
  const latestDay = chartData[chartData.length - 1];
  const previousDay = chartData[chartData.length - 2];
  const attendanceTrend = previousDay
    ? (
        ((Number(latestDay.attendanceRate) -
          Number(previousDay.attendanceRate)) /
          Number(previousDay.attendanceRate)) *
        100
      ).toFixed(1)
    : 0;

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
                <TrendingUp className='h-5 w-5' />
                اتجاهات الحضور
              </CardTitle>
              <CardDescription>
                اتجاهات الحضور اليومية خلال الـ {totalDays} أيام الماضية
              </CardDescription>
            </div>
            <Badge
              variant={Number(attendanceTrend) >= 0 ? 'default' : 'destructive'}
            >
              {Number(attendanceTrend) >= 0 ? '+' : ''}
              {attendanceTrend}%
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className='space-y-6'>
            {/* Summary Stats */}
            <div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
              <div className='space-y-1 text-center'>
                <div className='flex items-center justify-center gap-1'>
                  <UserCheck className='h-4 w-4 text-green-500' />
                  <span className='text-muted-foreground text-sm'>
                    متوسط الحضور
                  </span>
                </div>
                <div className='text-lg font-bold text-green-600'>
                  {avgPresent.toFixed(0)}
                </div>
              </div>
              <div className='space-y-1 text-center'>
                <div className='flex items-center justify-center gap-1'>
                  <UserX className='h-4 w-4 text-red-500' />
                  <span className='text-muted-foreground text-sm'>
                    متوسط الغياب
                  </span>
                </div>
                <div className='text-lg font-bold text-red-600'>
                  {avgAbsent.toFixed(0)}
                </div>
              </div>
              <div className='space-y-1 text-center'>
                <div className='flex items-center justify-center gap-1'>
                  <Clock className='h-4 w-4 text-yellow-500' />
                  <span className='text-muted-foreground text-sm'>
                    متوسط التأخير
                  </span>
                </div>
                <div className='text-lg font-bold text-yellow-600'>
                  {avgLate.toFixed(0)}
                </div>
              </div>
              <div className='space-y-1 text-center'>
                <div className='flex items-center justify-center gap-1'>
                  <Calendar className='h-4 w-4 text-blue-500' />
                  <span className='text-muted-foreground text-sm'>
                    متوسط ساعات العمل
                  </span>
                </div>
                <div className='text-lg font-bold text-blue-600'>
                  {avgWorkingHours.toFixed(1)}
                </div>
              </div>
            </div>

            {/* Attendance Chart */}
            <div className='h-[300px]'>
              <ChartContainer config={chartConfig}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray='3 3' />
                  <XAxis
                    dataKey='date'
                    tick={{ fontSize: 12 }}
                    tickMargin={8}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        formatter={(value, name) => [
                          `${value}`,
                          chartConfig[name as keyof typeof chartConfig]
                            ?.label || name
                        ]}
                        labelFormatter={(value) => `التاريخ: ${value}`}
                      />
                    }
                  />
                  <Line
                    type='monotone'
                    dataKey='presentCount'
                    stroke='var(--color-presentCount)'
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type='monotone'
                    dataKey='absentCount'
                    stroke='var(--color-absentCount)'
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type='monotone'
                    dataKey='lateCount'
                    stroke='var(--color-lateCount)'
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <ChartLegend content={<ChartLegendContent />} />
                </LineChart>
              </ChartContainer>
            </div>

            {/* Working Hours Chart */}
            <div className='h-[200px]'>
              <h4 className='mb-2 text-sm font-medium'>
                متوسط ساعات العمل اليومية
              </h4>
              <ChartContainer config={chartConfig}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray='3 3' />
                  <XAxis
                    dataKey='date'
                    tick={{ fontSize: 12 }}
                    tickMargin={8}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        formatter={(value) => [`${value} ساعة`, 'ساعات العمل']}
                        labelFormatter={(value) => `التاريخ: ${value}`}
                      />
                    }
                  />
                  <Bar
                    dataKey='averageWorkingHours'
                    fill='var(--color-averageWorkingHours)'
                    radius={[2, 2, 0, 0]}
                  />
                </BarChart>
              </ChartContainer>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
