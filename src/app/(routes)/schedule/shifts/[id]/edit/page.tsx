import React, { Suspense } from 'react';
import FormCardSkeleton from '@/components/form-card-skeleton';
import PageContainer from '@/components/layout/page-container';
import { ShiftData, ShiftForm, shiftService } from '@/features/shift';
import { organizationalService } from '@/features/organizational-unit/api/organizational.service';
import { IOrganizationalUnitList } from '@/features/organizational-unit/types/organizational';
import { usersPermissionsService } from '@/features/system/users-permissions/api/users-permissions.service';
import Unauthorized from '@/components/auth/unauthorized';

export const metadata = {
  title: 'تعديل المناوبة',
  description: 'تعديل المناوبة'
};

type pageProps = {
  params: Promise<{ id: string }>;
};

const page = async (props: pageProps) => {
  const params = await props.params;
  const shift = await shiftService.getShiftById(params.id);

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
            initialData={shift?.data as unknown as ShiftData}
            pageTitle='تعديل المناوبة'
            organizations={organizationsData}
          />
        </Suspense>
      </div>
    </PageContainer>
  );
};

export default page;
