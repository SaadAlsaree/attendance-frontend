import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import AttendanceActions from '@/features/attendance/components/attendance-actions';
import AttendanceListing from '@/features/attendance/components/attendance-listing';
import { employeeService } from '@/features/employee/api/employees.service';
import { EmployeeData } from '@/features/employee/types/employees';
import { usersPermissionsService } from '@/features/system/users-permissions/api/users-permissions.service';
import { Role } from '@/features/system/users-permissions/types/users-permissions';
import { searchParamsCache } from '@/lib/searchparams';
import { getBaghdadToday } from '@/lib/utils/date-utils';
import { hasAnyRole } from '@/utils/auth/auth-utils';
import { redirect } from 'next/navigation';
import { SearchParams } from 'nuqs/server';
import { Suspense } from 'react';

export const metadata = {
  title: 'عرض جميع الحضور'
};

type pageProps = {
  searchParams: Promise<SearchParams>;
};

const ViewAllAttendancePage = async (props: pageProps) => {
  const searchParams = await props.searchParams;
  
  const data = await usersPermissionsService.getCurrentUser();
      
  // View gate: monitoring roles (incl. view-only security officers) may view.
  const canView = hasAnyRole(data, [Role.Admin, Role.Manager, Role.Employee, Role.SecurityOfficer]);


  // redirect to home if user is not authorized
        if (!canView) {
            redirect('/');
        }
  

  // Manual check-in is a write action — admins only (devices remain the normal path)
  const canCheckIn = hasAnyRole(data, [Role.Admin]);

  let employeesList: EmployeeData[] = [];
  if (canCheckIn) {
    const employees = await employeeService.getEmployees({
      page: 1,
      pageSize: 100
    });
    employeesList = employees?.data?.data ?? [];
  }

  // Feature 04: on first open, pin the view to today's attendance and order by
  // earliest check-in. The `attendanceDefaultsApplied` marker is set after seeding so
  // that once the user clears the date (to browse other days) we never re-pin today.
  if (!searchParams.attendanceDefaultsApplied) {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(searchParams)) {
      if (value === undefined) continue;
      if (Array.isArray(value)) {
        value.forEach((v) => params.append(key, v));
      } else {
        params.set(key, value);
      }
    }
    if (!params.has('date')) params.set('date', getBaghdadToday());
    if (!params.has('sortBy')) params.set('sortBy', 'checkInTime');
    if (!params.has('sortOrder')) params.set('sortOrder', 'asc');
    params.set('page', '1');
    params.set('attendanceDefaultsApplied', '1');
    redirect(`/attendance/view-all-attendance?${params.toString()}`);
  }

  searchParamsCache.parse(searchParams);
  return (
    <PageContainer scrollable={false}>
      <div className='flex flex-1 flex-col space-y-4'>
        <div className='flex items-start justify-between'>
          <Heading
            title='عرض جميع الحضور'
            description='إدارة وعرض جميع سجلات الحضور'
          />
          {canCheckIn && <AttendanceActions employees={employeesList} />}
        </div>
        <Separator />

        <Suspense
          fallback={
            <DataTableSkeleton columnCount={8} rowCount={10} filterCount={3} />
          }
        >
          <AttendanceListing searchParams={searchParams} />
        </Suspense>
      </div>
    </PageContainer>
  );
};

export default ViewAllAttendancePage;
