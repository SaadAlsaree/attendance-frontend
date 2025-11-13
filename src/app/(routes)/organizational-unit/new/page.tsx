import PageContainer from '@/components/layout/page-container';
import { organizationalService } from '@/features/organizational-unit/api/organizational.service';
import OrganizationalUnitForm from '@/features/organizational-unit/components/organizational-unit-form';
import { IOrganizationalUnitList } from '@/features/organizational-unit/types/organizational';
import React from 'react';

const page = async () => {
  const organizationalUnits =
    await organizationalService.getOrganizationalUnits();

  const organizationalUnitsList = (organizationalUnits?.data ||
    []) as IOrganizationalUnitList[];

  return (
    <PageContainer>
      <OrganizationalUnitForm
        initialData={null}
        pageTitle='Add Organizational Unit'
        parentUnits={organizationalUnitsList}
      />
    </PageContainer>
  );
};

export default page;
