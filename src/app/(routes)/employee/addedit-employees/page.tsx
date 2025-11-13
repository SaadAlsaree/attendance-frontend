import PageContainer from '@/components/layout/page-container';
import AddEditEmployeesForm from '@/features/employee/components/employees-form';
import { organizationalService } from '@/features/organizational-unit/api/organizational.service';
import { IOrganizationalUnitList } from '@/features/organizational-unit/types/organizational';

export default async function addeditemployeesPage() {
  const organizationalUnits =
    await organizationalService.getOrganizationalUnits();

  const organizationalUnitsList = (organizationalUnits?.data ||
    []) as IOrganizationalUnitList[];

  return (
    <PageContainer>
      <AddEditEmployeesForm organizationalUnits={organizationalUnitsList} />
    </PageContainer>
  );
}
