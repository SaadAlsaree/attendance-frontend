import FormCardSkeleton from '@/components/form-card-skeleton';
import PageContainer from '@/components/layout/page-container';
import { attendanceService } from '@/features/attendance/api';
import AttendanceViewPage from '@/features/attendance/components/attendance-view';
import { AttendanceResponse } from '@/features/attendance/types';
import { usersPermissionsService } from '@/features/system/users-permissions/api/users-permissions.service';
import { Role } from '@/features/system/users-permissions/types/users-permissions';
import { hasAnyRole } from '@/utils/auth/auth-utils';
import { redirect } from 'next/navigation';
import React, { Suspense } from 'react';

export const metadata = {
  title: 'بيانات الحضور والانصراف',
  description: 'بيانات الحضور والانصراف'
};

type pageProps = {
  params: Promise<{ id: string }>;
};
const page = async (props: pageProps) => {
  const params = await props.params;
  const attendance = await attendanceService.getAttendanceById(params.id);

  const data = await usersPermissionsService.getCurrentUser();
      
  const canAdd = hasAnyRole(data, [Role.Admin, Role.Manager, Role.Employee]);
      
      
  // redirect to home if user is not authorized
        if (!canAdd) {
            redirect('/');
        }

  return (
    <PageContainer scrollable>
      <div className='flex-1 space-y-4'>
        <Suspense fallback={<FormCardSkeleton />}>
          <AttendanceViewPage data={attendance?.data as AttendanceResponse} />
        </Suspense>
      </div>
    </PageContainer>
  );
};

export default page;
