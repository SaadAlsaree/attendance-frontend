import React, { Suspense } from 'react';
import PageContainer from '@/components/layout/page-container';
import FormCardSkeleton from '@/components/form-card-skeleton';

import { organizationalService } from '@/features/organizational-unit/api/organizational.service';
import { IOrganizationalUnitList } from '@/features/organizational-unit/types/organizational';
import UsersPermissionsForm from '@/features/system/users-permissions/components/users-permissions-form';
import { Role } from '@/features/system/users-permissions/types/users-permissions';
import { hasAnyRole } from '@/utils/auth/auth-utils';
import { redirect } from 'next/navigation';
import { usersPermissionsService } from '@/features/system/users-permissions/api/users-permissions.service';

export const metadata = {
  title: 'إضافة مستخدم جديد',
  description: 'إضافة مستخدم جديد'
};

const NewUserPage = async () => {

   const data = await usersPermissionsService.getCurrentUser();
  
    const canAdd = hasAnyRole(data, [Role.Admin, Role.Manager]);
  
  
    // redirect to home if user is not authorized
    if (!canAdd) {
        redirect('/');
    }
  // Fetch organizations data once and cache it
  const organizationsResponse =
    await organizationalService.getOrganizationalUnits();
  const organizationsData =
    (organizationsResponse?.data as IOrganizationalUnitList[]) || [];

  return (
    <PageContainer scrollable>
      <div className='flex-1 space-y-4'>
        <Suspense fallback={<FormCardSkeleton />}>
          <UsersPermissionsForm
            initialData={null}
            pageTitle='إضافة مستخدم جديد'
            organizations={organizationsData}
          />
        </Suspense>
      </div>
    </PageContainer>
  );
};

export default NewUserPage;
