'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Eye, Edit, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

// Define the schedule data structure
export interface EmployeeScheduleData {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeNumber: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const columns: ColumnDef<EmployeeScheduleData>[] = [
  {
    accessorKey: 'employee',
    header: 'الموظف',
    cell: ({ row }) => {
      const schedule = row.original;
      return (
        <div>
          <div className='font-medium'>{schedule.employeeName}</div>
          <div className='text-muted-foreground text-sm'>
            {schedule.employeeNumber}
          </div>
        </div>
      );
    }
  },
  {
    accessorKey: 'dayOfWeek',
    header: 'اليوم',
    cell: ({ row }) => {
      const day = row.getValue('dayOfWeek') as string;
      const dayNames: Record<string, string> = {
        Monday: 'الاثنين',
        Tuesday: 'الثلاثاء',
        Wednesday: 'الأربعاء',
        Thursday: 'الخميس',
        Friday: 'الجمعة',
        Saturday: 'السبت',
        Sunday: 'الأحد'
      };
      return <div className='text-sm'>{dayNames[day] || day}</div>;
    }
  },
  {
    accessorKey: 'startTime',
    header: 'وقت البداية',
    cell: ({ row }) => (
      <div className='text-sm'>{row.getValue('startTime')}</div>
    )
  },
  {
    accessorKey: 'endTime',
    header: 'وقت النهاية',
    cell: ({ row }) => <div className='text-sm'>{row.getValue('endTime')}</div>
  },
  {
    accessorKey: 'isActive',
    header: 'الحالة',
    cell: ({ row }) => {
      const isActive = row.getValue('isActive') as boolean;
      return (
        <Badge variant={isActive ? 'default' : 'secondary'}>
          {isActive ? 'نشط' : 'غير نشط'}
        </Badge>
      );
    }
  },
  {
    id: 'actions',
    header: 'الإجراءات',
    cell: ({ row }) => {
      const schedule = row.original;

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
            <DropdownMenuItem
              onClick={() =>
                window.open(`/employee/schedule/view/${schedule.id}`, '_blank')
              }
            >
              <Eye className='ml-2 h-4 w-4' />
              عرض
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                window.open(`/employee/schedule/edit/${schedule.id}`, '_blank')
              }
            >
              <Edit className='ml-2 h-4 w-4' />
              تعديل
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className='text-destructive'>
              <Trash2 className='ml-2 h-4 w-4' />
              حذف
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }
  }
];
