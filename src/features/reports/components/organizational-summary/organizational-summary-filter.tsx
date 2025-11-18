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

import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import { setToStartOfDayUTC } from '@/lib/utils/date-utils';
import { Input } from '@/components/ui/input';

interface OrganizationalUnit {
  id: string;
  unitName: string;
  unitCode: string;
  parentId?: string;
}

type OrganizationalSummaryFilterProps = {
  organization: OrganizationalUnit[];
};

const OrganizationalSummaryFilter = ({
  organization
}: OrganizationalSummaryFilterProps) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [organizationalUnitId, setOrganizationalUnitId] = useQueryState(
    'organizationalUnitId'
  );
  const [date, setDate] = useQueryState('date', {
    parse: (value) => new Date(value),
    serialize: (value) => value.toISOString()
  });
  const [includeSubUnits, setIncludeSubUnits] = useQueryState(
    'includeSubUnits',
    {
      parse: (value) => value === 'true',
      serialize: (value) => value.toString()
    }
  );

  const onDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      // Set time to start of day (00:00:00) in UTC
      const dateAtStartOfDay = setToStartOfDayUTC(selectedDate);
      setDate(dateAtStartOfDay);
    }
  };

  const onUnitSelect = (unitId: string) => {
    setOrganizationalUnitId(unitId === 'all' ? null : unitId);
  };

  const onIncludeSubUnitsChange = (value: string) => {
    setIncludeSubUnits(value === 'true');
  };

  const onResetFilters = () => {
    setOrganizationalUnitId(null);
    setDate(null);
    setIncludeSubUnits(true);
  };

  const onApplyFilters = () => {
    setIsOpen(false);
    const params = new URLSearchParams();

    if (date) {
      params.set('date', date.toISOString());
    }
    if (organizationalUnitId) {
      params.set('organizationalUnitId', organizationalUnitId);
    }
    if (includeSubUnits !== null && includeSubUnits !== undefined) {
      params.set('includeSubUnits', includeSubUnits.toString());
    }

    const queryString = params.toString();
    const url = queryString
      ? `/reports/organizational-summary?${queryString}`
      : '/reports/organizational-summary';
    router.push(url);
  };

  const hasActiveFilters =
    organizationalUnitId || date || includeSubUnits === false;

  const activeFiltersCount = [
    organizationalUnitId,
    date,
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
          {/* التاريخ */}
          <div className='space-y-3'>
            <label className='text-sm font-medium'>التاريخ</label>
            <Input
              value={date ? format(date, 'yyyy-MM-dd', { locale: ar }) : ''}
              onChange={(e) =>
                onDateSelect(new Date(e.target.value + 'T00:00:00'))
              }
              type='date'
            />
          </div>

          {/* الوحدة التنظيمية */}
          <div className='space-y-3'>
            <label className='text-sm font-medium'>الجهة</label>
            <Select
              value={organizationalUnitId || 'all'}
              onValueChange={onUnitSelect}
            >
              <SelectTrigger className='w-full'>
                <SelectValue placeholder='اختر الجهة' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>جميع الجهات</SelectItem>
                {organization.map((unit) => (
                  <SelectItem key={unit.id} value={unit.id}>
                    {unit.unitName} ({unit.unitCode})
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
                    {
                      organization.find((u) => u.id === organizationalUnitId)
                        ?.unitName
                    }
                  </Badge>
                )}
                {date && (
                  <Badge variant='secondary' className='text-xs'>
                    التاريخ: {format(date, 'dd/MM/yyyy', { locale: ar })}
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

export default OrganizationalSummaryFilter;
