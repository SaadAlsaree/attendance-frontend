import FormCardSkeleton from '@/components/form-card-skeleton';
import PageContainer from '@/components/layout/page-container';
import { organizationalService } from '@/features/organizational-unit/api/organizational.service';
import { IOrganizationalUnitList } from '@/features/organizational-unit/types/organizational';
import { usersPermissionsService } from '@/features/system/users-permissions/api/users-permissions.service';
import UsersPermissionsForm from '@/features/system/users-permissions/components/users-permissions-form';
import React, { Suspense } from 'react';

type pageProps = {
  params: Promise<{ id: string }>;
};

const page = async (props: pageProps) => {
  const { id } = await props.params;

  const user = await usersPermissionsService.getUserPermissionById(id);

  const organizations = await organizationalService.getOrganizationalUnits();

  const organizationsData = organizations?.data as IOrganizationalUnitList[];

  console.log(user);
  return (
    <PageContainer>
      <div className='flex-1 space-y-4'>
        <Suspense fallback={<FormCardSkeleton />}>
          <UsersPermissionsForm
            initialData={user}
            pageTitle='تعديل المستخدم'
            organizations={organizationsData}
          />
        </Suspense>
      </div>
    </PageContainer>
  );
};

export default page;
