import NotAttendanceTable from './not-attendance-tables';
import { searchParamsCache } from '@/lib/searchparams';
import { NotAttendanceData } from '../types/attendance';
import { attendanceService } from '../api/attendance.service';
import { columns } from './not-attendance-tables/columns';

interface NotAttendanceListingProps {
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default async function NotAttendanceListing({
  searchParams
}: NotAttendanceListingProps = {}) {
  const page = searchParamsCache.get('page');
  const searchTerm = searchParamsCache.get('searchTerm');
  const pageSize = searchParamsCache.get('pageSize');

  // Get additional filters from searchParams
  const dateParam = searchParams?.date as string | undefined;
  // Date is now in YYYY-MM-DD format, use it directly
  const date = dateParam || undefined;
  const statusParam = searchParams?.status as string | undefined;
  const organizationId = searchParams?.organizationId as string | undefined;
  const employeeId = searchParams?.employeeId as string | undefined;
  const shiftId = searchParams?.shiftId as string | undefined;

  const filters = {
    page: page ? parseInt(String(page)) : undefined,
    pageSize: pageSize ? parseInt(String(pageSize)) : undefined,
    ...(searchTerm && { searchTerm: searchTerm }),
    ...(date && { date: date }),
    ...(statusParam && { status: parseInt(statusParam) }),
    ...(organizationId && { organizationId: organizationId }),
    ...(employeeId && { employeeId: employeeId }),
    ...(shiftId && { shiftId: shiftId })
  };

  const data = await attendanceService.getNotAttendance(filters);
  const totalItems = data?.totalCount || 0;
  const notAttendances = (data?.data || []) as NotAttendanceData[];

  return (
    <NotAttendanceTable<NotAttendanceData, unknown>
      data={notAttendances}
      totalItems={totalItems}
      columns={columns}
    />
  );
}

