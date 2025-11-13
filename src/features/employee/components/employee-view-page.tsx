'use client';

import React from 'react';
import moment from 'moment';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  Mail,
  User,
  Building,
  CalendarDays,
  CreditCard,
  Shield,
  Copy,
  Check
} from 'lucide-react';

// Types based on the provided data structure
interface AttendanceSchedule {
  id: string;
  startDate: string;
  endDate: string;
  scheduleType: number;
  isActive: boolean;
  notes: string;
  excludedDates: string[];
  exceptions: any[];
  scheduleDays: ScheduleDay[];
}

interface ScheduleDay {
  attendanceScheduleId: string;
  dayOfWeek: number;
  shiftId: string;
  isActive: boolean;
  notes: string;
}

interface Attendance {
  id: string;
  employeeId: number;
  organizationId: string;
  date: string;
  checkInTime: string | null;
  checkOutTime: string | null;
  status: number;
  shiftId: string;
  workingMinutes: number | null;
  breakMinutes: number | null;
  overtimeMinutes: number | null;
  lateMinutes: number | null;
  earlyLeaveMinutes: number | null;
  notes: string | null;
  checkInMethod: number;
  checkOutMethod: number | null;
}

interface EmployeeData {
  id: number;
  code: string;
  rfid: string;
  userId: string;
  fullName: string;
  email: string;
  organizationalUnitId: string;
  organizationalUnitName: string;
  managerId: string | null;
  managerName: string | null;
  isManager: boolean;
  createdAt: string;
  faceImageUrl: string;
  nationalIdFrontUrl: string;
  nationalIdBackUrl: string;
  profileImageUrl: string;
  status: number;
  statusName: string;
  totalWorkingDays: number;
  totalWorkingHours: number;
  lateDays: number;
  leaveDays: number;
  attendanceSchedules: AttendanceSchedule;
  attendances: Attendance[];
}

type Props = {
  employee: EmployeeData;
};

