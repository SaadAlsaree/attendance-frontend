import { reportsService } from '@/features/reports/api/reports.service';
import { getServerSession } from 'next-auth';
import authOption from '@/lib/auth-option';
import React from 'react';
import { usersPermissionsService } from '@/features/system/users-permissions/api/users-permissions.service';
import PageContainer from '@/components/layout/page-container';
import OrganizationalReportContainer from '@/features/reports/components/organizational-report/organizational-report-container';
import { OrganizationalReportResponse } from '@/features/reports/types/organization-report';
import { searchParamsCache } from '@/lib/searchparams';

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const OrganizationalReportPage = async ({ searchParams }: Props) => {
  // Get current user from server session
  const session = await getServerSession(authOption);

  if (!session?.user) {
    return <div>Not authenticated</div>;
  }

  const user = await usersPermissionsService.getCurrentUser();

  // Await searchParams and parse with nuqs
  const params = await searchParams;
  searchParamsCache.parse(params);

  // Get values from searchParamsCache
  const organizationalUnitIdParam = searchParamsCache.get('organizationalUnitId');
  const dateParam = searchParamsCache.get('date');
  const shiftIdParam = searchParamsCache.get('shiftId');
  const includeSubUnitsParam = searchParamsCache.get('includeSubUnits');
  const searchTermParam = searchParamsCache.get('searchTerm');
  const pageNumberParam = searchParamsCache.get('pageNumber');
  const pageSizeParam = searchParamsCache.get('pageSize');

  // Use URL params if provided, otherwise fall back to user's organizational unit
  const organizationalUnitId = organizationalUnitIdParam || user?.organizationalUnitId;
  const date = dateParam || undefined;
  const shiftId = shiftIdParam || undefined;
  const includeSubUnits = includeSubUnitsParam === 'false' ? false : true;
  const searchTerm = searchTermParam || undefined;
  const pageNumber = pageNumberParam || 1;
  const pageSize = pageSizeParam || 10;

  // Validate required field
  if (!organizationalUnitId) {
    return (
      <PageContainer>
        <div className='flex items-center justify-center p-8'>
          <p className='text-muted-foreground'>يرجى اختيار الجهة من الفلتر</p>
        </div>
      </PageContainer>
    );
  }

  const report = await reportsService.getOrganization({
    organizationalUnitId,
    date,
    shiftId,
    includeSubUnits,
    searchTerm,
    pageNumber,
    pageSize
  });

  return (
    <PageContainer>
      <OrganizationalReportContainer
        report={report as unknown as OrganizationalReportResponse}
      />
    </PageContainer>
  );
};

export default OrganizationalReportPage;
