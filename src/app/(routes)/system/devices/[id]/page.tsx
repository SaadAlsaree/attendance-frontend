import FormCardSkeleton from '@/components/form-card-skeleton';
import PageContainer from '@/components/layout/page-container';
import { organizationalService } from '@/features/organizational-unit/api/organizational.service';
import { IOrganizationalUnitList } from '@/features/organizational-unit/types/organizational';
import { DeviceForm, devicesService } from '@/features/system/devices';
import { usersPermissionsService } from '@/features/system/users-permissions/api/users-permissions.service';
import { Role } from '@/features/system/users-permissions/types/users-permissions';
import { hasAnyRole } from '@/utils/auth/auth-utils';
import { redirect } from 'next/navigation';
import React, { Suspense } from 'react';

type pageProps = {
  params: Promise<{ id: string }>;
};

const page = async ({ params }: pageProps) => {
  const { id } = await params;

    const data = await usersPermissionsService.getCurrentUser();
    
  const canAdd = hasAnyRole(data, [Role.Admin, Role.Manager]);
    
    
  // redirect to home if user is not authorized
  if (!canAdd) {
      redirect('/');
  }

  const device = await devicesService.getDeviceById(id);

  const organizations = await organizationalService.getOrganizationalUnits();

  const organizationsData = organizations?.data as IOrganizationalUnitList[];

  return (
    <PageContainer>
      <div className='flex-1 space-y-4'>
        <Suspense fallback={<FormCardSkeleton />}>
          <DeviceForm
            initialData={device}
            pageTitle='تعديل الجهاز'
            organizations={organizationsData}
          />
        </Suspense>
      </div>
    </PageContainer>
  );
};

export default page;
