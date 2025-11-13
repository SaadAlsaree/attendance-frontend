import PageContainer from '@/components/layout/page-container';
import { organizationalService } from '@/features/organizational-unit/api/organizational.service';
import OrganizationalUnitViewPage from '@/features/organizational-unit/components/organizational-unit-view-page';
import { IOrganizationalUnitDetails } from '@/features/organizational-unit/types/organizational';
import React from 'react';

type pageProps = {
  params: Promise<{ id: string }>;
};

const page = async ({ params }: pageProps) => {
  const { id } = await params;

  const organization =
    await organizationalService.getOrganizationalUnitById(id);

  return (
    <div>
      <PageContainer>
        <div className='flex-1 space-y-4'>
          <OrganizationalUnitViewPage
            data={organization as unknown as IOrganizationalUnitDetails}
          />
        </div>
      </PageContainer>
    </div>
  );
};

export default page;
