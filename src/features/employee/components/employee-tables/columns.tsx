'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Eye, Edit, Search } from 'lucide-react';
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
    cell: ({ row }) => {
      const employee = row.original;

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
            <DropdownMenuItem asChild>
              <Link href={`/employee/addedit-employees/${employee.id}/edit`}>
                <Edit className='ml-2 h-4 w-4' />
                تعديل
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }
  }
];
