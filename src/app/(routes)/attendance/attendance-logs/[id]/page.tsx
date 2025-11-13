import FormCardSkeleton from '@/components/form-card-skeleton';
import PageContainer from '@/components/layout/page-container';
import { AttendanceLogsViewPage } from '@/features/attendance-logs';
import { attendanceLogService } from '@/features/attendance-logs/api';
import { AttendanceLogResponse } from '@/features/attendance-logs/types';

import React, { Suspense } from 'react';

export const metadata = {
  title: 'بيانات سجل الحضور',
  description: 'بيانات سجل الحضور والانصراف'
};

type pageProps = {
  params: Promise<{ id: string }>;
};

const page = async (props: pageProps) => {
  const params = await props.params;
  const attendanceLog = await attendanceLogService.getAttendanceLogById(
    params.id
  );

  return (
    <PageContainer scrollable>
      <div className='flex-1 space-y-4'>
        <Suspense fallback={<FormCardSkeleton />}>
          <AttendanceLogsViewPage
            data={attendanceLog as AttendanceLogResponse}
          />
        </Suspense>
      </div>
    </PageContainer>
  );
};

export default page;
