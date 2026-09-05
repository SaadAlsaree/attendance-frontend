import PageContainer from '@/components/layout/page-container';
import {
  organizationsUnitsService,
  OrganizationsUnitsViewPage,
  IOrganizationalUnitDetails
} from '@/features/system/organizationsunits';
import React, { Suspense } from 'react';
import FormCardSkeleton from '@/components/form-card-skeleton';
import { usersPermissionsService } from '@/features/system/users-permissions/api/users-permissions.service';
import { Role } from '@/features/system/users-permissions/types/users-permissions';
import { hasAnyRole } from '@/utils/auth/auth-utils';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'تفاصيل الوحدة التنظيمية'
};

type PageProps = {
  params: Promise<{ id: string }>;
};

const OrganizationalUnitDetailsPage = async ({ params }: PageProps) => {
  const { id } = await params;

  const data = await usersPermissionsService.getCurrentUser();
  const canAdd = hasAnyRole(data, [Role.Admin, Role.Manager, Role.SuperAdmin]);

  // redirect to home if user is not authorized
  if (!canAdd) {
    redirect('/');
  }

  const organization = await organizationsUnitsService.getOrganizationalUnitById(id);

  return (
    <PageContainer scrollable>
      <div className='flex-1 space-y-4'>
        <Suspense fallback={<FormCardSkeleton />}>
          <OrganizationsUnitsViewPage
            data={organization as unknown as IOrganizationalUnitDetails}
          />
        </Suspense>
      </div>
    </PageContainer>
  );
};

export default OrganizationalUnitDetailsPage;
