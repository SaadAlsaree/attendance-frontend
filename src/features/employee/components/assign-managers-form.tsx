'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useAuthApi } from '@/hooks/use-auth-api';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

import { employeeService } from '../api/employees.service';
import { EmployeeData, Manager } from '../types/employees';
import { managerAssignmentSchema } from '../utils/employees';
import { z } from 'zod';
import {
  columns,
  DataTable,
  EmployeeScheduleData
} from './employee-schedules-tables';

type AssignManagerFormData = z.infer<typeof managerAssignmentSchema>;

interface AssignManagersFormProps {
  employeeId?: string;
  onSuccess?: () => void;
}

export default function AssignManagersForm({
  employeeId,
  onSuccess
}: AssignManagersFormProps) {
  const { authApiCall } = useAuthApi();
  const [employees, setEmployees] = useState<EmployeeData[]>([]);
  const [managers, setManagers] = useState<Manager[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeData | null>(
    null
  );

  const form = useForm<AssignManagerFormData>({
    resolver: zodResolver(managerAssignmentSchema),
    defaultValues: {
      managerId: ''
    }
  });

  // Load employees and managers
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);

        // Load employees
        const employeesResponse = await authApiCall(() =>
          employeeService.getEmployeesClient()
        );

        // Load managers
        const managersResponse = await authApiCall(() =>
          employeeService.getManagersClient()
        );

        if (employeesResponse?.data) {
          setEmployees(employeesResponse.data.data);
        }

        if (managersResponse?.data) {
          setManagers(managersResponse.data);
        }
      } catch (error) {
        console.error('Error loading data:', error);
        toast.error('حدث خطأ في تحميل البيانات');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [authApiCall]);

  const onSubmit = async (data: AssignManagerFormData) => {
    if (!selectedEmployee) {
      toast.error('يرجى اختيار موظف');
      return;
    }

    try {
      const success = await authApiCall(() =>
        employeeService.assignManagerClient(
          selectedEmployee.id.toString(),
          data
        )
      );

      if (success) {
        toast.success('تم تعيين المدير بنجاح');
        form.reset();
        setSelectedEmployee(null);
        onSuccess?.();
      } else {
        toast.error('حدث خطأ في تعيين المدير');
      }
    } catch (error) {
      console.error('Error assigning manager:', error);
      toast.error('حدث خطأ في تعيين المدير');
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>تعيين المديرين</CardTitle>
          <CardDescription>جاري التحميل...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='flex h-32 items-center justify-center'>
            <div className='border-primary h-8 w-8 animate-spin rounded-full border-b-2'></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Assign Manager Form */}
      <Card>
        <CardHeader>
          <CardTitle>تعيين المديرين</CardTitle>
          <CardDescription>اختر موظف وقم بتعيين مدير له</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
              {/* Employee Selection */}
              <div className='space-y-4'>
                <div>
                  <label className='text-sm font-medium'>اختر الموظف</label>
                  <Select
                    value={selectedEmployee?.id.toString() || ''}
                    onValueChange={(value) => {
                      const employee = employees.find(
                        (emp) => emp.id.toString() === value
                      );
                      setSelectedEmployee(employee || null);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder='اختر موظف...' />
                    </SelectTrigger>
                    <SelectContent>
                      {employees.map((employee) => (
                        <SelectItem
                          key={employee.id}
                          value={employee.id.toString()}
                        >
                          {employee.fullName} - {employee.code}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedEmployee && (
                  <div className='bg-muted/50 rounded-lg border p-4'>
                    <h4 className='mb-2 font-medium'>الموظف المحدد:</h4>
                    <p className='text-muted-foreground text-sm'>
                      {selectedEmployee.fullName} - {selectedEmployee.code}
                    </p>
                    <p className='text-muted-foreground text-sm'>
                      المدير الحالي:{' '}
                      {selectedEmployee.managerName || 'غير محدد'}
                    </p>
                  </div>
                )}
              </div>

              {/* Manager Selection */}
              <FormField
                control={form.control}
                name='managerId'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>المدير</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='اختر مدير...' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {managers.map((manager) => (
                          <SelectItem key={manager.id} value={manager.id}>
                            {manager.fullName} - {manager.employeeNumber}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      اختر المدير الذي سيتم تعيينه للموظف المحدد
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type='submit' disabled={!selectedEmployee}>
                تعيين المدير
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Employees List */}
      <Card>
        <CardHeader>
          <CardTitle>قائمة الموظفين</CardTitle>
          <CardDescription>عرض جميع الموظفين مع مديريهم</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={employees as unknown as EmployeeScheduleData[]}
            searchPlaceholder='البحث في الموظفين...'
          />
        </CardContent>
      </Card>
    </div>
  );
}
