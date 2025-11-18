'use client';

import React, { useState, useEffect } from 'react';
import { useQueryState } from 'nuqs';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
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
import { CalendarIcon, FilterIcon, RotateCcw } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import { setToStartOfDayUTC, setToEndOfDayUTC } from '@/lib/utils/date-utils';
import { useOrganizationalUnits } from '@/hooks/use-organizational-unit';
import { shiftService } from '@/features/shift/api/shift.service';
import { useAuthApi } from '@/hooks/use-auth-api';
import { ShiftData } from '@/features/shift/types/shift';
import { OrganizationalReportQuery } from '../../types/organization-report';
import type { DateRange } from 'react-day-picker';

type OrganizationalReportFilterProps = {
  onFilterChange?: (query: OrganizationalReportQuery) => void;
};

const OrganizationalReportFilter = ({
  onFilterChange
}: OrganizationalReportFilterProps) => {
  const router = useRouter();
  const { authApiCall } = useAuthApi();
  const [isOpen, setIsOpen] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [shifts, setShifts] = useState<ShiftData[]>([]);
  const [isLoadingShifts, setIsLoadingShifts] = useState(false);

  // Fetch organizational units
  const { organizationalUnits, isLoading: isLoadingUnits } =
    useOrganizationalUnits({
      page: 1,
      pageSize: 1000
    });

  // URL state management with nuqs
  const [organizationalUnitId, setOrganizationalUnitId] = useQueryState(
    'organizationalUnitId'
  );
  const [startDate, setStartDate] = useQueryState('startDate', {
    parse: (value) => (value ? new Date(value) : null),
    serialize: (value) => (value ? value.toISOString() : '')
  });
  const [endDate, setEndDate] = useQueryState('endDate', {
    parse: (value) => (value ? new Date(value) : null),
    serialize: (value) => (value ? value.toISOString() : '')
  });
  const [shiftId, setShiftId] = useQueryState('shiftId');
  const [includeSubUnits, setIncludeSubUnits] = useQueryState(
    'includeSubUnits',
    {
      parse: (value) => value === 'true',
      serialize: (value) => value.toString(),
      defaultValue: true
    }
  );

  // Fetch shifts
  useEffect(() => {
    const fetchShifts = async () => {
      setIsLoadingShifts(true);
      try {
        const response = await authApiCall(() =>
          shiftService.getShiftsListClient({
            page: 1,
            pageSize: 1000,
            isActive: true
          })
        );
        if (response?.data) {
          const shiftsData = Array.isArray(response.data)
            ? response.data.map((item: any) => item.data || item)
            : [];
          setShifts(shiftsData);
        }
      } catch (error) {
        console.error('Error fetching shifts:', error);
      } finally {
        setIsLoadingShifts(false);
      }
    };

    fetchShifts();
  }, [authApiCall]);

  // Date range state for the calendar
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: startDate || undefined,
    to: endDate || undefined
  });

  // Update date range when URL params change
  useEffect(() => {
    setDateRange({
      from: startDate || undefined,
      to: endDate || undefined
    });
  }, [startDate, endDate]);

  const onDateRangeSelect = (range: DateRange | undefined) => {
    setDateRange(range);
    if (range?.from) {
      // Set start date to beginning of day (00:00:00) in UTC
      const startDateAtStartOfDay = setToStartOfDayUTC(range.from);
      setStartDate(startDateAtStartOfDay);
    } else {
      setStartDate(null);
    }
    if (range?.to) {
      // Set end date to end of day (23:59:59.999) in UTC
      const endDateAtEndOfDay = setToEndOfDayUTC(range.to);
      setEndDate(endDateAtEndOfDay);
    } else {
      setEndDate(null);
    }
  };

  const onUnitSelect = (unitId: string) => {
    setOrganizationalUnitId(unitId);
  };

  const onShiftSelect = (selectedShiftId: string) => {
    setShiftId(selectedShiftId === 'all' ? null : selectedShiftId);
  };

  const onIncludeSubUnitsChange = (value: string) => {
    setIncludeSubUnits(value === 'true');
  };

  const onResetFilters = () => {
    setOrganizationalUnitId(null);
    setStartDate(null);
    setEndDate(null);
    setShiftId(null);
    setIncludeSubUnits(true);
    setDateRange(undefined);
  };

  const onApplyFilters = () => {
    // Validate required field
    if (!organizationalUnitId) {
      // Could show an error message here
      return;
    }

    setIsOpen(false);

    // Build query object
    const query: OrganizationalReportQuery = {
      organizationalUnitId,
      ...(startDate && { startDate: startDate.toISOString() }),
      ...(endDate && { endDate: endDate.toISOString() }),
      ...(shiftId && { shiftId }),
      includeSubUnits: includeSubUnits ?? true
    };

    // Call callback if provided
    if (onFilterChange) {
      onFilterChange(query);
    }

    // Update URL with query params
    const params = new URLSearchParams();

    params.set('organizationalUnitId', organizationalUnitId);
    if (startDate) {
      params.set('startDate', startDate.toISOString());
    }
    if (endDate) {
      params.set('endDate', endDate.toISOString());
    }
    if (shiftId) {
      params.set('shiftId', shiftId);
    }
    if (includeSubUnits !== null && includeSubUnits !== undefined) {
      params.set('includeSubUnits', includeSubUnits.toString());
    }

    const queryString = params.toString();
    const url = `/reports/organizational-report?${queryString}`;
    router.push(url);
    router.refresh();
  };

  const hasActiveFilters =
    organizationalUnitId ||
    startDate ||
    endDate ||
    shiftId ||
    includeSubUnits === false;

  const activeFiltersCount = [
    organizationalUnitId,
    startDate,
    endDate,
    shiftId,
    includeSubUnits === false
  ].filter(Boolean).length;

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
            فلترة التقرير
          </SheetTitle>
          <SheetDescription>
            اختر معايير الفلترة لعرض البيانات المطلوبة
          </SheetDescription>
        </SheetHeader>

        <div className='space-y-6 py-6'>
          {/* الوحدة التنظيمية - Required */}
          <div className='space-y-3'>
            <label className='text-sm font-medium'>
              الجهة <span className='text-destructive'>*</span>
            </label>
            <Select
              value={organizationalUnitId || undefined}
              onValueChange={onUnitSelect}
              disabled={isLoadingUnits}
            >
              <SelectTrigger className='w-full'>
                <SelectValue placeholder='اختر الجهة' />
              </SelectTrigger>
              <SelectContent>
                {organizationalUnits?.map((unit) => (
                  <SelectItem key={unit.id} value={unit.id}>
                    {unit.name} ({unit.code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* نطاق التاريخ */}
          <div className='space-y-3'>
            <label className='text-sm font-medium'>نطاق التاريخ</label>
            <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant='outline'
                  className={cn(
                    'w-full justify-start text-right font-normal',
                    !dateRange?.from &&
                      !dateRange?.to &&
                      'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className='ml-2 h-4 w-4' />
                  {dateRange?.from && dateRange?.to
                    ? `${format(dateRange.from, 'PPP', { locale: ar })} - ${format(dateRange.to, 'PPP', { locale: ar })}`
                    : dateRange?.from
                      ? format(dateRange.from, 'PPP', { locale: ar })
                      : 'اختر نطاق التاريخ'}
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className='w-auto p-0'
                align='end'
                onOpenAutoFocus={(e) => e.preventDefault()}
              >
                <Calendar
                  mode='range'
                  selected={dateRange}
                  onSelect={(range) => {
                    onDateRangeSelect(range);
                    // Close popover only when both dates are selected
                    if (range?.from && range?.to) {
                      setIsDatePickerOpen(false);
                    }
                  }}
                  initialFocus
                  locale={ar}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* المناوبة */}
          <div className='space-y-3'>
            <label className='text-sm font-medium'>المناوبة</label>
            <Select
              value={shiftId || 'all'}
              onValueChange={onShiftSelect}
              disabled={isLoadingShifts}
            >
              <SelectTrigger className='w-full'>
                <SelectValue placeholder='اختر المناوبة' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>جميع المناوبات</SelectItem>
                {shifts.map((shift) => (
                  <SelectItem key={shift.id} value={shift.id}>
                    {shift.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* تضمين الوحدات الفرعية */}
          <div className='space-y-3'>
            <label className='text-sm font-medium'>تضمين الوحدات الفرعية</label>
            <Select
              value={includeSubUnits?.toString() || 'true'}
              onValueChange={onIncludeSubUnitsChange}
            >
              <SelectTrigger className='w-full'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='true'>نعم</SelectItem>
                <SelectItem value='false'>لا</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* ملخص الفلاتر */}
          {hasActiveFilters && (
            <div className='bg-muted/50 rounded-lg border p-4'>
              <h4 className='mb-3 text-sm font-medium'>الفلاتر المطبقة:</h4>
              <div className='flex flex-wrap gap-2'>
                {organizationalUnitId && (
                  <Badge variant='secondary' className='text-xs'>
                    الجهة:{' '}
                    {organizationalUnits?.find(
                      (u) => u.id === organizationalUnitId
                    )?.name || 'اختر الجهة'}
                  </Badge>
                )}
                {startDate && (
                  <Badge variant='secondary' className='text-xs'>
                    من: {format(startDate, 'dd/MM/yyyy', { locale: ar })}
                  </Badge>
                )}
                {endDate && (
                  <Badge variant='secondary' className='text-xs'>
                    إلى: {format(endDate, 'dd/MM/yyyy', { locale: ar })}
                  </Badge>
                )}
                {shiftId && (
                  <Badge variant='secondary' className='text-xs'>
                    المناوبة: {shifts.find((s) => s.id === shiftId)?.name}
                  </Badge>
                )}
                {includeSubUnits === false && (
                  <Badge variant='secondary' className='text-xs'>
                    لا تشمل الوحدات الفرعية
                  </Badge>
                )}
              </div>
            </div>
          )}
        </div>

        <SheetFooter className='flex gap-2'>
          <Button
            variant='outline'
            onClick={onResetFilters}
            className='flex items-center gap-2'
          >
            <RotateCcw className='h-4 w-4' />
            إعادة تعيين
          </Button>
          <SheetClose asChild>
            <Button onClick={onApplyFilters} className='flex-1'>
              تطبيق الفلاتر
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default OrganizationalReportFilter;
