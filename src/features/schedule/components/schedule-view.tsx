'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, User, FileText, CalendarDays, X } from 'lucide-react';
import {
  AttendanceScheduleResponse,
  formatDate,
  formatDateRange,
  getActiveStatusText,
  ScheduleTypeNames
} from '../index';
import { getDayName } from '@/utils/date.utils';

interface ScheduleViewProps {
  schedule: AttendanceScheduleResponse;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function ScheduleView({
  schedule,
  onEdit,
  onDelete
}: ScheduleViewProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    if (!onDelete) return;

    if (confirm('هل أنت متأكد من حذف هذا الجدول؟')) {
      setIsLoading(true);
      try {
        await onDelete();
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className='w-full space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold'>تفاصيل جدول الحضور</h1>
          <p className='text-muted-foreground'>عرض تفاصيل جدول الحضور للموظف</p>
        </div>
        <div className='flex space-x-2'>
          {onEdit && (
            <Button onClick={onEdit} variant='outline'>
              تعديل
            </Button>
          )}
          {onDelete && (
            <Button
              onClick={handleDelete}
              variant='destructive'
              disabled={isLoading}
            >
              {isLoading ? 'جاري الحذف...' : 'حذف'}
            </Button>
          )}
        </div>
      </div>

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Calendar className='h-5 w-5' />
            معلومات أساسية
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <div className='flex items-center gap-2'>
              <User className='text-muted-foreground h-4 w-4' />
              <div>
                <p className='text-sm font-medium'>الموظف</p>
                <p className='text-muted-foreground text-sm'>
                  {schedule.employeeName}
                </p>
              </div>
            </div>

            <div className='flex items-center gap-2'>
              <Calendar className='text-muted-foreground h-4 w-4' />
              <div>
                <p className='text-sm font-medium'>نوع الجدول</p>
                <p className='text-muted-foreground text-sm'>
                  {ScheduleTypeNames[schedule.scheduleType]}
                </p>
              </div>
            </div>

            <div className='flex items-center gap-2'>
              <Clock className='text-muted-foreground h-4 w-4' />
              <div>
                <p className='text-sm font-medium'>الفترة الزمنية</p>
                <p className='text-muted-foreground text-sm'>
                  {formatDateRange(schedule.startDate, schedule.endDate || '-')}
                </p>
              </div>
            </div>

            <div className='flex items-center gap-2'>
              <Badge variant={schedule.isActive ? 'default' : 'secondary'}>
                {getActiveStatusText(schedule.isActive)}
              </Badge>
            </div>
          </div>

          {schedule.notes && (
            <div className='flex items-start gap-2'>
              <FileText className='text-muted-foreground mt-0.5 h-4 w-4' />
              <div>
                <p className='text-sm font-medium'>ملاحظات</p>
                <p className='text-muted-foreground text-sm'>
                  {schedule.notes}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Schedule Days */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <CalendarDays className='h-5 w-5' />
            أيام الجدول
          </CardTitle>
          <CardDescription>
            تفاصيل المناوبات لكل يوم من أيام الأسبوع
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='space-y-3'>
            {schedule.scheduleDays.map((day) => (
              <div
                key={day.id}
                className='flex items-center justify-between rounded-lg border p-3'
              >
                <div className='flex items-center gap-4'>
                  <div className='flex items-center gap-2'>
                    <Badge variant='outline'>
                      {getDayName(day.scheduleDayDate)}
                    </Badge>
                    <Badge variant={day.isActive ? 'default' : 'secondary'}>
                      {day.isActive ? 'نشط' : 'غير نشط'}
                    </Badge>
                  </div>
                  <div>
                    <p className='font-medium'>{day.shiftName}</p>
                    {day.notes && (
                      <p className='text-muted-foreground text-sm'>
                        {day.notes}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Excluded Dates */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <X className='h-5 w-5' />
            التواريخ المستثناة
          </CardTitle>
          <CardDescription>التواريخ التي لا يطبق عليها الجدول</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='flex flex-wrap gap-2'>
            {schedule.excludedDates.length > 0 ? (
              schedule.excludedDates.map((date) => (
                <Badge key={date} variant='secondary'>
                 <div className='flex flex-col items-center gap-2'>
                 <p className='text-black font-medium text-sm'>{getDayName(date)}</p>
                 <p className='text-muted-foreground text-sm'>{formatDate(date)}</p>
                  </div>
                </Badge>
              ))
            ) : (
              <p className='text-muted-foreground text-sm'>
                لا توجد تواريخ مستثناة
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Metadata */}
      <Card>
        <CardHeader>
          <CardTitle>معلومات إضافية</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-1 gap-4 text-sm md:grid-cols-2'>
            <div>
              <p className='font-medium'>تاريخ الإنشاء</p>
              <p className='text-muted-foreground'>
                {formatDate(schedule.createdAt)}
              </p>
            </div>
            <div>
              <p className='font-medium'>آخر تحديث</p>
              <p className='text-muted-foreground'>
                {formatDate(schedule.lastUpdatedAt || '-')}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
