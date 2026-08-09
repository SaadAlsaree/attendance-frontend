import FixedShiftTable from './fixed-shift-table';
import { searchParamsCache } from '@/lib/searchparams';
import { EmployeeWeeklyShiftsRow } from '../types/schedules';
import { scheduleService } from '../api/schedule.service';
import { columns } from './fixed-shift-table/columns';

export default async function FixedShiftListing() {
  const page = searchParamsCache.get('page');
  const searchTerm = searchParamsCache.get('searchTerm');
  const pageSize = searchParamsCache.get('pageSize');

  const filters = {
    page: page ? parseInt(String(page)) : undefined,
    pageSize: pageSize ? parseInt(String(pageSize)) : undefined,
    ...(searchTerm && { searchTerm: searchTerm })
  };

  const data = await scheduleService.getFixedShiftsList(filters);
  const totalRows = data?.totalCount || 0;
  const rows = (data?.data || []) as EmployeeWeeklyShiftsRow[];

  return (
    <FixedShiftTable<EmployeeWeeklyShiftsRow, unknown>
      data={rows}
      totalItems={totalRows}
      columns={columns}
    />
  );
}
