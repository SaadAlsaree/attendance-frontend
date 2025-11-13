import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import {
  Users,
  UserCheck,
  UserX,
  Clock,
  CalendarDays,
  Timer
} from 'lucide-react';
import { OrganizationalSummaryResponse } from '../../types/organizational-summary';

type OrganizationalSummaryCardProps = {
  data: OrganizationalSummaryResponse;
};

const OrganizationalSummaryCard = ({
  data
}: OrganizationalSummaryCardProps) => {
  const { data: summaryData } = data;

  const stats = [
    {
      title: 'إجمالي الموظفين',
      value: summaryData.totaleEmployees,
      icon: Users,
      color: 'bg-blue-500',
      textColor: 'text-blue-200'
    },
    {
      title: 'الحضور',
      value: summaryData.tottalAttendances,
      icon: UserCheck,
      color: 'bg-green-500',
      textColor: 'text-green-200'
    },
    {
      title: 'الغير مبصمين',
      value: summaryData.tottalNotAttendances,
      icon: UserX,
      color: 'bg-red-500',
      textColor: 'text-red-200'
    },
    {
      title: 'التأخير',
      value: summaryData.totalLate,
      icon: Clock,
      color: 'bg-yellow-500',
      textColor: 'text-yellow-200'
    },
    {
      title: 'الإجازات',
      value: summaryData.totalLeaves,
      icon: CalendarDays,
      color: 'bg-purple-500',
      textColor: 'text-purple-200'
    },
    {
      title: 'العمل الإضافي',
      value: summaryData.totalOvertime,
      icon: Timer,
      color: 'bg-orange-500',
      textColor: 'text-orange-200'
    }
  ];

  const attendanceRate =
    summaryData.totaleEmployees > 0
      ? (
          (summaryData.tottalAttendances / summaryData.totaleEmployees) *
          100
        ).toFixed(1)
      : '0';

  return (
    <div className='space-y-6'>
      {/* الإحصائيات الرئيسية */}
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-6'>
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <Card key={index} className='transition-shadow hover:shadow-lg'>
              <CardContent className='p-6'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-sm font-medium text-gray-600 dark:text-gray-400'>
                      {stat.title}
                    </p>
                    <p className='mt-1 text-2xl font-bold text-gray-900 dark:text-gray-100'>
                      {stat.value.toLocaleString('ar-EG')}
                    </p>
                  </div>
                  <div
                    className={`rounded-full p-3 ${stat.color} bg-opacity-10`}
                  >
                    <IconComponent className={`h-6 w-6 ${stat.textColor}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* معدل الحضور */}
      {/* <Card className='bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950'>
        <CardContent className='p-6'>
          <div className='flex items-center justify-between'>
            <div>
              <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100'>
                معدل الحضور
              </h3>
              <p className='text-gray-600 dark:text-gray-400'>
                نسبة الموظفين الحاضرين من إجمالي الموظفين
              </p>
            </div>
            <div className='text-right'>
              <div className='text-3xl font-bold text-blue-600'>
                {attendanceRate}%
              </div>
              <div className='flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400'>
                <TrendingUp className='h-4 w-4' />
                <span>معدل الحضور</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card> */}
    </div>
  );
};

export default OrganizationalSummaryCard;
