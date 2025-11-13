import React, { Suspense } from 'react';
import FormCardSkeleton from '@/components/form-card-skeleton';
import PageContainer from '@/components/layout/page-container';

import { attendanceService } from '@/features/attendance/api';
import { AttendanceResponse } from '@/features/attendance/types';
import AttendanceForm from '@/features/attendance/components/attendance-form';

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
