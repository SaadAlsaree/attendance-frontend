import PageContainer from '@/components/layout/page-container';
import { organizationalService } from '@/features/organizational-unit/api/organizational.service';
import OrganizationalUnitForm from '@/features/organizational-unit/components/organizational-unit-form';
import { IOrganizationalUnitList } from '@/features/organizational-unit/types/organizational';
import React from 'react';
import { usersPermissionsService } from '@/features/system/users-permissions/api/users-permissions.service';
import { Role } from '@/features/system/users-permissions/types/users-permissions';
import { hasAnyRole } from '@/utils/auth/auth-utils';
import { redirect } from 'next/navigation';

const page = async () => {
  const organizationalUnits =
    await organizationalService.getOrganizationalUnits();

  const organizationalUnitsList = (organizationalUnits?.data ||
    []) as IOrganizationalUnitList[];

  const data = await usersPermissionsService.getCurrentUser();
      
  const canAdd = hasAnyRole(data, [Role.Admin, Role.Manager]);
      
      
  // redirect to home if user is not authorized
        if (!canAdd) {
            redirect('/');
        }

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
