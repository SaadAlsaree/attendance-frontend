'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Check, ChevronsUpDown } from 'lucide-react';
import { useAuthApi } from '@/hooks/use-auth-api';
import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

import { employeeService } from '../api/employees.service';
import { EmployeeData, WeeklyShiftDay } from '../types/employees';
import { ShiftData } from '@/features/shift/types/shift';

// value used in the selects for "day off" (Radix Select rejects empty string values)
const OFF = 'off';

const WEEK_DAYS: { dayOfWeek: number; label: string }[] = [
  { dayOfWeek: 0, label: 'الأحد' },
  { dayOfWeek: 1, label: 'الاثنين' },
  { dayOfWeek: 2, label: 'الثلاثاء' },
  { dayOfWeek: 3, label: 'الأربعاء' },
  { dayOfWeek: 4, label: 'الخميس' },
  { dayOfWeek: 5, label: 'الجمعة' },
  { dayOfWeek: 6, label: 'السبت' }
];

const WORK_DAYS = [0, 1, 2, 3, 4]; // الأحد → الخميس (quick-fill target)

const emptyPattern = (): Record<number, string> => ({
  0: OFF,
  1: OFF,
  2: OFF,
  3: OFF,
  4: OFF,
  5: OFF,
  6: OFF
});

const shiftLabel = (shift: ShiftData) =>
  `${shift.name} (${shift.startTime.slice(0, 5)} - ${shift.endTime.slice(0, 5)})`;

interface AssignWeeklyShiftsFormProps {
  employees: EmployeeData[];
  shifts: ShiftData[];
}

