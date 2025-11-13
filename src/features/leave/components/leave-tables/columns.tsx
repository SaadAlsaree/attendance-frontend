'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import { AllBadgeVariants } from '@/components/ui/badge-types';
import { Column, ColumnDef } from '@tanstack/react-table';
import { User, Calendar, FileText, Clock, Eye } from 'lucide-react';
import {
  LeaveItem,
  LeaveType,
  LeaveTypeDisplay
} from '@/features/leave/types/leaves';
import {
  getLeaveTypeDisplayName,
  getStatusDisplayName,
  formatDateForDisplay,
  calculateLeaveDays,
  LEAVE_STATUS
} from '@/features/leave/utils/leaves';
import moment from 'moment';
import { CellAction } from './cell-action';
import Link from 'next/link';

// Helper function to determine leave type badge variant
const getLeaveTypeVariant = (leaveType: LeaveType): AllBadgeVariants => {
  switch (leaveType) {
    case LeaveType.Ordinary:
      return 'blue';
    case LeaveType.Sick:
      return 'red';
    case LeaveType.Emergency:
      return 'orange';
    case LeaveType.Maternity:
      return 'blue';
    case LeaveType.TimeOff:
      return 'blue';
    case LeaveType.Hajj:
    case LeaveType.Umrah:
      return 'green';
    case LeaveType.Study:
      return 'yellow';
    case LeaveType.Unpaid:
      return 'gray';
    case LeaveType.Compensatory:
      return 'blue';
    default:
      return 'gray';
  }
};

// Helper function to determine status badge variant
const getStatusVariant = (status: number): AllBadgeVariants => {
  switch (status) {
    case LEAVE_STATUS.PENDING:
      return 'yellow';
    case LEAVE_STATUS.APPROVED:
      return 'green';
    case LEAVE_STATUS.REJECTED:
      return 'red';
    case LEAVE_STATUS.CANCELLED:
      return 'gray';
    default:
      return 'gray';
  }
};

