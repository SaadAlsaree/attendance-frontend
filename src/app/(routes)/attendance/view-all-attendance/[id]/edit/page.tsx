import React, { Suspense } from 'react';
import FormCardSkeleton from '@/components/form-card-skeleton';
import PageContainer from '@/components/layout/page-container';

import { attendanceService } from '@/features/attendance/api';
import { AttendanceResponse } from '@/features/attendance/types';
import AttendanceForm from '@/features/attendance/components/attendance-form';
import { usersPermissionsService } from '@/features/system/users-permissions/api/users-permissions.service';
import { Role } from '@/features/system/users-permissions/types/users-permissions';
import { hasAnyRole } from '@/utils/auth/auth-utils';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'تعديل الحضور والانصراف',
  description: 'تعديل الحضور والانصراف'
};

type pageProps = {
  params: Promise<{ id: string }>;
};

const page = async (props: pageProps) => {
  const params = await props.params;
  const attendance = await attendanceService.getAttendanceById(params.id);

  const data = await usersPermissionsService.getCurrentUser();
      
  const canAdd = hasAnyRole(data, [Role.Admin, Role.Manager]);
      
      
  // redirect to home if user is not authorized
        if (!canAdd) {
            redirect('/');
        }

  return (
    <PageContainer scrollable>
      <div className='flex-1 space-y-4'>
        <Suspense fallback={<FormCardSkeleton />}>
          <AttendanceForm
            initialData={attendance?.data as AttendanceResponse}
            pageTitle='تعديل الحضور والانصراف'
            attendanceId={params.id}
          />
        </Suspense>
      </div>
    </PageContainer>
  );
};

export default page;
