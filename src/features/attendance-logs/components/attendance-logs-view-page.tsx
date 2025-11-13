'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Clock,
  User,
  ArrowRightLeft,
  CreditCard,
  Hash,
  Building
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { AllBadgeVariants } from '@/components/ui/badge-types';
import {
  AttendanceLogResponse,
  Direct,
  directName
} from '../types/attendance-logs';
import moment from 'moment';

interface AttendanceLogsViewPageProps {
  data: AttendanceLogResponse;
}

export default function AttendanceLogsViewPage({
  data
}: AttendanceLogsViewPageProps) {
  const router = useRouter();

  // Helper function to determine direct badge variant
  const getDirectVariant = (direct: Direct): AllBadgeVariants => {
    switch (direct) {
      case Direct.IN:
        return 'green';
      case Direct.OUT:
        return 'red';
      default:
        return 'gray';
    }
  };

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>
            تفاصيل سجل الحضور
          </h2>
          <p className='text-muted-foreground'>
            عرض تفاصيل سجل الحضور للموظف:{' '}
            {data.employee?.fullName || data.empName || 'غير محدد'}
          </p>
        </div>
        <div className='flex space-x-2'>
          <Button
            variant='outline'
            onClick={() => router.push('/attendance/attendance-logs')}
          >
            العودة للقائمة
          </Button>
        </div>
      </div>

      <div className='grid gap-4 md:grid-cols-2'>
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <User className='h-5 w-5' />
              معلومات الموظف
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <p className='text-muted-foreground text-sm font-medium'>
                  اسم الموظف
                </p>
                <p className='text-sm'>
                  {data.employee?.fullName || data.empName || 'غير محدد'}
                </p>
              </div>
              <div>
                <p className='text-muted-foreground text-sm font-medium'>
                  رقم الموظف
                </p>
                <p className='text-sm'>
                  {data.employee?.code || data.empID || 'غير محدد'}
                </p>
              </div>
              <div>
                <p className='text-muted-foreground text-sm font-medium'>
                  رقم البطاقة
                </p>
                <p className='font-mono text-sm'>{data.cardNo}</p>
              </div>
              <div>
                <p className='text-muted-foreground text-sm font-medium'>
                  RFID
                </p>
                <p className='font-mono text-sm'>
                  {data.employee?.rfid || data.cardNo || '-'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Building className='h-5 w-5' />
              الوحدة التنظيمية
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <p className='text-muted-foreground text-sm font-medium'>
                  اسم الوحدة
                </p>
                <p className='text-sm'>
                  {data.employee?.organizationalUnitName || 'غير محدد'}
                </p>
              </div>
              <div>
                <p className='text-muted-foreground text-sm font-medium'>
                  رمز الوحدة
                </p>
                <p className='text-sm'>
                  {data.employee?.organizationalUnitCode || 'غير محدد'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Clock className='h-5 w-5' />
              تفاصيل الحضور
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <p className='text-muted-foreground text-sm font-medium'>
                  تاريخ العمل
                </p>
                <p className='text-sm'>
                  {moment(data.dateWork).format('YYYY-MM-DD')}
                </p>
              </div>
              <div>
                <p className='text-muted-foreground text-sm font-medium'>
                  وقت الدخول/الخروج
                </p>
                <p className='font-mono text-sm'>
                  {moment(data.timeAttend, 'HH:mm:ss').format('hh:mm:ss A')}
                </p>
              </div>
              <div>
                <p className='text-muted-foreground text-sm font-medium'>
                  تاريخ ووقت الدخول/الخروج
                </p>
                <p className='font-mono text-sm'>
                  {moment(data.dateTimeAttend).format('YYYY-MM-DD hh:mm:ss A')}
                </p>
              </div>
              <div>
                <p className='text-muted-foreground text-sm font-medium'>
                  الدخول/الخروج
                </p>
                <Badge variant={getDirectVariant(data.direct)} size='sm'>
                  {directName[data.direct]}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <CreditCard className='h-5 w-5' />
              معلومات البطاقة
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <p className='text-muted-foreground text-sm font-medium'>
                  رقم البطاقة
                </p>
                <p className='font-mono text-sm'>{data.cardNo}</p>
              </div>
              <div>
                <p className='text-muted-foreground text-sm font-medium'>
                  RFID
                </p>
                <p className='font-mono text-sm'>
                  {data.employee?.rfid || data.cardNo || '-'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Hash className='h-5 w-5' />
              معلومات الجهاز
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <p className='text-muted-foreground text-sm font-medium'>
                  اسم الجهاز
                </p>
                <p className='text-sm'>{data.deviceName}</p>
              </div>
              <div>
                <p className='text-muted-foreground text-sm font-medium'>
                  رقم الجهاز
                </p>
                <p className='font-mono text-sm'>{data.deviceNo}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <ArrowRightLeft className='h-5 w-5' />
              معلومات إضافية
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <p className='text-muted-foreground text-sm font-medium'>
                  معرف الموظف
                </p>
                <p className='font-mono text-sm'>{data.empID}</p>
              </div>
              <div>
                <p className='text-muted-foreground text-sm font-medium'>
                  معرف الموظف (API)
                </p>
                <p className='font-mono text-sm'>{data.employee?.id || '-'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
