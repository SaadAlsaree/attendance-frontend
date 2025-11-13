'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { toast } from 'sonner';
import { CreateScheduleDayRequest } from '../types/schedules';
import { DAYS_OF_WEEK, getDayOfWeekDisplayName } from '../types/schedules';
import { ShiftData } from '@/features/shift';
import { CustomSwitch } from '@/components/ui/custom-switch';

interface ScheduleDayFormData {
  dayOfWeek: number;
  shiftId: string;
  isActive: boolean;
  notes?: string;
}

interface ScheduleDaysFormRef {
  getScheduleDays: () => CreateScheduleDayRequest[];
  validate: () => { isValid: boolean; errors: string[] };
  reset: () => void;
  getSelectedDays: () => number[];
  getActiveDays: () => ScheduleDayFormData[];
  getDayData: (dayOfWeek: number) => ScheduleDayFormData | undefined;
}

interface ScheduleDaysFormProps {
  shifts: ShiftData[];
  initialScheduleDays?: CreateScheduleDayRequest[];
  onScheduleDaysChange: (scheduleDays: CreateScheduleDayRequest[]) => void;
}

const ScheduleDaysForm = forwardRef<ScheduleDaysFormRef, ScheduleDaysFormProps>(
  ({ shifts, initialScheduleDays = [], onScheduleDaysChange }, ref) => {
    const [scheduleDays, setScheduleDays] = useState<ScheduleDayFormData[]>([]);
    const [selectedDays, setSelectedDays] = useState<number[]>([]);

    // Expose methods through ref
    useImperativeHandle(ref, () => ({
      getScheduleDays: () => {
        return scheduleDays
          .filter((day) => day.isActive)
          .map((day) => ({
            shiftId: day.shiftId,
            dayOfWeek: day.dayOfWeek,
            isActive: day.isActive,
            notes: day.notes
          }));
      },
      validate: () => {
        const errors: string[] = [];
        const activeDays = scheduleDays.filter((day) => day.isActive);

        if (activeDays.length === 0) {
          errors.push('يجب اختيار يوم واحد على الأقل');
        }

        // Check for days without shifts
        const daysWithoutShifts = activeDays.filter((day) => !day.shiftId);
        if (daysWithoutShifts.length > 0) {
          const dayNames = daysWithoutShifts.map((day) =>
            getDayOfWeekDisplayName(day.dayOfWeek)
          );
          errors.push(`يجب اختيار مناوبة للأيام: ${dayNames.join(', ')}`);
        }

        return { isValid: errors.length === 0, errors };
      },
      reset: () => {
        const initialDays = DAYS_OF_WEEK.map((day) => ({
          dayOfWeek: day.value,
          shiftId: '',
          isActive: false,
          notes: ''
        }));
        setScheduleDays(initialDays);
        setSelectedDays([]);
      },
      getSelectedDays: () => selectedDays,
      getActiveDays: () => scheduleDays.filter((day) => day.isActive),
      getDayData: (dayOfWeek: number) =>
        scheduleDays.find((day) => day.dayOfWeek === dayOfWeek)
    }));

    // Initialize schedule days from initial data
    useEffect(() => {
      if (initialScheduleDays.length > 0) {
        const days = initialScheduleDays.map((day) => ({
          dayOfWeek: day.dayOfWeek,
          shiftId: day.shiftId,
          isActive: day.isActive,
          notes: day.notes || ''
        }));
        setScheduleDays(days);
        setSelectedDays(
          days.filter((day) => day.isActive).map((day) => day.dayOfWeek)
        );
      } else {
        // Initialize with all days disabled
        const initialDays = DAYS_OF_WEEK.map((day) => ({
          dayOfWeek: day.value,
          shiftId: '',
          isActive: false,
          notes: ''
        }));
        setScheduleDays(initialDays);
      }
    }, [initialScheduleDays]);

    // Notify parent when active schedule days change
    useEffect(() => {
      const activeDays = scheduleDays
        .filter((day) => day.isActive)
        .map((day) => ({
          shiftId: day.shiftId,
          dayOfWeek: day.dayOfWeek,
          isActive: day.isActive,
          notes: day.notes
        }));
      onScheduleDaysChange(activeDays);
    }, [scheduleDays, onScheduleDaysChange]);

    const handleDayToggle = (dayOfWeek: number, checked: boolean) => {
      const newScheduleDays = scheduleDays.map((day) =>
        day.dayOfWeek === dayOfWeek ? { ...day, isActive: checked } : day
      );

      setScheduleDays(newScheduleDays);

      if (checked) {
        setSelectedDays((prev) => [...prev, dayOfWeek]);
      } else {
        setSelectedDays((prev) => prev.filter((day) => day !== dayOfWeek));
      }
    };

    const handleShiftChange = (dayOfWeek: number, shiftId: string) => {
      const newScheduleDays = scheduleDays.map((day) =>
        day.dayOfWeek === dayOfWeek ? { ...day, shiftId } : day
      );

      setScheduleDays(newScheduleDays);
    };

    const handleNotesChange = (dayOfWeek: number, notes: string) => {
      const newScheduleDays = scheduleDays.map((day) =>
        day.dayOfWeek === dayOfWeek ? { ...day, notes } : day
      );

      setScheduleDays(newScheduleDays);
    };

    const handleValidation = () => {
      const validation = {
        isValid: false,
        errors: [] as string[]
      };

      const activeDays = scheduleDays.filter((day) => day.isActive);

      if (activeDays.length === 0) {
        validation.errors.push('يجب اختيار يوم واحد على الأقل');
      }

      // Check for days without shifts
      const daysWithoutShifts = activeDays.filter((day) => !day.shiftId);
      if (daysWithoutShifts.length > 0) {
        const dayNames = daysWithoutShifts.map((day) =>
          getDayOfWeekDisplayName(day.dayOfWeek)
        );
        validation.errors.push(
          `يجب اختيار مناوبة للأيام: ${dayNames.join(', ')}`
        );
      }

      validation.isValid = validation.errors.length === 0;

      if (!validation.isValid) {
        validation.errors.forEach((error) => toast.error(error));
        return false;
      }
      toast.success('جميع البيانات صحيحة!');
      return true;
    };

    const getScheduleSummary = () => {
      const activeDays = scheduleDays.filter((day) => day.isActive);
      const daysWithShifts = activeDays.filter((day) => day.shiftId);
      const daysWithoutShifts = activeDays.filter((day) => !day.shiftId);

      return {
        totalDays: activeDays.length,
        daysWithShifts: daysWithShifts.length,
        daysWithoutShifts: daysWithoutShifts.length,
        isComplete: daysWithoutShifts.length === 0 && activeDays.length > 0
      };
    };

    // Ensure shifts is always an array
    const safeShifts = Array.isArray(shifts) ? shifts : [];
    const shiftOptions = safeShifts.map((shift) => ({
      label: shift.name,
      value: shift.id
    }));

    return (
      <Card className='w-full'>
        <CardHeader>
          <CardTitle className='text-left text-xl font-bold'>
            أيام الجدول الزمني
          </CardTitle>
          <Separator />
        </CardHeader>
        <CardContent>
          <div className='space-y-6'>
            {DAYS_OF_WEEK.map((day) => {
              const dayData = scheduleDays.find(
                (d) => d.dayOfWeek === day.value
              );
              const isActive = dayData?.isActive || false;
              const shiftId = dayData?.shiftId || '';
              const notes = dayData?.notes || '';

              return (
                <div
                  key={day.value}
                  className={`space-y-4 rounded-lg border p-4 transition-all duration-200 ${
                    isActive
                      ? 'border-green-200 bg-green-50'
                      : 'border-gray-200'
                  }`}
                >
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center space-x-3'>
                      <Checkbox
                        id={`day-${day.value}`}
                        checked={isActive}
                        onCheckedChange={(checked) =>
                          handleDayToggle(day.value, checked as boolean)
                        }
                      />
                      <label
                        htmlFor={`day-${day.value}`}
                        className={`text-lg font-medium ${
                          isActive ? 'text-green-700' : 'text-gray-600'
                        }`}
                      >
                        {day.displayName}
                      </label>
                    </div>
                    <CustomSwitch
                      checked={isActive}
                      onCheckedChange={(checked) =>
                        handleDayToggle(day.value, checked)
                      }
                    />
                  </div>

                  {isActive && (
                    <div className='space-y-4 border-l-2 border-green-200 pl-6'>
                      <div className='space-y-2'>
                        <label className='text-sm font-medium text-gray-700'>
                          المناوبة
                        </label>
                        <Select
                          value={shiftId}
                          onValueChange={(value) =>
                            handleShiftChange(day.value, value)
                          }
                        >
                          <SelectTrigger
                            className={!shiftId ? 'border-red-300' : ''}
                          >
                            <SelectValue placeholder='اختر المناوبة' />
                          </SelectTrigger>
                          <SelectContent>
                            {shiftOptions.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {!shiftId && (
                          <p className='flex items-center text-sm text-red-500'>
                            <span className='mr-1'>⚠️</span>
                            يجب اختيار مناوبة لهذا اليوم
                          </p>
                        )}
                        {shiftId && (
                          <p className='flex items-center text-sm text-green-600'>
                            <span className='mr-1'>✅</span>
                            تم اختيار المناوبة
                          </p>
                        )}
                      </div>

                      <div className='space-y-2'>
                        <label className='text-sm font-medium text-gray-700'>
                          الملاحظات (اختياري)
                        </label>
                        <Textarea
                          placeholder='أدخل ملاحظات خاصة بهذا اليوم'
                          value={notes}
                          onChange={(e) =>
                            handleNotesChange(day.value, e.target.value)
                          }
                          rows={2}
                          className='resize-none'
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            <div className='flex items-center justify-between border-t pt-4'>
              <div className='flex items-center space-x-2'>
                <div className='text-muted-foreground text-sm'>
                  تم اختيار {selectedDays.length} يوم/أيام
                </div>
                {selectedDays.length > 0 && (
                  <div className='rounded bg-green-100 px-2 py-1 text-xs text-green-600'>
                    نشط
                  </div>
                )}
              </div>
              <Button
                type='button'
                variant='outline'
                onClick={handleValidation}
                className='text-sm'
              >
                التحقق من الصحة
              </Button>
            </div>

            {selectedDays.length === 0 && (
              <div className='text-muted-foreground rounded-lg border-2 border-dashed border-gray-200 py-8 text-center'>
                <div className='mb-2 text-4xl'>📅</div>
                <p>لم يتم اختيار أي أيام بعد</p>
                <p className='text-sm'>اختر الأيام التي تريد إضافتها للجدول</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }
);

ScheduleDaysForm.displayName = 'ScheduleDaysForm';

export default ScheduleDaysForm;
