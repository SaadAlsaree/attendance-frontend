'use client';
import React from 'react';
import { OrganizationalSummaryResponse } from '../../types/organizational-summary';
import OrganizationalSummaryCard from './organizational-summary-card';
import OrganizationalSummaryFilter from './organizational-summary-filter';
import OrganizationalSummaryDataCart from './organizational-summary-data-cart';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface OrganizationalUnit {
  id: string;
  unitName: string;
  unitCode: string;
  parentId?: string;
}

type OrganizationalSummaryProps = {
  data: OrganizationalSummaryResponse;
  organization: OrganizationalUnit[];
};

const OrganizationalSummary = ({
  data,
  organization
}: OrganizationalSummaryProps) => {
  return (
    <div className='space-y-6'>
      {/* عنوان التقرير */}
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-2xl font-bold text-gray-900 dark:text-gray-100'>
            تقرير الموظفين
          </h2>
          <p className='mt-1 text-gray-600 dark:text-gray-400'>
            تاريخ التقرير:{' '}
            {format(new Date(data.data.date), 'EEEE, d MMMM yyyy', {
              locale: ar
            })}
          </p>
          <p className='text-sm text-gray-500 dark:text-gray-500'>
            تم إنشاؤه في:{' '}
            {format(new Date(data.data.generatedAt), 'HH:mm', { locale: ar })}
          </p>
        </div>
        <div className='flex items-center gap-2'>
          <OrganizationalSummaryFilter organization={organization} />

          <Badge variant='secondary' className='text-sm'>
            {data.data.units.length} الجهة
          </Badge>
        </div>
      </div>
      <Separator />
      {/* البطاقة الرئيسية مع الإحصائيات */}
      <OrganizationalSummaryCard data={data} />

      {/* جدول تفاصيل الوحدات التنظيمية */}
      <div className='w-full overflow-hidden'>
        <div className='max-w-full'>
          <OrganizationalSummaryDataCart data={data.data.units} />
        </div>
      </div>
    </div>
  );
};

export default OrganizationalSummary;
