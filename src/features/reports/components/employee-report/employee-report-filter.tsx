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

const EmployeeReportFilter = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');

  const { employees, isLoading: isLoadingEmployees } = useEmployees({
    page: 1,
    pageSize: 1000,
    ...(search ? { searchTerm: search } : {})
  });

  const [employeeId, setEmployeeId] = useQueryState('employeeId');
  const [fromDate, setFromDate] = useQueryState('fromDate');
  const [toDate, setToDate] = useQueryState('toDate');

  const onReset = () => {
    setEmployeeId(null);
    setFromDate(null);
    setToDate(null);
    setSearch('');
  };

  const isValid = Boolean(employeeId && fromDate && toDate);

  const onApply = () => {
    if (!isValid) {
      return;
    }
    setIsOpen(false);

    const params = new URLSearchParams();
    params.set('employeeId', employeeId!);
    params.set('fromDate', fromDate!);
    params.set('toDate', toDate!);

    window.location.href = `/reports/employee-report?${params.toString()}`;
  };

  const activeFiltersCount = [employeeId, fromDate, toDate].filter(
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
            فلترة تقرير الموظف
          </SheetTitle>
          <SheetDescription>
            اختر الموظف والمدى الزمني (من - إلى)
          </SheetDescription>
        </SheetHeader>

        <div className='space-y-6 py-6'>
          {/* البحث عن موظف */}
          <div className='space-y-3'>
            <label className='text-sm font-medium'>بحث عن موظف</label>
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder='اكتب اسم الموظف للبحث'
            />
          </div>

          {/* الموظف - Required */}
          <div className='space-y-3'>
            <label className='text-sm font-medium'>
              الموظف <span className='text-destructive'>*</span>
            </label>
            <Select
              value={employeeId || undefined}
              onValueChange={(value) => setEmployeeId(value)}
              disabled={isLoadingEmployees}
            >
              <SelectTrigger className='w-full'>
                <SelectValue placeholder='اختر الموظف' />
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

          {/* من تاريخ - Required */}
          <div className='space-y-3'>
            <label className='text-sm font-medium'>
              من تاريخ <span className='text-destructive'>*</span>
            </label>
            <Input
              value={fromDate || ''}
              onChange={(e) => setFromDate(e.target.value || null)}
              type='date'
            />
          </div>

          {/* إلى تاريخ - Required */}
          <div className='space-y-3'>
            <label className='text-sm font-medium'>
              إلى تاريخ <span className='text-destructive'>*</span>
            </label>
            <Input
              value={toDate || ''}
              onChange={(e) => setToDate(e.target.value || null)}
              type='date'
            />
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

export default EmployeeReportFilter;
