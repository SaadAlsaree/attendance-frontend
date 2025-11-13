import ShiftTable from './shift-table';
import { searchParamsCache } from '@/lib/searchparams';
import { ShiftResponse } from '../types/shift';
import { shiftService } from '../api/shift.service';
import { columns } from './shift-table/columns';

export default async function ShiftsListing() {
  const page = searchParamsCache.get('page');
  const searchText = searchParamsCache.get('searchText');
  const pageSize = searchParamsCache.get('pageSize');

  const filters = {
    page: page ? parseInt(String(page)) : undefined,
    pageSize: pageSize ? parseInt(String(pageSize)) : undefined,
    ...(searchText && { searchTerm: searchText })
  };

  const data = await shiftService.getShiftsList(filters);
  const totalShifts = data?.totalItems || 0;
  const shifts = data?.data as unknown as ShiftResponse[];

  return (
    <ShiftTable<ShiftResponse, unknown>
      data={shifts}
      totalItems={totalShifts}
      columns={columns}
    />
  );
}
