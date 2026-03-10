import PageContainer from '@/components/layout/page-container';
import { buttonVariants } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import { DevicesListing } from '@/features/system/devices';
import { usersPermissionsService } from '@/features/system/users-permissions/api/users-permissions.service';
import { Role } from '@/features/system/users-permissions/types/users-permissions';
import { searchParamsCache } from '@/lib/searchparams';
import { cn } from '@/lib/utils';
import { hasAnyRole } from '@/utils/auth/auth-utils';
import { IconPlus } from '@tabler/icons-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { SearchParams } from 'nuqs/server';
import { Suspense } from 'react';


export const metadata = {
  title: 'الأجهزة'
};

type pageProps = {
  searchParams: Promise<SearchParams>;
};

const DevicesPage = async (props: pageProps) => {
  const searchParams = await props.searchParams;

  const data = await usersPermissionsService.getCurrentUser();
    
  const canAdd = hasAnyRole(data, [Role.Admin, Role.Manager]);
    
    
  // redirect to home if user is not authorized
      if (!canAdd) {
          redirect('/');
      }

  searchParamsCache.parse(searchParams);
  return (
    <PageContainer scrollable={false}>
      <div className='flex flex-1 flex-col space-y-4'>
        <div className='flex items-start justify-between'>
          <Heading title='الأجهزة' description='إدارة الأجهزة' />
          <Link
            href='/system/devices/new'
            className={cn(buttonVariants(), 'text-xs md:text-sm')}
          >
            <IconPlus className='mr-2 h-4 w-4' /> إضافة جهاز جديد
          </Link>
        </div>
        <Separator />

        <Suspense
          fallback={
            <DataTableSkeleton columnCount={6} rowCount={8} filterCount={2} />
          }
        >
          <DevicesListing />
        </Suspense>
      </div>
    </PageContainer>
  );
};

export default DevicesPage;
