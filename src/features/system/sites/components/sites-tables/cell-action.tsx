'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { AlertModal } from '@/components/modal/alert-modal';
import { MoreHorizontal, Pencil, Trash, Eye } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { ISite } from '../../types/sites';
import { sitesService } from '../../api/sites.service';

export function SiteCellAction({ data }: { data: ISite }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const onConfirm = async () => {
    setLoading(true);

    try {
      await sitesService.deleteSiteClient(data.id);
      toast.success('تم حذف الموقع');
      router.refresh();
    } catch (error) {
      // The API refuses to delete a site that still has units or supervisors attached.
      console.error('Error deleting site:', error);
      toast.error('تعذّر حذف الموقع — تأكد من عدم ارتباط وحدات أو مشرفين به');
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
        onConfirm={onConfirm}
        loading={loading}
      />
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' className='h-8 w-8 p-0'>
            <MoreHorizontal className='h-4 w-4' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          <DropdownMenuLabel>الإجراءات</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => router.push(`/system/sites/${data.id}`)}
          >
            <Eye className='ml-2 h-4 w-4' /> عرض
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => router.push(`/system/sites/${data.id}/edit`)}
          >
            <Pencil className='ml-2 h-4 w-4' /> تعديل
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <Trash className='ml-2 h-4 w-4' /> حذف
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
