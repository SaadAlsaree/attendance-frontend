'use client';

import React, { useState } from 'react';
import { useQueryState } from 'nuqs';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet';
import { FilterIcon, RotateCcw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useEmployees } from '@/hooks/use-employees';

// Default to the previous full month so cumulative overtime "للأشهر السابقة" is one click away.
const toIso = (d: Date) => d.toISOString().slice(0, 10);
const getPreviousMonthRange = () => {
  const now = new Date();
  const firstOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastOfPrevMonth = new Date(firstOfThisMonth.getTime() - 24 * 60 * 60 * 1000);
  const firstOfPrevMonth = new Date(
    lastOfPrevMonth.getFullYear(),
    lastOfPrevMonth.getMonth(),
    1
  );
  return { start: toIso(firstOfPrevMonth), end: toIso(lastOfPrevMonth) };
};

const OvertimeReportFilter = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');

  const { employees, isLoading: isLoadingEmployees } = useEmployees({
    page: 1,
    pageSize: 1000,
    ...(search ? { searchTerm: search } : {})
  });

  const [startDate, setStartDate] = useQueryState('startDate');
  const [endDate, setEndDate] = useQueryState('endDate');
  const [employeeId, setEmployeeId] = useQueryState('employeeId');

  const defaults = getPreviousMonthRange();
  const fromValue = startDate ?? defaults.start;
  const toValue = endDate ?? defaults.end;

  const onReset = () => {
    setStartDate(null);
    setEndDate(null);
    setEmployeeId(null);
    setSearch('');
  };

  // Backend validator rejects same-day ranges (EndDate must be > StartDate).
  const isValid = Boolean(fromValue && toValue && fromValue < toValue);

  const onApply = () => {
    if (!isValid) {
      return;
    }
    setIsOpen(false);

    const params = new URLSearchParams();
    params.set('startDate', fromValue);
    params.set('endDate', toValue);
    if (employeeId) {
      params.set('employeeId', employeeId);
    }

    window.location.href = `/reports/overtime-report?${params.toString()}`;
  };

  const activeFiltersCount = [startDate, endDate, employeeId].filter(
    Boolean
  ).length;

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant='outline' size='sm' className='flex items-center gap-2'>
          <FilterIcon className='h-4 w-4' />
          فلترة
          {activeFiltersCount > 0 && (
            <Badge
              variant='secondary'
              className='ml-1 h-5 w-5 rounded-full p-0 text-xs'
            >
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side='left' className='w-[400px] p-6 sm:w-[540px]'>
        <SheetHeader>
          <SheetTitle className='flex items-center gap-2'>
            <FilterIcon className='h-5 w-5' />
            فلترة تقرير العمل الإضافي
          </SheetTitle>
          <SheetDescription>
            اختر المدى الزمني (من - إلى) — يمكن أن يشمل الأشهر السابقة
          </SheetDescription>
        </SheetHeader>

        <div className='space-y-6 py-6'>
          {/* من تاريخ - Required */}
          <div className='space-y-3'>
            <label className='text-sm font-medium'>
              من تاريخ <span className='text-destructive'>*</span>
            </label>
            <Input
              value={fromValue}
              onChange={(e) => setStartDate(e.target.value || null)}
              type='date'
            />
          </div>

          {/* إلى تاريخ - Required */}
          <div className='space-y-3'>
            <label className='text-sm font-medium'>
              إلى تاريخ <span className='text-destructive'>*</span>
            </label>
            <Input
              value={toValue}
              onChange={(e) => setEndDate(e.target.value || null)}
              type='date'
            />
          </div>

          {!isValid && (
            <p className='text-destructive text-sm'>
              يجب أن يكون تاريخ النهاية بعد تاريخ البداية
            </p>
          )}

          {/* البحث عن موظف (اختياري) */}
          <div className='space-y-3'>
            <label className='text-sm font-medium'>بحث عن موظف (اختياري)</label>
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder='اكتب اسم الموظف للبحث'
            />
          </div>

          {/* الموظف - Optional */}
          <div className='space-y-3'>
            <label className='text-sm font-medium'>الموظف (اختياري)</label>
            <Select
              value={employeeId || undefined}
              onValueChange={(value) => setEmployeeId(value)}
              disabled={isLoadingEmployees}
            >
              <SelectTrigger className='w-full'>
                <SelectValue placeholder='كل الموظفين' />
              </SelectTrigger>
              <SelectContent>
                {employees?.map((employee: any) => (
                  <SelectItem key={employee.id} value={employee.id}>
                    {employee.fullName}
                    {employee.empId ? ` (${employee.empId})` : ''}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <SheetFooter className='flex gap-2'>
          <Button
            variant='outline'
            onClick={onReset}
            className='flex items-center gap-2'
          >
            <RotateCcw className='h-4 w-4' />
            إعادة تعيين
          </Button>
          <SheetClose asChild>
            <Button onClick={onApply} disabled={!isValid} className='flex-1'>
              عرض التقرير
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default OvertimeReportFilter;
