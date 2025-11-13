'use client';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { scheduleService } from '@/features/schedule/api/schedule.service';
import { useAuthApi } from '@/hooks/use-auth-api';
import { Spinner } from '@/components/spinner';
import { SCHEDULE_TYPE_OPTIONS } from '../types/schedules';

// Form schema for schedule assignment
const assignScheduleSchema = z.object({
  employeeIds: z.array(z.string()).min(1, 'يجب اختيار موظف واحد على الأقل'),
  scheduleType: z.string().min(1, 'نوع الجدول مطلوب'),
  startDate: z.string().min(1, 'تاريخ البداية مطلوب'),
  endDate: z.string().optional(),
  isActive: z.boolean().default(true),
  notes: z.string().optional(),
  excludedDates: z.array(z.string()).default([])
});

type AssignScheduleFormValues = z.infer<typeof assignScheduleSchema>;

interface AssignSchedulesProps {
  employees: Array<{ id: string; name: string }>;
  pageTitle: string;
}

export default function AssignSchedules({
  employees,
  pageTitle
}: AssignSchedulesProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { authApiCall } = useAuthApi();

  // initial values
  const defaultValues: AssignScheduleFormValues = {
    employeeIds: [],
    scheduleType: '',
    startDate: '',
    endDate: '',
    isActive: true,
    notes: '',
    excludedDates: []
  };

  // form
  const form = useForm<AssignScheduleFormValues>({
    resolver: zodResolver(assignScheduleSchema),
    defaultValues
  });

  const employeeOptions = employees.map((emp) => ({
    label: emp.name,
    value: emp.id
  }));

  // submit
  const onSubmit = async (data: AssignScheduleFormValues) => {
    try {
      setLoading(true);

      // Create schedules for each selected employee
      const promises = data.employeeIds.map((employeeId) => {
        const scheduleData = {
          employeeId,
          startDate: data.startDate,
          endDate: data.endDate,
          scheduleType: data.scheduleType,
          isActive: data.isActive,
          notes: data.notes,
          scheduleDays: [], // This would need to be configured based on schedule type
          excludedDates: data.excludedDates
        };

        return scheduleService.createScheduleClient(scheduleData);
      });

      const results = await Promise.all(promises);
      const successCount = results.filter((result) => result !== null).length;

      if (successCount > 0) {
        toast.success(`تم إنشاء ${successCount} جدول بنجاح!`);
        router.push('/schedule/schedules');
        router.refresh();
      } else {
        toast.error('لم يتم إنشاء أي جدول!');
      }
    } catch (error) {
      console.error(error);
      toast.error('حدث خطأ!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className='mx-auto w-full'>
      <CardHeader>
        <CardTitle className='text-left text-2xl font-bold'>
          {pageTitle}
        </CardTitle>
        <Separator />
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='w-full space-y-4'
          >
            <div className='grid gap-4 md:grid-cols-2'>
              <FormField
                control={form.control}
                name='scheduleType'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>نوع الجدول</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl className='w-full'>
                        <SelectTrigger>
                          <SelectValue placeholder='اختر نوع الجدول' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {SCHEDULE_TYPE_OPTIONS.map((option) => (
                          <SelectItem
                            key={option.value}
                            value={option.value.toString()}
                          >
                            {option.displayName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='startDate'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>تاريخ البداية</FormLabel>
                    <FormControl>
                      <Input
                        type='date'
                        placeholder='اختر تاريخ البداية'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='endDate'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>تاريخ النهاية (اختياري)</FormLabel>
                    <FormControl>
                      <Input
                        type='date'
                        placeholder='اختر تاريخ النهاية'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='isActive'
                render={({ field }) => (
                  <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
                    <div className='space-y-0.5'>
                      <FormLabel className='text-base'>الحالة</FormLabel>
                      <div className='text-muted-foreground text-sm'>
                        تفعيل أو إلغاء تفعيل الجداول
                      </div>
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
            </div>

            <FormField
              control={form.control}
              name='notes'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>الملاحظات</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='أدخل الملاحظات (اختياري)'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='flex items-center justify-end space-x-2'>
              <Button
                type='button'
                variant='outline'
                onClick={() => router.push('/schedule/schedules')}
              >
                إلغاء
              </Button>
              <Button type='submit' disabled={loading}>
                {loading && <Spinner className='mr-2 h-4 w-4' />}
                تعيين الجداول
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
