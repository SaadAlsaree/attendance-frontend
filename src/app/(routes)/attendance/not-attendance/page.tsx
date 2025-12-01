import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import NotAttendanceListing from '@/features/attendance/components/not-attendance-listing';
import { searchParamsCache } from '@/lib/searchparams';
import { SearchParams } from 'nuqs/server';
import { Suspense } from 'react';

export const metadata = {
  title: 'غير المبصمين'
};

type pageProps = {
  searchParams: Promise<SearchParams>;
};

const NotAttendancePage = async (props: pageProps) => {
  const searchParams = await props.searchParams;

  searchParamsCache.parse(searchParams);
  return (
    <PageContainer scrollable={false}>
      <div className='flex flex-1 flex-col space-y-4'>
        <div className='flex items-start justify-between'>
          <Heading
            title='غير المبصمين'
            description='إدارة وعرض سجلات غير المبصمين'
          />
        </div>
        <Separator />

        <Suspense
          fallback={
            <DataTableSkeleton columnCount={8} rowCount={10} filterCount={3} />
          }
        >
          <NotAttendanceListing searchParams={searchParams as { [key: string]: string | string[] | undefined }} />
        </Suspense>
      </div>
    </PageContainer>
  );
};

export default NotAttendancePage;

