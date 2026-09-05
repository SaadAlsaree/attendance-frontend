import PageContainer from '@/components/layout/page-container';
import { buttonVariants } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import SitesListing from '@/features/system/sites/components/sites-listing';
import { searchParamsCache } from '@/lib/searchparams';
import { cn } from '@/lib/utils';
import { IconPlus } from '@tabler/icons-react';
import Link from 'next/link';
import { SearchParams } from 'nuqs/server';
import { Suspense } from 'react';
import { Role } from '@/features/system/users-permissions/types/users-permissions';
import { hasAnyRole } from '@/utils/auth/auth-utils';
import { redirect } from 'next/navigation';
import { usersPermissionsService } from '@/features/system/users-permissions/api/users-permissions.service';

export const metadata = {
  title: 'المواقع'
};

type pageProps = {
  searchParams: Promise<SearchParams>;
};

const SitesPage = async (props: pageProps) => {
  const searchParams = await props.searchParams;

  searchParamsCache.parse(searchParams);

  const data = await usersPermissionsService.getCurrentUser();

  // Managing sites means controlling who can see which employees, so it stays with admins.
  const canManage = hasAnyRole(data, [Role.Admin, Role.SuperAdmin]);

  if (!canManage) {
    redirect('/');
  }

  return (
    <PageContainer scrollable={false}>
      <div className='flex flex-1 flex-col space-y-4'>
        <div className='flex items-start justify-between'>
          <Heading
            title='المواقع'
            description='الموقع يضم وحدة أو أكثر — ولا تنضم تفرعات الوحدة تلقائياً'
          />
          <Link
            href='/system/sites/new'
            className={cn(buttonVariants(), 'text-xs md:text-sm')}
          >
            <IconPlus className='ml-2 h-4 w-4' /> إضافة موقع جديد
          </Link>
        </div>
        <Separator />

        <Suspense
          fallback={
            <DataTableSkeleton columnCount={6} rowCount={8} filterCount={2} />
          }
        >
          <SitesListing />
        </Suspense>
      </div>
    </PageContainer>
  );
};

export default SitesPage;
