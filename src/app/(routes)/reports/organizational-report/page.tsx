import { reportsService } from '@/features/reports/api/reports.service';
import { getServerSession } from 'next-auth';
import authOption from '@/lib/auth-option';
import React from 'react';
import { usersPermissionsService } from '@/features/system/users-permissions/api/users-permissions.service';
import PageContainer from '@/components/layout/page-container';
import OrganizationalReportContainer from '@/features/reports/components/organizational-report/organizational-report-container';
import { OrganizationalReportResponse } from '@/features/reports/types/organization-report';

type Props = {
  searchParams: Promise<{
    organizationalUnitId: string;
    startDate: string;
    endDate: string;
    shiftId: string;
    includeSubUnits: boolean;
    searchTerm: string;
    page: string;
    pageSize: string;
  }>;
};

const OrganizationalReportPage = async ({ searchParams }: Props) => {
  // Get current user from server session
  const session = await getServerSession(authOption);

  if (!session?.user) {
    return <div>Not authenticated</div>;
  }

  const user = await usersPermissionsService.getCurrentUser();

  // Await searchParams before accessing its properties
  const params = await searchParams;

  const organizationalUnitId = user?.organizationalUnitId;
  const startDate = params.startDate ? params.startDate : undefined;
  const endDate = params.endDate ? params.endDate : undefined;
  const shiftId = params.shiftId ? params.shiftId : undefined;
  const includeSubUnits = true;
  const searchTerm = params.searchTerm ? params.searchTerm : undefined;
  const page = parseInt(params.page) || 1;
  const pageSize = parseInt(params.pageSize) || 1000;

  const report = await reportsService.getOrganization({
    organizationalUnitId,
    startDate,
    endDate,
    shiftId,
    includeSubUnits,
    searchTerm,
    page,
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
