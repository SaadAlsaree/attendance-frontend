import LeaveTable from './leave-tables';
import { searchParamsCache } from '@/lib/searchparams';
import { LeaveResponse } from '../types/leaves';
import { LeavesService } from '../api/approvereject-leaves.service';
import { columns } from './leave-tables/columns';

export default async function LeaveListing() {
  const page = searchParamsCache.get('page') || 1;
  const pageSize = searchParamsCache.get('pageSize') || 10;
  const employeeId = searchParamsCache.get('employeeId');
  const searchTerm = searchParamsCache.get('searchTerm');
  const startDate = searchParamsCache.get('startDate');
  const endDate = searchParamsCache.get('endDate');
  const status = searchParamsCache.get('status');

  const filters = {
    page,
    pageSize,
    ...(searchTerm && { searchTerm: searchTerm }),
    ...(employeeId && { employeeId: Number(employeeId) }),
    ...(startDate && { startDate }),
    ...(endDate && { endDate }),
    ...(status && { status: Number(status) })
  };

  const data = await LeavesService.getLeaves(filters);
  const totalLeaves = data?.totalCount || 0;
  const leaves = (data?.data || []) as LeaveResponse['data'];

  return (
    <LeaveTable data={leaves} totalItems={totalLeaves} columns={columns} />
  );
}
