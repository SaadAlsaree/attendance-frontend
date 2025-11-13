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
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

import { employeeService } from '../api/employees.service';
import { EmployeeData } from '../types/employees';
import { z } from 'zod';

// Schedule form validation schema
const scheduleFormSchema = z.object({
  employeeId: z.string().min(1, 'الموظف مطلوب'),
  dayOfWeek: z.string().min(1, 'اليوم مطلوب'),
  startTime: z.string().min(1, 'وقت البداية مطلوب'),
  endTime: z.string().min(1, 'وقت النهاية مطلوب'),
  isActive: z.boolean().default(true)
});

type ScheduleFormData = z.infer<typeof scheduleFormSchema>;

interface EmployeeSchedulesFormProps {
  scheduleId?: string;
  onSuccess?: () => void;
}

export default function EmployeeSchedulesForm({
  scheduleId,
  onSuccess
}: EmployeeSchedulesFormProps) {
  const { authApiCall } = useAuthApi();
  const [employees, setEmployees] = useState<EmployeeData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ScheduleFormData>({
    resolver: zodResolver(scheduleFormSchema),
    defaultValues: {
      employeeId: '',
      dayOfWeek: '',
      startTime: '',
      endTime: '',
      isActive: true
    }
  });

  // Load employees
  useEffect(() => {
    const loadEmployees = async () => {
      try {
        setIsLoading(true);
        const response = await authApiCall(() =>
          employeeService.getEmployeesClient()
        );
        if (response?.data) {
          setEmployees(response.data.data);
        }
      } catch (error) {
        console.error('Error loading employees:', error);
        toast.error('حدث خطأ في تحميل قائمة الموظفين');
      } finally {
        setIsLoading(false);
      }
    };

    loadEmployees();
  }, [authApiCall]);

  // Load schedule data if editing
  useEffect(() => {
    if (scheduleId) {
      const loadSchedule = async () => {
        try {
          // TODO: Replace with actual API call
          // const response = await authApiCall(() =>
          //   scheduleService.getScheduleByIdClient(scheduleId)
          // );
          // if (response?.data) {
          //   form.reset(response.data);
          // }
        } catch (error) {
          console.error('Error loading schedule:', error);
          toast.error('حدث خطأ في تحميل بيانات الجدول');
        }
      };

      loadSchedule();
    }
  }, [scheduleId, authApiCall, form]);

  const onSubmit = async (data: ScheduleFormData) => {
    try {
      setIsSubmitting(true);

      // TODO: Replace with actual API call
      // const success = scheduleId
      //   ? await authApiCall(() => scheduleService.updateScheduleClient(scheduleId, data))
      //   : await authApiCall(() => scheduleService.createScheduleClient(data));

      // Mock success for now
      const success = true;

      if (success) {
        toast.success(
          scheduleId ? 'تم تحديث الجدول بنجاح' : 'تم إنشاء الجدول بنجاح'
        );
        form.reset();
        onSuccess?.();
      } else {
        toast.error('حدث خطأ في حفظ الجدول');
      }
    } catch (error) {
      console.error('Error saving schedule:', error);
      toast.error('حدث خطأ في حفظ الجدول');
    } finally {
      setIsSubmitting(false);
    }
  };

  const dayOptions = [
    { value: 'Monday', label: 'الاثنين' },
    { value: 'Tuesday', label: 'الثلاثاء' },
    { value: 'Wednesday', label: 'الأربعاء' },
    { value: 'Thursday', label: 'الخميس' },
    { value: 'Friday', label: 'الجمعة' },
    { value: 'Saturday', label: 'السبت' },
    { value: 'Sunday', label: 'الأحد' }
  ];

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            {scheduleId ? 'تعديل جدول العمل' : 'إضافة جدول عمل جديد'}
          </CardTitle>
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
    <Card>
      <CardHeader>
        <CardTitle>
          {scheduleId ? 'تعديل جدول العمل' : 'إضافة جدول عمل جديد'}
        </CardTitle>
        <CardDescription>
          {scheduleId
            ? 'تعديل معلومات جدول العمل للموظف'
            : 'إضافة جدول عمل جديد للموظف'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            {/* Employee Selection */}
            <FormField
              control={form.control}
              name='employeeId'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>الموظف</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='اختر الموظف...' />
                      </SelectTrigger>
                    </FormControl>
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
                  <FormDescription>
                    اختر الموظف الذي سيتم إنشاء جدول العمل له
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Day of Week */}
            <FormField
              control={form.control}
              name='dayOfWeek'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>اليوم</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='اختر اليوم...' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {dayOptions.map((day) => (
                        <SelectItem key={day.value} value={day.value}>
                          {day.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>اختر يوم العمل</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Start Time */}
            <FormField
              control={form.control}
              name='startTime'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>وقت البداية</FormLabel>
                  <FormControl>
                    <Input type='time' placeholder='08:00' {...field} />
                  </FormControl>
                  <FormDescription>حدد وقت بداية العمل</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* End Time */}
            <FormField
              control={form.control}
              name='endTime'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>وقت النهاية</FormLabel>
                  <FormControl>
                    <Input type='time' placeholder='17:00' {...field} />
                  </FormControl>
                  <FormDescription>حدد وقت نهاية العمل</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Is Active */}
            <FormField
              control={form.control}
              name='isActive'
              render={({ field }) => (
                <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
                  <div className='space-y-0.5'>
                    <FormLabel className='text-base'>نشط</FormLabel>
                    <FormDescription>
                      تفعيل أو إلغاء تفعيل هذا الجدول
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className='flex gap-4'>
              <Button type='submit' disabled={isSubmitting}>
                {isSubmitting
                  ? 'جاري الحفظ...'
                  : scheduleId
                    ? 'تحديث الجدول'
                    : 'إنشاء الجدول'}
              </Button>
              <Button
                type='button'
                variant='outline'
                onClick={() => form.reset()}
              >
                إعادة تعيين
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
