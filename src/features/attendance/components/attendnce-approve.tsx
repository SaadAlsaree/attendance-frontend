'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { CheckCircle, X, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ApproveAttendanceRequest } from '../types/attendance';
import { approveAttendanceSchema } from '../utils/validation';
import { attendanceService } from '../api/attendance.service';
import { useAuthApi } from '@/hooks/use-auth-api';
import { AttendanceResponse } from '../types/attendance';
import { formatDate, formatTime } from '../utils/attendance';

interface AttendanceApproveDialogProps {
  isOpen: boolean;
  onClose: () => void;
  attendance: AttendanceResponse;
  onSuccess?: () => void;
}

type ApproveFormData = {
  approvalNotes: string;
};

export default function AttendanceApproveDialog({
  isOpen,
  onClose,
  attendance,
  onSuccess
}: AttendanceApproveDialogProps) {
  const [loading, setLoading] = useState(false);
  const { authApiCall } = useAuthApi();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<ApproveFormData>({
    resolver: zodResolver(approveAttendanceSchema),
    defaultValues: {
      approvalNotes: ''
    }
  });

  const onSubmit = async (data: ApproveFormData) => {
    try {
      setLoading(true);

      const approveData: ApproveAttendanceRequest = {
        approvedBy: 'current-user-id', // This should be replaced with actual user ID
        approvalNotes: data.approvalNotes || undefined
      };

      const response = await authApiCall(async () =>
        attendanceService.approveAttendanceClient(attendance.id, approveData)
      );

      if (response) {
        toast.success('تم اعتماد الحضور بنجاح');
        reset();
        onSuccess?.();
        onClose();
      } else {
        toast.error('فشل في اعتماد الحضور');
      }
    } catch (error) {
      toast.error('حدث خطأ أثناء اعتماد الحضور');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      reset();
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className='sm:max-w-[500px]'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <CheckCircle className='h-5 w-5 text-green-600' />
            اعتماد الحضور
          </DialogTitle>
          <DialogDescription>تأكيد اعتماد سجل الحضور للموظف</DialogDescription>
        </DialogHeader>

        <div className='space-y-4'>
          {/* Attendance Summary */}
          <div className='bg-muted/50 rounded-lg border p-4'>
            <h4 className='mb-3 font-medium'>تفاصيل الحضور</h4>
            <div className='grid grid-cols-2 gap-3 text-sm'>
              <div>
                <span className='text-muted-foreground'>الموظف:</span>
                <p className='font-medium'>
                  {attendance.employeeName || 'غير محدد'}
                </p>
              </div>
              <div>
                <span className='text-muted-foreground'>التاريخ:</span>
                <p className='font-medium'>{formatDate(attendance.date)}</p>
              </div>
              <div>
                <span className='text-muted-foreground'>وقت الدخول:</span>
                <p className='font-medium'>
                  {attendance.checkInTime
                    ? formatTime(attendance.checkInTime)
                    : 'لم يسجل'}
                </p>
              </div>
              <div>
                <span className='text-muted-foreground'>وقت الخروج:</span>
                <p className='font-medium'>
                  {attendance.checkOutTime
                    ? formatTime(attendance.checkOutTime)
                    : 'لم يسجل'}
                </p>
              </div>
            </div>
            <Separator className='my-3' />
            <div className='flex items-center gap-2'>
              <span className='text-muted-foreground text-sm'>الحالة:</span>
              <Badge variant='outline'>
                {attendance.status === 1 ? 'حضور' : 'غير محدد'}
              </Badge>
            </div>
          </div>

          {/* Approval Form */}
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='approvalNotes'>ملاحظات الاعتماد (اختياري)</Label>
              <Textarea
                id='approvalNotes'
                placeholder='أضف ملاحظات حول الاعتماد...'
                className='min-h-[100px]'
                {...register('approvalNotes')}
              />
              {errors.approvalNotes && (
                <p className='text-destructive text-sm'>
                  {errors.approvalNotes.message}
                </p>
              )}
            </div>

            <DialogFooter className='gap-2'>
              <Button
                type='button'
                variant='outline'
                onClick={handleClose}
                disabled={loading}
              >
                <X className='mr-2 h-4 w-4' />
                إلغاء
              </Button>
              <Button
                type='submit'
                disabled={loading}
                className='bg-green-600 hover:bg-green-700'
              >
                {loading ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    جاري الاعتماد...
                  </>
                ) : (
                  <>
                    <CheckCircle className='mr-2 h-4 w-4' />
                    اعتماد الحضور
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
