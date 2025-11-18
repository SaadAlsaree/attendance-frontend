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
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command';
import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { LeaveItem, LeaveTypeDisplay } from '@/features/leave/types/leaves';
import { LeavesService } from '@/features/leave/api/approvereject-leaves.service';
import { useAuthApi } from '@/hooks/use-auth-api';
import {
  formSchema,
  LeaveFormValues,
  formatLeavePayload,
  formatUpdateLeavePayload,
  formatDateForInput,
  LEAVE_STATUS_DISPLAY
} from '../utils/leaves';
import { Spinner } from '@/components/spinner';
import { Check, ChevronsUpDown } from 'lucide-react';
import { EmployeeData } from '@/features/employee/types/employees';

interface LeaveFormProps {
  initialData?: LeaveItem | null;
  pageTitle: string;
  leaveId?: string;
  employeeData?: EmployeeData[];
}

export default function LeaveForm({
  initialData,
  pageTitle,
  leaveId,
  employeeData
}: LeaveFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { authApiCall } = useAuthApi();

  // Filter employees based on search term
  const filteredEmployees = employeeData?.filter((employee) =>
    employee.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle search input change
  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
    router.push(`/leave/new?searchTerm=${value}`);
  }, []);

  // initial values
  const defaultValues = initialData
    ? {
        employeeId: initialData.employeeId,
        leaveType: initialData.leaveType,
        startDate: formatDateForInput(initialData.startDate),
        endDate: formatDateForInput(initialData.endDate),
        reason: initialData.reason,
        status: initialData.status,
        rejectionReason: initialData.rejectionReason || ''
      }
    : {};

  // form
  const form = useForm<LeaveFormValues>({
    resolver: zodResolver(formSchema(initialData || null)),
    defaultValues
  });

  // submit
  const onSubmit = async (data: LeaveFormValues) => {
    try {
      setLoading(true);
      if (initialData) {
        // Update existing leave
        const response = await authApiCall(() =>
          LeavesService.updateLeave(
            initialData.id,
            formatUpdateLeavePayload(data) as LeaveItem
          )
        );

        if (response) {
          toast.success('تم تعديل طلب الإجازة بنجاح!');
          router.push('/leave/leaves');
          router.refresh();
        } else {
          toast.error('لم يتم تعديل طلب الإجازة!');
        }
      } else {
        // Create new leave
        const response = await authApiCall(() =>
          LeavesService.createLeave(formatLeavePayload(data) as LeaveItem)
        );

        if (response) {
          toast.success('تم إنشاء طلب الإجازة بنجاح!');
          router.push('/leave');
          router.refresh();
        } else {
          toast.error('لم يتم إنشاء طلب الإجازة!');
        }
      }
    } catch (error) {
      console.error(error);
      toast.error('حدث خطأ!');
    } finally {
      setLoading(false);
    }
  };

  // Get leave type options
  const leaveTypeOptions = Object.entries(LeaveTypeDisplay).map(
    ([value, label]) => ({
      value: value,
      label: label
    })
  );

  // Get status options
  const statusOptions = Object.entries(LEAVE_STATUS_DISPLAY).map(
    ([value, label]) => ({
      value: value,
      label: label
    })
  );

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
              {initialData?.id ? (
                <FormField
                  control={form.control}
                  name='employeeId'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>اسم الموظف</FormLabel>
                      <FormControl>
                        <Input
                          type='text'
                          placeholder='اسم الموظف'
                          {...field}
                          value={initialData?.fullName}
                          disabled
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : (
                <FormField
                  control={form.control}
                  name='employeeId'
                  render={({ field }) => (
                    <FormItem className='flex flex-col'>
                      <FormLabel>اسم الموظف</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl className='w-full'>
                            <Button
                              variant='outline'
                              role='combobox'
                              className={cn(
                                'w-full justify-between',
                                !field.value && 'text-muted-foreground'
                              )}
                            >
                              {field.value
                                ? employeeData?.find(
                                    (employee) => employee.id === field.value
                                  )?.fullName
                                : 'اختر موظف'}
                              <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className='w-[300px] p-0'>
                          <Command>
                            <CommandInput
                              placeholder='ابحث عن موظف...'
                              value={searchTerm}
                              onValueChange={handleSearchChange}
                            />
                            <CommandList>
                              <CommandEmpty>لا يوجد موظفين</CommandEmpty>
                              <CommandGroup>
                                {filteredEmployees?.map((employee) => (
                                  <CommandItem
                                    value={employee.fullName}
                                    key={employee.id}
                                    onSelect={() => {
                                      form.setValue('employeeId', employee.id);
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        'mr-2 h-4 w-4',
                                        employee.id === field.value
                                          ? 'opacity-100'
                                          : 'opacity-0'
                                      )}
                                    />
                                    {employee.fullName}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name='leaveType'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>نوع الموقف</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(Number(value))}
                      value={field.value?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger className='w-full'>
                          <SelectValue placeholder='اختر نوع الموقف' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {leaveTypeOptions.map((option) => (
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

            <div className='grid gap-4 md:grid-cols-2'>
              <FormField
                control={form.control}
                name='startDate'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>تاريخ البداية</FormLabel>
                    <FormControl>
                      <Input
                        type='datetime-local'
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
                    <FormLabel>تاريخ النهاية</FormLabel>
                    <FormControl>
                      <Input
                        type='datetime-local'
                        placeholder='اختر تاريخ النهاية'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name='reason'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ملاحظات</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='أدخل ملاحظات '
                      className='resize-none'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {initialData && (
              <div className='grid gap-4 md:grid-cols-2'>
                <FormField
                  control={form.control}
                  name='status'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>الحالة</FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange(Number(value))}
                        defaultValue={field.value?.toString()}
                      >
                        <FormControl>
                          <SelectTrigger className='w-full'>
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
                <FormField
                  control={form.control}
                  name='rejectionReason'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>سبب الرفض (اختياري)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder='أدخل سبب الرفض إذا كان مطلوباً'
                          className='resize-none'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            <div className='flex items-center gap-2 pt-4'>
              <Button
                type='submit'
                disabled={loading}
                className='flex items-center gap-2'
              >
                {loading ? <Spinner className='h-4 w-4' /> : <span>حفظ</span>}
              </Button>
              <Button
                type='button'
                variant='outline'
                onClick={() => router.push('/leave')}
                disabled={loading}
              >
                إلغاء
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
