'use client';

import { useState } from 'react';
import { Copy, MoreHorizontal, Trash, Eye, Edit } from 'lucide-react';
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
import { IOrganizationalUnitList } from '../../types/organizationsunits';
import { organizationsUnitsService } from '../../api/organizationsunits.service';
import { useAuthApi } from '@/hooks/use-auth-api';
import { AlertModal } from '@/components/modal/alert-modal';

interface CellActionProps {
  data: IOrganizationalUnitList;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const { authApiCall } = useAuthApi();

  const onCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.success('تم نسخ المعرف بنجاح');
  };

  const onDelete = async () => {
    try {
      setLoading(true);

      const response = await authApiCall(() =>
        organizationsUnitsService.deleteOrganizationalUnit(data.id)
      );

      if (response) {
        toast.success('تم حذف الوحدة التنظيمية بنجاح');
        router.refresh();
      } else {
        toast.error('فشل في حذف الوحدة التنظيمية');
      }
    } catch (error) {
      toast.error('حدث خطأ أثناء الحذف');
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
          <DropdownMenuItem onClick={() => onCopy(data.id)}>
            <Copy className='mr-2 h-4 w-4' />
            نسخ المعرف
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() =>
              router.push(`/system/organizationsunits/${data.id}`)
            }
          >
            <Eye className='mr-2 h-4 w-4' />
            عرض التفاصيل
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() =>
              router.push(`/system/organizationsunits/${data.id}/edit`)
            }
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
