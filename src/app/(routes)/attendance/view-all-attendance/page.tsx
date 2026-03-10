import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
// import AttendanceActions from '@/features/attendance/components/attendance-actions';
import AttendanceListing from '@/features/attendance/components/attendance-listing';
import { usersPermissionsService } from '@/features/system/users-permissions/api/users-permissions.service';
import { Role } from '@/features/system/users-permissions/types/users-permissions';
import { searchParamsCache } from '@/lib/searchparams';
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
      
  const canAdd = hasAnyRole(data, [Role.Admin, Role.Manager, Role.Employee]);
      
      
  // redirect to home if user is not authorized
        if (!canAdd) {
            redirect('/');
        }
  

  // const employees = await employeeService.getEmployees({
  //   page: 1,
  //   pageSize: 100
  // });
  // const employeesList: EmployeeData[] = employees?.data?.data ?? [];

  searchParamsCache.parse(searchParams);
  return (
    <PageContainer scrollable={false}>
      <div className='flex flex-1 flex-col space-y-4'>
        <div className='flex items-start justify-between'>
          <Heading
            title='عرض جميع الحضور'
            description='إدارة وعرض جميع سجلات الحضور'
          />
          {/* <AttendanceActions employees={employeesList} /> */}
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