export default function EmployeeViewPage({ employee }: Props) {
  const [copiedField, setCopiedField] = React.useState<string | null>(null);

  // Copy to clipboard function
  const copyToClipboard = async (text: string, fieldName: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  // Helper function to get initials from name (safe)
  const getInitials = (name?: string | null) => {
    if (!name) return '';
    try {
      return name
        .split(' ')
        .map((word) => (word ? word.charAt(0) : ''))
        .join('')
        .toUpperCase()
        .slice(0, 2);
    } catch (err) {
      console.error('getInitials error:', err);
      return '';
    }
  };

  // Helper function to format date
  const formatDate = (dateString: string) => {
    return moment(dateString).format('YYYY-MM-DD');
  };

  // Helper function to format time
  const formatTime = (dateString: string | null) => {
    if (!dateString) return '-';
    return moment(dateString).format('HH:mm');
  };

  // Helper function to get day name from day of week
  const getDayName = (dayOfWeek: number): string => {
    const dayNames = {
      1: 'الأحد',
      2: 'الاثنين',
      3: 'الثلاثاء',
      4: 'الأربعاء',
      5: 'الخميس',
      6: 'الجمعة',
      7: 'السبت'
    };
    return dayNames[dayOfWeek as keyof typeof dayNames] || 'غير محدد';
  };

  // Helper function to get attendance status name
  const getAttendanceStatusName = (status: number): string => {
    const statusNames = {
      1: 'حضور كامل',
      2: 'تأخير بسيط',
      3: 'تأخير كبير',
      4: 'انصراف مبكر',
      5: 'غياب',
      6: 'تأخير',
      7: 'حضور مبكر'
    };
    return statusNames[status as keyof typeof statusNames] || 'غير محدد';
  };

  // Helper function to calculate total hours from minutes
  const formatWorkingHours = (minutes: number | null): string => {
    if (!minutes) return '0 ساعات';
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (hours === 0) {
      return `${remainingMinutes} دقيقة`;
    }
    return `${hours} ساعة ${remainingMinutes > 0 ? `و ${remainingMinutes} دقيقة` : ''}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Inactive':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'Suspended':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Terminated':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusBadgeColor = (status: number) => {
    switch (status) {
      case 1: // حضور كامل
        return 'bg-green-100 text-green-800 border-green-200';
      case 2: // تأخير بسيط
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 7: // حضور مبكر
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 6: // تأخير
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 5: // غياب
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className='flex w-full flex-col gap-6 p-4'>
      {/* Header Section */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold text-gray-900 dark:text-white'>
            ملف الموظف
          </h1>
          <p className='mt-1 text-gray-600 dark:text-gray-400'>
            عرض معلومات الموظف التفصيلية
          </p>
        </div>
        <div className='flex gap-2'></div>
      </div>

      <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
        {/* Employee Profile Card */}
        <div className='lg:col-span-1'>
          <Card className='h-fit'>
            <CardHeader className='pb-4 text-center'>
              <div className='mb-4 flex justify-center'>
                <Avatar className='h-24 w-24'>
                  <AvatarImage
                    src={employee?.faceImageUrl || employee?.profileImageUrl}
                    alt={employee?.fullName}
                  />
                  <AvatarFallback className='text-2xl font-semibold'>
                    {getInitials(employee?.fullName)}
                  </AvatarFallback>
                </Avatar>
              </div>
              <CardTitle className='space-y-6 text-xl'>
                {employee?.fullName}
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={() =>
                    copyToClipboard(employee?.fullName, 'headerFullName')
                  }
                  className='h-6 w-6 p-0 hover:bg-gray-100'
                >
                  {copiedField === 'headerFullName' ? (
                    <Check className='h-3 w-3 text-green-600' />
                  ) : (
                    <Copy className='h-3 w-3 text-gray-500' />
                  )}
                </Button>
              </CardTitle>
              <CardDescription className='text-base'>موظف</CardDescription>
              <div className='mt-3 flex justify-center gap-2'>
                {employee?.statusName && (
                  <Badge className={getStatusColor(employee?.statusName)}>
                    {employee?.statusName}
                  </Badge>
                )}
                {employee?.isManager && (
                  <Badge className='border-blue-200 bg-blue-100 text-blue-800'>
                    مدير
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='space-y-3'>
                <div className='flex items-center gap-3'>
                  <div className='flex h-8 w-8 items-center justify-center rounded-full bg-red-100'>
                    <User className='h-4 w-4 text-red-600' />
                  </div>
                  <div className='flex-1'>
                    <div className='flex items-center justify-between'>
                      <p className='text-sm text-gray-500'>معرف الموظف</p>
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={() =>
                          employee?.id &&
                          copyToClipboard(employee?.id.toString(), 'id')
                        }
                        className='h-6 w-6 p-0 hover:bg-gray-100'
                      >
                        {copiedField === 'id' ? (
                          <Check className='h-3 w-3 text-green-600' />
                        ) : (
                          <Copy className='h-3 w-3 text-gray-500' />
                        )}
                      </Button>
                    </div>
                    <p className='font-medium'>{employee?.id}</p>
                  </div>
                </div>

                <div className='flex items-center gap-3'>
                  <div className='flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100'>
                    <Shield className='h-4 w-4 text-indigo-600' />
                  </div>
                  <div className='flex-1'>
                    <div className='flex items-center justify-between'>
                      <p className='text-sm text-gray-500'>رقم RFID</p>
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={() => copyToClipboard(employee?.rfid, 'rfid')}
                        className='h-6 w-6 p-0 hover:bg-gray-100'
                      >
                        {copiedField === 'rfid' ? (
                          <Check className='h-3 w-3 text-green-600' />
                        ) : (
                          <Copy className='h-3 w-3 text-gray-500' />
                        )}
                      </Button>
                    </div>
                    <p className='font-medium'>{employee?.rfid}</p>
                  </div>
                </div>

                <div className='flex items-center gap-3'>
                  <div className='flex h-8 w-8 items-center justify-center rounded-full bg-blue-100'>
                    <CreditCard className='h-4 w-4 text-blue-600' />
                  </div>
                  <div className='flex-1'>
                    <div className='flex items-center justify-between'>
                      <p className='text-sm text-gray-500'>رقم الوظيفي</p>
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={() => copyToClipboard(employee?.code, 'code')}
                        className='h-6 w-6 p-0 hover:bg-gray-100'
                      >
                        {copiedField === 'code' ? (
                          <Check className='h-3 w-3 text-green-600' />
                        ) : (
                          <Copy className='h-3 w-3 text-gray-500' />
                        )}
                      </Button>
                    </div>
                    <p className='font-medium'>{employee?.code}</p>
                  </div>
                </div>

                <div className='flex items-center gap-3'>
                  <div className='flex h-8 w-8 items-center justify-center rounded-full bg-green-100'>
                    <Mail className='h-4 w-4 text-green-600' />
                  </div>
                  <div>
                    <p className='text-sm text-gray-500'>البريد الإلكتروني</p>
                    <p className='font-medium'>{employee?.email}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Employee Details */}
        <div className='space-y-6 lg:col-span-2'>
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <User className='h-5 w-5' />
                المعلومات الشخصية
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                <div className='space-y-4'>
                  <div>
                    <div className='flex items-center justify-between'>
                      <label className='text-sm font-medium text-gray-500'>
                        الاسم الكامل
                      </label>
                    </div>
                    <p className='mt-1 text-base font-medium'>
                      {employee?.fullName}
                    </p>
                  </div>
                </div>
                <div className='space-y-4'>
                  <div>
                    <label className='text-sm font-medium text-gray-500'>
                      المدير المباشر
                    </label>
                    <p className='mt-1 text-base font-medium'>
                      {employee?.managerName || 'غير محدد'}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Organizational Information */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Building className='h-5 w-5' />
                المعلومات الجهة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                <div className='space-y-4'>
                  <div>
                    <label className='text-sm font-medium text-gray-500'>
                      الجهة
                    </label>
                    <p className='mt-1 text-base font-medium'>
                      {employee?.organizationalUnitName}
                    </p>
                  </div>
                </div>
                <div className='space-y-4'>
                  {employee?.statusName && (
                    <div>
                      <label className='text-sm font-medium text-gray-500'>
                        حالة الحساب
                      </label>
                      <Badge className={getStatusColor(employee?.statusName)}>
                        {employee?.statusName}
                      </Badge>
                    </div>
                  )}
                  <div>
                    <label className='text-sm font-medium text-gray-500'>
                      تاريخ الإنشاء
                    </label>
                    <p className='mt-1 text-base font-medium'>
                      {formatDate(employee?.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Summary Statistics */}
      <div className='mt-6 grid grid-cols-1 gap-4 md:grid-cols-4'>
        <div className='rounded-lg bg-blue-50 p-4 text-center'>
          <p className='text-sm text-gray-600'>إجمالي أيام العمل</p>
          <p className='text-xl font-bold text-blue-600'>
            {employee?.totalWorkingDays} أيام
          </p>
        </div>
        <div className='rounded-lg bg-green-50 p-4 text-center'>
          <p className='text-sm text-gray-600'>إجمالي ساعات العمل</p>
          <p className='text-xl font-bold text-green-600'>
            {typeof employee?.totalWorkingHours === 'number'
              ? `${employee?.totalWorkingHours.toFixed(2)} ساعة`
              : '0 ساعة'}
          </p>
        </div>
        <div className='rounded-lg bg-yellow-50 p-4 text-center'>
          <p className='text-sm text-gray-600'>أيام التأخير</p>
          <p className='text-xl font-bold text-yellow-600'>
            {employee?.lateDays} أيام
          </p>
        </div>
        <div className='rounded-lg bg-gray-50 p-4 text-center'>
          <p className='text-sm text-gray-600'>أيام الإجازة</p>
          <p className='text-xl font-bold text-gray-600'>
            {employee?.leaveDays} أيام
          </p>
        </div>
      </div>
      {/* Schedule Log Table */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <CalendarDays className='h-5 w-5' />
            سجل الحضور والانصراف
          </CardTitle>
          <CardDescription>
            عرض تفاصيل الحضور والانصراف للأسبوع الحالي
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='rounded-md border'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>التاريخ</TableHead>
                  <TableHead>اليوم</TableHead>
                  <TableHead>وقت الحضور</TableHead>
                  <TableHead>وقت الانصراف</TableHead>
                  <TableHead>إجمالي الساعات</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead>ملاحظات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(employee?.attendances || []).map((attendance) => (
                  <TableRow key={attendance.id}>
                    <TableCell className='font-medium'>
                      {formatDate(attendance.date)}
                    </TableCell>
                    <TableCell>
                      {getDayName(new Date(attendance.date).getDay() + 1)}
                    </TableCell>
                    <TableCell
                      className={!attendance.checkInTime ? 'text-gray-400' : ''}
                    >
                      {formatTime(attendance.checkInTime)}
                    </TableCell>
                    <TableCell
                      className={
                        !attendance.checkOutTime ? 'text-gray-400' : ''
                      }
                    >
                      {formatTime(attendance.checkOutTime)}
                    </TableCell>
                    <TableCell
                      className={
                        !attendance.workingMinutes ? 'text-gray-400' : ''
                      }
                    >
                      {formatWorkingHours(attendance.workingMinutes)}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusBadgeColor(attendance.status)}>
                        {getAttendanceStatusName(attendance.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className='text-sm text-gray-600'>
                      {attendance.notes || '-'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
