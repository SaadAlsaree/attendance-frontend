'use client';
import React from 'react';
import { OrganizationalReportResponse } from '../../types/organization-report';
import moment from 'moment';
import 'moment/locale/ar';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { columns } from './columns';
import {
  User,
  Clock,
  Calendar,
  Building,
  Hash,
  LogIn,
  LogOut,
  AlertTriangle,
  Timer
} from 'lucide-react';

// Set Arabic locale for moment
moment.locale('ar');

type Props = {
  report: OrganizationalReportResponse;
};

const OrganizationalReportTable = ({ report }: Props) => {
  const getStatusBadge = (employee: any) => {
    if (employee.isLate) {
      return (
        <Badge variant='destructive' className='text-xs'>
          متأخر
        </Badge>
      );
    }
    if (employee.isEarlyLeave) {
      return (
        <Badge variant='secondary' className='text-xs'>
          مبكر
        </Badge>
      );
    }
    return (
      <Badge variant='outline' className='text-xs'>
        عادي
      </Badge>
    );
  };

  const formatTime = (time: string) => {
    return moment(time).format('hh:mm A');
  };

  const formatDate = (date: string) => {
    return moment(date).format('dddd DD/MM/YYYY');
  };

  return (
    <div className='space-y-6'>
      {/* Desktop Table View */}
      <div className='hidden lg:block'>
        <div className='rounded-sm border'>
          {report?.data?.units?.map((unit) => (
            <div key={unit.unitId}>
              <div className='bg-muted flex items-center justify-between gap-2 p-2'>
                <div className='flex flex-col gap-2'>
                  <h3 className='text-sm font-medium'>{unit.unitName}</h3>
                  <p className='text-muted-foreground flex items-center gap-1 text-sm'>
                    <Badge variant='blue-outline' className='text-xs'>
                      {unit.totalEmployees}
                    </Badge>
                    إجمالي الموظفين
                  </p>
                  <p className='text-muted-foreground flex items-center gap-1 text-sm'>
                    <Badge variant='green-outline' className='text-xs'>
                      {unit.totalAttendances}
                    </Badge>
                    حضور
                  </p>
                  <span className='text-muted-foreground flex items-center gap-1 text-sm'>
                    <Badge variant='red-outline' className='text-xs'>
                      {unit.totalNotAttendances}
                    </Badge>
                    غير مبصم
                  </span>
                </div>
                <div className='flex flex-col gap-2'>
                  <p className='text-muted-foreground flex items-center gap-1 text-sm'>
                    <Badge variant='red-outline' className='text-xs'>
                      {unit.totalLate}
                    </Badge>
                    متأخر
                  </p>
                  <p className='text-muted-foreground flex items-center gap-1 text-sm'>
                    <Badge variant='yellow-outline' className='text-xs'>
                      {unit.totalLeaves}
                    </Badge>
                    أجازة
                  </p>
                  <p className='text-muted-foreground flex items-center gap-1 text-sm'>
                    <Badge variant='blue-outline' className='text-xs'>
                      {unit.totalShifts}
                    </Badge>
                    عدد المناوبات
                  </p>
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    {columns.map((column) => (
                      <TableHead
                        key={column.value}
                        className={column.className}
                      >
                        {column.label}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {unit?.employeeDetails?.map((employee) => (
                    <TableRow
                      key={employee.employeeId}
                      className='hover:bg-muted/50'
                    >
                      <TableCell>
                        <div className='flex items-center gap-2'>
                          <User className='h-4 w-4 text-blue-600' />
                          <div>
                            <div className='font-medium'>
                              {employee.employeeName}
                            </div>
                            <div className='text-muted-foreground flex items-center gap-1 text-sm'>
                              <Hash className='h-3 w-3' />
                              {employee.employeeCode}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className='flex items-center gap-1'>
                          <Building className='text-muted-foreground h-3 w-3' />
                          {employee.organizationalUnitName}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className='flex items-center gap-1'>
                          <Calendar className='text-muted-foreground h-3 w-3' />
                          {moment(employee.date).format('dddd')}
                        </div>
                      </TableCell>
                      {/* <TableCell>
                        {moment(employee.date).format('DD/MM/YYYY')}
                      </TableCell> */}
                      <TableCell>
                        <div className='flex items-center gap-1'>
                          <LogIn className='h-3 w-3 text-green-600' />
                          {formatTime(employee.checkInTime)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className='flex items-center gap-1'>
                          <LogOut className='h-3 w-3 text-red-600' />
                          {employee.checkOutTime
                            ? formatTime(employee.checkOutTime)
                            : 'غير مبصم'}
                        </div>
                      </TableCell>
                      <TableCell>
                        {employee.isLate && (
                          <Badge variant='destructive' className='text-xs'>
                            <AlertTriangle className='mr-1 h-3 w-3' />
                            متأخر
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {employee.isEarlyLeave && (
                          <Badge variant='secondary' className='text-xs'>
                            <Clock className='mr-1 h-3 w-3' />
                            مبكر
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {employee.overtimeDuration && (
                          <div className='flex items-center gap-1'>
                            <Timer className='h-3 w-3 text-orange-600' />
                            {employee.overtimeDuration}
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Card View */}
      <div className='space-y-4 lg:hidden'>
        <div className='mb-4 flex items-center gap-2'>
          <Building className='h-5 w-5' />
          <h2 className='text-lg font-semibold'>تقرير الحضور التنظيمي</h2>
        </div>

        {report?.data?.units?.map((unit) =>
          unit.employeeDetails.map((employee) => (
            <Card
              key={employee.employeeId}
              className='transition-shadow hover:shadow-md'
            >
              <CardContent className='p-4'>
                <div className='space-y-4'>
                  {/* Employee Info */}
                  <div className='flex items-start justify-between'>
                    <div className='flex items-center gap-3'>
                      <div className='rounded-full bg-blue-100 p-2 dark:bg-blue-900/20'>
                        <User className='h-4 w-4 text-blue-600' />
                      </div>
                      <div>
                        <h3 className='text-base font-semibold'>
                          {employee.employeeName}
                        </h3>
                        <div className='text-muted-foreground flex items-center gap-1 text-sm'>
                          <Hash className='h-3 w-3' />
                          {employee.employeeCode}
                        </div>
                      </div>
                    </div>
                    {getStatusBadge(employee)}
                  </div>

                  {/* Organizational Unit */}
                  <div className='flex items-center gap-2 text-sm'>
                    <Building className='text-muted-foreground h-4 w-4' />
                    <span className='text-muted-foreground'>الجهة:</span>
                    <span className='font-medium'>
                      {employee.organizationalUnitName}
                    </span>
                  </div>

                  {/* Date and Day */}
                  <div className='flex items-center gap-2 text-sm'>
                    <Calendar className='text-muted-foreground h-4 w-4' />
                    <span className='text-muted-foreground'>التاريخ:</span>
                    <span className='font-medium'>
                      {formatDate(employee.date)}
                    </span>
                  </div>

                  {/* Time Information */}
                  <div className='grid grid-cols-2 gap-4'>
                    <div className='flex items-center gap-2 text-sm'>
                      <LogIn className='h-4 w-4 text-green-600' />
                      <div>
                        <div className='text-muted-foreground text-xs'>
                          وقت الدخول
                        </div>
                        <div className='font-medium'>
                          {formatTime(employee.checkInTime)}
                        </div>
                      </div>
                    </div>
                    <div className='flex items-center gap-2 text-sm'>
                      <LogOut className='h-4 w-4 text-red-600' />
                      <div>
                        <div className='text-muted-foreground text-xs'>
                          وقت الخروج
                        </div>
                        <div className='font-medium'>
                          {employee.checkOutTime
                            ? formatTime(employee.checkOutTime)
                            : '-'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Status Indicators */}
                  <div className='flex flex-wrap gap-2'>
                    {employee.isLate && (
                      <Badge variant='destructive' className='text-xs'>
                        <AlertTriangle className='mr-1 h-3 w-3' />
                        متأخر
                      </Badge>
                    )}
                    {employee.isEarlyLeave && (
                      <Badge variant='secondary' className='text-xs'>
                        <Clock className='mr-1 h-3 w-3' />
                        مبكر
                      </Badge>
                    )}
                    {employee.overtimeDuration && (
                      <Badge variant='outline' className='text-xs'>
                        <Timer className='mr-1 h-3 w-3' />
                        {employee.overtimeDuration}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default OrganizationalReportTable;
