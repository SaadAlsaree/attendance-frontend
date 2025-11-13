import AttendanceLogsTable from './attendance-logs-tables';
import { searchParamsCache } from '@/lib/searchparams';
import { AttendanceLogResponse } from '../types/attendance-logs';
import { attendanceLogService } from '../api/attendance-logs.service';
import { columns } from './attendance-logs-tables/columns';

export default async function AttendanceLogsListing() {
  const page = searchParamsCache.get('page') || 1;
  const pageSize = searchParamsCache.get('pageSize') || 10;
  const organizationId = searchParamsCache.get('organizationId');
  const searchTerm = searchParamsCache.get('searchTerm');
  const startDate = searchParamsCache.get('startDate');
  const endDate = searchParamsCache.get('endDate');
  const direct = searchParamsCache.get('direct');
  const attendanceStatus = searchParamsCache.get('attendanceStatus');

  const filters = {
    page,
    pageSize,
    ...(searchTerm && { searchTerm: searchTerm }),
    ...(organizationId && { organizationId }),
    ...(startDate && { startDate }),
    ...(endDate && { endDate }),
    ...(direct && { direct: direct }),
    ...(attendanceStatus && { attendanceStatus: attendanceStatus.toString() })
  };

  const data = await attendanceLogService.getAttendanceLogsList(filters);
  const totalAttendanceLogs = data?.totalCount || 0;
  const attendanceLogs = (data?.data || []) as AttendanceLogResponse[];

  return (
    <AttendanceLogsTable
      data={attendanceLogs}
      totalItems={totalAttendanceLogs}
      columns={columns}
    />
  );
}
