'use client';

import React, { useRef } from 'react';
import moment from 'moment';
import 'moment/locale/ar';
import { useReactToPrint } from 'react-to-print';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Timer, Calendar, Printer } from 'lucide-react';
import { OvertimeReportResponse } from '../../types/overtime-report';
import OvertimeReportFilter from './overtime-report-filter';
import OvertimeReportTable from './overtime-report-table';
import OvertimeReportPrint from './overtime-report-print';

type Props = {
  report: OvertimeReportResponse | null;
};

const OvertimeReportContainer = ({ report }: Props) => {
  const printRef = useRef<HTMLDivElement>(null);

  const onPrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: 'تقرير العمل الإضافي'
  });

  const stats = report
    ? [
        {
          title: 'إجمالي ساعات العمل الإضافي',
          value: Number(report.statistics.totalOvertimeHours ?? 0).toFixed(2)
        },
        {
          title: 'موظفون لديهم إضافي',
          value: report.statistics.employeesWithOvertime ?? 0
        },
        {
          title: 'متوسط ساعات الإضافي',
          value: Number(report.statistics.averageOvertimeHours ?? 0).toFixed(2)
        }
      ]
    : [];

  return (
    <div className='w-full space-y-6'>
      {/* Header */}
      <div className='flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between'>
        <div className='space-y-2'>
          <div className='flex items-center gap-2'>
            <Timer className='text-primary h-6 w-6' />
            <h1 className='text-2xl font-bold'>تقرير العمل الإضافي</h1>
          </div>
          {report && (
            <div className='text-muted-foreground flex flex-wrap items-center gap-3 text-sm'>
              <span className='flex items-center gap-1'>
                <Calendar className='h-4 w-4' />
                {moment(report.startDate).locale('ar').format('DD/MM/YYYY')} -{' '}
                {moment(report.endDate).locale('ar').format('DD/MM/YYYY')}
              </span>
            </div>
          )}
        </div>

        <div className='flex items-center gap-2'>
          <OvertimeReportFilter />
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
              يرجى تحديد المدى الزمني (من - إلى) من الفلتر لعرض تقرير العمل الإضافي
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Statistics */}
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-3'>
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

          {/* Per-employee cumulative overtime table */}
          <OvertimeReportTable employees={report.employeeSummaries} />
        </>
      )}

      {/* Hidden print component */}
      {report && (
        <div style={{ display: 'none' }}>
          <OvertimeReportPrint ref={printRef} report={report} />
        </div>
      )}
    </div>
  );
};

export default OvertimeReportContainer;
