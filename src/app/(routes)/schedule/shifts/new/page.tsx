import React, { Suspense } from 'react';
import PageContainer from '@/components/layout/page-container';
import FormCardSkeleton from '@/components/form-card-skeleton';
import { ShiftForm } from '@/features/shift';
import { organizationalService } from '@/features/organizational-unit/api/organizational.service';
import { IOrganizationalUnitList } from '@/features/organizational-unit/types/organizational';
import { usersPermissionsService } from '@/features/system/users-permissions/api/users-permissions.service';
import Unauthorized from '@/components/auth/unauthorized';

export const metadata = {
  title: 'إضافة مناوبة جديدة',
  description: 'إضافة مناوبة جديدة'
};

const NewMailFilePage = async () => {
  const organizations = await organizationalService.getOrganizationalUnits();
  const organizationsData = organizations?.data as IOrganizationalUnitList[];

  const currentUser = await usersPermissionsService.getCurrentUser();

  if (currentUser?.role != 1) {
    return (
      <PageContainer>
        <Unauthorized />
      </PageContainer>
    );
  }

  return (
    <PageContainer scrollable>
      <div className='flex-1 space-y-4'>
        <Suspense fallback={<FormCardSkeleton />}>
          <ShiftForm
            initialData={null}
            pageTitle='إضافة مناوبة جديدة'
            organizations={organizationsData}
          />
        </Suspense>
      </div>
    </PageContainer>
  );
};

export default NewMailFilePage;
