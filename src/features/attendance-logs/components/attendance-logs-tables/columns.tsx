'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import { AllBadgeVariants } from '@/components/ui/badge-types';
import { Column, ColumnDef } from '@tanstack/react-table';
import {
  User,
  Clock,
  Calendar,
  FileText,
  CreditCard,
  Building2,
  Hash
} from 'lucide-react';
import {
  AttendanceLogResponse,
  Direct,
  directName
} from '@/features/attendance-logs/types/attendance-logs';
import moment from 'moment';
import { CellAction } from './cell-action';
import Link from 'next/link';
import { getDayName } from '@/utils/date.utils';

// Helper function to determine direct badge variant
const getDirectVariant = (direct: Direct): AllBadgeVariants => {
  switch (direct) {
    case Direct.IN:
      return 'green';
    case Direct.OUT:
      return 'red';
    default:
      return 'gray';
  }
};

// Helper function to get day name in Arabic

export const columns: ColumnDef<AttendanceLogResponse>[] = [
  {
    id: 'searchTerm',
    accessorKey: 'employee.fullName',
    header: ({
      column
    }: {
      column: Column<AttendanceLogResponse, unknown>;
    }) => <DataTableColumnHeader column={column} title='الموظف' />,
    cell: ({ row }) => {
      const employee = row.original.employee;
      const empName = employee?.fullName || row.original.empName || 'غير محدد';
      const empCode = employee?.code || row.original.empID || '-';

      return (
        <Link
          href={`/attendance/attendance-logs/${row.original.id}`}
          className='hover:text-primary transition-colors duration-200'
        >
          <div className='flex items-center gap-2'>
            <User className='h-4 w-4 text-blue-600' />
            <div>
              <div className='font-medium'>{empName}</div>
              <div className='text-muted-foreground text-sm'>{empCode}</div>
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
    id: 'organizationalUnit',
    accessorKey: 'employee.organizationalUnitName',
    header: ({
      column
    }: {
      column: Column<AttendanceLogResponse, unknown>;
    }) => <DataTableColumnHeader column={column} title='الوحدة التنظيمية' />,
    cell: ({ row }) => {
      const employee = row.original.employee;
      return (
        <div className='flex items-center gap-2'>
          <Building2 className='h-4 w-4 text-purple-600' />
          <div>
            <div className='font-medium'>
              {employee?.organizationalUnitName || '-'}
            </div>
            <div className='text-muted-foreground text-sm'>
              {employee?.organizationalUnitCode || '-'}
            </div>
          </div>
        </div>
      );
    },
    meta: {
      label: 'الوحدة التنظيمية',
      icon: Building2
    }
  },
  {
    id: 'dayName',
    accessorKey: 'dateWork',
    header: ({
      column
    }: {
      column: Column<AttendanceLogResponse, unknown>;
    }) => <DataTableColumnHeader column={column} title='اليوم' />,
    cell: ({ cell }) => {
      const dateWork = cell.getValue<string>();
      return (
        <div className='flex items-center gap-1'>
          <Calendar className='h-4 w-4 text-purple-600' />
          <span className='text-sm font-medium'>{getDayName(dateWork)}</span>
        </div>
      );
    },
    meta: {
      label: 'اليوم',
      icon: Calendar
    }
  },
  {
    id: 'dateWork',
    accessorKey: 'dateWork',
    header: ({
      column
    }: {
      column: Column<AttendanceLogResponse, unknown>;
    }) => <DataTableColumnHeader column={column} title='تاريخ العمل' />,
    cell: ({ cell }) => {
      const dateWork = cell.getValue<string>();
      return (
        <div className='flex items-center gap-1'>
          <Calendar className='h-4 w-4 text-green-600' />
          <span>{moment(dateWork).format('YYYY-MM-DD')}</span>
        </div>
      );
    },
    meta: {
      label: 'تاريخ العمل',
      placeholder: 'اختر التاريخ...',
      variant: 'dateRange',
      icon: Calendar
    }
  },
  {
    id: 'timeAttend',
    accessorKey: 'timeAttend',
    header: ({
      column
    }: {
      column: Column<AttendanceLogResponse, unknown>;
    }) => <DataTableColumnHeader column={column} title='وقت الدخول/الخروج' />,
    cell: ({ cell }) => {
      const timeAttend = cell.getValue<string>();
      return (
        <div className='flex items-center gap-1'>
          <Clock className='h-4 w-4 text-blue-600' />
          <span className='font-mono'>
            {moment(timeAttend, 'HH:mm:ss').format('hh:mm:ss A')}
          </span>
        </div>
      );
    },
    meta: {
      label: 'وقت الدخول/الخروج',
      icon: Clock
    }
  },
  {
    id: 'dateTimeAttend',
    accessorKey: 'dateTimeAttend',
    header: ({
      column
    }: {
      column: Column<AttendanceLogResponse, unknown>;
    }) => (
      <DataTableColumnHeader column={column} title='تاريخ ووقت الدخول/الخروج' />
    ),
    cell: ({ cell }) => {
      const dateTimeAttend = cell.getValue<string>();
      return (
        <div className='flex items-center gap-1'>
          <Clock className='h-4 w-4 text-indigo-600' />
          <span className='font-mono text-sm'>
            {moment(dateTimeAttend).format('YYYY-MM-DD HH:mm:ss A')}
          </span>
        </div>
      );
    },
    meta: {
      label: 'تاريخ ووقت الدخول/الخروج',
      icon: Clock
    }
  },
  {
    id: 'direct',
    accessorKey: 'direct',
    header: ({
      column
    }: {
      column: Column<AttendanceLogResponse, unknown>;
    }) => <DataTableColumnHeader column={column} title='الحضور/الانصراف' />,
    cell: ({ cell }) => {
      const direct = cell.getValue<Direct>();
      const directLabel = directName[direct];

      return <Badge variant={getDirectVariant(direct)}>{directLabel}</Badge>;
    },
    meta: {
      label: 'الحضور/الانصراف',
      placeholder: 'اختر الحضور/الانصراف...',
      variant: 'select',
      icon: FileText,
      options: [
        { label: 'دخول', value: Direct.IN.toString() },
        { label: 'خروج', value: Direct.OUT.toString() }
      ]
    },
    enableColumnFilter: true,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id)?.toString());
    }
  },
  {
    id: 'cardNo',
    accessorKey: 'cardNo',
    header: ({
      column
    }: {
      column: Column<AttendanceLogResponse, unknown>;
    }) => <DataTableColumnHeader column={column} title='رقم البطاقة' />,
    cell: ({ cell }) => {
      const cardNo = cell.getValue<string>();
      return (
        <div className='flex items-center gap-1'>
          <CreditCard className='h-4 w-4 text-purple-600' />
          <span className='font-mono'>{cardNo}</span>
        </div>
      );
    },
    meta: {
      label: 'رقم البطاقة',
      placeholder: 'ابحث عن رقم البطاقة...',
      variant: 'text',
      icon: CreditCard
    },
    enableColumnFilter: true
  },
  {
    id: 'deviceName',
    accessorKey: 'deviceName',
    header: ({
      column
    }: {
      column: Column<AttendanceLogResponse, unknown>;
    }) => <DataTableColumnHeader column={column} title='اسم الجهاز' />,
    cell: ({ cell }) => {
      const deviceName = cell.getValue<string>();
      return (
        <div className='flex items-center gap-1'>
          <Hash className='h-4 w-4 text-gray-600' />
          <span className='text-sm'>{deviceName}</span>
        </div>
      );
    },
    meta: {
      label: 'اسم الجهاز',
      icon: Hash
    }
  },
  {
    id: 'deviceNo',
    accessorKey: 'deviceNo',
    header: ({
      column
    }: {
      column: Column<AttendanceLogResponse, unknown>;
    }) => <DataTableColumnHeader column={column} title='رقم الجهاز' />,
    cell: ({ cell }) => {
      const deviceNo = cell.getValue<string>();
      return (
        <div className='flex items-center gap-1'>
          <Hash className='h-4 w-4 text-gray-600' />
          <span className='font-mono text-sm'>{deviceNo}</span>
        </div>
      );
    },
    meta: {
      label: 'رقم الجهاز',
      icon: Hash
    }
  },
  {
    id: 'actions',
    header: ({
      column
    }: {
      column: Column<AttendanceLogResponse, unknown>;
    }) => <DataTableColumnHeader column={column} title='العمليات' />,
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
