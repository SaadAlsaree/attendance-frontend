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

  // تهيئة search params cache
  searchParamsCache.parse(searchParamsResolved);

  const searchQuery = searchParamsCache.get('employeeSearch');

  const shifts = await shiftService.getShiftsList({
    page: 1,
    pageSize: 100
  });

  // جلب الموظفين مع أو بدون بحث
  const employees = await employeeService.getEmployees({
    page: 1,
    pageSize: 50,
    ...(searchQuery && { searchTerm: searchQuery })
  });

  const employeesList = (employees?.data?.data || []) as EmployeeData[];
  const shiftsList = shifts?.data;
  const schedule = await scheduleService.getScheduleById(id);
  const scheduleDate = schedule?.data;

  console.log({
    searchQuery,
    totalEmployees: employees?.data?.totalCount || 0,
    employeesCount: employeesList.length
  });



  return (
    <PageContainer scrollable>
      <div className='flex-1 space-y-4'>
        <Suspense fallback={<FormCardSkeleton />}>
          <ScheduleForm
            initialData={scheduleDate}
            emploeesList={employeesList}
            shifts={shiftsList as unknown as ShiftData[]}
          />
        </Suspense>
      </div>
    </PageContainer>
  );
};

export default EditSchedulePage;
