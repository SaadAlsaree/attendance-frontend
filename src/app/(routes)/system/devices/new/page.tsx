import React, { Suspense } from 'react';
import PageContainer from '@/components/layout/page-container';
import FormCardSkeleton from '@/components/form-card-skeleton';
import { DeviceForm } from '@/features/system/devices';
import { organizationalService } from '@/features/organizational-unit/api/organizational.service';
import { IOrganizationalUnitList } from '@/features/organizational-unit/types/organizational';
import { usersPermissionsService } from '@/features/system/users-permissions/api/users-permissions.service';
import { Role } from '@/features/system/users-permissions/types/users-permissions';
import { hasAnyRole } from '@/utils/auth/auth-utils';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'إضافة جهاز جديد',
  description: 'إضافة جهاز جديد'
};

const NewDevicePage = async () => {
  const organizations = await organizationalService.getOrganizationalUnits();

    const data = await usersPermissionsService.getCurrentUser();
    
  const canAdd = hasAnyRole(data, [Role.Admin, Role.Manager]);
    
    
  // redirect to home if user is not authorized
  if (!canAdd) {
      redirect('/');
  }

  const organizationsData = organizations?.data as IOrganizationalUnitList[];

  return (
    <PageContainer scrollable>
      <div className='flex-1 space-y-4'>
        <Suspense fallback={<FormCardSkeleton />}>
          <DeviceForm initialData={null} organizations={organizationsData} />
        </Suspense>
      </div>
    </PageContainer>
  );
};

export default NewDevicePage;
