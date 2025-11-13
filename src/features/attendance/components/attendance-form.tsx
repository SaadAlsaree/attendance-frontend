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
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { AttendanceResponse } from '@/features/attendance/types';
import { attendanceService } from '@/features/attendance/api';
import { useAuthApi } from '@/hooks/use-auth-api';
import {
  attendanceFormSchema,
  AttendanceFormValues,
  formatAttendancePayload,
  getStatusOptions,
  formatTimeForInput
} from '../utils/attendance-form';
import { Spinner } from '@/components/spinner';

interface AttendanceFormProps {
  initialData: AttendanceResponse | null;
  pageTitle: string;
  attendanceId?: string;
}

export default function AttendanceForm({
  initialData,
  pageTitle,
  attendanceId
}: AttendanceFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { authApiCall } = useAuthApi();

  // initial values
  const defaultValues = initialData
    ? {
        checkInTime:
          formatTimeForInput(initialData.checkInTime || undefined) || '',
        checkOutTime:
          formatTimeForInput(initialData.checkOutTime || undefined) || '',
        notes: initialData.notes || '',
        status: initialData.status || undefined
      }
    : {
        checkInTime: '',
        checkOutTime: '',
        notes: '',
        status: undefined
      };

  // form
  const form = useForm<AttendanceFormValues>({
    resolver: zodResolver(attendanceFormSchema(initialData)),
    defaultValues
  });

  // submit
  const onSubmit = async (data: AttendanceFormValues) => {
    try {
      setLoading(true);

      if (initialData && attendanceId) {
        const response = await authApiCall(() =>
          attendanceService.updateAttendance(
            attendanceId,
            formatAttendancePayload(data)
          )
        );

        if (response) {
          toast.success('تم تعديل الحضور والانصراف بنجاح!');
          router.push('/attendance/view-all-attendance');
          router.refresh();
        } else {
          toast.error('لم يتم تعديل الحضور والانصراف!');
        }
      } else {
        toast.error('بيانات غير صحيحة للتعديل!');
      }
    } catch (error) {
      console.error(error);
      toast.error('حدث خطأ!');
    } finally {
      setLoading(false);
    }
  };

  const statusOptions = getStatusOptions();

  return (
    <Card className='mx-auto w-full'>
      <CardHeader>
        <CardTitle className='text-left text-2xl font-bold'>
          {pageTitle}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Separator />
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='w-full space-y-4'
          >
            <div className='grid gap-4 md:grid-cols-2'>
              <FormField
                control={form.control}
                name='checkInTime'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>وقت الحضور</FormLabel>
                    <FormControl>
                      <Input
                        type='datetime-local'
                        placeholder='اختر وقت الحضور'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='checkOutTime'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>وقت الانصراف</FormLabel>
                    <FormControl>
                      <Input
                        type='datetime-local'
                        placeholder='اختر وقت الانصراف'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className='grid gap-4 md:grid-cols-2'>
              <FormField
                control={form.control}
                name='status'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الحالة</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value?.toString()}
                    >
                      <FormControl className='w-full'>
                        <SelectTrigger>
                          <SelectValue placeholder='اختر الحالة' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {statusOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className='space-y-4'>
              <FormField
                control={form.control}
                name='notes'
                render={({ field }) => (
                  <FormItem className='col-span-2'>
                    <FormLabel>الملاحظات</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='أدخل الملاحظات'
                        {...field}
                        rows={3}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button disabled={loading} type='submit' className='ml-auto'>
              {initialData ? 'تعديل' : 'إنشاء'}
              {loading && (
                <Spinner variant='default' className='ml-2 h-4 w-4' />
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
