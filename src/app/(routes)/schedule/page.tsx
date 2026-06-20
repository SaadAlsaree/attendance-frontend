import PageContainer from '@/components/layout/page-container';
import { buttonVariants } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import { ScheduleListing } from '@/features/schedule';
import { searchParamsCache } from '@/lib/searchparams';
import { cn } from '@/lib/utils';
import { IconPlus } from '@tabler/icons-react';
import Link from 'next/link';
import { SearchParams } from 'nuqs/server';
import { Suspense } from 'react';
import { usersPermissionsService } from '@/features/system/users-permissions/api/users-permissions.service';

export const metadata = {
  title: 'جدول الدوام'
};

type pageProps = {
  searchParams: Promise<SearchParams>;
};

const ShiftPage = async (props: pageProps) => {
  const searchParams = await props.searchParams;

  searchParamsCache.parse(searchParams);

  // Only Admin (1) / SuperAdmin (8) may create schedules — spec «للادمن فقط»
  const currentUser = await usersPermissionsService.getCurrentUser();
  const canCreateSchedule = currentUser?.role == 1 || currentUser?.role == 8;

  return (
    <PageContainer scrollable={false}>
      <div className='flex flex-1 flex-col space-y-4'>
        <div className='flex items-start justify-between'>
          <Heading title='جدول الدوام' description='إدارة جدول الدوام' />
          {canCreateSchedule && (
            <Link
              href='/schedule/create-schedule'
              className={cn(buttonVariants(), 'text-xs md:text-sm')}
            >
              <IconPlus className='mr-2 h-4 w-4' /> إضافة جدول دوام جديد
            </Link>
          )}
        </div>
        <Separator />

        <Suspense
          fallback={
            <DataTableSkeleton columnCount={6} rowCount={8} filterCount={2} />
          }
        >
          <ScheduleListing />
        </Suspense>
      </div>
    </PageContainer>
  );
};

export default ShiftPage;
