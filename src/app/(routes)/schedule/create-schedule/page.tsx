import React, { Suspense } from 'react';
import PageContainer from '@/components/layout/page-container';
import FormCardSkeleton from '@/components/form-card-skeleton';
import { SearchParams } from 'nuqs/server';

import { ScheduleForm } from '@/features/schedule';
import { employeeService } from '@/features/employee/api/employees.service';
import { EmployeeData } from '@/features/employee/types/employees';
import { shiftService } from '@/features/shift/api/shift.service';
import { ShiftData } from '@/features/shift';
import { searchParamsCache } from '@/lib/searchparams';
import { usersPermissionsService } from '@/features/system/users-permissions/api/users-permissions.service';
import Unauthorized from '@/components/auth/unauthorized';

export const metadata = {
  title: 'إضافة جدول دوام جديد',
  description: 'إضافة جدول دوام جديد'
};

type pageProps = {
  searchParams: Promise<SearchParams>;
};

const NewMailFilePage = async (props: pageProps) => {
  const searchParams = await props.searchParams;

  searchParamsCache.parse(searchParams);

  const searchTerm = searchParamsCache.get('searchTerm');

  // Admin-only: schedule creation is restricted to Admin (1) and SuperAdmin (8) — spec «للادمن فقط»
  const currentUser = await usersPermissionsService.getCurrentUser();
  if (currentUser?.role != 1 && currentUser?.role != 8) {
    return (
      <PageContainer>
        <Unauthorized />
      </PageContainer>
    );
  }

  const shifts = await shiftService.getShiftsList({
    page: 1,
    pageSize: 100
  });
  const shiftsList = shifts?.data;

  const employees = await employeeService.getEmployees({
    page: 1,
    pageSize: 100,
    searchTerm: searchTerm || undefined
  });
  const employeesList = employees?.data?.data as EmployeeData[];

  return (
    <PageContainer scrollable>
      <div className='flex-1 space-y-4'>
        <Suspense fallback={<FormCardSkeleton />}>
          <ScheduleForm
            initialData={null}
            employeeData={employeesList}
            shifts={shiftsList as unknown as ShiftData[]}
          />
        </Suspense>
      </div>
    </PageContainer>
  );
};

export default NewMailFilePage;
