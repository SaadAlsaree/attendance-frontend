import PageContainer from '@/components/layout/page-container';
import FormCardSkeleton from '@/components/form-card-skeleton';
import {
  organizationsUnitsService,
  OrganizationsUnitsForm,
  IOrganizationalUnitDetails,
  IOrganizationalUnitList
} from '@/features/system/organizationsunits';
import React, { Suspense } from 'react';
import { usersPermissionsService } from '@/features/system/users-permissions/api/users-permissions.service';
import { Role } from '@/features/system/users-permissions/types/users-permissions';
import { hasAnyRole } from '@/utils/auth/auth-utils';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'تعديل الوحدة التنظيمية'
};

type PageProps = {
  params: Promise<{ id: string }>;
};

const OrganizationalUnitEditPage = async ({ params }: PageProps) => {
  const { id } = await params;

  const data = await usersPermissionsService.getCurrentUser();
  const canAdd = hasAnyRole(data, [Role.Admin, Role.Manager, Role.SuperAdmin]);

  // redirect to home if user is not authorized
  if (!canAdd) {
    redirect('/');
  }

  const organization = await organizationsUnitsService.getOrganizationalUnitById(id);
  const unitsResponse = await organizationsUnitsService.getOrganizationalUnits();

  let parentUnits: IOrganizationalUnitList[] = [];
  if (Array.isArray(unitsResponse?.data)) {
    parentUnits = unitsResponse.data;
  } else if (Array.isArray(unitsResponse)) {
    parentUnits = unitsResponse;
  }

  return (
    <PageContainer scrollable>
      <div className='flex-1 space-y-4'>
        <Suspense fallback={<FormCardSkeleton />}>
          <OrganizationsUnitsForm
            initialData={organization as unknown as IOrganizationalUnitDetails}
            pageTitle='تعديل الوحدة التنظيمية'
            parentUnits={parentUnits}
          />
        </Suspense>
      </div>
    </PageContainer>
  );
};

export default OrganizationalUnitEditPage;
