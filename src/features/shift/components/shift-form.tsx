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
import { ShiftData } from '@/features/shift/types/shift';
import { shiftService } from '@/features/shift/api/shift.service';
import { useAuthApi } from '@/hooks/use-auth-api';
import {
  formSchema,
  ShiftFormValues,
  formatShiftPayload,
  formatShiftUpdatePayload,
  convertBackendTimeTo24Hour
} from '../utils/shift';
import { SHIFT_TYPE_OPTIONS } from '../types/shift';
import { Spinner } from '@/components/spinner';
import { CustomSwitch } from '@/components/ui/custom-switch';
import { IOrganizationalUnitList } from '@/features/organizational-unit/types/organizational';
import { Switch } from '@/components/ui/switch';

interface ShiftFormProps {
  initialData: ShiftData | null;
  pageTitle: string;
  organizations?: Array<IOrganizationalUnitList>;
}

export default function ShiftForm({
  initialData,
  pageTitle,
  organizations = []
}: ShiftFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { authApiCall } = useAuthApi();

  // initial values
  const defaultValues = initialData
    ? {
        name: initialData.name || '',
        description: initialData.description || '',
        startTime: convertBackendTimeTo24Hour(initialData.startTime) || '',
        endTime: convertBackendTimeTo24Hour(initialData.endTime) || '',
        shiftType: initialData.shiftType?.toString() || '',
        isActive: initialData.isActive ?? true,
        gracePeriodMinutes: initialData.gracePeriodMinutes || undefined,
        maxLateMinutes: initialData.maxLateMinutes || undefined,
        allowEarlyCheckIn: initialData.allowEarlyCheckIn ?? false,
        allowLateCheckOut: initialData.allowLateCheckOut ?? false
      }
    : {};

  // form
  const form = useForm<ShiftFormValues>({
    resolver: zodResolver(formSchema(initialData)),
    defaultValues
  });

  const organizationOptions = organizations.map((org) => ({
    label: org.unitName,
    value: org.id
  }));

  // submit
  const onSubmit = async (data: ShiftFormValues) => {
    try {
      setLoading(true);

      if (initialData?.id) {
        const response = await authApiCall(async () =>
          shiftService.updateShiftClient(
            initialData.id!,
            formatShiftUpdatePayload(data)
          )
        );
        console.log('response', response);
        if (response) {
          toast.success('تم تعديل المناوبة بنجاح!');
          router.push('/schedule/shifts');
          router.refresh();
        } else {
          toast.error('لم يتم تعديل المناوبة!');
        }
      } else {
        const response = await authApiCall(async () =>
          shiftService.createShiftClient(formatShiftPayload(data))
        );
        console.log('response', response);
        if (response) {
          toast.success('تم إنشاء المناوبة بنجاح!');
          router.push('/schedule/shifts');
          router.refresh();
        } else {
          toast.error('لم يتم إنشاء المناوبة!');
        }
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
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>اسم المناوبة</FormLabel>
                    <FormControl>
                      <Input placeholder='أدخل اسم المناوبة' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='shiftType'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>نوع المناوبة</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl className='w-full'>
                        <SelectTrigger>
                          <SelectValue placeholder='اختر نوع المناوبة' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {SHIFT_TYPE_OPTIONS.map(
                          (option: {
                            value: number;
                            label: string;
                            displayName: string;
                          }) => (
                            <SelectItem
                              key={option.value}
                              value={option.value.toString()}
                            >
                              {option.displayName}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='startTime'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>وقت البداية</FormLabel>
                    <FormControl>
                      <Input
                        type='time'
                        placeholder='أدخل وقت البداية'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='endTime'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>وقت النهاية</FormLabel>
                    <FormControl>
                      <Input
                        type='time'
                        placeholder='أدخل وقت النهاية'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='gracePeriodMinutes'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>فترة السماح (دقائق)</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        placeholder='أدخل فترة السماح'
                        {...field}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value
                              ? parseInt(e.target.value)
                              : undefined
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='maxLateMinutes'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>أقصى تأخير مسموح (دقائق)</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        placeholder='أدخل أقصى تأخير مسموح'
                        {...field}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value
                              ? parseInt(e.target.value)
                              : undefined
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className='space-y-4'>
              <FormField
                control={form.control}
                name='description'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الوصف</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='أدخل وصف المناوبة'
                        className='resize-none'
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
                name='allowEarlyCheckIn'
                render={({ field }) => (
                  <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
                    <div className='space-y-0.5'>
                      <FormLabel className='text-base'>
                        السماح بالتسجيل المبكر
                      </FormLabel>
                      <div className='text-muted-foreground text-sm'>
                        السماح للموظفين بالتسجيل قبل وقت البداية
                      </div>
                    </div>
                    <FormControl>
                      <Switch
                        dir='ltr'
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='allowLateCheckOut'
                render={({ field }) => (
                  <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
                    <div className='space-y-0.5'>
                      <FormLabel className='text-base'>
                        السماح بالتسجيل المتأخر
                      </FormLabel>
                      <div className='text-muted-foreground text-sm'>
                        السماح للموظفين بالتسجيل بعد وقت النهاية
                      </div>
                    </div>
                    <FormControl>
                      <Switch
                        dir='ltr'
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div className='flex items-center justify-between rounded-lg border p-4'>
              <div className='space-y-0.5'>
                <FormLabel className='text-base'>حالة المناوبة</FormLabel>
                <div className='text-muted-foreground text-sm'>
                  تفعيل أو إلغاء تفعيل المناوبة
                </div>
              </div>
              <FormField
                control={form.control}
                name='isActive'
                render={({ field }) => (
                  <FormControl>
                    <Switch
                      dir='ltr'
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                )}
              />
            </div>

            <div className='flex justify-end space-x-2'>
              <Button
                type='button'
                variant='outline'
                onClick={() => router.back()}
                disabled={loading}
              >
                إلغاء
              </Button>
              <Button type='submit' disabled={loading}>
                {loading && <Spinner className='mr-2 h-4 w-4' />}
                {initialData ? 'تحديث' : 'إنشاء'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
