import ScheduleTable from './schedule-table';
import { searchParamsCache } from '@/lib/searchparams';
import { AttendanceScheduleResponse } from '../types/schedules';
import { scheduleService } from '../api/schedule.service';
import { columns } from './schedule-table/columns';

export default async function ScheduleListing() {
  const page = searchParamsCache.get('page');
  const searchTerm = searchParamsCache.get('searchTerm');
  const pageSize = searchParamsCache.get('pageSize');

  const filters = {
    page: page ? parseInt(String(page)) : undefined,
    pageSize: pageSize ? parseInt(String(pageSize)) : undefined,
    ...(searchTerm && { searchTerm: searchTerm })
  };

  const data = await scheduleService.getSchedulesList(filters);
  const totalSchedules = data?.totalCount || 0;
  const schedules = (data?.data || []) as AttendanceScheduleResponse[];

  return (
    <ScheduleTable<AttendanceScheduleResponse, unknown>
      data={schedules}
      totalItems={totalSchedules}
      columns={columns}
    />
  );
}
