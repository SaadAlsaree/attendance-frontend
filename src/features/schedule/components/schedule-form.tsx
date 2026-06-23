'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import {
  format,
  addDays,
  differenceInDays,
  isAfter,
  isBefore
} from 'date-fns';
import {
  CalendarIcon,
  Plus,
  Trash2,
  Users,
  Calendar,
  Clock,
  FileText,
  CheckCircle,
  Info,
  Check,
  ChevronsUpDown
} from 'lucide-react';

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { cn } from '@/lib/utils';

// Import types and schemas
import {
  ScheduleType,
  type AttendanceScheduleResponse,
  SCHEDULE_TYPE_OPTIONS
} from '../types/schedules';
import {
  formSchema,
  type FormData,
  formatSchedulePayload,
  formatScheduleUpdatePayload,
  formatDate
} from '../utils/schedule';
import { EmployeeData } from '@/features/employee/types/employees';
import { ShiftData } from '@/features/shift';
import { scheduleService } from '@/features/schedule/api/schedule.service';
import { useAuthApi } from '@/hooks/use-auth-api';
import { toast } from 'sonner';
import { getDayName } from '@/utils/date.utils';
import { Switch } from '@/components/ui/switch';

interface AttendanceScheduleFormProps {
  employeeData?: EmployeeData[];
  shifts: ShiftData[];
  initialData?: AttendanceScheduleResponse | null;
}

function normalizeToStartOfDay(date: Date): Date {
  const normalizedDate = new Date(date);
  normalizedDate.setHours(0, 0, 0, 0);
  return normalizedDate;
}

