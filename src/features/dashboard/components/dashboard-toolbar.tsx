'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { CalendarIcon, Filter, RefreshCw, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export interface DashboardFilters {
  organizationId: string;
  date?: string;
  startDate?: string;
  endDate?: string;
  employeeId?: string;
  departmentId?: string;
}

interface DashboardToolbarProps {
  filters: DashboardFilters;
  onFiltersChange: (filters: DashboardFilters) => void;
  onRefresh: () => void;
  isLoading?: boolean;
  organizations?: Array<{ id: string; name: string }>;
  employees?: Array<{ id: string; name: string; employeeNumber: string }>;
  departments?: Array<{ id: string; name: string }>;
}

export function DashboardToolbar({
  filters,
  onFiltersChange,
  onRefresh,
  isLoading = false,
  organizations = [],
  employees = [],
  departments = []
}: DashboardToolbarProps) {
  const [localFilters, setLocalFilters] = useState<DashboardFilters>(filters);
  const [isDateRangeOpen, setIsDateRangeOpen] = useState(false);
  const [isDateOpen, setIsDateOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  // Update local filters when props change
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  // Calculate active filters
  useEffect(() => {
    const active: string[] = [];
    if (localFilters.organizationId) active.push('المنظمة');
    if (localFilters.date) active.push('التاريخ');
    if (localFilters.startDate || localFilters.endDate)
      active.push('نطاق التاريخ');
    if (localFilters.employeeId) active.push('الموظف');
    if (localFilters.departmentId) active.push('القسم');
    setActiveFilters(active);
  }, [localFilters]);

  const handleFilterChange = (
    key: keyof DashboardFilters,
    value: string | undefined
  ) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleDateRangeSelect = (
    range: { from?: Date; to?: Date } | undefined
  ) => {
    if (!range) return;

    const newFilters = {
      ...localFilters,
      startDate: range.from ? format(range.from, 'yyyy-MM-dd') : undefined,
      endDate: range.to ? format(range.to, 'yyyy-MM-dd') : undefined,
      date: undefined // Clear single date when using range
    };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
    setIsDateRangeOpen(false);
  };

  const handleDateSelect = (date: Date | undefined) => {
    const newFilters = {
      ...localFilters,
      date: date ? format(date, 'yyyy-MM-dd') : undefined,
      startDate: undefined, // Clear range when using single date
      endDate: undefined
    };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
    setIsDateOpen(false);
  };

  const clearFilters = () => {
    const clearedFilters: DashboardFilters = {
      organizationId: localFilters.organizationId,
      date: undefined,
      startDate: undefined,
      endDate: undefined,
      employeeId: undefined,
      departmentId: undefined
    };
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const getSelectedOrganizationName = () => {
    return (
      organizations.find((org) => org.id === localFilters.organizationId)
        ?.name || 'اختر المنظمة'
    );
  };

  const getSelectedEmployeeName = () => {
    const employee = employees.find(
      (emp) => emp.id === localFilters.employeeId
    );
    return employee
      ? `${employee.name} (${employee.employeeNumber})`
      : 'اختر الموظف';
  };

  const getSelectedDepartmentName = () => {
    return (
      departments.find((dept) => dept.id === localFilters.departmentId)?.name ||
      'اختر القسم'
    );
  };

  return (
    <Card className='mb-6'>
      <CardHeader className='pb-4'>
        <div className='flex items-center justify-between'>
          <CardTitle className='flex items-center gap-2 text-lg'>
            <Filter className='h-5 w-5' />
            مرشحات لوحة التحكم
          </CardTitle>
          <div className='flex items-center gap-2'>
            {activeFilters.length > 0 && (
              <Badge variant='secondary' className='text-xs'>
                {activeFilters.length} نشط
              </Badge>
            )}
            <Button
              variant='outline'
              size='sm'
              onClick={clearFilters}
              disabled={activeFilters.length === 0}
            >
              <X className='mr-1 h-4 w-4' />
              مسح
            </Button>
            <Button
              variant='outline'
              size='sm'
              onClick={onRefresh}
              disabled={isLoading}
            >
              <RefreshCw
                className={cn('mr-1 h-4 w-4', isLoading && 'animate-spin')}
              />
              تحديث
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6'>
          {/* Organization Filter */}
          <div className='space-y-2'>
            <Label htmlFor='organization' className='text-sm font-medium'>
              المنظمة
            </Label>
            <Select
              value={localFilters.organizationId}
              onValueChange={(value) =>
                handleFilterChange('organizationId', value)
              }
            >
              <SelectTrigger id='organization' className='w-full'>
                <SelectValue placeholder='اختر المنظمة' />
              </SelectTrigger>
              <SelectContent>
                {organizations.map((org) => (
                  <SelectItem key={org.id} value={org.id}>
                    {org.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Department Filter */}
          <div className='space-y-2'>
            <Label htmlFor='department' className='text-sm font-medium'>
              القسم
            </Label>
            <Select
              value={localFilters.departmentId || 'all'}
              onValueChange={(value) =>
                handleFilterChange(
                  'departmentId',
                  value === 'all' ? undefined : value
                )
              }
            >
              <SelectTrigger id='department' className='w-full'>
                <SelectValue placeholder='جميع الأقسام' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>جميع الأقسام</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept.id} value={dept.id}>
                    {dept.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Employee Filter */}
          <div className='space-y-2'>
            <Label htmlFor='employee' className='text-sm font-medium'>
              الموظف
            </Label>
            <Select
              value={localFilters.employeeId || 'all'}
              onValueChange={(value) =>
                handleFilterChange(
                  'employeeId',
                  value === 'all' ? undefined : value
                )
              }
            >
              <SelectTrigger id='employee' className='w-full'>
                <SelectValue placeholder='جميع الموظفين' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>جميع الموظفين</SelectItem>
                {employees.map((emp) => (
                  <SelectItem key={emp.id} value={emp.id}>
                    {emp.name} ({emp.employeeNumber})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Single Date Filter */}
          <div className='space-y-2'>
            <Label className='text-sm font-medium'>التاريخ</Label>
            <Popover open={isDateOpen} onOpenChange={setIsDateOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant='outline'
                  className={cn(
                    'w-full justify-start text-left font-normal',
                    !localFilters.date && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className='mr-2 h-4 w-4' />
                  {localFilters.date
                    ? format(new Date(localFilters.date), 'PPP', { locale: ar })
                    : 'اختر التاريخ'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className='w-auto p-0' align='start'>
                <Calendar
                  mode='single'
                  selected={
                    localFilters.date ? new Date(localFilters.date) : undefined
                  }
                  onSelect={handleDateSelect}
                  initialFocus
                  locale={ar}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Date Range Filter */}
          <div className='space-y-2'>
            <Label className='text-sm font-medium'>نطاق التاريخ</Label>
            <Popover open={isDateRangeOpen} onOpenChange={setIsDateRangeOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant='outline'
                  className={cn(
                    'w-full justify-start text-left font-normal',
                    !localFilters.startDate &&
                      !localFilters.endDate &&
                      'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className='mr-2 h-4 w-4' />
                  {localFilters.startDate && localFilters.endDate
                    ? `${format(new Date(localFilters.startDate), 'MMM dd', { locale: ar })} - ${format(new Date(localFilters.endDate), 'MMM dd, yyyy', { locale: ar })}`
                    : 'اختر النطاق'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className='w-auto p-0' align='start'>
                <Calendar
                  initialFocus
                  mode='range'
                  defaultMonth={
                    localFilters.startDate
                      ? new Date(localFilters.startDate)
                      : new Date()
                  }
                  selected={{
                    from: localFilters.startDate
                      ? new Date(localFilters.startDate)
                      : undefined,
                    to: localFilters.endDate
                      ? new Date(localFilters.endDate)
                      : undefined
                  }}
                  onSelect={handleDateRangeSelect}
                  numberOfMonths={2}
                  locale={ar}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Search Input */}
          <div className='space-y-2'>
            <Label htmlFor='search' className='text-sm font-medium'>
              البحث
            </Label>
            <div className='relative'>
              <Search className='text-muted-foreground absolute top-2.5 left-2 h-4 w-4' />
              <Input
                id='search'
                placeholder='ابحث...'
                className='pl-8'
                // Add search functionality as needed
              />
            </div>
          </div>
        </div>

        {/* Active Filters Display */}
        {activeFilters.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className='mt-4 border-t pt-4'
          >
            <div className='flex flex-wrap items-center gap-2'>
              <span className='text-muted-foreground text-sm'>
                المرشحات النشطة:
              </span>
              {localFilters.organizationId && (
                <Badge variant='secondary' className='text-xs'>
                  المنظمة: {getSelectedOrganizationName()}
                </Badge>
              )}
              {localFilters.date && (
                <Badge variant='secondary' className='text-xs'>
                  التاريخ:{' '}
                  {format(new Date(localFilters.date), 'MMM dd, yyyy', {
                    locale: ar
                  })}
                </Badge>
              )}
              {localFilters.startDate && localFilters.endDate && (
                <Badge variant='secondary' className='text-xs'>
                  النطاق:{' '}
                  {format(new Date(localFilters.startDate), 'MMM dd', {
                    locale: ar
                  })}{' '}
                  -{' '}
                  {format(new Date(localFilters.endDate), 'MMM dd', {
                    locale: ar
                  })}
                </Badge>
              )}
              {localFilters.employeeId && (
                <Badge variant='secondary' className='text-xs'>
                  الموظف: {getSelectedEmployeeName()}
                </Badge>
              )}
              {localFilters.departmentId && (
                <Badge variant='secondary' className='text-xs'>
                  القسم: {getSelectedDepartmentName()}
                </Badge>
              )}
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}
