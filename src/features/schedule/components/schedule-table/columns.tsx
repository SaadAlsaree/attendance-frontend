'use client';

import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import { Column, ColumnDef } from '@tanstack/react-table';
import {
  Calendar,
  User,
  Clock,
  FileText,
  CheckCircle,
  XCircle,
  CalendarDays,
  CalendarX
} from 'lucide-react';
import { AttendanceScheduleResponse } from '@/features/schedule/types/schedules';
import { formatDate, formatDateRange } from '../../utils/schedule';
import { CellAction } from './cell-action';

export const columns: ColumnDef<AttendanceScheduleResponse>[] = [
  {
    id: 'searchTerm',
    size: 200,
    accessorKey: 'employeeName',
    header: ({
      column
    }: {
      column: Column<AttendanceScheduleResponse, unknown>;
    }) => <DataTableColumnHeader column={column} title='اسم الموظف' />,
    cell: ({ cell }) => <div>{cell.getValue<string>()}</div>,
    meta: {
      label: 'اسم الموظف',
      placeholder: 'ابحث عن اسم الموظف...',
      variant: 'text',
      icon: User
    },
    enableColumnFilter: true
  },
  {
    id: 'scheduleTypeName',
    accessorKey: 'scheduleTypeName',
    header: ({
      column
    }: {
      column: Column<AttendanceScheduleResponse, unknown>;
    }) => <DataTableColumnHeader column={column} title='نوع الجدول' />,
    cell: ({ cell }) => {
      const scheduleTypeName = cell.getValue<string>();
      return <Badge variant='outline'>{scheduleTypeName}</Badge>;
    },
    meta: {
      label: 'نوع الجدول',
      icon: Calendar
    }
  },
  {
    id: 'startDate',
    accessorKey: 'startDate',
    header: ({
      column
    }: {
      column: Column<AttendanceScheduleResponse, unknown>;
    }) => <DataTableColumnHeader column={column} title='تاريخ البداية' />,
    cell: ({ cell, row }) => {
      const startDate = cell.getValue<string>();
      const endDate = row.original.endDate;
      return (
        <div className='flex items-center gap-1'>
          <Calendar className='h-4 w-4 text-blue-600' />
          <span>{formatDateRange(startDate, endDate || '-')}</span>
        </div>
      );
    },
    meta: {
      label: 'تاريخ البداية',
      icon: Calendar
    }
  },
  {
    id: 'endDate',
    accessorKey: 'endDate',
    header: ({
      column
    }: {
      column: Column<AttendanceScheduleResponse, unknown>;
    }) => <DataTableColumnHeader column={column} title='تاريخ النهاية' />,
    cell: ({ cell }) => {
      const endDate = cell.getValue<string>();
      return endDate ? (
        <div className='flex items-center gap-1'>
          <CalendarX className='h-4 w-4 text-red-600' />
          <span>{formatDate(endDate)}</span>
        </div>
      ) : (
        <div className='flex items-center gap-1'>
          <Clock className='h-4 w-4 text-green-600' />
          <span>مستمر</span>
        </div>
      );
    },
    meta: {
      label: 'تاريخ النهاية',
      icon: CalendarX
    }
  },
  {
    id: 'scheduleDays',
    accessorKey: 'scheduleDays',
    header: ({
      column
    }: {
      column: Column<AttendanceScheduleResponse, unknown>;
    }) => <DataTableColumnHeader column={column} title='أيام العمل' />,
    cell: ({ cell }) => {
      const scheduleDays = cell.getValue<any[]>();
      const activeDays = scheduleDays?.filter((day) => day.isActive) || [];
      return (
        <div className='flex items-center gap-1'>
          <CalendarDays className='h-4 w-4 text-purple-600' />
          <span>{activeDays.length} يوم</span>
        </div>
      );
    },
    meta: {
      label: 'أيام العمل',
      icon: CalendarDays
    }
  },
  {
    id: 'excludedDates',
    accessorKey: 'excludedDates',
    header: ({
      column
    }: {
      column: Column<AttendanceScheduleResponse, unknown>;
    }) => <DataTableColumnHeader column={column} title='التواريخ المستثناة' />,
    cell: ({ cell }) => {
      const excludedDates = cell.getValue<string[]>();
      return excludedDates && excludedDates.length > 0 ? (
        <Badge variant='secondary'>{excludedDates.length} تاريخ</Badge>
      ) : (
        <div>-</div>
      );
    },
    meta: {
      label: 'التواريخ المستثناة',
      icon: CalendarX
    }
  },
  {
    id: 'isActive',
    accessorKey: 'isActive',
    header: ({
      column
    }: {
      column: Column<AttendanceScheduleResponse, unknown>;
    }) => <DataTableColumnHeader column={column} title='الحالة' />,
    cell: ({ cell }) => {
      const isActive = cell.getValue<boolean>();
      return isActive ? (
        <div className='flex items-center gap-1'>
          <CheckCircle className='h-4 w-4 text-green-600' />
          <span>نشط</span>
        </div>
      ) : (
        <div className='flex items-center gap-1'>
          <XCircle className='h-4 w-4 text-red-600' />
          <span>غير نشط</span>
        </div>
      );
    },
    meta: {
      label: 'الحالة',
      icon: CheckCircle
    }
  },
  {
    id: 'notes',
    accessorKey: 'notes',
    header: ({
      column
    }: {
      column: Column<AttendanceScheduleResponse, unknown>;
    }) => <DataTableColumnHeader column={column} title='الملاحظات' />,
    cell: ({ cell }) => {
      const notes = cell.getValue<string>();
      return <div>{notes || '-'}</div>;
    },
    meta: {
      label: 'الملاحظات',
      icon: FileText
    }
  },
  {
    id: 'createdAt',
    accessorKey: 'createdAt',
    header: ({
      column
    }: {
      column: Column<AttendanceScheduleResponse, unknown>;
    }) => <DataTableColumnHeader column={column} title='تاريخ الإنشاء' />,
    cell: ({ cell }) => {
      const createdAt = cell.getValue<string>();
      return <div>{formatDate(createdAt)}</div>;
    },
    meta: {
      label: 'تاريخ الإنشاء',
      icon: Calendar
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
