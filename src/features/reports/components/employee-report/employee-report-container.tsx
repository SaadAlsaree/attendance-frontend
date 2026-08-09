'use client';
import React, { useRef } from 'react';
import moment from 'moment';
import 'moment/locale/ar';
// Importing a moment locale silently makes it the GLOBAL default, which breaks
// SSR hydration everywhere (server renders 'en' digits, client renders Arabic).
// Register it, then restore the default — all usages here call .locale('ar') explicitly.
moment.locale('en');
import { useReactToPrint } from 'react-to-print';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table } from '@/components/ui/table';
import { User, Printer, Calendar } from 'lucide-react';
import { EmployeeReportData } from '../../types/employee-report';
import EmployeeReportFilter from './employee-report-filter';
import EmployeeReportPrint from './employee-report-print';

type Props = {
  report: EmployeeReportData | null;
};

const EmployeeReportContainer = ({ report }: Props) => {
  const printRef = useRef<HTMLDivElement>(null);

  const onPrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: report
      ? `تقرير موظف - ${report.employeeName}`
      : 'تقرير موظف'
  });

  const formatTime = (time: string | null) =>
    time ? moment(time).locale('ar').format('hh:mm A') : 'غير مبصم';

  const stats = report
    ? [
        { title: 'إجمالي الأيام', value: report.totalDays },
        { title: 'أيام الحضور', value: report.presentDays },
        { title: 'أيام الغياب', value: report.absentDays },
        { title: 'أيام التأخير', value: report.lateDays },
        { title: 'أيام الإجازة', value: report.leaveDays },
        { title: 'ساعات إضافية', value: report.totalOvertimeHours }
      ]
    : [];

  return (
    <div className='w-full space-y-6'>
      {/* Header */}
      <div className='flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between'>
        <div className='space-y-2'>
          <div className='flex items-center gap-2'>
            <User className='text-primary h-6 w-6' />
            <h1 className='text-2xl font-bold'>تقرير موظف</h1>
          </div>
          {report && (
            <div className='text-muted-foreground flex flex-wrap items-center gap-3 text-sm'>
              <span className='font-medium'>{report.employeeName}</span>
              {report.employeeCode && <span>({report.employeeCode})</span>}
              <span className='flex items-center gap-1'>
                <Calendar className='h-4 w-4' />
                {moment(report.fromDate).locale('ar').format('DD/MM/YYYY')} -{' '}
                {moment(report.toDate).locale('ar').format('DD/MM/YYYY')}
              </span>
            </div>
          )}
        </div>

        <div className='flex items-center gap-2'>
          <EmployeeReportFilter />
          <Button
            onClick={onPrint}
            variant='outline'
            size='sm'
            disabled={!report}
            className='flex items-center gap-2'
          >
            <Printer className='h-4 w-4' />
            طباعة التقرير
          </Button>
        </div>
      </div>

      {!report ? (
        <Card>
          <CardContent className='flex items-center justify-center p-10'>
            <p className='text-muted-foreground'>
              يرجى اختيار الموظف والمدى الزمني من الفلتر لعرض التقرير
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Statistics */}
          <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6'>
            {stats.map((stat, index) => (
              <Card key={index}>
                <CardContent className='p-4 text-center'>
                  <p className='text-muted-foreground text-xs font-medium'>
                    {stat.title}
                  </p>
                  <p className='text-2xl font-bold'>{stat.value}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Daily table */}
          <Card>
            <CardContent className='p-0'>
              <div className='overflow-x-auto'>
                <Table>
                  <thead>
                    <tr className='border-b text-sm'>
                      <th className='p-3 text-right'>اليوم</th>
                      <th className='p-3 text-right'>التاريخ</th>
                      <th className='p-3 text-center'>وقت الدخول</th>
                      <th className='p-3 text-center'>وقت الخروج</th>
                      <th className='p-3 text-center'>الحالة</th>
                      <th className='p-3 text-center'>تأخير (د)</th>
                      <th className='p-3 text-center'>انصراف مبكر (د)</th>
                      <th className='p-3 text-center'>إضافي (د)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.days.length === 0 ? (
                      <tr>
                        <td
                          colSpan={8}
                          className='text-muted-foreground p-6 text-center'
                        >
                          لا توجد سجلات ضمن المدى المحدد
                        </td>
                      </tr>
                    ) : (
                      report.days.map((day, index) => (
                        <tr key={index} className='border-b text-sm'>
                          <td className='p-3 text-right'>
                            {moment(day.date).locale('ar').format('dddd')}
                          </td>
                          <td className='p-3 text-right'>
                            {moment(day.date).locale('ar').format('DD/MM/YYYY')}
                          </td>
                          <td className='p-3 text-center'>
                            {formatTime(day.checkInTime)}
                          </td>
                          <td className='p-3 text-center'>
                            {formatTime(day.checkOutTime)}
                          </td>
                          <td className='p-3 text-center'>
                            <Badge variant='secondary'>{day.statusName}</Badge>
                          </td>
                          <td className='p-3 text-center'>
                            {day.lateMinutes || '-'}
                          </td>
                          <td className='p-3 text-center'>
                            {day.earlyLeaveMinutes || '-'}
                          </td>
                          <td className='p-3 text-center'>
                            {day.overtimeMinutes || '-'}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Hidden print component */}
      {report && (
        <div style={{ display: 'none' }}>
          <EmployeeReportPrint ref={printRef} report={report} />
        </div>
      )}
    </div>
  );
};

export default EmployeeReportContainer;
