'use client';

import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import { Column, ColumnDef } from '@tanstack/react-table';
import {
  Clock,
  FileText,
  Calendar,
  CheckCircle,
  XCircle,
  Play,
  Square
} from 'lucide-react';
import { ShiftData, ShiftResponse } from '@/features/shift/types/shift';
import { formatTime, formatDate, getActiveStatusText } from '../../utils/shift';
import { CellAction } from './cell-action';

export const columns: ColumnDef<ShiftResponse>[] = [
  {
    id: 'name',
    accessorKey: 'name',
    header: ({ column }: { column: Column<ShiftResponse, unknown> }) => (
      <DataTableColumnHeader column={column} title='اسم المناوبة' />
    ),
    cell: ({ cell }) => <div>{cell.getValue<string>()}</div>,
    meta: {
      label: 'اسم المناوبة',
      placeholder: 'ابحث عن اسم المناوبة...',
      variant: 'text',
      icon: Clock
    },
    enableColumnFilter: true
  },
  // {
  //   id: 'shiftTypeName',
  //   accessorKey: 'shiftTypeName',
  //   header: ({ column }: { column: Column<ShiftResponse, unknown> }) => (
  //     <DataTableColumnHeader column={column} title='نوع المناوبة' />
  //   ),
  //   cell: ({ cell }) => {
  //     const shiftTypeName = cell.getValue<string>();
  //     return <Badge variant='outline'>{shiftTypeName}</Badge>;
  //   },
  //   meta: {
  //     label: 'نوع المناوبة',
  //     placeholder: 'ابحث عن نوع المناوبة...',
  //     variant: 'text',
  //     icon: Clock
  //   }
  // },
  {
    id: 'shiftTypeName',
    accessorKey: 'shiftTypeName',
    header: ({ column }: { column: Column<ShiftResponse, unknown> }) => (
      <DataTableColumnHeader column={column} title='نوع المناوبة' />
    ),
    cell: ({ cell }) => {
      const shiftTypeName = cell.getValue<string>();
      return <Badge variant='outline'>{shiftTypeName}</Badge>;
    },
    meta: {
      label: 'نوع المناوبة',
      icon: Clock
    }
  },
  {
    id: 'startTime',
    accessorKey: 'startTime',
    header: ({ column }: { column: Column<ShiftResponse, unknown> }) => (
      <DataTableColumnHeader column={column} title='وقت البداية الدوام' />
    ),
    cell: ({ cell }) => {
      const startTime = cell.getValue<string>();
      return (
        <div className='flex items-center gap-1'>
          <Play className='h-4 w-4 text-green-600' />
          <span>{formatTime(startTime)}</span>
        </div>
      );
    },
    meta: {
      label: 'وقت البداية الدوام',
      icon: Play
    }
  },
  {
    id: 'endTime',
    accessorKey: 'endTime',
    header: ({ column }: { column: Column<ShiftResponse, unknown> }) => (
      <DataTableColumnHeader column={column} title='وقت النهاية الدوام' />
    ),
    cell: ({ cell }) => {
      const endTime = cell.getValue<string>();
      return (
        <div className='flex items-center gap-1'>
          <Square className='h-4 w-4 text-red-600' />
          <span>{formatTime(endTime)}</span>
        </div>
      );
    },
    meta: {
      label: 'وقت النهاية الدوام',
      icon: Square
    }
  },
  {
    id: 'description',
    accessorKey: 'description',
    header: ({ column }: { column: Column<ShiftResponse, unknown> }) => (
      <DataTableColumnHeader column={column} title='الوصف' />
    ),
    cell: ({ cell }) => {
      const description = cell.getValue<string>();
      return <div>{description || '-'}</div>;
    },
    meta: {
      label: 'الوصف',
      icon: FileText
    }
  },
  {
    id: 'gracePeriodMinutes',
    accessorKey: 'gracePeriodMinutes',
    header: ({ column }: { column: Column<ShiftResponse, unknown> }) => (
      <DataTableColumnHeader column={column} title='فترة السماح' />
    ),
    cell: ({ cell }) => {
      const gracePeriod = cell.getValue<number>();
      return gracePeriod ? (
        <Badge variant='secondary'>{gracePeriod} دقيقة</Badge>
      ) : (
        <div>-</div>
      );
    },
    meta: {
      label: 'فترة السماح',
      icon: Clock
    }
  },
  {
    id: 'maxLateMinutes',
    accessorKey: 'maxLateMinutes',
    header: ({ column }: { column: Column<ShiftResponse, unknown> }) => (
      <DataTableColumnHeader column={column} title='أقصى تأخير' />
    ),
    cell: ({ cell }) => {
      const maxLate = cell.getValue<number>();
      return maxLate ? (
        <Badge variant='secondary'>{maxLate} دقيقة</Badge>
      ) : (
        <div>-</div>
      );
    },
    meta: {
      label: 'أقصى تأخير',
      icon: Clock
    }
  },
  {
    id: 'allowEarlyCheckIn',
    accessorKey: 'allowEarlyCheckIn',
    header: ({ column }: { column: Column<ShiftResponse, unknown> }) => (
      <DataTableColumnHeader column={column} title='التسجيل المبكر' />
    ),
    cell: ({ cell }) => {
      const allowEarly = cell.getValue<boolean>();
      return allowEarly ? (
        <div className='flex items-center gap-1'>
          <CheckCircle className='h-4 w-4 text-green-600' />
          <span>مسموح</span>
        </div>
      ) : (
        <div className='flex items-center gap-1'>
          <XCircle className='h-4 w-4 text-red-600' />
          <span>غير مسموح</span>
        </div>
      );
    },
    meta: {
      label: 'التسجيل المبكر',
      icon: CheckCircle
    }
  },
  {
    id: 'allowLateCheckOut',
    accessorKey: 'allowLateCheckOut',
    header: ({ column }: { column: Column<ShiftResponse, unknown> }) => (
      <DataTableColumnHeader column={column} title='التسجيل المتأخر' />
    ),
    cell: ({ cell }) => {
      const allowLate = cell.getValue<boolean>();
      return allowLate ? (
        <div className='flex items-center gap-1'>
          <CheckCircle className='h-4 w-4 text-green-600' />
          <span>مسموح</span>
        </div>
      ) : (
        <div className='flex items-center gap-1'>
          <XCircle className='h-4 w-4 text-red-600' />
          <span>غير مسموح</span>
        </div>
      );
    },
    meta: {
      label: 'التسجيل المتأخر',
      icon: CheckCircle
    }
  },
  {
    id: 'isActive',
    accessorKey: 'isActive',
    header: ({ column }: { column: Column<ShiftResponse, unknown> }) => (
      <DataTableColumnHeader column={column} title='الحالة' />
    ),
    cell: ({ cell }) => {
      const isActive = cell.getValue<boolean>();
      return (
        <Badge variant={isActive ? 'default' : 'secondary'}>
          {getActiveStatusText(isActive)}
        </Badge>
      );
    },
    meta: {
      label: 'الحالة',
      icon: Calendar
    }
  },
  {
    id: 'createdAt',
    accessorKey: 'createdAt',
    header: ({ column }: { column: Column<ShiftResponse, unknown> }) => (
      <DataTableColumnHeader column={column} title='تاريخ الإنشاء' />
    ),
    cell: ({ cell }) => {
      const createdAt = cell.getValue<string>();
      return (
        <div className='flex items-center gap-1'>
          <Calendar className='h-4 w-4 text-blue-600' />
          <span>{formatDate(createdAt)}</span>
        </div>
      );
    },
    meta: {
      label: 'تاريخ الإنشاء',
      icon: Calendar
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => (
      <CellAction data={row.original as unknown as ShiftData} />
    )
  }
];
