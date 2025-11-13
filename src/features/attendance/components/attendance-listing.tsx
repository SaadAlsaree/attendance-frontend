import AttendanceTable from './attendance-tables';
import { searchParamsCache } from '@/lib/searchparams';
import { AttendanceResponse } from '../types/attendance';
import { attendanceService } from '../api/attendance.service';
import { columns } from './attendance-tables/columns';
import { baghdadIsoDate } from '@/lib/format';

interface AttendanceListingProps {
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default async function AttendanceListing({
  searchParams
}: AttendanceListingProps = {}) {
  const page = searchParamsCache.get('page');
  const searchTerm = searchParamsCache.get('searchTerm');
  const pageSize = searchParamsCache.get('pageSize');

  // Get additional filters from searchParams
  const dateParam = searchParams?.date as Date | undefined;
  const date = baghdadIsoDate(dateParam);
  const statusParam = searchParams?.status as string | undefined;
  const organizationId = searchParams?.organizationId as string | undefined;

  const filters = {
    page: page ? parseInt(String(page)) : undefined,
    pageSize: pageSize ? parseInt(String(pageSize)) : undefined,
    ...(searchTerm && { searchTerm: searchTerm }),
    ...(date && { date: date }),

    ...(statusParam && { status: statusParam }),
    ...(organizationId && { organizationId: organizationId })
  };

  const data = await attendanceService.getAttendanceList(filters);
  const totalAttendances = data?.totalCount || 0;
  const attendances = (data?.data || []) as AttendanceResponse[];

  return (
    <AttendanceTable<AttendanceResponse, unknown>
      data={attendances}
      totalItems={totalAttendances}
      columns={columns}
    />
  );
}
