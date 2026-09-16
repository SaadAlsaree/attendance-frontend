import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import { AttendanceLogsListing } from '@/features/attendance-logs';
import { searchParamsCache } from '@/lib/searchparams';
import { SearchParams } from 'nuqs/server';
import { Suspense } from 'react';
import { Role } from '@/features/system/users-permissions/types/users-permissions';
import { hasAnyRole } from '@/utils/auth/auth-utils';
import { redirect } from 'next/navigation';
import { usersPermissionsService } from '@/features/system/users-permissions/api/users-permissions.service';

type pageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function attendancelogsPage(props: pageProps) {
  const searchParams = await props.searchParams;

  searchParamsCache.parse(searchParams);

  // Explicit gate. The API scopes this screen's data per role, but without a check here the page
  // was reachable by direct URL for any authenticated user regardless of sidebar filtering.
  const currentUser = await usersPermissionsService.getCurrentUser();

  if (
    !hasAnyRole(currentUser, [
      Role.Admin,
      Role.SuperAdmin,
      Role.Manager,
      Role.Employee,
      Role.SecurityOfficer,
      Role.OrgSupervisor,
      Role.SiteSupervisor
    ])
  ) {
    redirect('/');
  }

  return (
    <PageContainer scrollable={false}>
      <div className='flex flex-1 flex-col space-y-4'>
        <div className='flex items-start justify-between'>
          <Heading
            title='عرض جميع الحضور'
            description='إدارة وعرض جميع سجلات الحضور'
          />
        </div>
        <Separator />

        <Suspense
          fallback={
            <DataTableSkeleton columnCount={8} rowCount={10} filterCount={3} />
          }
        >
          <AttendanceLogsListing />
        </Suspense>
      </div>
    </PageContainer>
  );
}
