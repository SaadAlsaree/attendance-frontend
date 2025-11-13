'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Clock,
  Calendar,
  CheckCircle,
  XCircle,
  Play,
  Square
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ShiftData } from '@/features/shift/types/shift';
import { formatTime, formatDate, getActiveStatusText } from '../utils/shift';

interface ShiftViewProps {
  data: ShiftData;
}

export default function ShiftViewPage({ data }: ShiftViewProps) {
  const router = useRouter();

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>تفاصيل المناوبة</h2>
          <p className='text-muted-foreground'>
            عرض تفاصيل المناوبة: {data.name}
          </p>
        </div>
        <Button onClick={() => router.push(`/schedule/shifts/${data.id}/edit`)}>
          تعديل المناوبة
        </Button>
      </div>

      <div className='grid gap-4 md:grid-cols-2'>
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Clock className='h-5 w-5' />
              معلومات المناوبة الأساسية
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <p className='text-muted-foreground text-sm font-medium'>
                  اسم المناوبة
                </p>
                <p className='text-sm'>{data.name}</p>
              </div>
              <div></div>
              <div>
                <p className='text-muted-foreground text-sm font-medium'>
                  نوع المناوبة
                </p>
                <Badge variant='outline'>{data.shiftTypeName}</Badge>
              </div>
              <div>
                <p className='text-muted-foreground text-sm font-medium'>
                  الحالة
                </p>
                <Badge variant={data.isActive ? 'default' : 'secondary'}>
                  {getActiveStatusText(data.isActive)}
                </Badge>
              </div>
            </div>
            {data.description && (
              <div>
                <p className='text-muted-foreground text-sm font-medium'>
                  الوصف
                </p>
                <p className='text-sm'>{data.description}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Play className='h-5 w-5' />
              أوقات المناوبة
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='grid grid-cols-2 gap-4'>
              <div className='flex items-center gap-2'>
                <Play className='h-4 w-4 text-green-600' />
                <div>
                  <p className='text-muted-foreground text-sm font-medium'>
                    وقت البداية
                  </p>
                  <p className='text-sm'>{formatTime(data.startTime)}</p>
                </div>
              </div>
              <div className='flex items-center gap-2'>
                <Square className='h-4 w-4 text-red-600' />
                <div>
                  <p className='text-muted-foreground text-sm font-medium'>
                    وقت النهاية
                  </p>
                  <p className='text-sm'>{formatTime(data.endTime)}</p>
                </div>
              </div>
            </div>
            <Separator />
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <p className='text-muted-foreground text-sm font-medium'>
                  فترة السماح
                </p>
                <p className='text-sm'>
                  {data.gracePeriodMinutes
                    ? `${data.gracePeriodMinutes} دقيقة`
                    : 'غير محدد'}
                </p>
              </div>
              <div>
                <p className='text-muted-foreground text-sm font-medium'>
                  أقصى تأخير مسموح
                </p>
                <p className='text-sm'>
                  {data.maxLateMinutes
                    ? `${data.maxLateMinutes} دقيقة`
                    : 'غير محدد'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <CheckCircle className='h-5 w-5' />
              إعدادات التسجيل
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='grid grid-cols-2 gap-4'>
              <div className='flex items-center gap-2'>
                {data.allowEarlyCheckIn ? (
                  <CheckCircle className='h-4 w-4 text-green-600' />
                ) : (
                  <XCircle className='h-4 w-4 text-red-600' />
                )}
                <div>
                  <p className='text-muted-foreground text-sm font-medium'>
                    التسجيل المبكر
                  </p>
                  <p className='text-sm'>
                    {data.allowEarlyCheckIn ? 'مسموح' : 'غير مسموح'}
                  </p>
                </div>
              </div>
              <div className='flex items-center gap-2'>
                {data.allowLateCheckOut ? (
                  <CheckCircle className='h-4 w-4 text-green-600' />
                ) : (
                  <XCircle className='h-4 w-4 text-red-600' />
                )}
                <div>
                  <p className='text-muted-foreground text-sm font-medium'>
                    التسجيل المتأخر
                  </p>
                  <p className='text-sm'>
                    {data.allowLateCheckOut ? 'مسموح' : 'غير مسموح'}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Calendar className='h-5 w-5' />
              معلومات إضافية
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <p className='text-muted-foreground text-sm font-medium'>
                  تاريخ الإنشاء
                </p>
                <p className='text-sm'>{formatDate(data.createdAt)}</p>
              </div>
              <div>
                <p className='text-muted-foreground text-sm font-medium'>
                  معرف المناوبة
                </p>
                <p className='font-mono text-sm'>{data.id}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
