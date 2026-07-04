'use client';

import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import { Column, ColumnDef } from '@tanstack/react-table';
import { Building2, CalendarClock, Pencil, User } from 'lucide-react';
import { EmployeeWeeklyShiftsRow } from '@/features/schedule/types/schedules';
import { summarizeWeeklyPattern } from '../../utils/weekly-pattern';

export const columns: ColumnDef<EmployeeWeeklyShiftsRow>[] = [
  {
    id: 'searchTerm',
    size: 200,
    accessorKey: 'fullName',
    header: ({
      column
    }: {
      column: Column<EmployeeWeeklyShiftsRow, unknown>;
    }) => <DataTableColumnHeader column={column} title='اسم الموظف' />,
    cell: ({ cell }) => <div>{cell.getValue<string>()}</div>,
    meta: {
      label: 'اسم الموظف',
      placeholder: 'ابحث بالاسم أو الرمز...',
      variant: 'text',
      icon: User
    },
    enableColumnFilter: true
  },
  {
    id: 'empId',
    accessorKey: 'empId',
    header: ({
      column
    }: {
      column: Column<EmployeeWeeklyShiftsRow, unknown>;
    }) => <DataTableColumnHeader column={column} title='الرقم الوظيفي' />,
    cell: ({ cell }) => (
      <span className='font-mono text-sm'>{cell.getValue<string>()}</span>
    ),
    meta: {
      label: 'الرقم الوظيفي'
    }
  },
  {
    id: 'organizationalUnitName',
    accessorKey: 'organizationalUnitName',
    header: ({
      column
    }: {
      column: Column<EmployeeWeeklyShiftsRow, unknown>;
    }) => <DataTableColumnHeader column={column} title='الجهة' />,
    cell: ({ cell }) => <div>{cell.getValue<string>() || '—'}</div>,
    meta: {
      label: 'الجهة',
      icon: Building2
    }
  },
  {
    id: 'pattern',
    header: ({
      column
    }: {
      column: Column<EmployeeWeeklyShiftsRow, unknown>;
    }) => <DataTableColumnHeader column={column} title='نمط الدوام' />,
    cell: ({ row }) => {
      const segments = summarizeWeeklyPattern(row.original.days);
      return (
        <div className='flex max-w-md flex-wrap gap-1'>
          {segments.map((segment) => (
            <Badge key={segment} variant='outline'>
              {segment}
            </Badge>
          ))}
        </div>
      );
    },
    meta: {
      label: 'نمط الدوام',
      icon: CalendarClock
    }
  },
  {
    id: 'actions',
    header: () => <span>الإجراءات</span>,
    cell: ({ row }) => (
      <Button asChild variant='ghost' size='sm' title='تعديل الدوام الثابت'>
        <Link
          href={`/schedule/assign-shifts?searchTerm=${encodeURIComponent(row.original.empId)}`}
        >
          <Pencil className='h-4 w-4' />
        </Link>
      </Button>
    )
  }
];
