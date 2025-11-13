import FormCardSkeleton from '@/components/form-card-skeleton';
import PageContainer from '@/components/layout/page-container';
import { attendanceService } from '@/features/attendance/api';
import AttendanceViewPage from '@/features/attendance/components/attendance-view';
import { AttendanceResponse } from '@/features/attendance/types';

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
