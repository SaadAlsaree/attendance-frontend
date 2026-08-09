'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { MoreHorizontal, Eye, Edit, CheckCircle, LogOut } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { AlertModal } from '@/components/modals/alert-modal';
import { AttendanceResponse } from '../../types/attendance';
import { attendanceService } from '../../api/attendance.service';
import { useAuthApi } from '@/hooks/use-auth-api';
import AttendanceApproveDialog from '../attendnce-approve';
import { useEmployees } from '@/hooks/use-employees';
import { Separator } from '@/components/ui/separator';
import { useCurrentUser } from '@/hooks/use-current-user';
import { canWrite } from '@/utils/auth/auth-utils';

interface CellActionProps {
  data: AttendanceResponse;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [checkOutDialogOpen, setCheckOutDialogOpen] = useState(false);
  const { authApiCall } = useAuthApi();
  const { employees } = useEmployees();
  const { user } = useCurrentUser();
  // View-only roles (e.g. security officers) may only view attendance.
  const showWrite = canWrite(user);

  const onDelete = async () => {
    try {
      setLoading(true);
      const success = await authApiCall(async () =>
        attendanceService.deleteAttendanceClient(data.id)
      );

      if (success) {
        toast.success('تم حذف الحضور بنجاح');
        router.refresh();
      } else {
        toast.error('فشل في حذف الحضور');
      }
    } catch (error) {
      toast.error('حدث خطأ أثناء حذف الحضور');
      console.error(error);
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
              router.push(`/attendance/view-all-attendance/${data.id}`)
            }
          >
            <Eye className='mr-2 h-4 w-4' />
            عرض
          </DropdownMenuItem>
          {showWrite && (
            <DropdownMenuItem
              onClick={() =>
                router.push(`/attendance/view-all-attendance/${data.id}/edit`)
              }
            >
              <Edit className='mr-2 h-4 w-4' />
              تعديل
            </DropdownMenuItem>
          )}

          {showWrite && !data.approvedBy && (
            <DropdownMenuItem onClick={() => setApproveDialogOpen(true)}>
              <CheckCircle className='mr-2 h-4 w-4' />
              اعتماد
            </DropdownMenuItem>
          )}
          {showWrite && (
            <>
              <Separator />
              <DropdownMenuItem onClick={() => setCheckOutDialogOpen(true)}>
                <LogOut className='mr-2 h-4 w-4 text-red-500' />
                تسجيل الخروج
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Dialogs */}
      <AttendanceApproveDialog
        isOpen={approveDialogOpen}
        onClose={() => setApproveDialogOpen(false)}
        attendance={data}
        onSuccess={() => {
          router.refresh();
        }}
      />
    </>
  );
};
