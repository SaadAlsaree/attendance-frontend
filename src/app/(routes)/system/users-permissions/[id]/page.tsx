import FormCardSkeleton from '@/components/form-card-skeleton';
import PageContainer from '@/components/layout/page-container';
import { usersPermissionsService } from '@/features/system/users-permissions/api/users-permissions.service';
import UsersPermissionsViewPage from '@/features/system/users-permissions/components/users-permissions-view-page';
import { UserPermission } from '@/features/system/users-permissions/types/users-permissions';
import React, { Suspense } from 'react';

type pageProps = {
  params: Promise<{ id: string }>;
};

const page = async (props: pageProps) => {
  const { id } = await props.params;

  const user = await usersPermissionsService.getUserPermissionById(id);

  return (
    <PageContainer>
      <div className='flex-1 space-y-4'>
        <Suspense fallback={<FormCardSkeleton />}>
          <UsersPermissionsViewPage data={user as UserPermission} />
        </Suspense>
      </div>
    </PageContainer>
  );
};

export default page;
