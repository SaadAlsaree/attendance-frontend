'use client';

import { useState } from 'react';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { IconLogin } from '@tabler/icons-react';
import CheckInFormDialog from '@/features/attendance/components/check-in-form';
import {
  AttendanceResponse,
  AttendanceStatus
} from '@/features/attendance/types/attendance';
import { EmployeeData } from '@/features/employee/types/employees';

type Props = {
  employees: EmployeeData[];
};

export default function AttendanceActions({ employees }: Props) {
  const [checkInDialogOpen, setCheckInDialogOpen] = useState(false);
  const [currentAttendance, setCurrentAttendance] =
    useState<AttendanceResponse | null>(null);

  const employeesList = employees.map((employee) => ({
    id: employee.id.toString(),
    name: employee.fullName,
    email: employee.userLogin
  }));

  const handleCheckIn = () => {
    // For now, we'll create a mock attendance object
    // In a real app, you might want to get the current user's attendance record
    const today = new Date();
    const mockAttendance: AttendanceResponse = {
      id: 'current-attendance',
      employeeId: '1',
      organizationId: 'current-org',
      date: today.toISOString().split('T')[0], // استخدام التاريخ الحالي
      status: AttendanceStatus.Completed, // Assuming 0 is the default status
      createdAt: today.toISOString(),
      employeeName: 'الموظف الحالي',
      employeeNumber: 'EMP001'
    };

    setCurrentAttendance(mockAttendance);
    setCheckInDialogOpen(true);
  };

  // const handleCheckOut = () => {
  //   // For now, we'll create a mock attendance object
  //   // In a real app, you might want to get the current user's attendance record
  //   const mockAttendance: AttendanceResponse = {
  //     id: 'current-attendance',
  //     employeeId: 'current-employee',
  //     organizationId: 'current-org',
  //     date: new Date().toISOString().split('T')[0],
  //     checkInTime: new Date().toISOString(), // Mock check-in time
  //     status: AttendanceStatus.Completed, // Assuming 0 is the default status
  //     createdAt: new Date().toISOString(),
  //     employeeName: 'الموظف الحالي',
  //     employeeNumber: 'EMP001'
  //   };

  //   setCurrentAttendance(mockAttendance);
  //   setCheckOutDialogOpen(true);
  // };

  const handleSuccess = () => {
    // Refresh the page or update the data
    window.location.reload();
  };

  return (
    <>
      <div className='flex gap-2'>
        <button
          onClick={handleCheckIn}
          className={cn(
            buttonVariants({ variant: 'default' }),
            'bg-blue-600 text-xs hover:bg-blue-700 md:text-sm'
          )}
        >
          <IconLogin className='mr-2 h-4 w-4' /> تسجيل الحضور لموظف
        </button>
      </div>

      {/* Check-in Dialog */}
      {currentAttendance && (
        <CheckInFormDialog
          employees={employeesList}
          isOpen={checkInDialogOpen}
          onClose={() => setCheckInDialogOpen(false)}
          attendance={currentAttendance}
          onSuccess={handleSuccess}
        />
      )}

      {/* Check-out Dialog */}
    </>
  );
}
