import PageContainer from '@/components/layout/page-container';
import { buttonVariants } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import { OrganizationsUnitsListing } from '@/features/system/organizationsunits';
import { searchParamsCache } from '@/lib/searchparams';
import { cn } from '@/lib/utils';
import { IconPlus } from '@tabler/icons-react';
import Link from 'next/link';
import { SearchParams } from 'nuqs/server';
import { Suspense } from 'react';
import { Role } from '@/features/system/users-permissions/types/users-permissions';
import { hasAnyRole } from '@/utils/auth/auth-utils';
import { redirect } from 'next/navigation';
import { usersPermissionsService } from "@/features/system/users-permissions/api/users-permissions.service";

export const metadata = {
  title: 'الوحدات التنظيمية'
};

type pageProps = {
  searchParams: Promise<SearchParams>;
};

const OrganizationsUnitsPage = async (props: pageProps) => {
  const searchParams = await props.searchParams;

  searchParamsCache.parse(searchParams);

  const data = await usersPermissionsService.getCurrentUser();

  const canAdd = hasAnyRole(data, [Role.Admin, Role.Manager, Role.SuperAdmin]);

  // redirect to home if user is not authorized
  if (!canAdd) {
    redirect('/');
  }

  return (
    <PageContainer scrollable={false}>
      <div className='flex flex-1 flex-col space-y-4'>
        <div className='flex items-start justify-between'>
          <Heading
            title='الوحدات التنظيمية'
            description='إدارة الهيكل التنظيمي والجهات الإدارية للمؤسسة'
          />
          <Link
            href='/system/organizationsunits/new'
            className={cn(buttonVariants(), 'text-xs md:text-sm')}
          >
            <IconPlus className='ml-2 h-4 w-4' /> إضافة وحدة تنظيمية جديدة
          </Link>
        </div>
        <Separator />

        <Suspense
          fallback={
            <DataTableSkeleton columnCount={6} rowCount={8} filterCount={2} />
          }
        >
          <OrganizationsUnitsListing />
        </Suspense>
      </div>
    </PageContainer>
  );
};

export default OrganizationsUnitsPage;