export default function AssignWeeklyShiftsForm({
  employees,
  shifts
}: AssignWeeklyShiftsFormProps) {
  const { authApiCall } = useAuthApi();
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeData | null>(
    null
  );
  const [employeeOpen, setEmployeeOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [pattern, setPattern] = useState<Record<number, string>>(
    emptyPattern()
  );
  // Saving is full-replace, so never allow a save until the employee's current
  // pattern actually loaded — otherwise a failed load reads as "all days off"
  // and one click wipes the real pattern.
  const [patternLoaded, setPatternLoaded] = useState(false);
  const loadRequestIdRef = useRef(0);
  const [quickShift, setQuickShift] = useState<string>('');

  const activeShifts = shifts.filter((s) => s.isActive);

  // Employees are searched server-side (by full name OR code) via the page's
  // `searchTerm` query param — same pattern as the schedule form. Keep the input
  // responsive, debounce the server round-trip.
  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchTerm(value);

      if (searchDebounceRef.current) {
        clearTimeout(searchDebounceRef.current);
      }

      searchDebounceRef.current = setTimeout(() => {
        const qs = value ? `?searchTerm=${encodeURIComponent(value)}` : '';
        router.push(`/schedule/assign-shifts${qs}`);
      }, 350);
    },
    [router]
  );

  useEffect(() => {
    return () => {
      if (searchDebounceRef.current) {
        clearTimeout(searchDebounceRef.current);
      }
    };
  }, []);

  // Load the selected employee's current pattern
  const loadEmployeePattern = useCallback(
    async (employee: EmployeeData) => {
      const requestId = ++loadRequestIdRef.current;
      setPatternLoaded(false);
      setPattern(emptyPattern());
      try {
        const detail = await authApiCall(() =>
          employeeService.getEmployeeByIdClient(employee.id)
        );
        if (requestId !== loadRequestIdRef.current) {
          return; // a newer selection superseded this load
        }
        // the service swallows fetch errors and returns null — that is a failed
        // load, not an empty pattern
        if (!detail?.data) {
          toast.error('تعذر تحميل الدوام الحالي للموظف');
          return;
        }
        const next = emptyPattern();
        for (const day of detail.data.weeklyShifts || []) {
          next[day.dayOfWeek] = day.shiftId;
        }
        setPattern(next);
        setPatternLoaded(true);
      } catch (error) {
        console.error('Error loading weekly shifts:', error);
        if (requestId === loadRequestIdRef.current) {
          toast.error('تعذر تحميل الدوام الحالي للموظف');
        }
      }
    },
    [authApiCall]
  );

  const onSelectEmployee = (employee: EmployeeData) => {
    setSelectedEmployee(employee);
    setEmployeeOpen(false);
    loadEmployeePattern(employee);
  };

  const applyQuickFill = () => {
    if (!quickShift) {
      toast.error('اختر الدوام أولاً');
      return;
    }
    setPattern((prev) => {
      const next = { ...prev };
      for (const day of WORK_DAYS) {
        next[day] = quickShift;
      }
      return next;
    });
  };

  const submit = async (days: WeeklyShiftDay[], successMessage: string) => {
    if (!selectedEmployee) {
      toast.error('يرجى اختيار موظف');
      return;
    }
    try {
      setIsSaving(true);
      const success = await authApiCall(() =>
        employeeService.assignWeeklyShiftsClient(selectedEmployee.id, { days })
      );
      if (success) {
        toast.success(successMessage);
        if (days.length === 0) {
          setPattern(emptyPattern());
        }
      } else {
        toast.error('حدث خطأ في حفظ الدوام');
      }
    } catch (error) {
      console.error('Error assigning weekly shifts:', error);
      toast.error('حدث خطأ في حفظ الدوام');
    } finally {
      setIsSaving(false);
    }
  };

  const onSave = () =>
    submit(
      Object.entries(pattern)
        .filter(([, shiftId]) => shiftId !== OFF)
        .map(([dayOfWeek, shiftId]) => ({
          dayOfWeek: Number(dayOfWeek),
          shiftId
        })),
      'تم تثبيت الدوام بنجاح'
    );

  const onClear = () => submit([], 'تم مسح الدوام الثابت');

  return (
    <Card className='w-full'>
      <CardHeader>
        <CardTitle>تثبيت الدوام</CardTitle>
        <CardDescription>
          ثبّت دوام الموظف لكل يوم من أيام الأسبوع دون الحاجة إلى إنشاء جدول
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-6'>
        <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
          {/* Employee picker — searchable (server-side, by name or code) */}
          <div className='space-y-2'>
            <label className='text-sm font-medium'>اسم الموظف</label>
            <Popover open={employeeOpen} onOpenChange={setEmployeeOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant='outline'
                  role='combobox'
                  className={cn(
                    'w-full justify-between',
                    !selectedEmployee && 'text-muted-foreground'
                  )}
                >
                  {selectedEmployee
                    ? `${selectedEmployee.fullName} - ${selectedEmployee.empId}`
                    : 'اختر موظف'}
                  <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                </Button>
              </PopoverTrigger>
              <PopoverContent className='w-[340px] p-0'>
                <Command shouldFilter={false}>
                  <CommandInput
                    placeholder='ابحث عن موظف...'
                    value={searchTerm}
                    onValueChange={handleSearchChange}
                  />
                  <CommandList>
                    <CommandEmpty>لا يوجد موظفين</CommandEmpty>
                    <CommandGroup>
                      {employees.map((employee) => (
                        <CommandItem
                          value={employee.fullName}
                          key={employee.id}
                          onSelect={() => onSelectEmployee(employee)}
                        >
                          <Check
                            className={cn(
                              'mr-2 h-4 w-4',
                              employee.id === selectedEmployee?.id
                                ? 'opacity-100'
                                : 'opacity-0'
                            )}
                          />
                          {employee.fullName} - {employee.empId}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {selectedEmployee && (
            <div className='bg-muted/50 rounded-lg border p-4'>
              <h4 className='mb-2 font-medium'>الموظف المحدد:</h4>
              <p className='text-muted-foreground text-sm'>
                {selectedEmployee.fullName} - {selectedEmployee.empId}
              </p>
              <p className='text-muted-foreground text-sm'>
                الجهة: {selectedEmployee.organizationalUnitName || 'غير محدد'}
              </p>
            </div>
          )}
        </div>

        {selectedEmployee && (
          <>
            {/* Quick fill */}
            <div className='bg-muted/30 flex flex-wrap items-end gap-3 rounded-lg border p-4'>
              <div className='min-w-56 flex-1'>
                <label className='text-sm font-medium'>
                  تطبيق دوام واحد على أيام العمل (الأحد - الخميس)
                </label>
                <Select value={quickShift} onValueChange={setQuickShift}>
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder='اختر الدوام...' />
                  </SelectTrigger>
                  <SelectContent>
                    {activeShifts.map((shift) => (
                      <SelectItem key={shift.id} value={shift.id}>
                        {shiftLabel(shift)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                type='button'
                variant='secondary'
                onClick={applyQuickFill}
              >
                تطبيق على كل الأيام
              </Button>
            </div>

            {/* Per-day selects */}
            <div className='grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3'>
              {WEEK_DAYS.map(({ dayOfWeek, label }) => (
                <div key={dayOfWeek} className='space-y-1'>
                  <label className='text-sm font-medium'>{label}</label>
                  <Select
                    value={pattern[dayOfWeek]}
                    onValueChange={(value) =>
                      setPattern((prev) => ({ ...prev, [dayOfWeek]: value }))
                    }
                  >
                    <SelectTrigger className='w-full'>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={OFF}>بدون دوام (راحة)</SelectItem>
                      {activeShifts.map((shift) => (
                        <SelectItem key={shift.id} value={shift.id}>
                          {shiftLabel(shift)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>

            <div className='flex gap-3'>
              <Button
                type='button'
                onClick={onSave}
                disabled={isSaving || !patternLoaded}
              >
                تثبيت الدوام
              </Button>
              <Button
                type='button'
                variant='outline'
                onClick={onClear}
                disabled={isSaving || !patternLoaded}
              >
                مسح الدوام الثابت
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
