'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Copy, Edit, MoreHorizontal, Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { DeviceData } from '../../types/devices';
import { devicesService } from '../../api/devices.service';
import { AlertModal } from '@/components/modal/alert-modal';
import { useAuthApi } from '@/hooks/use-auth-api';

interface CellActionProps {
  data: DeviceData;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const { authApiCall } = useAuthApi();

  const onCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.success('تم نسخ معرف الجهاز!');
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      const success = await authApiCall(async () =>
        devicesService.deleteDevice(data.id)
      );

      if (success) {
        toast.success('تم حذف الجهاز بنجاح!');
        router.refresh();
      } else {
        toast.error('لم يتم حذف الجهاز!');
      }
    } catch (error) {
      toast.error('حدث خطأ أثناء حذف الجهاز!');
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
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => onCopy(data.id)}>
            <Copy className='mr-2 h-4 w-4' />
            نسخ المعرف
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => router.push(`/system/devices/${data.id}`)}
          >
            <Edit className='mr-2 h-4 w-4' />
            تعديل
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <Trash className='mr-2 h-4 w-4' />
            حذف
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
