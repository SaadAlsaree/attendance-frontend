import FormCardSkeleton from '@/components/form-card-skeleton';
import PageContainer from '@/components/layout/page-container';
import { DeviceForm, devicesService } from '@/features/system/devices';
import React, { Suspense } from 'react';

type pageProps = {
  params: Promise<{ id: string }>;
};

const page = async ({ params }: pageProps) => {
  const { id } = await params;

  const device = await devicesService.getDeviceById(id);

  return (
    <PageContainer>
      <div className='flex-1 space-y-4'>
        <Suspense fallback={<FormCardSkeleton />}>
          <DeviceForm initialData={device} pageTitle='تعديل الجهاز' />
        </Suspense>
      </div>
    </PageContainer>
  );
};

export default page;
