'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {  ReceiptText } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
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
      <Tooltip>
        <TooltipTrigger>  
        <Button
        variant={'outline'}
        size={'icon'}
          onClick={() => {
            router.push(`/leave/new?searchTerm=${encodeURIComponent(data.fullName)}`);
          }}
        >
          <ReceiptText  className=' h-4 w-4' />
        </Button>
     </TooltipTrigger>
     <TooltipContent>
       <p>إضافة موقف</p>
     </TooltipContent>
   </Tooltip>
  );
};
