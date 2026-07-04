'use client';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import {
  NotAttendanceData,
  AttendanceStatus,
  AttendanceStatusNames
} from '../../types/attendance';
import { CellAction } from './cell-action';
import { formatTime, formatWorkingTime } from '../../utils/attendance';
import moment from 'moment';
import { LogIn, LogOut, User, Hash, FilterIcon, Calendar } from 'lucide-react';
import Link from 'next/link';

export const columns: ColumnDef<NotAttendanceData>[] = [
  {
    id: 'searchTerm',
    accessorKey: 'fullName',
    size: 200,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='الموظف' />
    ),
    cell: ({ row }) => {
      const fullName = row.original.fullName;
      const code = row.original.code;

      const displayCode = code || '-';

      return (
        <Link
          href={`/employee/${row.original.employeeId}`}
          className='hover:text-primary transition-colors duration-200'
        >
          <div className='flex items-center gap-2'>
            <User className='h-4 w-4 text-blue-600' />
            <div>
              <div className=' font-medium'>{fullName}</div>
              <div className='text-muted-foreground flex items-center gap-1 text-sm'>
                <Hash className='h-3 w-3' />
                {displayCode}
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
    id: 'date',
    accessorKey: 'date',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='التاريخ' />
    ),
    cell: ({ row }) => (
      <div className=''>
        {moment(row.getValue('date')).format('YYYY-MM-DD')}
      </div>
    ),
    meta: {
      label: 'التاريخ',
      placeholder: 'اختر التاريخ...',
      variant: 'date',
      icon: Calendar
    },
    enableColumnFilter: true
  },
  {
    accessorKey: 'checkInTime',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='وقت الحضور' />
    ),
    cell: ({ row }) => (
      <div className='flex items-center gap-1 '>
        <span className='flex items-center gap-1 rounded bg-green-50 px-2 py-0.5 text-green-700'>
          <LogIn size={16} className='mr-1' />
          {row.getValue('checkInTime')
            ? formatTime(row.getValue('checkInTime'))
            : '-'}
        </span>
      </div>
    )
  },
  {
    accessorKey: 'checkOutTime',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='وقت الانصراف' />
    ),
    cell: ({ row }) => (
      <div className='flex items-center gap-1 '>
        <span className='flex items-center gap-1 rounded bg-orange-50 px-2 py-0.5 text-orange-700'>
          <LogOut size={16} className='mr-1' />
          {row.getValue('checkOutTime')
            ? formatTime(row.getValue('checkOutTime'))
            : '-'}
        </span>
      </div>
    )
  },
  {
    id: 'status',
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='الحالة' />
    ),
    cell: ({ row }) => {
      const status = row.original.status as AttendanceStatus;
      const statusName = AttendanceStatusNames[status] || 'غير معروف';

      // تحديد لون البادج المناسب لكل حالة
      let badgeVariant: string = 'default';

      switch (status) {
        case AttendanceStatus.Present:
          badgeVariant = 'green';
          break;
        case AttendanceStatus.Absent:
          badgeVariant = 'red';
          break;
        case AttendanceStatus.Late:
          badgeVariant = 'yellow';
          break;
        case AttendanceStatus.Early_Out:
          badgeVariant = 'orange';
          break;
        case AttendanceStatus.Overtime:
          badgeVariant = 'purple';
          break;
        case AttendanceStatus.Break:
          badgeVariant = 'blue';
          break;
        case AttendanceStatus.Vacation:
          badgeVariant = 'indigo';
          break;
        case AttendanceStatus.Holiday:
          badgeVariant = 'teal';
          break;
        case AttendanceStatus.Shift_Change:
          badgeVariant = 'gray-outline';
          break;
        case AttendanceStatus.Shift_Swap:
          badgeVariant = 'blue-outline';
          break;
        case AttendanceStatus.Shift_Swap_Request:
          badgeVariant = 'yellow-outline';
          break;
        case AttendanceStatus.Completed:
          badgeVariant = 'green-outline';
          break;
        default:
          badgeVariant = 'gray';
      }

      return (
        <div className=''>
          <Badge variant={badgeVariant as any} size='lg'>
            {statusName}
          </Badge>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
    meta: {
      label: 'الحالة',
      placeholder: 'اختر الحالة...',
      variant: 'select',
      icon: FilterIcon,
      options: [
        {
          value: String(AttendanceStatus.Present),
          label: AttendanceStatusNames[AttendanceStatus.Present]
        },
        {
          value: String(AttendanceStatus.Absent),
          label: AttendanceStatusNames[AttendanceStatus.Absent]
        },
        {
          value: String(AttendanceStatus.Break),
          label: AttendanceStatusNames[AttendanceStatus.Break]
        },
        {
          value: String(AttendanceStatus.Vacation),
          label: AttendanceStatusNames[AttendanceStatus.Vacation]
        },
        {
          value: String(AttendanceStatus.Holiday),
          label: AttendanceStatusNames[AttendanceStatus.Holiday]
        },
        {
          value: String(AttendanceStatus.Late),
          label: AttendanceStatusNames[AttendanceStatus.Late]
        },
        {
          value: String(AttendanceStatus.Early_Out),
          label: AttendanceStatusNames[AttendanceStatus.Early_Out]
        },
        {
          value: String(AttendanceStatus.Overtime),
          label: AttendanceStatusNames[AttendanceStatus.Overtime]
        },
        {
          value: String(AttendanceStatus.Shift_Change),
          label: AttendanceStatusNames[AttendanceStatus.Shift_Change]
        },
        {
          value: String(AttendanceStatus.Shift_Swap),
          label: AttendanceStatusNames[AttendanceStatus.Shift_Swap]
        },
        {
          value: String(AttendanceStatus.Shift_Swap_Request),
          label: AttendanceStatusNames[AttendanceStatus.Shift_Swap_Request]
        },
        {
          value: String(AttendanceStatus.Completed),
          label: AttendanceStatusNames[AttendanceStatus.Completed]
        }
      ]
    },
    enableColumnFilter: true
  },
  {
    accessorKey: 'workingMinutes',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='مدة العمل' />
    ),
    cell: ({ row }) => {
      const minutes = row.getValue('workingMinutes') as number | null;
      return (
        <div className=''>
          {minutes != null ? formatWorkingTime(minutes) : '-'}
        </div>
      );
    }
  },
  {
    accessorKey: 'lateMinutes',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='دقائق التأخير' />
    ),
    cell: ({ row }) => {
      const minutes = row.getValue('lateMinutes') as number | null;
      return (
        <div className=''>
          {minutes ? (
            <Badge variant='destructive' size='sm'>
              {formatWorkingTime(minutes)}
            </Badge>
          ) : (
            '-'
          )}
        </div>
      );
    }
  },
  {
    accessorKey: 'shiftName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='المناوبة' />
    ),
    cell: ({ row }) => (
      <div className=''>{row.getValue('shiftName') || '-'}</div>
    )
  },
  {
    accessorKey: 'organizationalName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='الجهة' />
    ),
    cell: ({ row }) => (
      <div className=''>{row.getValue('organizationalName') || '-'}</div>
    )
  },
  {
    accessorKey: 'leaveTypeName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='الاجراء' />
    ),
    cell: ({ row }) => {
      const leaveTypeName = row.getValue('leaveTypeName') as string | null | undefined;
      const hasValue = leaveTypeName && leaveTypeName.trim() !== '';
      return (
        <div className=''>
          <Badge variant={hasValue ? 'default' : 'outline'} size='sm'>
            {hasValue ? leaveTypeName : 'لا يوجد'}
          </Badge>
        </div>
      );
    }
  },
  {
    accessorKey: 'excludedDates',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='التواريخ المستثناة' />
    ),
    cell: ({ row }) => {
      const excludedDates = row.getValue('excludedDates') as string | null | undefined;
      const hasValue = excludedDates && excludedDates.trim() !== '';
      return (
        <div className=''>
          <Badge variant={hasValue ? 'default' : 'outline'} size='sm'>
            {hasValue ? excludedDates : 'لا يوجد'}
          </Badge>
        </div>
      );
    }
  },
  {
    accessorKey: 'notes',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='ملاحظات' />
    ),
    cell: ({ row }) => (
      <div
        className='max-w-[200px] truncate '
        title={row.getValue('notes') as string}
      >
        {row.getValue('notes') || '-'}
      </div>
    )
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];

