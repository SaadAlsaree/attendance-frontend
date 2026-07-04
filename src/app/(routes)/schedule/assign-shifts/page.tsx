import React, { Suspense } from 'react';
import PageContainer from '@/components/layout/page-container';
import FormCardSkeleton from '@/components/form-card-skeleton';
import { SearchParams } from 'nuqs/server';

import Unauthorized from '@/components/auth/unauthorized';
import AssignWeeklyShiftsForm from '@/features/employee/components/assign-weekly-shifts-form';
import { employeeService } from '@/features/employee/api/employees.service';
import { EmployeeData } from '@/features/employee/types/employees';
import { shiftService } from '@/features/shift/api/shift.service';
import { ShiftData } from '@/features/shift/types/shift';
import { searchParamsCache } from '@/lib/searchparams';
import { usersPermissionsService } from '@/features/system/users-permissions/api/users-permissions.service';

export const metadata = {
  title: 'تثبيت الدوام',
  description: 'تثبيت دوام الموظف الأسبوعي'
};

type pageProps = {
  searchParams: Promise<SearchParams>;
};

const AssignShiftsPage = async (props: pageProps) => {
  const searchParams = await props.searchParams;

  searchParamsCache.parse(searchParams);

  const searchTerm = searchParamsCache.get('searchTerm');

  // Admin-only write screen (Admin = 1, SuperAdmin = 8) — matches the backend policy
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
    pageSize: 100,
    isActive: true
  });
  const shiftsList = (shifts?.data || []) as unknown as ShiftData[];

  // Employees are searched server-side (by full name OR code) via `searchTerm`,
  // same pattern as the schedule form.
  // NOTE: spread the key only when set — URLSearchParams would stringify an
  // `undefined` value into the literal text "undefined" and match nothing.
  const employees = await employeeService.getEmployees({
    page: 1,
    pageSize: 100,
    ...(searchTerm ? { searchTerm } : {})
  });
  const employeesList = (employees?.data?.data || []) as EmployeeData[];

  return (
    <PageContainer scrollable>
      <div className='flex-1 space-y-4'>
        <Suspense fallback={<FormCardSkeleton />}>
          <AssignWeeklyShiftsForm
            employees={employeesList}
            shifts={shiftsList}
          />
        </Suspense>
      </div>
    </PageContainer>
  );
};

export default AssignShiftsPage;
