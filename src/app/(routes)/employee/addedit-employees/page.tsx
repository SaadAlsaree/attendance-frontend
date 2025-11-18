import Unauthorized from '@/components/auth/unauthorized';
import PageContainer from '@/components/layout/page-container';
import AddEditEmployeesForm from '@/features/employee/components/employees-form';
import { organizationalService } from '@/features/organizational-unit/api/organizational.service';
import { IOrganizationalUnitList } from '@/features/organizational-unit/types/organizational';
import { usersPermissionsService } from '@/features/system/users-permissions/api/users-permissions.service';

export default async function addeditemployeesPage() {
  const organizationalUnits =
    await organizationalService.getOrganizationalUnits();

  const organizationalUnitsList = (organizationalUnits?.data ||
    []) as IOrganizationalUnitList[];

  const currentUser = await usersPermissionsService.getCurrentUser();

  if (currentUser?.role != 1) {
    return (
      <PageContainer>
        <Unauthorized />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <AddEditEmployeesForm organizationalUnits={organizationalUnitsList} />
    </PageContainer>
  );
}
