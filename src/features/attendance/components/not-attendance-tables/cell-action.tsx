'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { MoreHorizontal, Copy, Plus } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { NotAttendanceData } from '../../types/attendance';

interface CellActionProps {
  data: NotAttendanceData;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const router = useRouter();

  const onCopy = (name: string) => {
    navigator.clipboard.writeText(name);
    toast.success('اسم الموظف نسخ بنجاح.');
  };
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
        <DropdownMenuItem onClick={() => onCopy(data.fullName)}>
          <Copy className='mr-2 h-4 w-4' />
          نسخ الاسم الكامل
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            onCopy(data.fullName);
            router.push(`/leave/new`);
          }}
        >
          <Plus className='mr-2 h-4 w-4' />
          إضافة موقف
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
