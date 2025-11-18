'use client';
import React, { useRef } from 'react';
import { OrganizationalReportResponse } from '../../types/organization-report';
import OrganizationalReportTable from './organizational-report-table';
import OrganizationalReportPrint from './organizational-report-print';
import OrganizationalReportFilter from './organizational-report-filter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Users,
  UserCheck,
  Calendar,
  AlertTriangle,
  Timer,
  TrendingUp,
  Building,
  Printer
} from 'lucide-react';
import { useReactToPrint } from 'react-to-print';
import moment from 'moment';
import 'moment/locale/ar';

// Set Arabic locale for moment
moment.locale('ar');

type Props = {
  report: OrganizationalReportResponse;
};

const OrganizationalReportContainer = ({ report }: Props) => {
  const printRef = useRef<HTMLDivElement>(null);

  const onPrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `تقرير الحضور اليومي - ${moment(report?.data?.date).format('DD-MM-YYYY')}`,
    onAfterPrint: () => {
      console.log('تم طباعة التقرير بنجاح');
    }
  });

  const formatDate = (date: string) => {
    return moment(date).format('dddd DD/MM/YYYY');
  };

  const getAttendancePercentage = () => {
    if (report?.data?.totalEmployees === 0) return 0;
    return Math.round(
      (report?.data?.totalAttendances / report?.data?.totalEmployees || 0) * 100
    );
  };

  const getLatePercentage = () => {
    if (report?.data?.totalAttendances === 0) return 0;
    return Math.round(
      (report?.data?.totalLate / report?.data?.totalAttendances) * 100
    );
  };

  const stats = [
    {
      title: 'إجمالي الموظفين',
      value: report?.data?.totalEmployees || 0,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      description: 'العدد الكلي للموظفين'
    },
    {
      title: 'الموظفين الحاضرين',
      value: report?.data?.totalAttendances || 0,
      icon: UserCheck,
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      description: `${getAttendancePercentage()}% من إجمالي الموظفين`
    },
    {
      title: 'الموظفين المتأخرين',
      value: report?.data?.totalLate || 0,
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
      description: `${getLatePercentage()}% من الحضور`
    },
    {
      title: 'موقف الاستثناءات',
      value: report?.data?.totalLeaves,
      icon: Calendar,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      description: 'إجمالي الاستثناءات اليوم'
    },
    {
      title: 'ساعات العمل الإضافي',
      value: report?.data?.totalOvertime,
      icon: Timer,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
      description: 'إجمالي الساعات الإضافية'
    }
  ];

  return (
    <div className='w-full space-y-6'>
      {/* Header Section */}
      <div className='flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between'>
        <div className='space-y-2'>
          <div className='flex items-center gap-2'>
            <Building className='text-primary h-6 w-6' />
            <h1 className='text-2xl font-bold'>التقرير الموقف اليومي</h1>
          </div>
          <div className='text-muted-foreground flex items-center gap-2'>
            <Calendar className='h-4 w-4' />
            <span className='text-sm'>{formatDate(report?.data?.date)}</span>
          </div>
        </div>

        <div className='flex items-center gap-2'>
          <OrganizationalReportFilter />
          <Button
            onClick={onPrint}
            variant='outline'
            size='sm'
            className='flex items-center gap-2'
          >
            <Printer className='h-4 w-4' />
            طباعة التقرير
          </Button>
          <Badge variant='outline' className='text-sm'>
            <TrendingUp className='mr-1 h-3 w-3' />
            تقرير يومي
          </Badge>
        </div>
      </div>

      <div className='flex flex-col gap-4'>
        {/* Statistics Cards */}
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5'>
          {stats.map((stat, index) => (
            <Card key={index} className='transition-shadow hover:shadow-md'>
              <CardContent className='p-4'>
                <div className='flex items-center gap-3'>
                  <div className={`rounded-lg p-2 ${stat.bgColor}`}>
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                  <div className='min-w-0 flex-1'>
                    <p className='text-muted-foreground truncate text-sm font-medium'>
                      {stat.title}
                    </p>
                    <p className='text-2xl font-bold'>{stat.value}</p>
                    <p className='text-muted-foreground truncate text-xs'>
                      {stat.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        {/* Detailed Report Table */}
        <OrganizationalReportTable report={report} />
      </div>

      {/* Summary Cards for Mobile */}
      <div className='space-y-4 lg:hidden'>
        <Card>
          <CardHeader className='pb-3'>
            <CardTitle className='flex items-center gap-2 text-lg'>
              <TrendingUp className='h-5 w-5' />
              ملخص الحضور
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-3'>
            <div className='grid grid-cols-2 gap-4'>
              <div className='rounded-lg bg-blue-50 p-3 text-center dark:bg-blue-900/20'>
                <div className='text-2xl font-bold text-blue-600'>
                  {report?.data?.totalEmployees || 0}
                </div>
                <div className='text-muted-foreground text-sm'>
                  إجمالي الموظفين
                </div>
              </div>
              <div className='rounded-lg bg-green-50 p-3 text-center dark:bg-green-900/20'>
                <div className='text-2xl font-bold text-green-600'>
                  {report?.data?.totalAttendances || 0}
                </div>
                <div className='text-muted-foreground text-sm'>الحضور</div>
              </div>
            </div>
            <div className='grid grid-cols-2 gap-4'>
              <div className='rounded-lg bg-red-50 p-3 text-center dark:bg-red-900/20'>
                <div className='text-2xl font-bold text-red-600'>
                  {report?.data?.totalLate || 0}
                </div>
                <div className='text-muted-foreground text-sm'>متأخرين</div>
              </div>
              <div className='rounded-lg bg-purple-50 p-3 text-center dark:bg-purple-900/20'>
                <div className='text-2xl font-bold text-purple-600'>
                  {report?.data?.totalLeaves}
                </div>
                <div className='text-muted-foreground text-sm'>أجازات</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Hidden Print Component */}
      <div style={{ display: 'none' }}>
        <OrganizationalReportPrint ref={printRef} report={report} />
      </div>
    </div>
  );
};

export default OrganizationalReportContainer;
