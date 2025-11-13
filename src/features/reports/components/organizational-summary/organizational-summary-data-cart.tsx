import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  Search,
  MoreHorizontal,
  Building2,
  Users,
  UserCheck,
  UserX,
  Clock,
  CalendarDays,
  Timer,
  TrendingUp
} from 'lucide-react';
import { OrganizationalUnitSummary } from '../../types/organizational-summary';
import { useState, useMemo } from 'react';

type OrganizationalSummaryDataCartProps = {
  data: OrganizationalUnitSummary[];
};

const OrganizationalSummaryDataCart = ({
  data
}: OrganizationalSummaryDataCartProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = useMemo(() => {
    return data.filter(
      (unit) =>
        unit.unitName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        unit.unitCode.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [data, searchTerm]);

  const getAttendanceRate = (unit: OrganizationalUnitSummary) => {
    return unit.totalEmployees > 0
      ? ((unit.tottalAttendances / unit.totalEmployees) * 100).toFixed(1)
      : '0';
  };

  const getStatusColor = (rate: string) => {
    const numRate = parseFloat(rate);
    if (numRate >= 90)
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    if (numRate >= 75)
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
  };

  return (
    <div>
      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <CardTitle className='flex items-center gap-2'>
              <Building2 className='h-5 w-5' />
              تفاصيل الجهات
            </CardTitle>
            <Badge variant='secondary'>{filteredData.length} جهة</Badge>
          </div>
        </CardHeader>
        <CardContent>
          {/* شريط البحث */}
          <div className='mb-6'>
            <div className='relative'>
              <Search className='absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 transform text-gray-400' />
              <Input
                placeholder='البحث في الجهات...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='pr-10'
              />
            </div>
          </div>

          {/* عرض الكارتات */}
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
            {filteredData.map((unit) => {
              const attendanceRate = getAttendanceRate(unit);
              return (
                <Card
                  key={unit.unitId}
                  className='transition-shadow hover:shadow-md'
                >
                  <CardHeader className='pb-3'>
                    <div className='flex items-start justify-between'>
                      <div className='flex-1'>
                        <CardTitle className='text-lg font-semibold text-gray-900 dark:text-gray-100'>
                          {unit.unitName}
                        </CardTitle>
                        {unit.parentUnitName && (
                          <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
                            {unit.parentUnitName}
                          </p>
                        )}
                        <Badge variant='outline' className='mt-2'>
                          {unit.unitCode}
                        </Badge>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant='ghost' className='h-8 w-8 p-0'>
                            <MoreHorizontal className='h-4 w-4' />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align='end'>
                          <DropdownMenuLabel>الإجراءات</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>عرض التفاصيل</DropdownMenuItem>
                          <DropdownMenuItem>تصدير البيانات</DropdownMenuItem>
                          <DropdownMenuItem>طباعة التقرير</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent className='pt-0'>
                    <div className='space-y-4'>
                      {/* إجمالي الموظفين */}
                      <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-2'>
                          <Users className='h-4 w-4 text-blue-600' />
                          <span className='text-sm text-gray-600 dark:text-gray-400'>
                            إجمالي الموظفين
                          </span>
                        </div>
                        <span className='font-semibold text-gray-900 dark:text-gray-100'>
                          {unit.totalEmployees.toLocaleString('ar-EG')}
                        </span>
                      </div>

                      {/* الحضور */}
                      <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-2'>
                          <UserCheck className='h-4 w-4 text-green-600' />
                          <span className='text-sm text-gray-600 dark:text-gray-400'>
                            الحضور
                          </span>
                        </div>
                        <span className='font-semibold text-green-600'>
                          {unit.tottalAttendances.toLocaleString('ar-EG')}
                        </span>
                      </div>

                      {/* الغير مبصمين */}
                      <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-2'>
                          <UserX className='h-4 w-4 text-red-600' />
                          <span className='text-sm text-gray-600 dark:text-gray-400'>
                            الغير مبصمين
                          </span>
                        </div>
                        <span className='font-semibold text-red-600'>
                          {unit.tottalNotAttendances.toLocaleString('ar-EG')}
                        </span>
                      </div>

                      {/* التأخير */}
                      <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-2'>
                          <Clock className='h-4 w-4 text-yellow-600' />
                          <span className='text-sm text-gray-600 dark:text-gray-400'>
                            التأخير
                          </span>
                        </div>
                        <span className='font-semibold text-yellow-600'>
                          {unit.totalLate.toLocaleString('ar-EG')}
                        </span>
                      </div>

                      {/* الإجازات */}
                      <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-2'>
                          <CalendarDays className='h-4 w-4 text-purple-600' />
                          <span className='text-sm text-gray-600 dark:text-gray-400'>
                            الإجازات
                          </span>
                        </div>
                        <span className='font-semibold text-purple-600'>
                          {unit.totalLeaves.toLocaleString('ar-EG')}
                        </span>
                      </div>

                      {/* العمل الإضافي */}
                      <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-2'>
                          <Timer className='h-4 w-4 text-orange-600' />
                          <span className='text-sm text-gray-600 dark:text-gray-400'>
                            العمل الإضافي
                          </span>
                        </div>
                        <span className='font-semibold text-orange-600'>
                          {unit.totalOvertime.toLocaleString('ar-EG')}
                        </span>
                      </div>

                      {/* معدل الحضور */}
                      <div className='border-t border-gray-200 pt-3 dark:border-gray-700'>
                        <div className='flex items-center justify-between'>
                          <div className='flex items-center gap-2'>
                            <TrendingUp className='h-4 w-4 text-blue-600' />
                            <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                              معدل الحضور
                            </span>
                          </div>
                          <Badge className={getStatusColor(attendanceRate)}>
                            {attendanceRate}%
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {filteredData.length === 0 && (
            <div className='py-12 text-center text-gray-500 dark:text-gray-400'>
              <Building2 className='mx-auto mb-4 h-12 w-12 text-gray-300' />
              <p className='text-lg font-medium'>
                لا توجد وحدات تنظيمية تطابق البحث
              </p>
              <p className='mt-1 text-sm'>جرب تغيير كلمات البحث</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OrganizationalSummaryDataCart;
