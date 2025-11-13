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

  const filters = {
    page: page ? Number(page) : 1,
    pageSize: pageSize ? Number(pageSize) : 10,
    ...(searchTerm && { searchTerm }),
    ...(status && { status: Number(status) }),
    ...(parentUnitId && { parentUnitId })
  };

  const data = await employeeService.getEmployees(filters);
  const totalEmployees = data?.data?.totalCount || 0;
  const employees = (data?.data?.data || []) as EmployeeData[];

  console.log(totalEmployees);

  return (
    <EmployeeTable<EmployeeData, unknown>
      data={employees}
      totalItems={totalEmployees}
      columns={columns}
    />
  );
}