export default function AttendanceScheduleForm({
  employeeData,
  shifts = [],
  initialData = null
}: AttendanceScheduleFormProps) {
  const { authApiCall } = useAuthApi();
  const router = useRouter();
  const [startDateOpen, setStartDateOpen] = useState(false);
  const [endDateOpen, setEndDateOpen] = useState(false);
  const [excludedDateOpen, setExcludedDateOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Employees are searched server-side (by full name OR code) via the page's `searchTerm`
  // query param, so render the server-provided list directly — no client-side re-filter
  // (which previously stripped matches found by employee code).
  const displayedEmployees = employeeData;

  // Handle search input change — keep the input responsive, debounce the server round-trip
  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchTerm(value);

      if (searchDebounceRef.current) {
        clearTimeout(searchDebounceRef.current);
      }

      searchDebounceRef.current = setTimeout(() => {
        const qs = value ? `?searchTerm=${encodeURIComponent(value)}` : '';
        if (initialData) {
          router.push(`/schedule/${initialData.id}${qs}`);
        } else {
          router.push(`/schedule/create-schedule${qs}`);
        }
      }, 350);
    },
    [router, initialData]
  );

  // Clear any pending debounced navigation on unmount
  useEffect(() => {
    return () => {
      if (searchDebounceRef.current) {
        clearTimeout(searchDebounceRef.current);
      }
    };
  }, []);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema(initialData)),
    defaultValues: {
      employeeId: initialData?.employeeId || '',
      startDate: initialData?.startDate || '',
      endDate: initialData?.endDate || '',
      scheduleType:
        initialData?.scheduleType?.toString() ||
        ScheduleType.Regular.toString(),
      isActive: initialData?.isActive ?? true,
      notes: initialData?.notes || '',
      scheduleDays: initialData?.scheduleDays || [],
      excludedDates: initialData?.excludedDates || []
    }
  });

  const { fields, append, remove, replace } = useFieldArray({
    control: form.control,
    name: 'scheduleDays'
  });

  const watchedStartDate = form.watch('startDate');
  const watchedEndDate = form.watch('endDate');

  // Helper function to convert JavaScript day (0-6) to our day format (1-7)
  const getDayOfWeek = (date: Date): number => {
    const jsDay = date.getDay(); // 0 = Sunday, 1 = Monday, etc.
    // Convert to our format: 1 = Sunday, 2 = Monday, etc.
    // JavaScript: 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat
    // Our format: 1=Sun, 2=Mon, 3=Tue, 4=Wed, 5=Thu, 6=Fri, 7=Sat
    return jsDay === 0 ? 1 : jsDay + 1;
  };

  // Generate schedule days based on date range (only in create mode)
  useEffect(() => {
    if (!initialData && watchedStartDate && watchedEndDate) {
      const start = new Date(watchedStartDate);
      const end = new Date(watchedEndDate);
      const diffInDays = differenceInDays(end, start);

      if (diffInDays >= 0) {
        const newScheduleDays = [];
        for (let i = 0; i <= diffInDays; i++) {
          const currentDate = addDays(start, i);
          const dayOfWeek = getDayOfWeek(currentDate);

          newScheduleDays.push({
            shiftId: '',
            dayOfWeek,
            scheduleDayDate: format(currentDate, 'yyyy-MM-dd'),
            isActive: true,
            notes: ''
          });
        }
        replace(newScheduleDays);
      }
    }
  }, [watchedStartDate, watchedEndDate, replace, initialData]);

  const handleSubmit = async (data: FormData) => {
    setIsLoading(true);

    // Additional validation (only in create mode)
    if (!initialData) {
      if (!data.scheduleDays || data.scheduleDays.length === 0) {
        toast.error('يجب إضافة أيام للجدولة');
        setIsLoading(false);
        return;
      }

      const daysWithoutShifts = data.scheduleDays.filter(
        (day) => day.isActive && !day.shiftId
      );
      if (daysWithoutShifts.length > 0) {
        toast.error(`يجب اختيار وردية لـ ${daysWithoutShifts.length} يوم نشط`);
        setIsLoading(false);
        return;
      }
    }

    try {
      if (initialData) {
        // Transform form data to match UpdateAttendanceScheduleRequest interface
        const updateData = formatScheduleUpdatePayload(data, initialData.id!);

        const response = await authApiCall(async () => {
          return scheduleService.updateScheduleClient(
            initialData.id!,
            updateData
          );
        });

        if (response) {
          if (response) {
            toast.success('تم تعديل الجدولة بنجاح');
            router.push('/schedule');
          } else {
            toast.error('حدث خطأ أثناء حفظ الجدولة');
          }
        }
      } else {
        const payload = formatSchedulePayload(data);
        const response = await authApiCall(async () => {
          return scheduleService.createScheduleClient(payload);
        });

        if (response) {
          toast.success('تم إنشاء الجدولة بنجاح');
          router.push('/schedule');
        } else {
          toast.error('الجدول موجود بالفعل لهذا التاريخ');
        }
      }
    } catch (error) {
      console.error('Schedule creation error:', error);
      toast.error('حدث خطأ أثناء حفظ الجدولة');
    } finally {
      setIsLoading(false);
    }
  };

  const shiftOptions = shifts.map((item) => ({
    value: item.id,
    label: item.name
  }));

  const addExcludedDate = (date: Date) => {
    const dateString = format(date, 'yyyy-MM-dd');
    const currentExcluded = form.getValues('excludedDates');

    // Check if date is within the schedule range
    if (watchedStartDate && watchedEndDate) {
      const start = new Date(watchedStartDate);
      const end = new Date(watchedEndDate);
      if (
        isBefore(date, normalizeToStartOfDay(start)) ||
        isAfter(date, normalizeToStartOfDay(end))
      ) {
        toast.error('التاريخ المستثنى يجب أن يكون ضمن فترة الجدولة');
        return;
      }
    }

    if (!currentExcluded.includes(dateString)) {
      form.setValue('excludedDates', [...currentExcluded, dateString]);
      toast.success('تم إضافة التاريخ المستثنى');
    } else {
      toast.error('هذا التاريخ مستثنى بالفعل');
    }
    setExcludedDateOpen(false);
  };

  const removeExcludedDate = (dateToRemove: string) => {
    const currentExcluded = form.getValues('excludedDates');
    form.setValue(
      'excludedDates',
      currentExcluded.filter((date) => date !== dateToRemove)
    );
    toast.success('تم إزالة التاريخ المستثنى');
  };

  const addScheduleDay = () => {
    // Calculate next day of week using our format (1-7)
    append({
      shiftId: '',
      scheduleDayDate: format(new Date(), 'yyyy-MM-dd'),
      isActive: true,
      notes: ''
    });
  };

  const fillAllDaysWithShift = (shiftId: string) => {
    const updatedDays = fields.map((field) => ({
      ...field,
      shiftId: field.isActive ? shiftId : field.shiftId
    }));
    replace(updatedDays);
    toast.success('تم ملء جميع الأيام النشطة بالوردية المختارة');
  };

  const clearAllShifts = () => {
    const updatedDays = fields.map((field) => ({
      ...field,
      shiftId: ''
    }));
    replace(updatedDays);
    toast.success('تم مسح جميع الورديات');
  };

  // Calculate schedule duration
  const scheduleDuration =
    watchedStartDate && watchedEndDate
      ? differenceInDays(new Date(watchedEndDate), new Date(watchedStartDate)) +
        1
      : 0;

  // Count filled schedule days
  const filledScheduleDays = fields.filter(
    (field) => field.shiftId && field.isActive
  ).length;
  const totalScheduleDays = fields.length;

  // Debug information
  const formIsValid = form.formState.isValid;
  const hasScheduleDays = fields.length > 0;
  const allActiveDaysHaveShifts = fields.every(
    (field) => !field.isActive || field.shiftId
  );

  // Check if all required fields are filled
  const isFormValid = initialData
    ? formIsValid && scheduleDuration > 0
    : formIsValid &&
      scheduleDuration > 0 &&
      hasScheduleDays &&
      allActiveDaysHaveShifts;

  return (
    <div className='mx-auto max-w-6xl space-y-8 p-6'>
      <div className='space-y-2 text-center'>
        <h1 className='text-3xl font-bold tracking-tight'>جدولة الحضور</h1>
        <p className='text-muted-foreground'>
          إنشاء وإدارة جداول حضور الموظفين
        </p>
      </div>

      {/* Form Status Alert */}
      {watchedStartDate && watchedEndDate && (
        <Alert
          className={cn(
            'border-l-4 border-green-500 bg-green-50 dark:border-green-400 dark:bg-green-950'
          )}
        >
          <div className='flex items-center gap-2'>
            <CheckCircle className='h-4 w-4 text-green-600 dark:text-green-400' />
            <AlertDescription>
              {`مدة الجدولة: ${scheduleDuration} يوم`}
            </AlertDescription>
          </div>
        </Alert>
      )}

      {/* Schedule Progress Alert - Only show in create mode */}
      {!initialData && totalScheduleDays > 0 && (
        <Alert
          className={cn(
            'border-l-4',
            filledScheduleDays === totalScheduleDays
              ? 'border-green-500 bg-green-50 dark:border-green-400 dark:bg-green-950'
              : 'border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-950'
          )}
        >
          <div className='flex items-center gap-2'>
            <Info className='h-4 w-4 text-blue-600 dark:text-blue-400' />
            <AlertDescription>
              تم تعيين {filledScheduleDays} من أصل {totalScheduleDays} يوم
              {filledScheduleDays === totalScheduleDays &&
                ' - جميع الأيام مكتملة'}
            </AlertDescription>
          </div>
        </Alert>
      )}

      {/* Progress Bar - Only show in create mode */}
      {!initialData && totalScheduleDays > 0 && (
        <div className='space-y-2'>
          <div className='text-muted-foreground flex justify-between text-sm'>
            <span>تقدم إكمال الجدولة</span>
            <span>
              {Math.round((filledScheduleDays / totalScheduleDays) * 100)}%
            </span>
          </div>
          <div className='h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700'>
            <div
              className={cn(
                'h-2 rounded-full transition-all duration-300',
                filledScheduleDays === totalScheduleDays
                  ? 'bg-green-500 dark:bg-green-400'
                  : 'bg-blue-500 dark:bg-blue-400'
              )}
              style={{
                width: `${(filledScheduleDays / totalScheduleDays) * 100}%`
              }}
            />
          </div>
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-8'>
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Users className='h-5 w-5' />
                المعلومات الأساسية
              </CardTitle>
              <CardDescription>اختر الموظف ونوع الجدولة</CardDescription>
            </CardHeader>
            <CardContent className='space-y-6'>
              <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
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
                            value={
                              employeeData?.find(
                                (emp) => emp.id === field.value
                              )?.fullName || ''
                            }
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
                            <Command shouldFilter={false}>
                              <CommandInput
                                placeholder='ابحث عن موظف...'
                                value={searchTerm}
                                onValueChange={handleSearchChange}
                              />
                              <CommandList>
                                <CommandEmpty>لا يوجد موظفين</CommandEmpty>
                                <CommandGroup>
                                  {displayedEmployees?.map((employee) => (
                                    <CommandItem
                                      value={employee.fullName}
                                      key={employee.id}
                                      onSelect={() => {
                                        form.setValue(
                                          'employeeId',
                                          employee.id
                                        );
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

                <div className='space-y-2'>
                  <Label htmlFor='scheduleType'>نوع الجدولة *</Label>
                  <Controller
                    name='scheduleType'
                    control={form.control}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className='w-full'>
                          <SelectValue placeholder='اختر نوع الجدولة' />
                        </SelectTrigger>
                        <SelectContent>
                          {SCHEDULE_TYPE_OPTIONS.map((type) => (
                            <SelectItem
                              key={type.value}
                              value={type.value.toString()}
                            >
                              {type.displayName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {form.formState.errors.scheduleType && (
                    <p className='text-destructive text-sm'>
                      {form.formState.errors.scheduleType.message}
                    </p>
                  )}
                </div>
              </div>

              <div className='flex items-center space-x-2'>
                <Controller
                  name='isActive'
                  control={form.control}
                  render={({ field }) => (
                    <Switch
                      dir='ltr'
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
                <Label htmlFor='isActive'>الجدولة نشطة</Label>
              </div>
            </CardContent>
          </Card>

          {/* Date Range */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Calendar className='h-5 w-5' />
                الفترة الزمنية
              </CardTitle>
              <CardDescription>
                حدد تاريخ البداية والنهاية
                {watchedStartDate && watchedEndDate && (
                  <span className='mt-1 block text-sm text-green-600 dark:text-green-400'>
                    المدة المحددة: {scheduleDuration} يوم
                  </span>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-6'>
              <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                <div className='space-y-2'>
                  <Label>تاريخ البداية *</Label>
                  <Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant='outline'
                        className={cn(
                          'w-full justify-start text-left font-normal',
                          !watchedStartDate && 'text-muted-foreground'
                        )}
                      >
                        <CalendarIcon className='mr-2 h-4 w-4' />
                        {watchedStartDate
                          ? format(new Date(watchedStartDate), 'PPP')
                          : 'اختر التاريخ'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className='w-auto p-0' align='start'>
                      <CalendarComponent
                        mode='single'
                        selected={
                          watchedStartDate
                            ? new Date(watchedStartDate)
                            : undefined
                        }
                        onSelect={(date) => {
                          if (date) {
                            form.setValue(
                              'startDate',
                              format(date, 'yyyy-MM-dd')
                            );
                            setStartDateOpen(false);
                          }
                        }}
                        disabled={(date) => {
                          // Disable past dates
                          return isBefore(
                            date,
                            normalizeToStartOfDay(new Date())
                          );
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  {form.formState.errors.startDate && (
                    <p className='text-destructive text-sm'>
                      {form.formState.errors.startDate.message}
                    </p>
                  )}
                </div>

                <div className='space-y-2'>
                  <Label>تاريخ النهاية *</Label>
                  <Popover open={endDateOpen} onOpenChange={setEndDateOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant='outline'
                        className={cn(
                          'w-full justify-start text-left font-normal',
                          !watchedEndDate && 'text-muted-foreground'
                        )}
                      >
                        <CalendarIcon className='mr-2 h-4 w-4' />
                        {watchedEndDate
                          ? format(new Date(watchedEndDate), 'PPP')
                          : 'اختر التاريخ'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className='w-auto p-0' align='start'>
                      <CalendarComponent
                        mode='single'
                        selected={
                          watchedEndDate ? new Date(watchedEndDate) : undefined
                        }
                        onSelect={(date) => {
                          if (date) {
                            form.setValue(
                              'endDate',
                              format(date, 'yyyy-MM-dd')
                            );
                            setEndDateOpen(false);
                          }
                        }}
                        disabled={(date) => {
                          if (!watchedStartDate) return false;
                          const start = new Date(watchedStartDate);
                          return isBefore(
                            date,
                            normalizeToStartOfDay(start)
                          );
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  {form.formState.errors.endDate && (
                    <p className='text-destructive text-sm'>
                      {form.formState.errors.endDate.message}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Schedule Days - Only show in create mode */}
          {!initialData && fields.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <Clock className='h-5 w-5' />
                  أيام الجدولة ({fields.length} يوم)
                </CardTitle>
                <CardDescription>
                  حدد الورديات لكل يوم في الفترة المحددة
                </CardDescription>
                <div className='flex flex-wrap gap-2'>
                  <Button
                    type='button'
                    variant='outline'
                    size='sm'
                    onClick={addScheduleDay}
                  >
                    <Plus className='mr-1 h-4 w-4' />
                    إضافة يوم
                  </Button>
                  {shiftOptions.length > 0 && (
                    <Select onValueChange={fillAllDaysWithShift}>
                      <SelectTrigger className='w-auto'>
                        <SelectValue placeholder='ملء جميع الأيام' />
                      </SelectTrigger>
                      <SelectContent>
                        {shiftOptions.map((shift) => (
                          <SelectItem key={shift.value} value={shift.value}>
                            ملء بـ {shift.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                  <Button
                    type='button'
                    variant='outline'
                    size='sm'
                    onClick={clearAllShifts}
                    className='text-destructive hover:text-destructive dark:text-red-400 dark:hover:text-red-300'
                  >
                    <Trash2 className='mr-1 h-4 w-4' />
                    مسح جميع الورديات
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
                  {fields.map((field, index) => {
                    const currentDate = watchedStartDate
                      ? addDays(new Date(watchedStartDate), index)
                      : new Date();
                    const dayName = field.scheduleDayDate
                      ? getDayName(field.scheduleDayDate)
                      : '';
                    const isDayComplete = field.shiftId && field.isActive;
                    const isExcluded = form
                      .watch('excludedDates')
                      .includes(format(currentDate, 'yyyy-MM-dd'));

                    return (
                      <Card
                        key={field.id}
                        className={cn(
                          'relative',
                          isExcluded &&
                            'bg-gray-50 opacity-50 dark:bg-gray-800',
                          isDayComplete &&
                            'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950'
                        )}
                      >
                        <CardHeader className='pb-3'>
                          <div className='flex items-center justify-between'>
                            <div className='space-y-1'>
                              <Badge variant='outline' className='text-xs'>
                                {format(currentDate, 'dd/MM/yyyy')}
                              </Badge>
                              <CardTitle className='text-lg'>
                                {dayName}
                              </CardTitle>
                              <div className='text-muted-foreground text-xs'>
                                اليوم {field.dayOfWeek} من الأسبوع
                              </div>
                              {isExcluded && (
                                <Badge variant='secondary' className='text-xs'>
                                  مستثنى
                                </Badge>
                              )}
                            </div>
                            <div className='flex items-center gap-2'>
                              <Controller
                                name={`scheduleDays.${index}.isActive`}
                                control={form.control}
                                render={({ field: switchField }) => (
                                  <Switch
                                    dir='ltr'
                                    checked={switchField.value}
                                    onCheckedChange={switchField.onChange}
                                    disabled={isExcluded}
                                  />
                                )}
                              />
                              {fields.length > 1 && (
                                <Button
                                  type='button'
                                  variant='ghost'
                                  size='sm'
                                  className='text-destructive hover:text-destructive hover:bg-destructive/10 h-8 w-8 p-0 dark:text-red-400 dark:hover:bg-red-950/20 dark:hover:text-red-300'
                                  onClick={() => remove(index)}
                                >
                                  <Trash2 className='h-4 w-4' />
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className='space-y-4'>
                          <div className='space-y-2'>
                            <Label className='text-sm font-medium'>
                              الوردية *
                            </Label>
                            <Controller
                              name={`scheduleDays.${index}.shiftId`}
                              control={form.control}
                              render={({ field: shiftField }) => (
                                <Select
                                  onValueChange={shiftField.onChange}
                                  value={shiftField.value}
                                  disabled={isExcluded}
                                >
                                  <SelectTrigger
                                    className={cn(
                                      'h-9 w-full',
                                      isDayComplete &&
                                        'border-green-300 bg-green-50 dark:border-green-600 dark:bg-green-950'
                                    )}
                                  >
                                    <SelectValue placeholder='اختر الوردية' />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {shiftOptions?.map((shift) => (
                                      <SelectItem
                                        key={shift.value}
                                        value={shift.value}
                                      >
                                        <div className='flex flex-col items-start'>
                                          <span className='font-medium'>
                                            {shift.label}
                                          </span>
                                        </div>
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              )}
                            />
                            {form.formState.errors.scheduleDays?.[index]
                              ?.shiftId && (
                              <p className='text-destructive text-xs'>
                                {
                                  form.formState.errors.scheduleDays[index]
                                    ?.shiftId?.message
                                }
                              </p>
                            )}
                          </div>

                          <div className='space-y-2'>
                            <Label className='text-sm font-medium'>
                              ملاحظات
                            </Label>
                            <Controller
                              name={`scheduleDays.${index}.notes`}
                              control={form.control}
                              render={({ field: notesField }) => (
                                <Textarea
                                  {...notesField}
                                  placeholder='ملاحظات إضافية'
                                  className='min-h-[60px] text-sm'
                                  disabled={isExcluded}
                                />
                              )}
                            />
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
                {form.formState.errors.scheduleDays && (
                  <p className='text-destructive mt-4 text-sm'>
                    {form.formState.errors.scheduleDays.message}
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          {/* Excluded Dates */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Calendar className='h-5 w-5' />
                التواريخ المستثناة
              </CardTitle>
              <CardDescription>
                أضف التواريخ التي يجب استثناؤها من الجدولة
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <Popover
                open={excludedDateOpen}
                onOpenChange={setExcludedDateOpen}
              >
                <PopoverTrigger asChild>
                  <Button
                    variant='outline'
                    className='w-full bg-transparent'
                    disabled={!watchedStartDate || !watchedEndDate}
                  >
                    <Plus className='mr-2 h-4 w-4' />
                    إضافة تاريخ مستثنى
                  </Button>
                </PopoverTrigger>
                <PopoverContent className='w-auto p-0' align='start'>
                  <CalendarComponent
                    mode='single'
                    onSelect={(date) => {
                      if (date) addExcludedDate(date);
                    }}
                    disabled={(date) => {
                      if (!watchedStartDate || !watchedEndDate) return true;
                      const start = new Date(watchedStartDate);
                      const end = new Date(watchedEndDate);
                      return (
                        isBefore(date, normalizeToStartOfDay(start)) ||
                        isAfter(date, normalizeToStartOfDay(end))
                      );
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              {form.watch('excludedDates').length > 0 && (
                <div className='flex flex-wrap gap-2'>
                  {form.watch('excludedDates').map((date) => (
                    <Badge key={date} variant='secondary'>
                      <div className='flex flex-col items-center gap-2'>
                        <p className='text-sm font-medium text-black'>
                          {getDayName(date)}
                        </p>
                        <p className='text-muted-foreground text-sm'>
                          {formatDate(date)}
                        </p>
                      </div>

                      <Button
                        type='button'
                        variant='ghost'
                        size='sm'
                        className='hover:bg-destructive hover:text-destructive-foreground h-4 w-4 p-0 dark:hover:bg-red-950 dark:hover:text-red-300'
                        onClick={() => removeExcludedDate(date)}
                      >
                        <Trash2 className='h-3 w-3' />
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Notes */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <FileText className='h-5 w-5' />
                ملاحظات إضافية
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Controller
                name='notes'
                control={form.control}
                render={({ field }) => (
                  <Textarea
                    {...field}
                    placeholder='أضف أي ملاحظات إضافية حول هذه الجدولة...'
                    className='min-h-[100px]'
                  />
                )}
              />
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className='flex justify-end space-x-4'>
            <Button
              type='button'
              variant='outline'
              onClick={() => router.back()}
            >
              إلغاء
            </Button>
            <div className='flex flex-col items-end gap-2'>
              <Button
                type='submit'
                disabled={isLoading || !isFormValid}
                className='min-w-[120px]'
              >
                {isLoading ? 'جاري الحفظ...' : 'حفظ الجدولة'}
              </Button>
              {!isFormValid && (
                <div className='text-muted-foreground text-right text-xs'>
                  {!formIsValid && 'يرجى إكمال جميع الحقول المطلوبة'}
                  {scheduleDuration <= 0 && ' - يجب تحديد فترة صحيحة'}
                  {!initialData &&
                    !hasScheduleDays &&
                    ' - يجب إضافة أيام للجدولة'}
                  {!initialData &&
                    !allActiveDaysHaveShifts &&
                    ' - يجب اختيار وردية لجميع الأيام النشطة'}
                </div>
              )}
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
