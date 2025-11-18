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
import { setToStartOfDayUTC } from '@/lib/utils/date-utils';

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

  // Normalize date to start of day in UTC
  const date = params.date
    ? setToStartOfDayUTC(new Date(params.date))
    : setToStartOfDayUTC(new Date());
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

  // console.log(organizationList);

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
