'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Clock,
  Calendar,
  User,
  ClipboardCheck,
  ArrowRightLeft,
  FileText,
  History,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  AttendanceResponse,
  AttendanceStatus,
  AttendanceLog
} from '../types/attendance';
import {
  formatDate,
  formatTime,
  getStatusText,
  formatWorkingTime,
  getLogMethodText
} from '../utils/attendance';
import AttendanceApproveDialog from './attendnce-approve';
import { useCurrentUser } from '@/hooks/use-current-user';
import { canWrite } from '@/utils/auth/auth-utils';

interface AttendanceViewProps {
  data: AttendanceResponse;
}

export default function AttendanceViewPage({ data }: AttendanceViewProps) {
  const router = useRouter();
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const { user } = useCurrentUser();
  // View-only roles (e.g. security officers) see no write actions.
  const showWrite = canWrite(user);

  // Helper function to determine badge variant based on attendance status
  const getStatusVariant = (status: AttendanceStatus) => {
    switch (status) {
      case AttendanceStatus.Present:
        return 'green'; // أخضر للحضور
      case AttendanceStatus.Absent:
        return 'red'; // أحمر للغياب
      case AttendanceStatus.Late:
        return 'yellow'; // أصفر للتأخير
      case AttendanceStatus.Early_Out:
        return 'orange'; // برتقالي للانصراف المبكر
      case AttendanceStatus.Break:
        return 'blue'; // أزرق للراحة
      case AttendanceStatus.Vacation:
        return 'indigo'; // نيلي للإجازة
      case AttendanceStatus.Holiday:
        return 'teal'; // تركواز للعطلة
      case AttendanceStatus.Overtime:
        return 'purple'; // بنفسجي للعمل الإضافي
      case AttendanceStatus.Shift_Change:
        return 'gray-outline'; // رمادي محدد لتغيير المناوبة
      case AttendanceStatus.Shift_Swap:
        return 'blue-outline'; // أزرق محدد لتبديل المناوبة
      case AttendanceStatus.Shift_Swap_Request:
        return 'yellow-outline'; // أصفر محدد لطلب تبديل المناوبة
      case AttendanceStatus.Completed:
        return 'green-outline'; // أخضر محدد للمكتمل
      default:
        return 'gray'; // رمادي للحالات غير المعروفة
    }
  };

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>تفاصيل الحضور</h2>
          <p className='text-muted-foreground'>
            عرض تفاصيل الحضور للموظف: {data.fullName || 'غير محدد'}
          </p>
        </div>
        <div className='flex space-x-2'>
          {showWrite && !data.approvedBy && (
            <Button
              onClick={() => setApproveDialogOpen(true)}
              className='bg-green-600 hover:bg-green-700'
            >
              اعتماد الحضور
            </Button>
          )}
          {showWrite && (
            <Button
              onClick={() =>
                router.push(`/attendance/view-all-attendance/${data.id}/edit`)
              }
            >
              تعديل الحضور
            </Button>
          )}
          <Button
            variant='outline'
            onClick={() => router.push('/attendance/view-all-attendance')}
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
                <p className='text-sm'>{data.fullName || 'غير محدد'}</p>
              </div>
              <div>
                <p className='text-muted-foreground text-sm font-medium'>
                  رقم الوظيفي
                </p>
                <p className='text-sm'>{data.code || 'غير محدد'}</p>
              </div>
              <div>
                <p className='text-muted-foreground text-sm font-medium'>
                  المناوبة
                </p>
                <p className='text-sm'>{data.shiftName || 'غير محدد'}</p>
              </div>
              <div>
                <p className='text-muted-foreground text-sm font-medium'>
                  الحالة
                </p>
                <Badge variant={getStatusVariant(data.status) as any} size='md'>
                  {getStatusText(data.status)}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Clock className='h-5 w-5' />
              أوقات الحضور
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <p className='text-muted-foreground text-sm font-medium'>
                  التاريخ
                </p>
                <p className='text-sm'>{formatDate(data.date)}</p>
              </div>
              <div>
                <p className='text-muted-foreground text-sm font-medium'>
                  وقت الدخول
                </p>
                <p className='text-sm'>
                  {data.checkInTime ? formatTime(data.checkInTime) : 'لم يسجل'}
                </p>
              </div>
              <div>
                <p className='text-muted-foreground text-sm font-medium'>
                  وقت الخروج
                </p>
                <p className='text-sm'>
                  {data.checkOutTime
                    ? formatTime(data.checkOutTime)
                    : 'لم يسجل'}
                </p>
              </div>
              <div>
                <p className='text-muted-foreground text-sm font-medium'>
                  مدة العمل
                </p>
                <p className='text-sm'>
                  {data.workingMinutes
                    ? formatWorkingTime(data.workingMinutes)
                    : 'غير محدد'}
                </p>
              </div>
            </div>
            <Separator />
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <p className='text-muted-foreground text-sm font-medium'>
                  طريقة تسجيل الدخول
                </p>
                <p className='text-sm'>
                  {data.checkInMethod
                    ? getLogMethodText(data.checkInMethod)
                    : 'غير محدد'}
                </p>
              </div>
              <div>
                <p className='text-muted-foreground text-sm font-medium'>
                  طريقة تسجيل الخروج
                </p>
                <p className='text-sm'>
                  {data.checkOutMethod
                    ? getLogMethodText(data.checkOutMethod)
                    : 'غير محدد'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <ArrowRightLeft className='h-5 w-5' />
              تفاصيل الوقت
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <p className='text-muted-foreground text-sm font-medium'>
                  وقت العمل
                </p>
                <p className='text-sm'>
                  {data.workingMinutes
                    ? `${formatWorkingTime(data.workingMinutes)} ساعة`
                    : 'غير محدد'}
                </p>
              </div>
              <div>
                <p className='text-muted-foreground text-sm font-medium'>
                  وقت الراحة
                </p>
                <p className='text-sm'>
                  {data.breakMinutes
                    ? `${data.breakMinutes} دقيقة`
                    : 'غير محدد'}
                </p>
              </div>
              <div>
                <p className='text-muted-foreground text-sm font-medium'>
                  وقت إضافي
                </p>
                <p className='text-sm'>
                  {data.overtimeMinutes
                    ? `${data.overtimeMinutes} دقيقة`
                    : 'غير محدد'}
                </p>
              </div>
              <div>
                <p className='text-muted-foreground text-sm font-medium'>
                  وقت التأخير
                </p>
                <p className='text-sm'>
                  {data.lateMinutes ? `${data.lateMinutes} دقيقة` : 'غير محدد'}
                </p>
              </div>
              <div>
                <p className='text-muted-foreground text-sm font-medium'>
                  وقت الخروج المبكر
                </p>
                <p className='text-sm'>
                  {data.earlyLeaveMinutes
                    ? `${data.earlyLeaveMinutes} دقيقة`
                    : 'غير محدد'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <ClipboardCheck className='h-5 w-5' />
              معلومات الاعتماد
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <p className='text-muted-foreground text-sm font-medium'>
                  حالة الاعتماد
                </p>
                <Badge variant={data.approvedBy ? 'green' : 'gray'} size='md'>
                  {data.approvedBy ? 'معتمد' : 'غير معتمد'}
                </Badge>
              </div>
              {data.approvedBy && (
                <>
                  <div>
                    <p className='text-muted-foreground text-sm font-medium'>
                      تم الاعتماد بواسطة
                    </p>
                    <p className='text-sm'>
                      {data.approverName || data.approvedBy}
                    </p>
                  </div>
                  <div>
                    <p className='text-muted-foreground text-sm font-medium'>
                      تاريخ الاعتماد
                    </p>
                    <p className='text-sm'>
                      {data.approvedAt
                        ? formatDate(data.approvedAt)
                        : 'غير محدد'}
                    </p>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Attendance Logs */}
        {data.logs && data.logs.length > 0 && (
          <Card className='md:col-span-2'>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <History className='h-5 w-5' />
                سجلات الحضور
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                {data.logs.map((log: AttendanceLog) => (
                  <div
                    key={log.id}
                    className='flex items-center justify-between rounded-lg border p-4'
                  >
                    <div className='flex items-center gap-4'>
                      <div className='flex items-center gap-2'>
                        {log.isVerified ? (
                          <CheckCircle className='h-4 w-4 text-green-500' />
                        ) : (
                          <XCircle className='h-4 w-4 text-red-500' />
                        )}
                        <Badge
                          variant={log.isVerified ? 'green' : 'red'}
                          size='sm'
                        >
                          {log.isVerified ? 'متحقق' : 'غير متحقق'}
                        </Badge>
                      </div>
                      <div>
                        <p className='text-sm font-medium'>
                          {formatTime(log.timestamp)}
                        </p>
                        <p className='text-muted-foreground text-xs'>
                          {formatDate(log.timestamp)}
                        </p>
                      </div>
                      <div>
                        <p className='text-sm font-medium'>{log.methodName}</p>
                        <p className='text-muted-foreground text-xs'>
                          طريقة التسجيل
                        </p>
                      </div>
                    </div>
                    {log.notes && (
                      <div className='text-muted-foreground max-w-xs text-sm'>
                        {log.notes}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <Card className='md:col-span-2'>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <FileText className='h-5 w-5' />
              ملاحظات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-sm'>{data.notes || 'لا توجد ملاحظات'}</p>
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
                  تاريخ التحديث
                </p>
                <p className='text-sm'>
                  {data.updatedAt
                    ? formatDate(data.updatedAt)
                    : 'لم يتم التحديث'}
                </p>
              </div>
              <div>
                <p className='text-muted-foreground text-sm font-medium'>
                  معرف الحضور
                </p>
                <p className='font-mono text-sm'>{data.id}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dialogs */}
      <AttendanceApproveDialog
        isOpen={approveDialogOpen}
        onClose={() => setApproveDialogOpen(false)}
        attendance={data}
        onSuccess={() => {
          // Refresh the page or update the data
          router.refresh();
        }}
      />
    </div>
  );
}
