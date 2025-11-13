import { employeeService } from '@/features/employee/api/employees.service';
import PageContainer from '@/components/layout/page-container';
import EmployeeViewPage from '@/features/employee/components/employee-view-page';

export default async function viewprofilePage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: employeeId } = await params;

  const data = await employeeService.getEmployeeById(employeeId);
  const employee = data?.data ;

  return (
    <PageContainer>
      <EmployeeViewPage
        employee={employee as any}
       
      />
    </PageContainer>
  );
}
