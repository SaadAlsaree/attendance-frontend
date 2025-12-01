'use client';

import React, { useState, useEffect } from 'react';
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
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useOrganizationalUnits } from '@/hooks/use-organizational-unit';
import { shiftService } from '@/features/shift/api/shift.service';
import { useAuthApi } from '@/hooks/use-auth-api';
import { ShiftData } from '@/features/shift/types/shift';
import { OrganizationalReportQuery } from '../../types/organization-report';

type OrganizationalReportFilterProps = {
  onFilterChange?: (query: OrganizationalReportQuery) => void;
};

const OrganizationalReportFilter = ({
  onFilterChange
}: OrganizationalReportFilterProps) => {
  const { authApiCall } = useAuthApi();
  const [isOpen, setIsOpen] = useState(false);
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
  const [date, setDate] = useQueryState('date', {
    parse: (value) => (value ? value : null),
    serialize: (value) => (value ? value : '')
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
  const [searchTerm, setSearchTerm] = useQueryState('searchTerm');
  const [pageNumber, setPageNumber] = useQueryState('pageNumber', {
    parse: (value) => (value ? parseInt(value) : 1),
    serialize: (value) => (value ? value.toString() : '1'),
    defaultValue: 1
  });
  const [pageSize, setPageSize] = useQueryState('pageSize', {
    parse: (value) => (value ? parseInt(value) : 10),
    serialize: (value) => (value ? value.toString() : '10'),
    defaultValue: 10
  });

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
    setDate(null);
    setShiftId(null);
    setIncludeSubUnits(true);
    setSearchTerm(null);
    setPageNumber(1);
    setPageSize(10);
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
      ...(date && { date }),
      ...(shiftId && { shiftId }),
      includeSubUnits: includeSubUnits ?? true,
      ...(searchTerm && { searchTerm }),
      pageNumber: pageNumber ?? 1,
      pageSize: pageSize ?? 10
    };

    // Call callback if provided
    if (onFilterChange) {
      onFilterChange(query);
    }

    // Build URL with all query params
    const params = new URLSearchParams();
    params.set('organizationalUnitId', organizationalUnitId);
    if (date) {
      params.set('date', date);
    }
    if (shiftId) {
      params.set('shiftId', shiftId);
    }
    params.set('includeSubUnits', (includeSubUnits ?? true).toString());
    if (searchTerm) {
      params.set('searchTerm', searchTerm);
    }
    params.set('pageNumber', (pageNumber ?? 1).toString());
    params.set('pageSize', (pageSize ?? 10).toString());

    const url = `/reports/organizational-report?${params.toString()}`;

    // Navigate to the new URL - this will trigger a full page reload
    // which ensures the server component re-renders with new params
    window.location.href = url;
  };

  const hasActiveFilters =
    organizationalUnitId ||
    date ||
    shiftId ||
    includeSubUnits === false ||
    searchTerm;

  const activeFiltersCount = [
    organizationalUnitId,
    date,
    shiftId,
    includeSubUnits === false,
    searchTerm
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

          {/* التاريخ */}
          <div className='space-y-3'>
            <label className='text-sm font-medium'>التاريخ</label>
            <Input
              value={date || ''}
              onChange={(e) => {
                const value = e.target.value;
                setDate(value || null);
              }}
              type='date'
            />
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

          {/* البحث */}
          <div className='space-y-3'>
            <label className='text-sm font-medium'>البحث</label>
            <Input
              value={searchTerm || ''}
              onChange={(e) => setSearchTerm(e.target.value || null)}
              placeholder='أدخل مصطلح البحث'
            />
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
                {date && (
                  <Badge variant='secondary' className='text-xs'>
                    التاريخ: {format(new Date(date + 'T00:00:00'), 'dd/MM/yyyy', { locale: ar })}
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
                {searchTerm && (
                  <Badge variant='secondary' className='text-xs'>
                    البحث: {searchTerm}
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