export const columns: ColumnDef<LeaveItem>[] = [
  {
    id: 'fullName',
    size: 200,
    accessorKey: 'fullName',
    header: ({ column }: { column: Column<LeaveItem, unknown> }) => (
      <DataTableColumnHeader column={column} title='الموظف' />
    ),
    cell: ({ row }) => {
      return (
        <Link
          href={`/leave/${row.original.id}`}
          className='hover:text-primary transition-colors duration-200'
        >
          <div className='flex items-center gap-2'>
            <User className='h-4 w-4 text-blue-600' />
            <div>
              <div className='font-medium'>
                {row.original.fullName || 'غير محدد'}
              </div>
              <div className='text-muted-foreground text-sm'>
                {row.original.code || '-'}
              </div>
            </div>
          </div>
        </Link>
      );
    },
    meta: {
      label: 'الموظف',
      placeholder: 'ابحث عن الموظف...',
      variant: 'text',
      icon: User
    },
    enableColumnFilter: true
  },
  {
    id: 'leaveType',
    accessorKey: 'leaveType',
    header: ({ column }: { column: Column<LeaveItem, unknown> }) => (
      <DataTableColumnHeader column={column} title='نوع الإجازة' />
    ),
    cell: ({ cell }) => {
      const leaveType = cell.getValue<LeaveType>();
      const leaveTypeName = getLeaveTypeDisplayName(leaveType);

      return (
        <Badge variant={getLeaveTypeVariant(leaveType)}>{leaveTypeName}</Badge>
      );
    },
    meta: {
      label: 'نوع الإجازة',
      placeholder: 'اختر نوع الإجازة...',
      variant: 'select',
      icon: FileText,
      options: Object.entries(LeaveTypeDisplay).map(([value, label]) => ({
        label,
        value
      }))
    },
    enableColumnFilter: true
  },
  {
    id: 'startDate',
    accessorKey: 'startDate',
    header: ({ column }: { column: Column<LeaveItem, unknown> }) => (
      <DataTableColumnHeader column={column} title='تاريخ البداية' />
    ),
    cell: ({ cell }) => {
      const startDate = cell.getValue<string>();
      return (
        <div className='flex items-center gap-1'>
          <Calendar className='h-4 w-4 text-green-600' />
          <span>{moment(startDate).format('DD/MM/YYYY')}</span>
        </div>
      );
    },
    meta: {
      label: 'تاريخ البداية',
      placeholder: 'اختر تاريخ البداية...',
      variant: 'dateRange',
      icon: Calendar
    }
  },
  {
    id: 'endDate',
    accessorKey: 'endDate',
    header: ({ column }: { column: Column<LeaveItem, unknown> }) => (
      <DataTableColumnHeader column={column} title='تاريخ النهاية' />
    ),
    cell: ({ cell }) => {
      const endDate = cell.getValue<string>();
      return (
        <div className='flex items-center gap-1'>
          <Calendar className='h-4 w-4 text-red-600' />
          <span>{moment(endDate).format('DD/MM/YYYY')}</span>
        </div>
      );
    },
    meta: {
      label: 'تاريخ النهاية',
      placeholder: 'اختر تاريخ النهاية...',
      variant: 'dateRange',
      icon: Calendar
    }
  },
  {
    id: 'duration',
    accessorFn: (row) => calculateLeaveDays(row.startDate, row.endDate),
    header: ({ column }: { column: Column<LeaveItem, unknown> }) => (
      <DataTableColumnHeader column={column} title='المدة' />
    ),
    cell: ({ cell }) => {
      const duration = cell.getValue<ReturnType<typeof calculateLeaveDays>>();
      return (
        <div className='flex items-center gap-1'>
          <Clock className='h-4 w-4 text-purple-600' />
          <span className='font-medium'>
            {duration.value} {duration.type === 'hours' ? 'ساعة' : 'يوم'}
          </span>
        </div>
      );
    },
    meta: {
      label: 'المدة',
      icon: Clock
    }
  },
  {
    id: 'status',
    accessorKey: 'status',
    header: ({ column }: { column: Column<LeaveItem, unknown> }) => (
      <DataTableColumnHeader column={column} title='الحالة' />
    ),
    cell: ({ cell }) => {
      const status = cell.getValue<number>();
      const statusName = getStatusDisplayName(status);

      return <Badge variant={getStatusVariant(status)}>{statusName}</Badge>;
    },
    meta: {
      label: 'الحالة',
      placeholder: 'اختر الحالة...',
      variant: 'select',
      icon: FileText,
      options: [
        { label: 'قيد الانتظار', value: LEAVE_STATUS.PENDING.toString() },
        { label: 'تمت الموافقة', value: LEAVE_STATUS.APPROVED.toString() },
        { label: 'مرفوض', value: LEAVE_STATUS.REJECTED.toString() },
        { label: 'ملغي', value: LEAVE_STATUS.CANCELLED.toString() }
      ]
    },
    enableColumnFilter: true
  },
  {
    id: 'reason',
    accessorKey: 'reason',
    header: ({ column }: { column: Column<LeaveItem, unknown> }) => (
      <DataTableColumnHeader column={column} title='السبب' />
    ),
    cell: ({ cell }) => {
      const reason = cell.getValue<string>();
      return (
        <div className='max-w-[200px] truncate' title={reason}>
          {reason}
        </div>
      );
    },
    meta: {
      label: 'السبب',
      placeholder: 'ابحث في السبب...',
      variant: 'text',
      icon: FileText
    },
    enableColumnFilter: true
  },
  {
    id: 'approvedBy',
    accessorKey: 'approverName',
    header: ({ column }: { column: Column<LeaveItem, unknown> }) => (
      <DataTableColumnHeader column={column} title='تمت الموافقة من' />
    ),
    cell: ({ cell }) => {
      const approverName = cell.getValue<string | null>();
      return (
        <div className='text-muted-foreground text-sm'>
          {approverName || '-'}
        </div>
      );
    },
    meta: {
      label: 'تمت الموافقة من',
      icon: User
    }
  },
  {
    id: 'approvedAt',
    accessorKey: 'approvedAt',
    header: ({ column }: { column: Column<LeaveItem, unknown> }) => (
      <DataTableColumnHeader column={column} title='تاريخ الموافقة' />
    ),
    cell: ({ cell }) => {
      const approvedAt = cell.getValue<string | null>();
      if (!approvedAt) return <span className='text-muted-foreground'>-</span>;

      return (
        <div className='flex items-center gap-1'>
          <Calendar className='h-4 w-4 text-blue-600' />
          <span>{formatDateForDisplay(approvedAt)}</span>
        </div>
      );
    },
    meta: {
      label: 'تاريخ الموافقة',
      icon: Calendar
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />,
    meta: {
      label: 'الإجراءات',
      icon: Eye
    }
  }
];
