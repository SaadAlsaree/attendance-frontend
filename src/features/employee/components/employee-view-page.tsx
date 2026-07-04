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
  Check,
  Printer
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
  empId: string;
  rfid: string;
  userId: string;
  fullName: string;
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
  weeklyShifts?: WeeklyShift[];
}

interface WeeklyShift {
  dayOfWeek: number; // 0=Sunday (الأحد) … 6=Saturday (السبت)
  shiftId: string;
  shiftName: string;
  startTime: string;
  endTime: string;
}

const WEEK_DAY_NAMES = [
  'الأحد',
  'الاثنين',
  'الثلاثاء',
  'الأربعاء',
  'الخميس',
  'الجمعة',
  'السبت'
];

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
      1: 'حضور',
      2: 'غياب',
      3: 'راحة',
      4: 'إجازة',
      5: 'عطلة',
      6: 'تأخير',
      7: 'انصراف مبكر',
      8: 'عمل إضافي',
      9: 'واجب',
      10: 'مستثنى',
      11: 'منسب',
      12: 'قيد المعالجة'
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
      case 1: // حضور
        return 'bg-green-100 text-green-800 border-green-200';
      case 2: // غياب
        return 'bg-red-100 text-red-800 border-red-200';
      case 3: // راحة
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 4: // إجازة
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 5: // عطلة
        return 'bg-teal-100 text-teal-800 border-teal-200';
      case 6: // تأخير
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 7: // انصراف مبكر
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 8: // عمل إضافي
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 9: // واجب
        return 'bg-cyan-100 text-cyan-800 border-cyan-200';
      case 10: // مستثنى
        return 'bg-slate-100 text-slate-800 border-slate-200';
      case 11: // منسب
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 12: // قيد المعالجة
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Print attendance data function
  const onPrintAttendance = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const printContent = `
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>طباعة بيانات الحضور - ${employee?.fullName}</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              padding: 20px;
              direction: rtl;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
              border-bottom: 2px solid #333;
              padding-bottom: 20px;
            }
            .header h1 {
              font-size: 24px;
              margin-bottom: 10px;
            }
            .employee-info {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 15px;
              margin-bottom: 30px;
              padding: 15px;
              background-color: #f5f5f5;
              border-radius: 8px;
            }
            .info-item {
              display: flex;
              justify-content: space-between;
            }
            .info-label {
              font-weight: bold;
              color: #666;
            }
            .info-value {
              color: #333;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
            }
            th, td {
              border: 1px solid #ddd;
              padding: 12px;
              text-align: right;
            }
            th {
              background-color: #4f46e5;
              color: white;
              font-weight: bold;
            }
            tr:nth-child(even) {
              background-color: #f9f9f9;
            }
            .status-badge {
              padding: 4px 8px;
              border-radius: 4px;
              font-size: 12px;
              display: inline-block;
            }
            .status-1 { background-color: #d1fae5; color: #065f46; }
            .status-2 { background-color: #fee2e2; color: #991b1b; }
            .status-3 { background-color: #dbeafe; color: #1e40af; }
            .status-4 { background-color: #e0e7ff; color: #3730a3; }
            .status-5 { background-color: #ccfbf1; color: #134e4a; }
            .status-6 { background-color: #fef3c7; color: #92400e; }
            .status-7 { background-color: #fed7aa; color: #9a3412; }
            .status-8 { background-color: #e9d5ff; color: #6b21a8; }
            .status-9 { background-color: #cffafe; color: #164e63; }
            .status-10 { background-color: #f1f5f9; color: #1e293b; }
            .status-11 { background-color: #fef3c7; color: #78350f; }
            .status-12 { background-color: #f3f4f6; color: #374151; }
            .footer {
              margin-top: 30px;
              text-align: center;
              font-size: 12px;
              color: #666;
              border-top: 1px solid #ddd;
              padding-top: 15px;
            }
            @media print {
              body {
                padding: 10px;
              }
              .no-print {
                display: none;
              }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>سجل الحضور والانصراف</h1>
            <p>${employee?.fullName}</p>
          </div>
          
          <div class="employee-info">
            <div class="info-item">
              <span class="info-label">الاسم الكامل:</span>
              <span class="info-value">${employee?.fullName || '-'}</span>
            </div>
           
            <div class="info-item">
              <span class="info-label">الجهة:</span>
              <span class="info-value">${employee?.organizationalUnitName || '-'}</span>
            </div>
            <div class="info-item">
              <span class="info-label">تاريخ الطباعة:</span>
              <span class="info-value">${moment().format('YYYY-MM-DD HH:mm')}</span>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>التاريخ</th>
                <th>اليوم</th>
                <th>وقت الحضور</th>
                <th>وقت الانصراف</th>
                <th>إجمالي الساعات</th>
                <th>الحالة</th>
                <th>ملاحظات</th>
              </tr>
            </thead>
            <tbody>
              ${(employee?.attendances || [])
                .map(
                  (attendance) => `
                <tr>
                  <td>${moment(attendance.date).format('YYYY-MM-DD')}</td>
                  <td>${getDayName(new Date(attendance.date).getDay() + 1)}</td>
                  <td>${
                    attendance.checkInTime
                      ? moment(attendance.checkInTime).format('hh:mm A')
                      : '-'
                  }</td>
                  <td>${
                    attendance.checkOutTime
                      ? moment(attendance.checkOutTime).format('hh:mm A')
                      : '-'
                  }</td>
                  <td>${formatWorkingHours(attendance.workingMinutes)}</td>
                  <td>
                    <span class="status-badge status-${attendance.status}">
                      ${getAttendanceStatusName(attendance.status)}
                    </span>
                  </td>
                  <td>${attendance.notes || '-'}</td>
                </tr>
              `
                )
                .join('')}
            </tbody>
          </table>

          <div class="footer">
            <p>تم إنشاء هذا التقرير في ${moment().format('YYYY-MM-DD HH:mm')}</p>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();

    // Wait for content to load then print
    setTimeout(() => {
      printWindow.print();
      printWindow.onafterprint = () => {
        printWindow.close();
      };
    }, 250);
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
                      <p className='text-sm text-gray-500'>
                        معرف الموظف من الجهاز
                      </p>
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={() =>
                          copyToClipboard(employee?.empId, 'empId')
                        }
                        className='h-6 w-6 p-0 hover:bg-gray-100'
                      >
                        {copiedField === 'empId' ? (
                          <Check className='h-3 w-3 text-green-600' />
                        ) : (
                          <Copy className='h-3 w-3 text-gray-500' />
                        )}
                      </Button>
                    </div>
                    <p className='font-medium'>{employee?.empId}</p>
                  </div>
                </div>

                <div className='flex items-center gap-3'>
                  <div className='flex h-8 w-8 items-center justify-center rounded-full bg-green-100'>
                    <Mail className='h-4 w-4 text-green-600' />
                  </div>
                  {/* <div>
                    <p className='text-sm text-gray-500'>البريد الإلكتروني</p>
                    <p className='font-medium'>{employee?.userLogin}</p>
                  </div> */}
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
                  <div>
                    <label className='text-sm font-medium text-gray-500'>
                      الدوام الثابت
                    </label>
                    {employee?.weeklyShifts?.length ? (
                      <div className='mt-1 space-y-1'>
                        {employee.weeklyShifts.map((day) => (
                          <p key={day.dayOfWeek} className='text-sm'>
                            <span className='inline-block w-20 font-medium'>
                              {WEEK_DAY_NAMES[day.dayOfWeek]}:
                            </span>
                            {day.shiftName} ({day.startTime.slice(0, 5)} -{' '}
                            {day.endTime.slice(0, 5)})
                          </p>
                        ))}
                      </div>
                    ) : (
                      <p className='mt-1 text-base font-medium'>غير محدد</p>
                    )}
                  </div>
                </div>
                <div className='space-y-4'>
                  {employee?.statusName && (
                    <div className='flex items-center gap-2'>
                      <label className='text-sm font-medium text-gray-500'>
                        حالة الحساب
                      </label>
                      <Badge className='border-green-200 bg-green-100 text-green-800'>
                        {employee?.statusName == 'Inactive' ? 'مفعل' : 'مفعل'}
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
          <div className='flex items-center justify-between'>
            <div>
              <CardTitle className='flex items-center gap-2'>
                <CalendarDays className='h-5 w-5' />
                سجل الحضور والانصراف
              </CardTitle>
              <CardDescription>
                عرض تفاصيل الحضور والانصراف للأسبوع الحالي
              </CardDescription>
            </div>
            <Button
              variant='outline'
              size='sm'
              onClick={onPrintAttendance}
              className='flex items-center gap-2'
            >
              <Printer className='h-4 w-4' />
              طباعة
            </Button>
          </div>
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
                      {moment(attendance.date).format('YYYY-MM-DD')}
                    </TableCell>
                    <TableCell>
                      {getDayName(new Date(attendance.date).getDay() + 1)}
                    </TableCell>
                    <TableCell
                      className={!attendance.checkInTime ? 'text-gray-400' : ''}
                    >
                      {attendance.checkInTime
                        ? moment(attendance.checkInTime).format('hh:mm A')
                        : '-'}
                    </TableCell>
                    <TableCell
                      className={
                        !attendance.checkOutTime ? 'text-gray-400' : ''
                      }
                    >
                      {attendance.checkOutTime
                        ? moment(attendance.checkOutTime).format('hh:mm A')
                        : '-'}
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
