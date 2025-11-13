import { employeeService } from '@/features/employee/api/employees.service';
import EmployeesViewPage from '@/features/employee/components/employees-view-page';
import { EmployeeData } from '@/features/employee/types/employees';
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
  return (
    <div>
      <EmployeesViewPage employeeData={employeeData} />
    </div>
  );
};

export default AddEditEmployee;
