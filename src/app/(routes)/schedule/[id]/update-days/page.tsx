import React, { Suspense } from 'react';
import { redirect } from 'next/navigation';
import PageContainer from '@/components/layout/page-container';
import FormCardSkeleton from '@/components/form-card-skeleton';

import { scheduleService } from '@/features/schedule/api/schedule.service';
import { shiftService } from '@/features/shift/api/shift.service';
import { ShiftData } from '@/features/shift';
import ScheduleUpdateDaysForm from '@/features/schedule/components/schedule-update-days-form';

export const metadata = {
  title: 'تحديث أيام الجدولة',
  description: 'تحديث أيام وورديات الجدولة'
};

type Props = {
  params: Promise<{
    id: string;
  }>;
};

const UpdateScheduleDaysPage = async ({ params }: Props) => {
  const { id } = await params;

  try {
    // Fetch schedule data
    const scheduleResponse = await scheduleService.getScheduleById(id);
    const schedule = scheduleResponse?.data;

    if (!schedule) {
      redirect('/schedule');
    }

    // Fetch shifts data
    const shiftsResponse = await shiftService.getShiftsList({
      page: 1,
      pageSize: 100
    });
    const shiftsList = shiftsResponse?.data || [];

    return (
      <PageContainer scrollable>
        <div className='flex-1 space-y-4'>
          <Suspense fallback={<FormCardSkeleton />}>
            <ScheduleUpdateDaysForm
              attendanceScheduleId={id}
              scheduleDays={schedule.scheduleDays}
              shifts={shiftsList as unknown as ShiftData[]}
              startDate={schedule.startDate}
              endDate={schedule.endDate || undefined}
              employeeName={schedule.employeeName || undefined}
            />
          </Suspense>
        </div>
      </PageContainer>
    );
  } catch (error) {
    console.error('Error loading schedule data:', error);
    redirect('/schedule');
  }
};

export default UpdateScheduleDaysPage;
