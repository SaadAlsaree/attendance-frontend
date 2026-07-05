import { searchParamsCache } from '@/lib/searchparams';
import EmployeeTable from './employee-tables';
import { EmployeeData } from '../types/employees';
import { columns } from './employee-tables/columns';
import { employeeService } from '../api/employees.service';

export default async function EmployeesListing() {
  const page = searchParamsCache.get('page');
  const searchTerm = searchParamsCache.get('searchTerm');
  const pageSize = searchParamsCache.get('pageSize');
  const status = searchParamsCache.get('status');
  const parentUnitId = searchParamsCache.get('parentUnitId');

  // Fixed-shift facet: the toolbar emits a comma-separated selection, so forward the
  // filter only when exactly one of true/false is chosen (both / none = no filter).
  const hasFixedShiftSelection = (searchParamsCache.get('hasFixedShift') ?? '')
    .split(',')
    .map((v) => v.trim())
    .filter((v) => v === 'true' || v === 'false');
  const hasFixedShift =
    hasFixedShiftSelection.length === 1 ? hasFixedShiftSelection[0] : undefined;

  const filters = {
    page: page ? Number(page) : 1,
    pageSize: pageSize ? Number(pageSize) : 10,
    ...(searchTerm && { searchTerm }),
    ...(status && { status: Number(status) }),
    ...(parentUnitId && { parentUnitId }),
    ...(hasFixedShift && { hasFixedShift })
  };

  const data = await employeeService.getEmployees(filters);
  const totalEmployees = data?.data?.totalCount || 0;
  const employees = (data?.data?.data || []) as EmployeeData[];


  return (
    <EmployeeTable<EmployeeData, unknown>
      data={employees}
      totalItems={totalEmployees}
      columns={columns}
    />
  );
}
