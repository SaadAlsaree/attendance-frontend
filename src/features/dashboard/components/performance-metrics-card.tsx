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
  Target,
  Clock,
  TrendingUp,
  Shield,
  CheckCircle,
  BarChart3
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface PerformanceMetrics {
  overallAttendanceRate: number;
  punctualityRate: number;
  productivityScore: number;
  employeeSatisfactionScore: number;
  systemUptime: number;
  dataAccuracyRate: number;
}

interface PerformanceMetricsCardProps {
  metrics: PerformanceMetrics | undefined;
  isLoading?: boolean;
}

interface MetricItemProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: 'green' | 'blue' | 'purple' | 'yellow' | 'red';
  description: string;
  target?: number;
}

const MetricItem: React.FC<MetricItemProps> = ({
  title,
  value,
  icon,
  color,
  description,
  target = 100
}) => {
  const getColor = (color: string, type: 'bg' | 'text' | 'border') => {
    const colors = {
      green: {
        bg: 'bg-green-50 dark:bg-green-950',
        text: 'text-green-600 dark:text-green-400',
        border: 'border-green-200 dark:border-green-800'
      },
      blue: {
        bg: 'bg-blue-50 dark:bg-blue-950',
        text: 'text-blue-600 dark:text-blue-400',
        border: 'border-blue-200 dark:border-blue-800'
      },
      purple: {
        bg: 'bg-purple-50 dark:bg-purple-950',
        text: 'text-purple-600 dark:text-purple-400',
        border: 'border-purple-200 dark:border-purple-800'
      },
      yellow: {
        bg: 'bg-yellow-50 dark:bg-yellow-950',
        text: 'text-yellow-600 dark:text-yellow-400',
        border: 'border-yellow-200 dark:border-yellow-800'
      },
      red: {
        bg: 'bg-red-50 dark:bg-red-950',
        text: 'text-red-600 dark:text-red-400',
        border: 'border-red-200 dark:border-red-800'
      }
    };
    return colors[color as keyof typeof colors][type];
  };

  const getPerformanceLevel = (value: number) => {
    if (value >= 90) return { label: 'ممتاز', variant: 'default' as const };
    if (value >= 75) return { label: 'جيد', variant: 'secondary' as const };
    if (value >= 60) return { label: 'مقبول', variant: 'outline' as const };
    return { label: 'يحتاج تحسين', variant: 'destructive' as const };
  };

  const performance = getPerformanceLevel(value);

  return (
    <div
      className={cn(
        'rounded-lg border p-4 transition-all duration-200 hover:shadow-md',
        getColor(color, 'bg'),
        getColor(color, 'border')
      )}
    >
      <div className='mb-3 flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <div className={cn('h-5 w-5', getColor(color, 'text'))}>{icon}</div>
          <h4 className='text-sm font-medium'>{title}</h4>
        </div>
        <Badge variant={performance.variant} className='text-xs'>
          {performance.label}
        </Badge>
      </div>

      <div className='space-y-2'>
        <div className='flex items-baseline gap-2'>
          <span className={cn('text-2xl font-bold', getColor(color, 'text'))}>
            {value.toFixed(1)}%
          </span>
          {target < 100 && (
            <span className='text-muted-foreground text-xs'>من {target}%</span>
          )}
        </div>

        <Progress value={value} className='h-2' />

        <p className='text-muted-foreground text-xs'>{description}</p>
      </div>
    </div>
  );
};

