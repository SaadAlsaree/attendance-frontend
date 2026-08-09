'use client';

import { useState } from 'react';
import { Copy, MoreHorizontal, Eye } from 'lucide-react';
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
import { LeaveItem } from '@/features/leave/types/leaves';
import { LeavesService } from '@/features/leave/api/approvereject-leaves.service';
import { useAuthApi } from '@/hooks/use-auth-api';
import { AlertModal } from '@/components/modal/alert-modal';
import { useCurrentUser } from '@/hooks/use-current-user';
import { canWrite } from '@/utils/auth/auth-utils';

interface CellActionProps {
  data: LeaveItem;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const { authApiCall } = useAuthApi();
  const { user } = useCurrentUser();
  // View-only roles (e.g. security officers) may only view details.
  const showEdit = canWrite(user);

  const onCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.success('ID copied to clipboard.');
  };

  const onDelete = async () => {
    try {
      setLoading(true);

      const response = await authApiCall(() =>
        LeavesService.deleteLeave?.(data.id)
      );

      if (response) {
        router.refresh();
        toast.success('Leave request deleted successfully');
      } else {
        toast.error('Failed to delete leave request');
      }
    } catch (error) {
      toast.error('Something went wrong.');
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  const onApprove = async () => {
    try {
      setLoading(true);

      const response = await authApiCall(() =>
        LeavesService.approveLeave?.(data.id, {
          approvedBy: 'current-user-id', // This should come from auth context
          approvedAt: new Date().toISOString(),
          approvalNotes: 'Approved by admin'
        })
      );

      if (response) {
        router.refresh();
        toast.success('Leave request approved successfully');
      } else {
        toast.error('Failed to approve leave request');
      }
    } catch (error) {
      toast.error('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const onReject = async () => {
    try {
      setLoading(true);

      const response = await authApiCall(() =>
        LeavesService.rejectLeave?.(data.id, {
          rejectedBy: 'current-user-id', // This should come from auth context
          rejectedAt: new Date().toISOString(),
          rejectionReason: 'Leave request rejected',
          rejectionNotes: 'Rejected by admin'
        })
      );

      if (response) {
        router.refresh();
        toast.success('Leave request rejected successfully');
      } else {
        toast.error('Failed to reject leave request');
      }
    } catch (error) {
      toast.error('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const onCancel = async () => {
    try {
      setLoading(true);

      const response = await authApiCall(() =>
        LeavesService.cancelLeave?.(data.id, {
          cancelledBy: 'current-user-id', // This should come from auth context
          cancelledAt: new Date().toISOString(),
          cancellationReason: 'Leave request cancelled',
          cancellationNotes: 'Cancelled by admin'
        })
      );

      if (response) {
        router.refresh();
        toast.success('Leave request cancelled successfully');
      } else {
        toast.error('Failed to cancel leave request');
      }
    } catch (error) {
      toast.error('Something went wrong.');
    } finally {
      setLoading(false);
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

          <DropdownMenuItem onClick={() => router.push(`/leave/${data.id}`)}>
            <Eye className='mr-2 h-4 w-4' />
            عرض التفاصيل
          </DropdownMenuItem>

          {showEdit && (
            <DropdownMenuItem
              onClick={() => router.push(`/leave/${data.id}/edit`)}
            >
              <Copy className='mr-2 h-4 w-4' />
              تعديل
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
