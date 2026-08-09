'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Table } from '@/components/ui/table';
import { EmployeeOvertimeSummary } from '../../types/overtime-report';

type Props = {
  employees: EmployeeOvertimeSummary[];
};

// Hours come back as decimals (minutes / 60); show 0 as '-' to match the report convention.
const fmtHours = (h: number) =>
  h ? Number(h).toFixed(2) : '-';

const OvertimeReportTable = ({ employees }: Props) => {
  return (
    <Card>
      <CardContent className='p-0'>
        <div className='overflow-x-auto'>
          <Table>
            <thead>
              <tr className='border-b text-sm'>
                <th className='p-3 text-right'>الموظف</th>
                <th className='p-3 text-right'>الجهة</th>
                <th className='p-3 text-center'>إجمالي ساعات الإضافي</th>
                <th className='p-3 text-center'>أيام الإضافي</th>
                <th className='p-3 text-center'>متوسط الإضافي / يوم</th>
              </tr>
            </thead>
            <tbody>
              {employees.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className='text-muted-foreground p-6 text-center'
                  >
                    لا توجد سجلات عمل إضافي ضمن المدى المحدد
                  </td>
                </tr>
              ) : (
                employees.map((emp) => (
                  <tr key={emp.employeeId} className='border-b text-sm'>
                    <td className='p-3 text-right'>{emp.employeeName}</td>
                    <td className='p-3 text-right'>{emp.departmentName}</td>
                    <td className='p-3 text-center'>
                      {fmtHours(emp.totalOvertimeHours)}
                    </td>
                    <td className='p-3 text-center'>{emp.overtimeDays || '-'}</td>
                    <td className='p-3 text-center'>
                      {fmtHours(emp.averageOvertimePerDay)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default OvertimeReportTable;
