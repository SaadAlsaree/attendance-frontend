'use client';

import { useState, useMemo } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { Clock, Plus, Trash2, Save, Info, Calendar } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CustomSwitch } from '@/components/ui/custom-switch';
import { cn } from '@/lib/utils';

// Import types and schemas
import {
  type UpdateScheduleDayRequest,
  type ScheduleDayResponse
} from '../types/schedules';
import {
  updateScheduleDaysSchema,
  type UpdateScheduleDaysFormValues
} from '../utils/schedule';
import { type ShiftData } from '@/features/shift';
import { scheduleService } from '@/features/schedule/api/schedule.service';
import { useAuthApi } from '@/hooks/use-auth-api';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { getDayName } from '@/utils/date.utils';
import { Switch } from '@/components/ui/switch';

interface ScheduleUpdateDaysFormProps {
  attendanceScheduleId: string;
  scheduleDays: ScheduleDayResponse[];
  shifts: ShiftData[];
  startDate: string;
  endDate?: string;
  employeeName?: string;
}

export default function ScheduleUpdateDaysForm({
  attendanceScheduleId,
  scheduleDays = [],
  shifts = [],
  startDate,
  endDate,
  employeeName
}: ScheduleUpdateDaysFormProps) {
  const { authApiCall } = useAuthApi();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Convert ScheduleDayResponse to UpdateScheduleDayRequest format
  const initialScheduleDays: UpdateScheduleDayRequest[] = useMemo(
    () =>
      scheduleDays.map((day) => ({
        id: day.id,
        shiftId: day.shiftId,
        isActive: day.isActive,
        notes: day.notes || ''
      })),
    [scheduleDays]
  );

  const form = useForm<UpdateScheduleDaysFormValues>({
    resolver: zodResolver(updateScheduleDaysSchema),
    defaultValues: {
      attendanceScheduleId,
      scheduleDays: initialScheduleDays
    }
  });

  const { fields } = useFieldArray({
    control: form.control,
    name: 'scheduleDays'
  });

  const handleSubmit = async (data: UpdateScheduleDaysFormValues) => {
    setIsLoading(true);

    try {
      // Additional validation
      const activeDaysWithoutShifts = data.scheduleDays.filter(
        (day) => day.isActive && !day.shiftId
      );

      if (activeDaysWithoutShifts.length > 0) {
        toast.error(
          `يجب اختيار وردية لـ ${activeDaysWithoutShifts.length} يوم نشط`
        );
        setIsLoading(false);
        return;
      }

      const response = await authApiCall(async () => {
        return scheduleService.updateScheduleDaysClient(data);
      });

      if (response?.success) {
        toast.success('تم تحديث أيام الجدولة بنجاح');
        router.push(`/schedule/${attendanceScheduleId}/view`);
      } else {
        toast.error(response?.message || 'حدث خطأ أثناء تحديث أيام الجدولة');
      }
    } catch (error) {
      console.error('Schedule days update error:', error);
      toast.error('حدث خطأ أثناء تحديث أيام الجدولة');
    } finally {
      setIsLoading(false);
    }
  };

  const shiftOptions = shifts.map((shift) => ({
    value: shift.id,
    label: shift.name,
    time: `${shift.startTime} - ${shift.endTime}`
  }));

  const addScheduleDay = () => {
    const newDay: UpdateScheduleDayRequest = {
      id: `temp-${Date.now()}`, // Temporary ID for new days
      shiftId: '',
      isActive: true,
      notes: ''
    };

    // Add to form array
    const currentDays = form.getValues('scheduleDays');
    form.setValue('scheduleDays', [...currentDays, newDay]);
  };

  const removeScheduleDay = (index: number) => {
    const currentDays = form.getValues('scheduleDays');
    const updatedDays = currentDays.filter((_, i) => i !== index);
    form.setValue('scheduleDays', updatedDays);
  };

  const fillAllDaysWithShift = (shiftId: string) => {
    const currentDays = form.getValues('scheduleDays');
    const updatedDays = currentDays.map((day) => ({
      ...day,
      shiftId: day.isActive ? shiftId : day.shiftId
    }));
    form.setValue('scheduleDays', updatedDays);
    toast.success('تم ملء جميع الأيام النشطة بالوردية المختارة');
  };

  const clearAllShifts = () => {
    const currentDays = form.getValues('scheduleDays');
    const updatedDays = currentDays.map((day) => ({
      ...day,
      shiftId: ''
    }));
    form.setValue('scheduleDays', updatedDays);
    toast.success('تم مسح جميع الورديات');
  };

  const toggleAllDays = (isActive: boolean) => {
    const currentDays = form.getValues('scheduleDays');
    const updatedDays = currentDays.map((day) => ({
      ...day,
      isActive
    }));
    form.setValue('scheduleDays', updatedDays);
    toast.success(`تم ${isActive ? 'تفعيل' : 'إلغاء تفعيل'} جميع الأيام`);
  };

  // Calculate progress
  const totalDays = fields.length;
  const completedDays = fields.filter(
    (field) => field.isActive && field.shiftId
  ).length;
  const progressPercentage =
    totalDays > 0 ? Math.round((completedDays / totalDays) * 100) : 0;

  // Check if form is valid
  const isFormValid =
    form.formState.isValid &&
    fields.every((field) => !field.isActive || field.shiftId);

  return (
    <div className='mx-auto max-w-6xl space-y-6 p-6'>
      <div className='space-y-2 text-center'>
        <h1 className='text-3xl font-bold tracking-tight'>
          تحديث أيام الجدولة
        </h1>
        <p className='text-muted-foreground'>
          تعديل أيام وورديات الجدولة
          {employeeName && ` - ${employeeName}`}
        </p>
      </div>

      {/* Schedule Info */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Calendar className='h-5 w-5' />
            معلومات الجدولة
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
            <div className='space-y-2'>
              <Label className='text-sm font-medium'>تاريخ البداية</Label>
              <div className='text-muted-foreground text-sm'>
                {format(new Date(startDate), 'PPP')}
              </div>
            </div>
            <div className='space-y-2'>
              <Label className='text-sm font-medium'>تاريخ النهاية</Label>
              <div className='text-muted-foreground text-sm'>
                {endDate ? format(new Date(endDate), 'PPP') : 'مستمر'}
              </div>
            </div>
            <div className='space-y-2'>
              <Label className='text-sm font-medium'>إجمالي الأيام</Label>
              <div className='text-muted-foreground text-sm'>
                {totalDays} يوم
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Progress Alert */}
      {totalDays > 0 && (
        <Alert
          className={cn(
            'border-l-4',
            progressPercentage === 100
              ? 'border-green-500 bg-green-50 dark:border-green-400 dark:bg-green-950'
              : 'border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-950'
          )}
        >
          <div className='flex items-center gap-2'>
            <Info className='h-4 w-4 text-blue-600 dark:text-blue-400' />
            <AlertDescription>
              تم تعيين {completedDays} من أصل {totalDays} يوم
              {progressPercentage === 100 && ' - جميع الأيام مكتملة'}
            </AlertDescription>
          </div>
        </Alert>
      )}

      {/* Progress Bar */}
      {totalDays > 0 && (
        <div className='space-y-2'>
          <div className='text-muted-foreground flex justify-between text-sm'>
            <span>تقدم إكمال الجدولة</span>
            <span>{progressPercentage}%</span>
          </div>
          <div className='h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700'>
            <div
              className={cn(
                'h-2 rounded-full transition-all duration-300',
                progressPercentage === 100
                  ? 'bg-green-500 dark:bg-green-400'
                  : 'bg-blue-500 dark:bg-blue-400'
              )}
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      )}

      <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-6'>
        {/* Schedule Days */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Clock className='h-5 w-5' />
              أيام الجدولة ({totalDays} يوم)
            </CardTitle>
            <CardDescription>حدد الورديات لكل يوم في الجدولة</CardDescription>
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
              <Button
                type='button'
                variant='outline'
                size='sm'
                onClick={() => toggleAllDays(true)}
              >
                تفعيل الكل
              </Button>
              <Button
                type='button'
                variant='outline'
                size='sm'
                onClick={() => toggleAllDays(false)}
              >
                إلغاء تفعيل الكل
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
              {fields.map((field, index) => {
                const originalDay = scheduleDays[index];
                const dayName = getDayName(originalDay?.scheduleDayDate || '');
                const isDayComplete = field.shiftId && field.isActive;

                return (
                  <Card
                    key={field.id}
                    className={cn(
                      'relative',
                      isDayComplete &&
                        'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950'
                    )}
                  >
                    <CardHeader className='pb-3'>
                      <div className='flex items-center justify-between'>
                        <div className='space-y-1'>
                          <CardTitle className='text-lg'>{dayName}</CardTitle>
                          <div className='text-muted-foreground text-xs'>
                            اليوم {originalDay?.scheduleDayDate} من الأسبوع
                          </div>
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
                              />
                            )}
                          />
                          {fields.length > 1 && (
                            <Button
                              type='button'
                              variant='ghost'
                              size='sm'
                              className='text-destructive hover:text-destructive hover:bg-destructive/10 h-8 w-8 p-0 dark:text-red-400 dark:hover:bg-red-950/20 dark:hover:text-red-300'
                              onClick={() => removeScheduleDay(index)}
                            >
                              <Trash2 className='h-4 w-4' />
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className='space-y-4'>
                      <div className='space-y-2'>
                        <Label className='text-sm font-medium'>الوردية *</Label>
                        <Controller
                          name={`scheduleDays.${index}.shiftId`}
                          control={form.control}
                          render={({ field: shiftField }) => (
                            <Select
                              onValueChange={shiftField.onChange}
                              value={shiftField.value}
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
                                      <span className='text-muted-foreground text-xs'>
                                        {shift.time}
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
                              form.formState.errors.scheduleDays[index]?.shiftId
                                ?.message
                            }
                          </p>
                        )}
                      </div>

                      <div className='space-y-2'>
                        <Label className='text-sm font-medium'>ملاحظات</Label>
                        <Controller
                          name={`scheduleDays.${index}.notes`}
                          control={form.control}
                          render={({ field: notesField }) => (
                            <Textarea
                              {...notesField}
                              placeholder='ملاحظات إضافية'
                              className='min-h-[60px] text-sm'
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

        {/* Submit Buttons */}
        <div className='flex justify-end space-x-4'>
          <Button
            type='button'
            variant='outline'
            onClick={() =>
              router.push(`/schedule/${attendanceScheduleId}/view`)
            }
            disabled={isLoading}
          >
            إلغاء
          </Button>
          <div className='flex flex-col items-end gap-2'>
            <Button
              type='submit'
              disabled={isLoading || !isFormValid}
              className='min-w-[120px]'
            >
              {isLoading ? (
                <>
                  <div className='mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent' />
                  جاري الحفظ...
                </>
              ) : (
                <>
                  <Save className='mr-2 h-4 w-4' />
                  حفظ التغييرات
                </>
              )}
            </Button>
            {!isFormValid && (
              <div className='text-muted-foreground text-right text-xs'>
                {!form.formState.isValid && 'يرجى إكمال جميع الحقول المطلوبة'}
                {!fields.every((field) => !field.isActive || field.shiftId) &&
                  ' - يجب اختيار وردية لجميع الأيام النشطة'}
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
