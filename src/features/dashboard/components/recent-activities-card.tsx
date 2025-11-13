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
  Activity,
  LogIn,
  LogOut,
  Clock,
  MapPin,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Calendar
} from 'lucide-react';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { ar } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface RecentActivity {
  id: string;
  activityType: string;
  description: string;
  employeeName: string;
  timestamp: string;
  status: string;
  location: string;
}

interface RecentActivitiesCardProps {
  activities: RecentActivity[] | undefined;
  isLoading?: boolean;
}

const ActivityItem: React.FC<{ activity: RecentActivity; index: number }> = ({
  activity,
  index
}) => {
  const getActivityIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'check_in':
      case 'login':
        return <LogIn className='h-4 w-4 text-green-500' />;
      case 'check_out':
      case 'logout':
        return <LogOut className='h-4 w-4 text-red-500' />;
      case 'break':
        return <Clock className='h-4 w-4 text-yellow-500' />;
      case 'location':
        return <MapPin className='h-4 w-4 text-blue-500' />;
      case 'leave':
        return <Calendar className='h-4 w-4 text-purple-500' />;
      default:
        return <Activity className='h-4 w-4 text-gray-500' />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'success':
      case 'approved':
      case 'completed':
        return {
          variant: 'default' as const,
          color: 'text-green-600',
          label: 'مكتمل'
        };
      case 'pending':
      case 'processing':
        return {
          variant: 'secondary' as const,
          color: 'text-yellow-600',
          label: 'قيد المعالجة'
        };
      case 'failed':
      case 'rejected':
      case 'error':
        return {
          variant: 'destructive' as const,
          color: 'text-red-600',
          label: 'فشل'
        };
      default:
        return {
          variant: 'outline' as const,
          color: 'text-gray-600',
          label: status
        };
    }
  };

  const statusBadge = getStatusBadge(activity.status);
  const timeAgo = formatDistanceToNow(parseISO(activity.timestamp), {
    addSuffix: true,
    locale: ar
  });

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className='hover:bg-muted/50 flex items-start gap-3 rounded-lg border p-3 transition-colors'
    >
      <div className='mt-1 flex-shrink-0'>
        {getActivityIcon(activity.activityType)}
      </div>

      <div className='min-w-0 flex-1 space-y-1'>
        <div className='flex items-center justify-between gap-2'>
          <p className='truncate text-sm font-medium'>
            {activity.employeeName}
          </p>
          <Badge variant={statusBadge.variant} className='text-xs'>
            {statusBadge.label}
          </Badge>
        </div>

        <p className='text-muted-foreground text-sm'>{activity.description}</p>

        <div className='text-muted-foreground flex items-center gap-4 text-xs'>
          <div className='flex items-center gap-1'>
            <Clock className='h-3 w-3' />
            <span>{timeAgo}</span>
          </div>
          {activity.location && (
            <div className='flex items-center gap-1'>
              <MapPin className='h-3 w-3' />
              <span className='truncate'>{activity.location}</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export function RecentActivitiesCard({
  activities,
  isLoading = false
}: RecentActivitiesCardProps) {
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
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className='flex items-start gap-3 rounded-lg border p-3'
              >
                <Skeleton className='mt-1 h-4 w-4' />
                <div className='flex-1 space-y-2'>
                  <div className='flex items-center justify-between'>
                    <Skeleton className='h-4 w-24' />
                    <Skeleton className='h-5 w-16' />
                  </div>
                  <Skeleton className='h-3 w-48' />
                  <div className='flex gap-4'>
                    <Skeleton className='h-3 w-16' />
                    <Skeleton className='h-3 w-20' />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!activities?.length) {
    return (
      <Card className='w-full'>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Activity className='h-5 w-5' />
            الأنشطة الحديثة
          </CardTitle>
          <CardDescription>آخر أنشطة الموظفين</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='text-muted-foreground flex h-[200px] items-center justify-center'>
            لا تتوفر أنشطة حديثة
          </div>
        </CardContent>
      </Card>
    );
  }

  // Sort activities by timestamp (most recent first)
  const sortedActivities = [...activities]
    .sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )
    .slice(0, 20); // Show last 20 activities

  // Calculate activity stats
  const totalActivities = sortedActivities.length;
  const successfulActivities = sortedActivities.filter((a) =>
    ['success', 'approved', 'completed'].includes(a.status.toLowerCase())
  ).length;
  const pendingActivities = sortedActivities.filter((a) =>
    ['pending', 'processing'].includes(a.status.toLowerCase())
  ).length;
  const failedActivities = sortedActivities.filter((a) =>
    ['failed', 'rejected', 'error'].includes(a.status.toLowerCase())
  ).length;

  // Group activities by type
  const activityTypes = sortedActivities.reduce(
    (acc, activity) => {
      acc[activity.activityType] = (acc[activity.activityType] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const mostCommonActivity = Object.entries(activityTypes).sort(
    (a, b) => b[1] - a[1]
  )[0];

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
                <Activity className='h-5 w-5' />
                الأنشطة الحديثة
              </CardTitle>
              <CardDescription>
                آخر {totalActivities} نشاط للموظفين
              </CardDescription>
            </div>
            <div className='text-center'>
              <div className='text-lg font-bold text-green-600'>
                {((successfulActivities / totalActivities) * 100).toFixed(0)}%
              </div>
              <div className='text-muted-foreground text-xs'>معدل النجاح</div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className='space-y-6'>
            {/* Activity Stats */}
            <div className='bg-muted/50 grid grid-cols-4 gap-4 rounded-lg p-4'>
              <div className='text-center'>
                <div className='text-lg font-bold text-blue-600'>
                  {totalActivities}
                </div>
                <div className='text-muted-foreground text-xs'>
                  إجمالي الأنشطة
                </div>
              </div>
              <div className='text-center'>
                <div className='text-lg font-bold text-green-600'>
                  {successfulActivities}
                </div>
                <div className='text-muted-foreground text-xs'>مكتملة</div>
              </div>
              <div className='text-center'>
                <div className='text-lg font-bold text-yellow-600'>
                  {pendingActivities}
                </div>
                <div className='text-muted-foreground text-xs'>
                  قيد المعالجة
                </div>
              </div>
              <div className='text-center'>
                <div className='text-lg font-bold text-red-600'>
                  {failedActivities}
                </div>
                <div className='text-muted-foreground text-xs'>فاشلة</div>
              </div>
            </div>

            {/* Most Common Activity */}
            {mostCommonActivity && (
              <div className='rounded-lg border bg-blue-50 p-3 dark:bg-blue-950'>
                <div className='flex items-center gap-2'>
                  <Activity className='h-4 w-4 text-blue-600' />
                  <span className='text-sm font-medium text-blue-700 dark:text-blue-300'>
                    النشاط الأكثر شيوعاً
                  </span>
                </div>
                <div className='mt-1 text-sm'>
                  <span className='font-medium'>{mostCommonActivity[0]}</span>
                  <span className='text-muted-foreground mx-2'>•</span>
                  <span className='font-bold text-blue-600'>
                    {mostCommonActivity[1]} مرة
                  </span>
                </div>
              </div>
            )}

            {/* Activities List */}
            <div className='max-h-[600px] space-y-2 overflow-y-auto pr-2'>
              {sortedActivities.map((activity, index) => (
                <ActivityItem
                  key={activity.id}
                  activity={activity}
                  index={index}
                />
              ))}
            </div>

            {/* View More */}
            {activities.length > 20 && (
              <div className='border-t pt-4 text-center'>
                <p className='text-muted-foreground text-sm'>
                  عرض آخر 20 نشاط من أصل {activities.length} نشاط
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
