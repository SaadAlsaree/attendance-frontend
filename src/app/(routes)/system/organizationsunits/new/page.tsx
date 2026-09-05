import React, { Suspense } from 'react';
import PageContainer from '@/components/layout/page-container';
import FormCardSkeleton from '@/components/form-card-skeleton';
import {
  OrganizationsUnitsForm,
  organizationsUnitsService,
  IOrganizationalUnitList
} from '@/features/system/organizationsunits';
import { usersPermissionsService } from '@/features/system/users-permissions/api/users-permissions.service';
import { Role } from '@/features/system/users-permissions/types/users-permissions';
import { hasAnyRole } from '@/utils/auth/auth-utils';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'إضافة وحدة تنظيمية جديدة',
  description: 'إضافة وحدة أو جهة إدارية جديدة للنظام'
};

export default async function OrganizationsUnitsNewPage() {
  const data = await usersPermissionsService.getCurrentUser();
  const canAdd = hasAnyRole(data, [Role.Admin, Role.Manager, Role.SuperAdmin]);

  // redirect to home if user is not authorized
  if (!canAdd) {
    redirect('/');
  }

  const response = await organizationsUnitsService.getOrganizationalUnits();

  let parentUnits: IOrganizationalUnitList[] = [];
  if (Array.isArray(response?.data)) {
    parentUnits = response.data;
  } else if (Array.isArray(response)) {
    parentUnits = response;
  }

  return (
    <PageContainer scrollable>
      <div className='flex-1 space-y-4'>
        <Suspense fallback={<FormCardSkeleton />}>
          <OrganizationsUnitsForm
            initialData={null}
            pageTitle='إضافة وحدة تنظيمية جديدة'
            parentUnits={parentUnits}
          />
        </Suspense>
      </div>
    </PageContainer>
  );
}
