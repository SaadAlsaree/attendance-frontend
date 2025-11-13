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
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Bell,
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle,
  X,
  Clock
} from 'lucide-react';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { ar } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface Alert {
  id: string;
  alertType: string;
  title: string;
  message: string;
  severity: string;
  createdAt: string;
  isResolved: boolean;
  resolvedAt: string | null;
}

interface AlertsCardProps {
  alerts: Alert[] | undefined;
  isLoading?: boolean;
}

const AlertItem: React.FC<{ alert: Alert; index: number }> = ({
  alert,
  index
}) => {
  const getSeverityIcon = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical':
      case 'high':
        return <AlertTriangle className='h-4 w-4 text-red-500' />;
      case 'medium':
      case 'warning':
        return <AlertCircle className='h-4 w-4 text-yellow-500' />;
      case 'low':
      case 'info':
        return <Info className='h-4 w-4 text-blue-500' />;
      default:
        return <Bell className='h-4 w-4 text-gray-500' />;
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical':
      case 'high':
        return {
          variant: 'destructive' as const,
          label: 'عالية',
          color: 'bg-red-50 border-red-200'
        };
      case 'medium':
      case 'warning':
        return {
          variant: 'secondary' as const,
          label: 'متوسطة',
          color: 'bg-yellow-50 border-yellow-200'
        };
      case 'low':
      case 'info':
        return {
          variant: 'outline' as const,
          label: 'منخفضة',
          color: 'bg-blue-50 border-blue-200'
        };
      default:
        return {
          variant: 'outline' as const,
          label: severity,
          color: 'bg-gray-50 border-gray-200'
        };
    }
  };

  const severityBadge = getSeverityBadge(alert.severity);
  const timeAgo = formatDistanceToNow(parseISO(alert.createdAt), {
    addSuffix: true,
    locale: ar
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className={cn(
        'rounded-lg border p-4 transition-all duration-200 hover:shadow-md',
        severityBadge.color,
        alert.isResolved && 'opacity-60'
      )}
    >
      <div className='flex items-start gap-3'>
        <div className='mt-0.5 flex-shrink-0'>
          {alert.isResolved ? (
            <CheckCircle className='h-4 w-4 text-green-500' />
          ) : (
            getSeverityIcon(alert.severity)
          )}
        </div>

        <div className='min-w-0 flex-1 space-y-2'>
          <div className='flex items-center justify-between gap-2'>
            <h4 className='truncate text-sm font-medium'>{alert.title}</h4>
            <div className='flex items-center gap-2'>
              {alert.isResolved && (
                <Badge
                  variant='outline'
                  className='bg-green-50 text-xs text-green-700'
                >
                  تم الحل
                </Badge>
              )}
              <Badge variant={severityBadge.variant} className='text-xs'>
                {severityBadge.label}
              </Badge>
            </div>
          </div>

          <p className='text-muted-foreground text-sm'>{alert.message}</p>

          <div className='text-muted-foreground flex items-center justify-between text-xs'>
            <div className='flex items-center gap-1'>
              <Clock className='h-3 w-3' />
              <span>{timeAgo}</span>
            </div>
            <span className='bg-muted rounded px-2 py-1 text-xs'>
              {alert.alertType}
            </span>
          </div>

          {alert.isResolved && alert.resolvedAt && (
            <div className='text-xs text-green-600'>
              تم الحل{' '}
              {formatDistanceToNow(parseISO(alert.resolvedAt), {
                addSuffix: true,
                locale: ar
              })}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export function AlertsCard({ alerts, isLoading = false }: AlertsCardProps) {
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
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className='space-y-3 rounded-lg border p-4'>
                <div className='flex items-center justify-between'>
                  <Skeleton className='h-4 w-32' />
                  <div className='flex gap-2'>
                    <Skeleton className='h-5 w-16' />
                    <Skeleton className='h-5 w-12' />
                  </div>
                </div>
                <Skeleton className='h-4 w-full' />
                <div className='flex items-center justify-between'>
                  <Skeleton className='h-3 w-20' />
                  <Skeleton className='h-4 w-16' />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!alerts?.length) {
    return (
      <Card className='w-full'>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Bell className='h-5 w-5' />
            التنبيهات والإشعارات
          </CardTitle>
          <CardDescription>تنبيهات النظام والأنشطة المهمة</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='text-muted-foreground flex h-[200px] items-center justify-center'>
            <div className='space-y-2 text-center'>
              <CheckCircle className='mx-auto h-12 w-12 text-green-500' />
              <p>لا توجد تنبيهات جديدة</p>
              <p className='text-xs'>جميع التنبيهات تم التعامل معها</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Sort alerts by severity and creation date
  const sortedAlerts = [...alerts].sort((a, b) => {
    // First sort by resolution status (unresolved first)
    if (a.isResolved !== b.isResolved) {
      return a.isResolved ? 1 : -1;
    }

    // Then by severity
    const severityOrder = {
      critical: 4,
      high: 4,
      medium: 3,
      warning: 3,
      low: 2,
      info: 2
    };
    const severityA =
      severityOrder[a.severity.toLowerCase() as keyof typeof severityOrder] ||
      1;
    const severityB =
      severityOrder[b.severity.toLowerCase() as keyof typeof severityOrder] ||
      1;

    if (severityA !== severityB) {
      return severityB - severityA;
    }

    // Finally by creation date (newest first)
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  // Calculate alert stats
  const totalAlerts = alerts.length;
  const unresolvedAlerts = alerts.filter((a) => !a.isResolved).length;
  const criticalAlerts = alerts.filter(
    (a) =>
      ['critical', 'high'].includes(a.severity.toLowerCase()) && !a.isResolved
  ).length;
  const resolvedAlerts = alerts.filter((a) => a.isResolved).length;

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
                <Bell className='h-5 w-5' />
                التنبيهات والإشعارات
              </CardTitle>
              <CardDescription>
                {unresolvedAlerts} تنبيه غير محلول من أصل {totalAlerts}
              </CardDescription>
            </div>
            <div className='text-center'>
              <div
                className={cn(
                  'text-lg font-bold',
                  criticalAlerts > 0 ? 'text-red-600' : 'text-green-600'
                )}
              >
                {criticalAlerts}
              </div>
              <div className='text-muted-foreground text-xs'>
                عالية الأولوية
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className='space-y-6'>
            {/* Alert Stats */}
            <div className='bg-muted/50 grid grid-cols-4 gap-4 rounded-lg p-4'>
              <div className='text-center'>
                <div className='text-lg font-bold text-blue-600'>
                  {totalAlerts}
                </div>
                <div className='text-muted-foreground text-xs'>
                  إجمالي التنبيهات
                </div>
              </div>
              <div className='text-center'>
                <div className='text-lg font-bold text-red-600'>
                  {unresolvedAlerts}
                </div>
                <div className='text-muted-foreground text-xs'>غير محلولة</div>
              </div>
              <div className='text-center'>
                <div className='text-lg font-bold text-orange-600'>
                  {criticalAlerts}
                </div>
                <div className='text-muted-foreground text-xs'>
                  عالية الأولوية
                </div>
              </div>
              <div className='text-center'>
                <div className='text-lg font-bold text-green-600'>
                  {resolvedAlerts}
                </div>
                <div className='text-muted-foreground text-xs'>محلولة</div>
              </div>
            </div>

            {/* Critical Alerts Banner */}
            {criticalAlerts > 0 && (
              <div className='rounded-lg border border-red-200 bg-red-50 p-4 dark:bg-red-950'>
                <div className='flex items-center gap-2'>
                  <AlertTriangle className='h-5 w-5 text-red-600' />
                  <div>
                    <h4 className='font-medium text-red-800 dark:text-red-200'>
                      تنبيهات عالية الأولوية
                    </h4>
                    <p className='text-sm text-red-600 dark:text-red-300'>
                      يوجد {criticalAlerts} تنبيه عالي الأولوية يتطلب انتباهاً
                      فورياً
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Alerts List */}
            <div className='max-h-[600px] space-y-3 overflow-y-auto pr-2'>
              {sortedAlerts.map((alert, index) => (
                <AlertItem key={alert.id} alert={alert} index={index} />
              ))}
            </div>

            {/* Resolution Rate */}
            <div className='border-t pt-4'>
              <div className='flex items-center justify-between text-sm'>
                <span>معدل الحل:</span>
                <div className='flex items-center gap-2'>
                  <div className='font-bold text-green-600'>
                    {totalAlerts > 0
                      ? ((resolvedAlerts / totalAlerts) * 100).toFixed(1)
                      : 0}
                    %
                  </div>
                  <div className='text-muted-foreground text-xs'>
                    ({resolvedAlerts}/{totalAlerts})
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
