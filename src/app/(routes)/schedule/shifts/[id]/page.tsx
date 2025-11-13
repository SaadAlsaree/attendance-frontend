import FormCardSkeleton from '@/components/form-card-skeleton';
import PageContainer from '@/components/layout/page-container';
import { ShiftData, shiftService } from '@/features/shift';
import ShiftViewPage from '@/features/shift/components/shift-view';

import React, { Suspense } from 'react';

export const metadata = {
  title: 'بيانات المناوبة',
  description: 'بيانات المناوبة'
};

type pageProps = {
  params: Promise<{ id: string }>;
};
const page = async (props: pageProps) => {
  const params = await props.params;
  const shift = await shiftService.getShiftById(params.id);

  return (
    <PageContainer scrollable>
      <div className='flex-1 space-y-4'>
        <Suspense fallback={<FormCardSkeleton />}>
          <ShiftViewPage data={shift?.data as unknown as ShiftData} />
        </Suspense>
      </div>
    </PageContainer>
  );
};

export default page;
