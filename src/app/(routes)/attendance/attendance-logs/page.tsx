import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import { AttendanceLogsListing } from '@/features/attendance-logs';
import { searchParamsCache } from '@/lib/searchparams';
import { SearchParams } from 'nuqs/server';
import { Suspense } from 'react';

type pageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function attendancelogsPage(props: pageProps) {
  const searchParams = await props.searchParams;

  searchParamsCache.parse(searchParams);
  return (
    <PageContainer scrollable={false}>
      <div className='flex flex-1 flex-col space-y-4'>
        <div className='flex items-start justify-between'>
          <Heading
            title='عرض جميع الحضور'
            description='إدارة وعرض جميع سجلات الحضور'
          />
        </div>
        <Separator />

        <Suspense
          fallback={
            <DataTableSkeleton columnCount={8} rowCount={10} filterCount={3} />
          }
        >
          <AttendanceLogsListing />
        </Suspense>
      </div>
    </PageContainer>
  );
}
