'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Clock,
  Calendar,
  User,
  FileText,
  CheckCircle,
  XCircle,
  ArrowLeft,
  Edit
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { AllBadgeVariants } from '@/components/ui/badge-types';
import { LeaveItem, LeaveType } from '../types/leaves';
import {
  getLeaveTypeDisplayName,
  getStatusDisplayName,
  formatDateForDisplay,
  calculateLeaveDays,
  LEAVE_STATUS,
  isLeavePending,
  isLeaveApproved,
  isLeaveRejected
} from '../utils/leaves';
import moment from 'moment';

interface LeaveViewPageProps {
  data: LeaveItem;
}

export default function LeaveViewPage({ data }: LeaveViewPageProps) {
  const router = useRouter();

  // Helper function to determine leave type badge variant
  const getLeaveTypeVariant = (leaveType: LeaveType): AllBadgeVariants => {
    switch (leaveType) {
      case LeaveType.Ordinary:
        return 'blue';
      case LeaveType.Sick:
        return 'red';
      case LeaveType.Emergency:
        return 'orange';
      case LeaveType.Maternity:
        return 'blue';
      case LeaveType.TimeOff:
        return 'blue';
      case LeaveType.Hajj:
      case LeaveType.Umrah:
        return 'green';
      case LeaveType.Study:
        return 'yellow';
      case LeaveType.Unpaid:
        return 'gray';
      case LeaveType.Compensatory:
        return 'blue';
      default:
        return 'gray';
    }
  };

  // Helper function to determine status badge variant
  const getStatusVariant = (status: number): AllBadgeVariants => {
    switch (status) {
      case LEAVE_STATUS.PENDING:
        return 'yellow';
      case LEAVE_STATUS.APPROVED:
        return 'green';
      case LEAVE_STATUS.REJECTED:
        return 'red';
      case LEAVE_STATUS.CANCELLED:
        return 'gray';
      default:
        return 'gray';
    }
  };

  const leaveDuration = calculateLeaveDays(data.startDate, data.endDate);

  // Feature 08: a status (موقف) is editable only within 24h of being recorded.
  // Advisory client check; the backend (Leave.EditWindowExpired) is the source of truth.
  const withinEditWindow =
    !data.createdAt ||
    moment().diff(moment(data.createdAt), 'hours', true) <= 24;

  return (
    <div className='w-full space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>تفاصيل الموقف</h2>
          <p className='text-muted-foreground'>عرض تفاصيل الموقف للموظف</p>
        </div>
        <div className='flex items-center gap-2'>
          <Button variant='outline' onClick={() => router.back()}>
            <ArrowLeft className='mr-2 h-4 w-4' />
            رجوع
          </Button>
          {isLeavePending(data.status) && (
            <>
              <Button
                variant='default'
                disabled={!withinEditWindow}
                title={
                  withinEditWindow ? undefined : 'انتهت مدة التعديل لهذا الموقف'
                }
                onClick={() => router.push(`/leave/leaves/${data.id}/edit`)}
              >
                <Edit className='mr-2 h-4 w-4' />
                تعديل
              </Button>
            </>
          )}
        </div>
      </div>

      <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
        {/* Employee Information */}
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              معلومات الموظف
            </CardTitle>
            <User className='text-muted-foreground h-4 w-4' />
          </CardHeader>
          <CardContent>
            <div className='space-y-2'>
              <div className='flex items-center gap-2'>
                <span className='text-sm font-medium'>الاسم:</span>
                <span className='text-sm'>{data.fullName}</span>
              </div>
              <div className='flex items-center gap-2'>
                <span className='text-sm font-medium'>الرقم الوظيفي:</span>
                <span className='text-sm'>{data.code}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Leave Type */}
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>نوع الموقف</CardTitle>
            <FileText className='text-muted-foreground h-4 w-4' />
          </CardHeader>
          <CardContent>
            <Badge variant={getLeaveTypeVariant(data.leaveType)}>
              {getLeaveTypeDisplayName(data.leaveType)}
            </Badge>
          </CardContent>
        </Card>

        {/* Status */}
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>الحالة</CardTitle>
            <CheckCircle className='text-muted-foreground h-4 w-4' />
          </CardHeader>
          <CardContent>
            <Badge variant={getStatusVariant(data.status)}>
              {getStatusDisplayName(data.status)}
            </Badge>
          </CardContent>
        </Card>

        {/* Start Date */}
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>تاريخ البداية</CardTitle>
            <Calendar className='text-muted-foreground h-4 w-4' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {moment(data.startDate).format('YYYY/MM/DD')}
            </div>
            <p className='text-muted-foreground text-xs'>
              {formatDateForDisplay(data.startDate)}
            </p>
          </CardContent>
        </Card>

        {/* End Date */}
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>تاريخ النهاية</CardTitle>
            <Calendar className='text-muted-foreground h-4 w-4' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {moment(data.endDate).format('YYYY/MM/DD')}
            </div>
            <p className='text-muted-foreground text-xs'>
              {formatDateForDisplay(data.endDate)}
            </p>
          </CardContent>
        </Card>

        {/* Duration */}
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>المدة</CardTitle>
            <Clock className='text-muted-foreground h-4 w-4' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {leaveDuration.value}{' '}
              {leaveDuration.type === 'hours' ? 'ساعة' : 'يوم'}
            </div>
            <p className='text-muted-foreground text-xs'>
              من {moment(data.startDate).format('YYYY/MM/DD')} إلى{' '}
              {moment(data.endDate).format('YYYY/MM/DD')}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Reason */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <FileText className='h-5 w-5' />
            سبب الإجازة
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className='text-sm leading-relaxed'>{data.reason}</p>
        </CardContent>
      </Card>

      {/* Approval Information */}
      {(isLeaveApproved(data.status) || isLeaveRejected(data.status)) && (
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              {isLeaveApproved(data.status) ? (
                <CheckCircle className='h-5 w-5 text-green-600' />
              ) : (
                <XCircle className='h-5 w-5 text-red-600' />
              )}
              {isLeaveApproved(data.status)
                ? 'معلومات الموافقة'
                : 'معلومات الرفض'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid gap-4 md:grid-cols-2'>
              <div className='space-y-2'>
                <div className='flex items-center gap-2'>
                  <span className='text-sm font-medium'>تمت الموافقة من:</span>
                  <span className='text-sm'>
                    {data.approverName || 'غير محدد'}
                  </span>
                </div>
                {data.approvedAt && (
                  <div className='flex items-center gap-2'>
                    <span className='text-sm font-medium'>تاريخ الموافقة:</span>
                    <span className='text-sm'>
                      {formatDateForDisplay(data.approvedAt)}
                    </span>
                  </div>
                )}
              </div>
              {isLeaveRejected(data.status) && data.rejectionReason && (
                <div className='space-y-2'>
                  <div className='flex items-center gap-2'>
                    <span className='text-sm font-medium'>سبب الرفض:</span>
                    <span className='text-sm'>{data.rejectionReason}</span>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Timestamps */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Clock className='h-5 w-5' />
            التواريخ
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='grid gap-4 md:grid-cols-2'>
            <div className='space-y-2'>
              <div className='flex items-center gap-2'>
                <span className='text-sm font-medium'>تاريخ الإنشاء:</span>
                <span className='text-sm'>
                  {moment(data.createdAt).format('YYYY/MM/DD')}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      {isLeavePending(data.status) && (
        <Card>
          <CardHeader>
            <CardTitle>الإجراءات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='flex items-center gap-2'>
              <Button
                variant='default'
                onClick={() => router.push(`/leave/leaves/${data.id}/approve`)}
              >
                <CheckCircle className='mr-2 h-4 w-4' />
                موافقة
              </Button>
              <Button
                variant='destructive'
                onClick={() => router.push(`/leave/leaves/${data.id}/reject`)}
              >
                <XCircle className='mr-2 h-4 w-4' />
                رفض
              </Button>
              <Button
                variant='outline'
                onClick={() => router.push(`/leave/leaves/${data.id}/cancel`)}
              >
                <XCircle className='mr-2 h-4 w-4' />
                إلغاء
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
