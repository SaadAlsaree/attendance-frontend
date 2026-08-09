'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  MoreHorizontal,
  Eye,
  Edit,
  Search,
  CalendarClock,
  CalendarPlus
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { formatDate } from '../../utils/employees';
import Link from 'next/link';
import { EmployeeData } from '../../types/employees';
import { useCurrentUser } from '@/hooks/use-current-user';
import { canWrite, hasAnyRole } from '@/utils/auth/auth-utils';
import { Role } from '@/features/system/users-permissions/types/users-permissions';

// Roles allowed to assign a fixed weekly pattern (matches the assign-shifts page guard).
// 12 = OrgSupervisor (feature 17) — a numeric literal so this branch, which predates that
// enum member, still compiles; it lights up automatically once feature 17 merges.
const ASSIGN_FIXED_SHIFT_ROLES = [Role.Admin, Role.SuperAdmin, 12];

// Row actions as a component so it can read the current user (hooks). View-only
// roles (e.g. security officers) see "عرض" only — never "تعديل".
function EmployeeRowActions({ employee }: { employee: EmployeeData }) {
  const { user } = useCurrentUser();
  const showEdit = canWrite(user);
  const canAssignShift = hasAnyRole(user, ASSIGN_FIXED_SHIFT_ROLES);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='h-8 w-8 p-0'>
          <span className='sr-only'>فتح القائمة</span>
          <MoreHorizontal className='h-4 w-4' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuLabel>الإجراءات</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={`/employee/${employee.id}`}>
            <Eye className='ml-2 h-4 w-4' />
            عرض
          </Link>
        </DropdownMenuItem>
        {showEdit && (
          <DropdownMenuItem asChild>
            <Link href={`/employee/addedit-employees/${employee.id}/edit`}>
              <Edit className='ml-2 h-4 w-4' />
              تعديل
            </Link>
          </DropdownMenuItem>
        )}
        {canAssignShift && (
          <DropdownMenuItem asChild>
            <Link
              href={`/schedule/assign-shifts?searchTerm=${encodeURIComponent(employee.empId)}`}
            >
              <CalendarPlus className='ml-2 h-4 w-4' />
              {employee.hasFixedShift ? 'تعديل الدوام الثابت' : 'تثبيت الدوام'}
            </Link>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export const columns: ColumnDef<EmployeeData, unknown>[] = [
  {
    id: 'searchTerm',
    accessorKey: 'fullName',
    header: 'الموظف',
    enableHiding: false,
    size: 300,
    minSize: 200,
    maxSize: 400,
    cell: ({ row }) => {
      const employee = row.original;
      return (
        <Link href={`/employee/${employee.id}`}>
          <div className='flex items-center gap-3'>
            <Avatar className='h-16 w-16'>
              <AvatarImage
                src={`/api/employees/${employee.id}/avatar`}
                alt={employee.fullName}
              />
              <AvatarFallback>
                {employee.fullName.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className='font-medium'>{employee.fullName}</div>
              <div className='text-muted-foreground text-sm'>
                {employee.empId} - {employee.organizationalUnitName}
              </div>
            </div>
          </div>
        </Link>
      );
    },
    meta: {
      label: 'الموظف',
      placeholder: 'ابحث عن الموظف أو الرقم الوظيفي...',
      variant: 'text',
      icon: Search
    },
    enableColumnFilter: true
  },
  {
    accessorKey: 'empId',
    header: 'المعرف من الجهاز',
    enableHiding: true,
    size: 120,
    minSize: 80,
    maxSize: 150,
    cell: ({ row }) => (
      <div className='font-mono text-sm'>{row.getValue('empId')}</div>
    )
  },
  {
    accessorKey: 'rfid',
    header: 'RFID',
    enableHiding: true,
    size: 150,
    minSize: 100,
    maxSize: 200,
    cell: ({ row }) => (
      <div className='font-mono text-sm'>{row.getValue('rfid')}</div>
    )
  },
 
  {
    accessorKey: 'organizationalUnitName',
    header: 'الجهة',
    enableHiding: true,
    size: 200,
    minSize: 150,
    maxSize: 250,
    cell: ({ row }) => {
      const unitName = row.original.organizationalUnitName || row.getValue('organizationalUnitName') || '-';
      return (
        <div className='text-sm'>{unitName}</div>
      );
    }
  },
 
  {
    accessorKey: 'isManager',
    header: 'الدور',
    enableHiding: true,
    size: 100,
    minSize: 80,
    maxSize: 120,
    cell: ({ row }) => {
      const isManager = row.getValue('isManager') as boolean;
      return (
        <Badge variant={isManager ? 'default' : 'secondary'}>
          {isManager ? 'مدير' : 'موظف'}
        </Badge>
      );
    }
  },
  {
    // Fixed weekly shift pattern (تثبيت الدوام). The column `id` is the URL filter
    // param name, so `meta.options` renders a faceted filter driving `?hasFixedShift=`.
    id: 'hasFixedShift',
    accessorKey: 'hasFixedShift',
    header: 'الدوام الثابت',
    enableHiding: true,
    size: 120,
    minSize: 90,
    maxSize: 150,
    cell: ({ row }) => {
      const hasFixedShift = row.original.hasFixedShift;
      return (
        <Badge variant={hasFixedShift ? 'default' : 'secondary'}>
          {hasFixedShift ? 'مثبت' : 'غير مثبت'}
        </Badge>
      );
    },
    meta: {
      label: 'الدوام الثابت',
      variant: 'select',
      icon: CalendarClock,
      options: [
        { label: 'مثبت', value: 'true' },
        { label: 'غير مثبت', value: 'false' }
      ]
    },
    enableColumnFilter: true
  },
  {
    accessorKey: 'createdAt',
    header: 'تاريخ الإنشاء',
    enableHiding: true,
    size: 140,
    minSize: 100,
    maxSize: 180,
    cell: ({ row }) => (
      <div className='text-sm'>{formatDate(row.getValue('createdAt'))}</div>
    )
  },
  {
    id: 'actions',
    header: 'الإجراءات',
    enableHiding: false,
    size: 80,
    minSize: 60,
    maxSize: 100,
    cell: ({ row }) => <EmployeeRowActions employee={row.original} />
  }
];
