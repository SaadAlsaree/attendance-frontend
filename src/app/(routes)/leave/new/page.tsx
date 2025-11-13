import PageContainer from '@/components/layout/page-container';
import { employeeService } from '@/features/employee/api/employees.service';
import { EmployeeData } from '@/features/employee/types/employees';
import LeaveForm from '@/features/leave/components/leave-form';
import { searchParamsCache } from '@/lib/searchparams';
import { SearchParams } from 'nuqs';

type pageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function newLeavePage(props: pageProps) {
  const searchParams = await props.searchParams;

  searchParamsCache.parse(searchParams);

  const searchTerm = searchParamsCache.get('searchTerm');

  const employee = await employeeService.getEmployees({
    page: 1,
    pageSize: 100,
    searchTerm: searchTerm || undefined
  });

  const employeeData = employee?.data?.data as EmployeeData[];

  return (
    <PageContainer>
      <LeaveForm pageTitle='إضافة موقف جديد' employeeData={employeeData} />
    </PageContainer>
  );
}
