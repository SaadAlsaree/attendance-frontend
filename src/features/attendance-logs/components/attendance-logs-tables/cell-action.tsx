'use client';

import { useState } from 'react';
import { MoreHorizontal, Eye } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

import { toast } from 'sonner';
import { AttendanceLogResponse } from '@/features/attendance-logs/types/attendance-logs';
import { attendanceLogService } from '@/features/attendance-logs/api/attendance-logs.service';
import { useAuthApi } from '@/hooks/use-auth-api';
import { AlertModal } from '@/components/modal/alert-modal';

interface CellActionProps {
  data: AttendanceLogResponse;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const { authApiCall } = useAuthApi();

  const onDelete = async () => {
    try {
      setLoading(true);

      // Use empID as identifier, or create a composite key if needed
      const identifier = data.empID || data.cardNo;
      const response = await authApiCall(() =>
        attendanceLogService.deleteAttendanceLog(identifier)
      );

      if (response) {
        router.refresh();
        toast.success('Attendance log deleted successfully');
      } else {
        toast.error('Failed to delete attendance log');
      }
    } catch (error) {
      toast.error('Something went wrong.');
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' className='h-8 w-8 p-0'>
            <span className='sr-only'>فتح القائمة</span>
            <MoreHorizontal className='h-4 w-4' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          <DropdownMenuLabel>الإجراءات</DropdownMenuLabel>

          <DropdownMenuItem
            onClick={() =>
              router.push(`/attendance/attendance-logs/${data.id}`)
            }
          >
            <Eye className='mr-2 h-4 w-4' />
            عرض التفاصيل
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
