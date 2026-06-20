import PageContainer from '@/components/layout/page-container';
import { buttonVariants } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import { LeaveListing } from '@/features/leave';
import { searchParamsCache } from '@/lib/searchparams';
import { cn } from '@/lib/utils';
import { IconPlus } from '@tabler/icons-react';
import Link from 'next/link';
import { SearchParams } from 'nuqs/server';
import { Suspense } from 'react';
import { usersPermissionsService } from '@/features/system/users-permissions/api/users-permissions.service';
import { canWrite } from '@/utils/auth/auth-utils';

export const metadata = {
  title: 'إدارة المواقف'
};

type pageProps = {
  searchParams: Promise<SearchParams>;
};

const LeavePage = async (props: pageProps) => {
  const searchParams = await props.searchParams;

  // View-only roles (e.g. security officers) can browse but not create a موقف.
  const currentUser = await usersPermissionsService.getCurrentUser();
  const showCreate = canWrite(currentUser);

  searchParamsCache.parse(searchParams);
  return (
    <PageContainer scrollable={false}>
      <div className='flex flex-1 flex-col space-y-4'>
        <div className='flex items-start justify-between'>
          <Heading title='المواقف' description='إدارة المواقف' />
          {showCreate && (
            <Link
              href='/leave/new'
              className={cn(buttonVariants(), 'text-xs md:text-sm')}
            >
              <IconPlus className='mr-2 h-4 w-4' /> إضافة موقف جديد
            </Link>
          )}
        </div>
        <Separator />

        <Suspense
          fallback={
            <DataTableSkeleton columnCount={6} rowCount={8} filterCount={2} />
          }
        >
          <LeaveListing />
        </Suspense>
      </div>
    </PageContainer>
  );
};

export default LeavePage;
