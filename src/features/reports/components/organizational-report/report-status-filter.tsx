'use client';
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { OrganizationalReportData } from '../../types/organization-report';
import {
  REPORT_STATUSES,
  ReportStatusKey,
  getStatusCount
} from './report-status-filters';

type Props = {
  data: OrganizationalReportData | undefined;
  value: ReportStatusKey;
  onChange: (value: ReportStatusKey) => void;
};

// Always-visible status filter bar. Drives what the screen table AND the print
// view show, so the user can filter → see → print exactly what they picked.
const ReportStatusFilter = ({ data, value, onChange }: Props) => {
  return (
    <div className='flex flex-col gap-2' dir='rtl'>
      <span className='text-muted-foreground text-sm font-medium'>
        تصفية حسب الحالة
      </span>
      <ToggleGroup
        type='single'
        variant='outline'
        size='sm'
        dir='rtl'
        value={value}
        onValueChange={(v) => v && onChange(v as ReportStatusKey)}
        className='flex flex-wrap justify-start gap-2'
      >
        {REPORT_STATUSES.map((status) => (
          <ToggleGroupItem
            key={status.key}
            value={status.key}
            aria-label={status.label}
            className='gap-1.5'
          >
            {status.label}
            <Badge variant='secondary' className='px-1.5 text-[10px]'>
              {getStatusCount(data, status.key)}
            </Badge>
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  );
};

export default ReportStatusFilter;
