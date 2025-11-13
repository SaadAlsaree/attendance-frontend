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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Trophy,
  Medal,
  Award,
  Star,
  Clock,
  UserCheck,
  Building2
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface TopPerformer {
  employeeId: string;
  employeeName: string;
  employeeNumber: string;
  department: string;
  attendanceRate: number;
  punctualityRate: number;
  averageWorkingHours: number;
  overtimeHours: number;
  lateCount: number;
  absentCount: number;
}

interface TopPerformersCardProps {
  performers: TopPerformer[] | undefined;
  isLoading?: boolean;
}

const PerformerCard: React.FC<{ performer: TopPerformer; rank: number }> = ({
  performer,
  rank
}) => {
  const getRankIcon = (rank: number) => {
    if (rank === 0) return <Trophy className='h-5 w-5 text-yellow-500' />;
    if (rank === 1) return <Medal className='h-5 w-5 text-gray-400' />;
    if (rank === 2) return <Award className='h-5 w-5 text-orange-500' />;
    return <Star className='h-4 w-4 text-blue-500' />;
  };

  const getRankBadge = (rank: number) => {
    if (rank === 0) return { label: '🥇 الأول', variant: 'default' as const };
    if (rank === 1)
      return { label: '🥈 الثاني', variant: 'secondary' as const };
    if (rank === 2) return { label: '🥉 الثالث', variant: 'outline' as const };
    return { label: `#${rank + 1}`, variant: 'outline' as const };
  };

  const rankBadge = getRankBadge(rank);
  const initials = performer.employeeName
    .split(' ')
    .map((name) => name.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: rank * 0.1 }}
      className={cn(
        'rounded-lg border p-4 transition-all duration-200 hover:shadow-md',
        rank === 0 &&
          'border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950',
        rank === 1 &&
          'border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950',
        rank === 2 &&
          'border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950',
        rank > 2 &&
          'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950'
      )}
    >
      <div className='mb-3 flex items-center gap-3'>
        <div className='flex items-center gap-2'>
          {getRankIcon(rank)}
          <Avatar className='h-8 w-8'>
            <AvatarImage src={`/avatars/${performer.employeeId}.jpg`} />
            <AvatarFallback className='text-xs'>{initials}</AvatarFallback>
          </Avatar>
        </div>
        <div className='min-w-0 flex-1'>
          <div className='flex items-center gap-2'>
            <h4 className='truncate text-sm font-medium'>
              {performer.employeeName}
            </h4>
            <Badge variant={rankBadge.variant} className='text-xs'>
              {rankBadge.label}
            </Badge>
          </div>
          <div className='text-muted-foreground flex items-center gap-2 text-xs'>
            <span>{performer.employeeNumber}</span>
            <span>•</span>
            <div className='flex items-center gap-1'>
              <Building2 className='h-3 w-3' />
              <span className='truncate'>{performer.department}</span>
            </div>
          </div>
        </div>
      </div>

      <div className='grid grid-cols-2 gap-3'>
        <div className='space-y-2'>
          <div className='flex items-center justify-between text-xs'>
            <span className='text-muted-foreground'>معدل الحضور</span>
            <span className='font-semibold text-green-600'>
              {performer.attendanceRate.toFixed(1)}%
            </span>
          </div>
          <div className='flex items-center justify-between text-xs'>
            <span className='text-muted-foreground'>الالتزام بالمواعيد</span>
            <span className='font-semibold text-blue-600'>
              {performer.punctualityRate.toFixed(1)}%
            </span>
          </div>
        </div>

        <div className='space-y-2'>
          <div className='flex items-center justify-between text-xs'>
            <span className='text-muted-foreground'>ساعات العمل</span>
            <span className='font-semibold'>
              {performer.averageWorkingHours.toFixed(1)}
            </span>
          </div>
          <div className='flex items-center justify-between text-xs'>
            <span className='text-muted-foreground'>ساعات إضافية</span>
            <span className='font-semibold text-purple-600'>
              {performer.overtimeHours.toFixed(1)}
            </span>
          </div>
        </div>
      </div>

      <div className='mt-3 flex items-center justify-between border-t pt-3 text-xs'>
        <div className='flex items-center gap-2'>
          <span className='text-muted-foreground'>تأخير:</span>
          <span
            className={cn(
              'font-medium',
              performer.lateCount === 0 ? 'text-green-600' : 'text-yellow-600'
            )}
          >
            {performer.lateCount}
          </span>
        </div>
        <div className='flex items-center gap-2'>
          <span className='text-muted-foreground'>غياب:</span>
          <span
            className={cn(
              'font-medium',
              performer.absentCount === 0 ? 'text-green-600' : 'text-red-600'
            )}
          >
            {performer.absentCount}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export function TopPerformersCard({
  performers,
  isLoading = false
}: TopPerformersCardProps) {
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
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className='space-y-3 rounded-lg border p-4'>
                <div className='flex items-center gap-3'>
                  <Skeleton className='h-5 w-5' />
                  <Skeleton className='h-8 w-8 rounded-full' />
                  <div className='flex-1 space-y-1'>
                    <Skeleton className='h-4 w-24' />
                    <Skeleton className='h-3 w-32' />
                  </div>
                  <Skeleton className='h-5 w-12' />
                </div>
                <div className='grid grid-cols-2 gap-3'>
                  <div className='space-y-2'>
                    <Skeleton className='h-3 w-full' />
                    <Skeleton className='h-3 w-full' />
                  </div>
                  <div className='space-y-2'>
                    <Skeleton className='h-3 w-full' />
                    <Skeleton className='h-3 w-full' />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!performers?.length) {
    return (
      <Card className='w-full'>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Trophy className='h-5 w-5' />
            أفضل الموظفين
          </CardTitle>
          <CardDescription>الموظفون المتميزون في الأداء</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='text-muted-foreground flex h-[200px] items-center justify-center'>
            لا تتوفر بيانات أفضل الموظفين
          </div>
        </CardContent>
      </Card>
    );
  }

  // Sort performers by attendance rate and punctuality
  const sortedPerformers = [...performers]
    .sort((a, b) => {
      const scoreA = (a.attendanceRate + a.punctualityRate) / 2;
      const scoreB = (b.attendanceRate + b.punctualityRate) / 2;
      return scoreB - scoreA;
    })
    .slice(0, 10); // Show top 10

  const averageAttendance =
    sortedPerformers.reduce((sum, p) => sum + p.attendanceRate, 0) /
    sortedPerformers.length;
  const averagePunctuality =
    sortedPerformers.reduce((sum, p) => sum + p.punctualityRate, 0) /
    sortedPerformers.length;
  const totalOvertimeHours = sortedPerformers.reduce(
    (sum, p) => sum + p.overtimeHours,
    0
  );

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
                <Trophy className='h-5 w-5' />
                أفضل الموظفين
              </CardTitle>
              <CardDescription>
                أفضل {sortedPerformers.length} موظف في الأداء
              </CardDescription>
            </div>
            <div className='text-center'>
              <div className='text-lg font-bold text-yellow-600'>
                {((averageAttendance + averagePunctuality) / 2).toFixed(1)}%
              </div>
              <div className='text-muted-foreground text-xs'>متوسط الأداء</div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className='space-y-6'>
            {/* Summary Stats */}
            <div className='bg-muted/50 grid grid-cols-3 gap-4 rounded-lg p-4'>
              <div className='text-center'>
                <div className='text-lg font-bold text-green-600'>
                  {averageAttendance.toFixed(1)}%
                </div>
                <div className='text-muted-foreground text-xs'>
                  متوسط الحضور
                </div>
              </div>
              <div className='text-center'>
                <div className='text-lg font-bold text-blue-600'>
                  {averagePunctuality.toFixed(1)}%
                </div>
                <div className='text-muted-foreground text-xs'>
                  متوسط الالتزام
                </div>
              </div>
              <div className='text-center'>
                <div className='text-lg font-bold text-purple-600'>
                  {totalOvertimeHours.toFixed(0)}
                </div>
                <div className='text-muted-foreground text-xs'>
                  إجمالي الساعات الإضافية
                </div>
              </div>
            </div>

            {/* Top Performers List */}
            <div className='max-h-[600px] space-y-3 overflow-y-auto pr-2'>
              {sortedPerformers.map((performer, index) => (
                <PerformerCard
                  key={performer.employeeId}
                  performer={performer}
                  rank={index}
                />
              ))}
            </div>

            {/* Additional Stats */}
            <div className='border-t pt-4'>
              <div className='grid grid-cols-1 gap-4 text-sm md:grid-cols-3'>
                <div className='text-center'>
                  <div className='text-lg font-bold text-green-600'>
                    {sortedPerformers.filter((p) => p.absentCount === 0).length}
                  </div>
                  <div className='text-muted-foreground text-xs'>بدون غياب</div>
                </div>
                <div className='text-center'>
                  <div className='text-lg font-bold text-blue-600'>
                    {sortedPerformers.filter((p) => p.lateCount === 0).length}
                  </div>
                  <div className='text-muted-foreground text-xs'>
                    بدون تأخير
                  </div>
                </div>
                <div className='text-center'>
                  <div className='text-lg font-bold text-purple-600'>
                    {sortedPerformers.filter((p) => p.overtimeHours > 0).length}
                  </div>
                  <div className='text-muted-foreground text-xs'>
                    مع ساعات إضافية
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
