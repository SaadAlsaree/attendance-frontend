import PageContainer from '@/components/layout/page-container';
import { employeeService } from '@/features/employee/api/employees.service';
import AddEditEmployeesForm from '@/features/employee/components/employees-form';
import { EmployeeData } from '@/features/employee/types/employees';
import { organizationalService } from '@/features/organizational-unit/api/organizational.service';
import { IOrganizationalUnitList } from '@/features/organizational-unit/types/organizational';
import React from 'react';

type Props = {
  params: Promise<{
    id: string;
  }>;
};
const AddEditEmployee = async ({ params }: Props) => {
  const { id } = await params;
  const employee = await employeeService.getEmployeeById(id);

  const employeeData = employee?.data as EmployeeData;

  const organizationalUnits =
    await organizationalService.getOrganizationalUnits();

  const organizationalUnitsList = (organizationalUnits?.data ||
    []) as IOrganizationalUnitList[];

  console.log(organizationalUnitsList);

  return (
    <PageContainer>
      <AddEditEmployeesForm
        initialData={employeeData}
        organizationalUnits={organizationalUnitsList}
      />
    </PageContainer>
  );
};

export default AddEditEmployee;