export function PerformanceMetricsCard({
  metrics,
  isLoading = false
}: PerformanceMetricsCardProps) {
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
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className='space-y-3 rounded-lg border p-4'>
                <div className='flex items-center justify-between'>
                  <Skeleton className='h-4 w-24' />
                  <Skeleton className='h-5 w-16' />
                </div>
                <Skeleton className='h-8 w-16' />
                <Skeleton className='h-2 w-full' />
                <Skeleton className='h-3 w-32' />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!metrics) {
    return (
      <Card className='w-full'>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Target className='h-5 w-5' />
            مؤشرات الأداء
          </CardTitle>
          <CardDescription>مؤشرات الأداء الرئيسية للنظام</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='text-muted-foreground flex h-[200px] items-center justify-center'>
            لا تتوفر بيانات مؤشرات الأداء
          </div>
        </CardContent>
      </Card>
    );
  }

  // Calculate overall performance score
  const overallScore =
    (metrics.overallAttendanceRate +
      metrics.punctualityRate +
      metrics.productivityScore +
      metrics.employeeSatisfactionScore +
      metrics.systemUptime +
      metrics.dataAccuracyRate) /
    6;

  const getOverallPerformanceColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

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
                <Target className='h-5 w-5' />
                مؤشرات الأداء
              </CardTitle>
              <CardDescription>
                مؤشرات الأداء الرئيسية للنظام والموظفين
              </CardDescription>
            </div>
            <div className='text-center'>
              <div
                className={cn(
                  'text-2xl font-bold',
                  getOverallPerformanceColor(overallScore)
                )}
              >
                {overallScore.toFixed(1)}%
              </div>
              <div className='text-muted-foreground text-xs'>
                النتيجة الإجمالية
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className='space-y-6'>
            {/* Overall Performance Bar */}
            <div className='bg-muted/50 rounded-lg p-4'>
              <div className='mb-2 flex items-center justify-between'>
                <span className='text-sm font-medium'>الأداء الإجمالي</span>
                <span
                  className={cn(
                    'text-sm font-bold',
                    getOverallPerformanceColor(overallScore)
                  )}
                >
                  {overallScore.toFixed(1)}%
                </span>
              </div>
              <Progress value={overallScore} className='h-3' />
            </div>

            {/* Metrics Grid */}
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <MetricItem
                  title='معدل الحضور'
                  value={metrics.overallAttendanceRate}
                  icon={<CheckCircle />}
                  color='green'
                  description='نسبة حضور الموظفين الإجمالية'
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <MetricItem
                  title='معدل الالتزام بالمواعيد'
                  value={metrics.punctualityRate}
                  icon={<Clock />}
                  color='blue'
                  description='نسبة الموظفين الملتزمين بمواعيد العمل'
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                <MetricItem
                  title='نتيجة الإنتاجية'
                  value={metrics.productivityScore}
                  icon={<TrendingUp />}
                  color='purple'
                  description='مؤشر الإنتاجية الإجمالي'
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.4 }}
              >
                <MetricItem
                  title='رضا الموظفين'
                  value={metrics.employeeSatisfactionScore}
                  icon={<BarChart3 />}
                  color='yellow'
                  description='مؤشر رضا الموظفين'
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.5 }}
              >
                <MetricItem
                  title='وقت تشغيل النظام'
                  value={metrics.systemUptime}
                  icon={<Shield />}
                  color='green'
                  description='نسبة وقت تشغيل النظام'
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.6 }}
              >
                <MetricItem
                  title='دقة البيانات'
                  value={metrics.dataAccuracyRate}
                  icon={<CheckCircle />}
                  color='blue'
                  description='معدل دقة البيانات المسجلة'
                />
              </motion.div>
            </div>

            {/* Performance Summary */}
            <div className='grid grid-cols-1 gap-4 border-t pt-4 md:grid-cols-3'>
              <div className='text-center'>
                <div className='text-lg font-bold text-green-600'>
                  {
                    [
                      metrics.overallAttendanceRate,
                      metrics.punctualityRate,
                      metrics.systemUptime
                    ].filter((v) => v >= 90).length
                  }
                </div>
                <div className='text-muted-foreground text-xs'>
                  مؤشرات ممتازة
                </div>
              </div>
              <div className='text-center'>
                <div className='text-lg font-bold text-yellow-600'>
                  {
                    [
                      metrics.overallAttendanceRate,
                      metrics.punctualityRate,
                      metrics.productivityScore,
                      metrics.employeeSatisfactionScore,
                      metrics.systemUptime,
                      metrics.dataAccuracyRate
                    ].filter((v) => v >= 75 && v < 90).length
                  }
                </div>
                <div className='text-muted-foreground text-xs'>مؤشرات جيدة</div>
              </div>
              <div className='text-center'>
                <div className='text-lg font-bold text-red-600'>
                  {
                    [
                      metrics.overallAttendanceRate,
                      metrics.punctualityRate,
                      metrics.productivityScore,
                      metrics.employeeSatisfactionScore,
                      metrics.systemUptime,
                      metrics.dataAccuracyRate
                    ].filter((v) => v < 75).length
                  }
                </div>
                <div className='text-muted-foreground text-xs'>تحتاج تحسين</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
