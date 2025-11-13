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
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Users,
  UserCheck,
  UserX,
  Clock,
  CalendarDays,
  TrendingUp,
  AlertTriangle,
  Monitor,
  MonitorX,
  Bell,
  BarChart3,
  Timer
} from 'lucide-react';
import { ApiResponse } from '../types/quick-stats';
import { cn } from '@/lib/utils';

interface QuickStatsCardProps {
  stats: ApiResponse | null;
  isLoading?: boolean;
}

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  trend?: number;
  color?: 'default' | 'green' | 'red' | 'yellow' | 'blue';
  suffix?: string;
  description?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  trend,
  color = 'default',
  suffix = '',
  description
}) => {
  const colorClasses = {
    default: 'border-border',
    green:
      'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950',
    red: 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950',
    yellow:
      'border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950',
    blue: 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950'
  };

  const iconColorClasses = {
    default: 'text-muted-foreground',
    green: 'text-green-600 dark:text-green-400',
    red: 'text-red-600 dark:text-red-400',
    yellow: 'text-yellow-600 dark:text-yellow-400',
    blue: 'text-blue-600 dark:text-blue-400'
  };

  return (
    <Card
      className={cn(
        'transition-all duration-200 hover:shadow-md',
        colorClasses[color]
      )}
    >
      <CardContent className='p-6'>
        <div className='flex items-center justify-between'>
          <div className='flex-1'>
            <div className='mb-2 flex items-center gap-2'>
              <div className={cn('h-5 w-5', iconColorClasses[color])}>
                {icon}
              </div>
              <p className='text-muted-foreground text-sm font-medium'>
                {title}
              </p>
            </div>
            <div className='flex items-baseline gap-1'>
              <p className='text-2xl font-bold'>
                {typeof value === 'number'
                  ? value.toLocaleString('ar-SA')
                  : value}
              </p>
              {suffix && (
                <span className='text-muted-foreground text-sm'>{suffix}</span>
              )}
            </div>
            {description && (
              <p className='text-muted-foreground mt-1 text-xs'>
                {description}
              </p>
            )}
          </div>
          {trend !== undefined && (
            <Badge
              variant={trend >= 0 ? 'default' : 'destructive'}
              className='text-xs'
            >
              {trend >= 0 ? '+' : ''}
              {trend}%
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export function QuickStatsCard({
  stats,
  isLoading = false
}: QuickStatsCardProps) {
  if (isLoading) {
    return (
      <>
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className='transition-all duration-200'>
            <CardContent className='p-6'>
              <div className='space-y-2'>
                <Skeleton className='h-4 w-24' />
                <Skeleton className='h-8 w-16' />
                <Skeleton className='h-3 w-20' />
              </div>
            </CardContent>
          </Card>
        ))}
      </>
    );
  }

  if (!stats?.data) {
    return (
      <Card className='col-span-full'>
        <CardContent className='p-6 text-center'>
          <p className='text-muted-foreground'>
            لا تتوفر بيانات إحصائيات سريعة
          </p>
        </CardContent>
      </Card>
    );
  }

  const data = stats.data;
  const attendanceRate = data.attendanceRate || 0;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <StatCard
          title='إجمالي الموظفين'
          value={data.totalEmployees}
          icon={<Users />}
          color='blue'
          description='العدد الكلي للموظفين'
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <StatCard
          title='الحاضرون اليوم'
          value={data.presentToday}
          icon={<UserCheck />}
          color='green'
          description={`معدل الحضور: ${attendanceRate.toFixed(1)}%`}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <StatCard
          title='الغائبون اليوم'
          value={data.absentToday}
          icon={<UserX />}
          color='red'
          description='عدد الموظفين الغائبين'
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
      >
        <StatCard
          title='المتأخرون'
          value={data.lateToday}
          icon={<Clock />}
          color='yellow'
          description='عدد الموظفين المتأخرين'
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.5 }}
      >
        <StatCard
          title='في إجازة'
          value={data.onLeaveToday}
          icon={<CalendarDays />}
          color='blue'
          description='عدد الموظفين في إجازة'
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.6 }}
      >
        <StatCard
          title='معدل ساعات العمل'
          value={data.averageWorkingHours.toFixed(1)}
          icon={<Timer />}
          suffix='ساعة'
          color='default'
          description='متوسط ساعات العمل اليومية'
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.7 }}
        className='md:col-span-2 lg:col-span-1'
      >
        <StatCard
          title='الأجهزة المتصلة'
          value={data.onlineDevices}
          icon={<Monitor />}
          color='green'
          description={`غير متصل: ${data.offlineDevices}`}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.8 }}
        className='md:col-span-2 lg:col-span-1'
      >
        <StatCard
          title='التنبيهات النشطة'
          value={data.activeAlerts}
          icon={<Bell />}
          color={data.activeAlerts > 0 ? 'red' : 'green'}
          description='التنبيهات غير المعالجة'
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.9 }}
        className='md:col-span-2 lg:col-span-1'
      >
        <StatCard
          title='طلبات الموافقة'
          value={data.pendingApprovals}
          icon={<AlertTriangle />}
          color={data.pendingApprovals > 0 ? 'yellow' : 'green'}
          description='طلبات قيد المراجعة'
        />
      </motion.div>
    </>
  );
}
