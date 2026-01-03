import React, { Suspense } from 'react';
import PageContainer from '@/components/layout/page-container';
import FormCardSkeleton from '@/components/form-card-skeleton';
import { SearchParams } from 'nuqs/server';

import { ScheduleForm, scheduleService } from '@/features/schedule';
import { employeeService } from '@/features/employee/api/employees.service';
import { EmployeeData } from '@/features/employee/types/employees';
import { shiftService } from '@/features/shift/api/shift.service';
import { ShiftData } from '@/features/shift';
import { searchParamsCache } from '@/lib/searchparams';

export const metadata = {
  title: 'تعديل جدول دوام',
  description: 'تعديل جدول دوام'
};

type Props = {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<SearchParams>;
};

const EditSchedulePage = async ({ params, searchParams }: Props) => {
  const { id } = await params;
  const searchParamsResolved = await searchParams;

  searchParamsCache.parse(searchParamsResolved);

  const searchTerm = searchParamsCache.get('searchTerm');

  const shifts = await shiftService.getShiftsList({
    page: 1,
    pageSize: 100
  });

  const employees = await employeeService.getEmployees({
    page: 1,
    pageSize: 100,
    searchTerm: searchTerm || undefined
  });

  const employeesList = employees?.data?.data as EmployeeData[];
  const shiftsList = shifts?.data;
  const schedule = await scheduleService.getScheduleById(id);
  const scheduleDate = schedule?.data;



  return (
    <PageContainer scrollable>
      <div className='flex-1 space-y-4'>
        <Suspense fallback={<FormCardSkeleton />}>
          <ScheduleForm
            initialData={scheduleDate}
            employeeData={employeesList}
            shifts={shiftsList as unknown as ShiftData[]}
          />
        </Suspense>
      </div>
    </PageContainer>
  );
};

export default EditSchedulePage;
