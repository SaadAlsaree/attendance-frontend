import PageContainer from '@/components/layout/page-container';

import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import { organizationalService } from '@/features/organizational-unit/api/organizational.service';
import { reportsService } from '@/features/reports/api/reports.service';
import OrganizationalSummary from '@/features/reports/components/organizational-summary/organizational-summary';
import {
  OrganizationalSummaryResponse,
  OrganizationalSummaryQuery
} from '@/features/reports/types/organizational-summary';
import React, { Suspense } from 'react';

export const metadata = {
  title: 'تقرير الموظفين',
  description: 'تقرير الموظفين'
};

type OrganizationalSummaryPageProps = {
  searchParams: Promise<OrganizationalSummaryQuery>;
};

const OrganizationalSummaryPage = async ({
  searchParams
}: OrganizationalSummaryPageProps) => {
  const params = await searchParams;

  const date = params.date ? new Date(params.date) : new Date();
  const organizationalUnitId = params.organizationalUnitId
    ? params.organizationalUnitId
    : undefined;
  const includeSubUnits = params.includeSubUnits ?? true;

  const response = await reportsService.getOrganizationalSummary({
    organizationalUnitId,
    includeSubUnits,
    date: date.toISOString()
  });

  const organization = await organizationalService.getOrganizationalUnits();

  const organizationList = organization?.data || [];

  return (
    <PageContainer scrollable={true}>
      <div className='flex flex-1 flex-col space-y-4 pb-8'>
        <Suspense
          fallback={
            <DataTableSkeleton columnCount={2} rowCount={8} filterCount={3} />
          }
        >
          <OrganizationalSummary
            data={response as unknown as OrganizationalSummaryResponse}
            organization={organizationList}
          />
        </Suspense>
      </div>
    </PageContainer>
  );
};

export default OrganizationalSummaryPage;
