import AttendanceTable from './attendance-tables';
import { searchParamsCache } from '@/lib/searchparams';
import { AttendanceResponse } from '../types/attendance';
import { attendanceService } from '../api/attendance.service';
import { columns } from './attendance-tables/columns';

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
  const dateParam = searchParams?.date as string | undefined;
  // Date is now in YYYY-MM-DD format, use it directly
  const date = dateParam || undefined;
  const statusParam = searchParams?.status as string | undefined;
  const organizationId = searchParams?.organizationId as string | undefined;
  const sortBy = searchParams?.sortBy as string | undefined;
  const sortOrder = searchParams?.sortOrder as string | undefined;

  const filters = {
    page: page ? parseInt(String(page)) : undefined,
    pageSize: pageSize ? parseInt(String(pageSize)) : undefined,
    ...(searchTerm && { searchTerm: searchTerm }),
    ...(date && { date: date }),
    ...(statusParam && { status: parseInt(statusParam) }),
    ...(organizationId && { organizationId: organizationId }),
    ...(sortBy && { sortBy: sortBy }),
    ...(sortOrder && { sortOrder: sortOrder })
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
