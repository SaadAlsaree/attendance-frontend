'use client';
import React from 'react';
import { OrganizationalReportResponse } from '../../types/organization-report';
import moment from 'moment';
import 'moment/locale/ar';
// Importing a moment locale silently makes it the GLOBAL default, which breaks
// SSR hydration everywhere (server renders 'en' digits, client renders Arabic).
// Register it, then restore the default — all usages here call .locale('ar') explicitly.
moment.locale('en');

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
  BadgeTone,
  ReportRow,
  ReportStatusKey,
  StatusBadge,
  getRowStatusBadges,
  getUnitRows
} from './report-status-filters';
import { User, Calendar, Building, Hash, LogIn, LogOut, Timer } from 'lucide-react';

type Props = {
  report: OrganizationalReportResponse;
  status?: ReportStatusKey;
};

// Map a semantic status tone to one of the app's Badge variants.
const TONE_VARIANT: Record<BadgeTone, string> = {
  green: 'green-outline',
  red: 'red-outline',
  yellow: 'yellow-outline',
  gray: 'secondary',
  purple: 'outline'
};

const StatusBadges = ({ badges }: { badges: StatusBadge[] }) => (
  <div className='flex flex-wrap gap-1'>
    {badges.map((b, i) => (
      <Badge
        key={i}
        variant={TONE_VARIANT[b.tone] as any}
        className='text-xs'
      >
        {b.label}
      </Badge>
    ))}
  </div>
);

const OrganizationalReportTable = ({ report, status = 'all' }: Props) => {
  const formatTime = (time: string | null) =>
    time ? moment(time).locale('ar').format('hh:mm A') : '—';

  const formatDay = (date: string | null) =>
    date ? moment(date).locale('ar').format('dddd') : '—';

  const formatDate = (date: string | null) =>
    date ? moment(date).locale('ar').format('dddd DD/MM/YYYY') : '—';

  return (
    <div className='space-y-6'>
      {/* Desktop Table View */}
      <div className='hidden lg:block'>
        <div className='rounded-sm border'>
          {report?.data?.units?.map((unit) => {
            const rows = getUnitRows(unit, status, report?.data?.date);
            return (
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
                        <TableHead key={column.value} className={column.className}>
                          {column.label}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rows.length === 0 && (
                      <TableRow>
                        <TableCell
                          colSpan={columns.length}
                          className='text-muted-foreground py-6 text-center text-sm'
                        >
                          لا يوجد موظفون ضمن هذه الحالة
                        </TableCell>
                      </TableRow>
                    )}
                    {rows.map((row, index) => (
                      <TableRow key={row.key} className='hover:bg-muted/50'>
                        <TableCell className='text-muted-foreground'>
                          {index + 1}
                        </TableCell>
                        <TableCell>
                          <div className='flex items-center gap-2'>
                            <User className='h-4 w-4 text-blue-600' />
                            <div>
                              <div className='font-medium'>{row.employeeName}</div>
                              {row.employeeCode && (
                                <div className='text-muted-foreground flex items-center gap-1 text-sm'>
                                  <Hash className='h-3 w-3' />
                                  {row.employeeCode}
                                </div>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className='flex items-center gap-1'>
                            <Building className='text-muted-foreground h-3 w-3' />
                            {row.organizationalUnitName}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className='flex items-center gap-1'>
                            <Calendar className='text-muted-foreground h-3 w-3' />
                            {formatDay(row.date)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className='flex items-center gap-1'>
                            <LogIn className='h-3 w-3 text-green-600' />
                            {formatTime(row.checkInTime)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className='flex items-center gap-1'>
                            <LogOut className='h-3 w-3 text-red-600' />
                            {formatTime(row.checkOutTime)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <StatusBadges badges={getRowStatusBadges(row)} />
                        </TableCell>
                        <TableCell>
                          {row.overtimeDuration ? (
                            <div className='flex items-center gap-1'>
                              <Timer className='h-3 w-3 text-orange-600' />
                              {row.overtimeDuration}
                            </div>
                          ) : (
                            '—'
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile Card View */}
      <div className='space-y-4 lg:hidden'>
        <div className='mb-4 flex items-center gap-2'>
          <Building className='h-5 w-5' />
          <h2 className='text-lg font-semibold'>تقرير الحضور التنظيمي</h2>
        </div>

        {report?.data?.units?.map((unit) => {
          const rows = getUnitRows(unit, status, report?.data?.date);
          return (
            <React.Fragment key={unit.unitId}>
              {rows.length === 0 && (
                <Card>
                  <CardContent className='text-muted-foreground p-4 text-center text-sm'>
                    لا يوجد موظفون ضمن هذه الحالة
                  </CardContent>
                </Card>
              )}
              {rows.map((row, index) => (
                <Card key={row.key} className='transition-shadow hover:shadow-md'>
                  <CardContent className='space-y-4 p-4'>
                    <div className='flex items-start justify-between'>
                      <div className='flex items-center gap-3'>
                        <span className='text-muted-foreground text-sm font-medium'>
                          {index + 1}
                        </span>
                        <div className='rounded-full bg-blue-100 p-2 dark:bg-blue-900/20'>
                          <User className='h-4 w-4 text-blue-600' />
                        </div>
                        <div>
                          <h3 className='text-base font-semibold'>
                            {row.employeeName}
                          </h3>
                          {row.employeeCode && (
                            <div className='text-muted-foreground flex items-center gap-1 text-sm'>
                              <Hash className='h-3 w-3' />
                              {row.employeeCode}
                            </div>
                          )}
                        </div>
                      </div>
                      <StatusBadges badges={getRowStatusBadges(row)} />
                    </div>

                    <div className='flex items-center gap-2 text-sm'>
                      <Building className='text-muted-foreground h-4 w-4' />
                      <span className='text-muted-foreground'>الجهة:</span>
                      <span className='font-medium'>
                        {row.organizationalUnitName}
                      </span>
                    </div>

                    <div className='flex items-center gap-2 text-sm'>
                      <Calendar className='text-muted-foreground h-4 w-4' />
                      <span className='text-muted-foreground'>التاريخ:</span>
                      <span className='font-medium'>{formatDate(row.date)}</span>
                    </div>

                    {row.kind === 'employee' && (
                      <div className='grid grid-cols-2 gap-4'>
                        <div className='flex items-center gap-2 text-sm'>
                          <LogIn className='h-4 w-4 text-green-600' />
                          <div>
                            <div className='text-muted-foreground text-xs'>
                              وقت الدخول
                            </div>
                            <div className='font-medium'>
                              {formatTime(row.checkInTime)}
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
                              {formatTime(row.checkOutTime)}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {row.overtimeDuration && (
                      <Badge variant='outline' className='text-xs'>
                        <Timer className='mr-1 h-3 w-3' />
                        {row.overtimeDuration}
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              ))}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default OrganizationalReportTable;
