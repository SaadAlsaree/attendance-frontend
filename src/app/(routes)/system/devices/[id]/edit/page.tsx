import FormCardSkeleton from '@/components/form-card-skeleton';
import PageContainer from '@/components/layout/page-container';
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

  return (
    <PageContainer>
      <div className='flex-1 space-y-4'>
        <Suspense fallback={<FormCardSkeleton />}>
          <DeviceForm initialData={device} pageTitle='تعديل الجهاز' />
        </Suspense>
      </div>
    </PageContainer>
  );
};

export default page;
