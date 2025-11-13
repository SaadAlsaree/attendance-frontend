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
  Monitor,
  MonitorCheck,
  MonitorX,
  Wifi,
  WifiOff,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Activity,
  Zap,
  Signal
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface DeviceStats {
  totalDevices: number;
  onlineDevices: number;
  offlineDevices: number;
  activeDevices: number;
  inactiveDevices: number;
  devicesWithIssues: number;
  uptimePercentage: number;
}

interface DeviceStatus {
  id: string;
  name: string;
  location: string;
  status: 'online' | 'offline' | 'warning' | 'error';
  lastSeen: string;
  batteryLevel?: number;
  signalStrength?: number;
}

interface DeviceStatusCardProps {
  deviceStats: DeviceStats | undefined;
  deviceStatuses: DeviceStatus[] | undefined;
  isLoading?: boolean;
}

const DeviceItem: React.FC<{ device: DeviceStatus; index: number }> = ({
  device,
  index
}) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
        return <CheckCircle className='h-4 w-4 text-green-500' />;
      case 'offline':
        return <XCircle className='h-4 w-4 text-red-500' />;
      case 'warning':
        return <AlertTriangle className='h-4 w-4 text-yellow-500' />;
      case 'error':
        return <XCircle className='h-4 w-4 text-red-500' />;
      default:
        return <Monitor className='h-4 w-4 text-gray-500' />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'online':
        return {
          variant: 'default' as const,
          label: 'متصل',
          color: 'bg-green-50 border-green-200'
        };
      case 'offline':
        return {
          variant: 'destructive' as const,
          label: 'غير متصل',
          color: 'bg-red-50 border-red-200'
        };
      case 'warning':
        return {
          variant: 'secondary' as const,
          label: 'تحذير',
          color: 'bg-yellow-50 border-yellow-200'
        };
      case 'error':
        return {
          variant: 'destructive' as const,
          label: 'خطأ',
          color: 'bg-red-50 border-red-200'
        };
      default:
        return {
          variant: 'outline' as const,
          label: 'غير معروف',
          color: 'bg-gray-50 border-gray-200'
        };
    }
  };

  const statusBadge = getStatusBadge(device.status);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className={cn(
        'rounded-lg border p-3 transition-all duration-200 hover:shadow-md',
        statusBadge.color
      )}
    >
      <div className='flex items-center gap-3'>
        <div className='flex-shrink-0'>{getStatusIcon(device.status)}</div>

        <div className='min-w-0 flex-1'>
          <div className='mb-1 flex items-center justify-between gap-2'>
            <h4 className='truncate text-sm font-medium'>{device.name}</h4>
            <Badge variant={statusBadge.variant} className='text-xs'>
              {statusBadge.label}
            </Badge>
          </div>

          <p className='text-muted-foreground mb-2 truncate text-xs'>
            📍 {device.location}
          </p>

          <div className='flex items-center gap-4 text-xs'>
            {device.batteryLevel !== undefined && (
              <div className='flex items-center gap-1'>
                <Zap className='h-3 w-3' />
                <span
                  className={cn(
                    device.batteryLevel > 20 ? 'text-green-600' : 'text-red-600'
                  )}
                >
                  {device.batteryLevel}%
                </span>
              </div>
            )}

            {device.signalStrength !== undefined && (
              <div className='flex items-center gap-1'>
                <Signal className='h-3 w-3' />
                <span
                  className={cn(
                    device.signalStrength > 70
                      ? 'text-green-600'
                      : device.signalStrength > 30
                        ? 'text-yellow-600'
                        : 'text-red-600'
                  )}
                >
                  {device.signalStrength}%
                </span>
              </div>
            )}

            <span className='text-muted-foreground'>{device.lastSeen}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export function DeviceStatusCard({
  deviceStats,
  deviceStatuses,
  isLoading = false
}: DeviceStatusCardProps) {
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
            <div className='grid grid-cols-2 gap-4'>
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className='space-y-2 text-center'>
                  <Skeleton className='mx-auto h-6 w-8' />
                  <Skeleton className='mx-auto h-3 w-16' />
                </div>
              ))}
            </div>
            <Skeleton className='h-2 w-full' />
            <div className='space-y-3'>
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className='rounded-lg border p-3'>
                  <div className='flex items-center gap-3'>
                    <Skeleton className='h-4 w-4' />
                    <div className='flex-1 space-y-2'>
                      <div className='flex items-center justify-between'>
                        <Skeleton className='h-4 w-24' />
                        <Skeleton className='h-5 w-16' />
                      </div>
                      <Skeleton className='h-3 w-32' />
                      <div className='flex gap-4'>
                        <Skeleton className='h-3 w-12' />
                        <Skeleton className='h-3 w-12' />
                        <Skeleton className='h-3 w-16' />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!deviceStats && !deviceStatuses?.length) {
    return (
      <Card className='w-full'>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Monitor className='h-5 w-5' />
            حالة الأجهزة
          </CardTitle>
          <CardDescription>حالة أجهزة الحضور والانصراف</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='text-muted-foreground flex h-[200px] items-center justify-center'>
            لا تتوفر بيانات الأجهزة
          </div>
        </CardContent>
      </Card>
    );
  }

  // Use default values if deviceStats is undefined
  const stats = deviceStats || {
    totalDevices: 0,
    onlineDevices: 0,
    offlineDevices: 0,
    activeDevices: 0,
    inactiveDevices: 0,
    devicesWithIssues: 0,
    uptimePercentage: 0
  };

  const uptimePercentage = stats.uptimePercentage || 0;
  const devices = deviceStatuses || [];

  // Sort devices by status priority (online first, then warning, then offline)
  const sortedDevices = [...devices].sort((a, b) => {
    const statusOrder = { online: 1, warning: 2, error: 3, offline: 4 };
    return (statusOrder[a.status] || 5) - (statusOrder[b.status] || 5);
  });

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
                <Monitor className='h-5 w-5' />
                حالة الأجهزة
              </CardTitle>
              <CardDescription>
                {stats.totalDevices} جهاز - {stats.onlineDevices} متصل
              </CardDescription>
            </div>
            <div className='text-center'>
              <div
                className={cn(
                  'text-lg font-bold',
                  uptimePercentage >= 95
                    ? 'text-green-600'
                    : uptimePercentage >= 80
                      ? 'text-yellow-600'
                      : 'text-red-600'
                )}
              >
                {uptimePercentage.toFixed(1)}%
              </div>
              <div className='text-muted-foreground text-xs'>وقت التشغيل</div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className='space-y-6'>
            {/* Device Stats Grid */}
            <div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
              <div className='space-y-2 text-center'>
                <div className='flex items-center justify-center gap-1'>
                  <MonitorCheck className='h-4 w-4 text-green-500' />
                  <span className='text-muted-foreground text-sm'>متصل</span>
                </div>
                <div className='text-xl font-bold text-green-600'>
                  {stats.onlineDevices}
                </div>
              </div>

              <div className='space-y-2 text-center'>
                <div className='flex items-center justify-center gap-1'>
                  <MonitorX className='h-4 w-4 text-red-500' />
                  <span className='text-muted-foreground text-sm'>
                    غير متصل
                  </span>
                </div>
                <div className='text-xl font-bold text-red-600'>
                  {stats.offlineDevices}
                </div>
              </div>

              <div className='space-y-2 text-center'>
                <div className='flex items-center justify-center gap-1'>
                  <Activity className='h-4 w-4 text-blue-500' />
                  <span className='text-muted-foreground text-sm'>نشط</span>
                </div>
                <div className='text-xl font-bold text-blue-600'>
                  {stats.activeDevices}
                </div>
              </div>

              <div className='space-y-2 text-center'>
                <div className='flex items-center justify-center gap-1'>
                  <AlertTriangle className='h-4 w-4 text-yellow-500' />
                  <span className='text-muted-foreground text-sm'>مشاكل</span>
                </div>
                <div className='text-xl font-bold text-yellow-600'>
                  {stats.devicesWithIssues}
                </div>
              </div>
            </div>

            {/* Uptime Progress */}
            <div className='space-y-2'>
              <div className='flex items-center justify-between'>
                <span className='text-sm font-medium'>
                  وقت التشغيل الإجمالي
                </span>
                <span
                  className={cn(
                    'text-sm font-bold',
                    uptimePercentage >= 95
                      ? 'text-green-600'
                      : uptimePercentage >= 80
                        ? 'text-yellow-600'
                        : 'text-red-600'
                  )}
                >
                  {uptimePercentage.toFixed(1)}%
                </span>
              </div>
              <Progress value={uptimePercentage} className='h-3' />
            </div>

            {/* Connectivity Status */}
            <div className='bg-muted/50 grid grid-cols-1 gap-4 rounded-lg p-4 md:grid-cols-2'>
              <div className='flex items-center gap-2'>
                <Wifi className='h-4 w-4 text-green-500' />
                <div>
                  <div className='text-sm font-medium'>الاتصال المستقر</div>
                  <div className='text-muted-foreground text-xs'>
                    {stats.onlineDevices} من {stats.totalDevices} أجهزة
                  </div>
                </div>
              </div>

              <div className='flex items-center gap-2'>
                <WifiOff className='h-4 w-4 text-red-500' />
                <div>
                  <div className='text-sm font-medium'>انقطاع الاتصال</div>
                  <div className='text-muted-foreground text-xs'>
                    {stats.offlineDevices} جهاز غير متصل
                  </div>
                </div>
              </div>
            </div>

            {/* Device List */}
            {devices.length > 0 && (
              <div className='space-y-3'>
                <h4 className='flex items-center gap-2 text-sm font-medium'>
                  <Monitor className='h-4 w-4' />
                  قائمة الأجهزة ({devices.length})
                </h4>
                <div className='max-h-[400px] space-y-2 overflow-y-auto pr-2'>
                  {sortedDevices.map((device, index) => (
                    <DeviceItem key={device.id} device={device} index={index} />
                  ))}
                </div>
              </div>
            )}

            {/* Health Summary */}
            <div className='border-t pt-4'>
              <div className='grid grid-cols-1 gap-4 text-sm md:grid-cols-3'>
                <div className='text-center'>
                  <div className='text-lg font-bold text-green-600'>
                    {stats.totalDevices > 0
                      ? (
                          (stats.onlineDevices / stats.totalDevices) *
                          100
                        ).toFixed(0)
                      : 0}
                    %
                  </div>
                  <div className='text-muted-foreground text-xs'>
                    معدل الاتصال
                  </div>
                </div>
                <div className='text-center'>
                  <div className='text-lg font-bold text-blue-600'>
                    {stats.totalDevices > 0
                      ? (
                          (stats.activeDevices / stats.totalDevices) *
                          100
                        ).toFixed(0)
                      : 0}
                    %
                  </div>
                  <div className='text-muted-foreground text-xs'>
                    معدل النشاط
                  </div>
                </div>
                <div className='text-center'>
                  <div className='text-lg font-bold text-red-600'>
                    {stats.totalDevices > 0
                      ? (
                          (stats.devicesWithIssues / stats.totalDevices) *
                          100
                        ).toFixed(0)
                      : 0}
                    %
                  </div>
                  <div className='text-muted-foreground text-xs'>
                    معدل المشاكل
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
