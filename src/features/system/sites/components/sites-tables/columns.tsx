'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { ISite } from '../../types/sites';
import { SiteCellAction } from './cell-action';

export const columns: ColumnDef<ISite>[] = [
  {
    accessorKey: 'siteName',
    header: 'اسم الموقع'
  },
  {
    accessorKey: 'siteCode',
    header: 'الرمز'
  },
  {
    accessorKey: 'unitCount',
    header: 'عدد الوحدات',
    cell: ({ row }) => <Badge variant='secondary'>{row.original.unitCount}</Badge>
  },
  {
    accessorKey: 'userCount',
    header: 'المشرفون',
    cell: ({ row }) => <Badge variant='secondary'>{row.original.userCount}</Badge>
  },
  {
    accessorKey: 'isActive',
    header: 'الحالة',
    cell: ({ row }) => (
      <Badge variant={row.original.isActive ? 'default' : 'outline'}>
        {row.original.isActive ? 'مُفعّل' : 'غير مُفعّل'}
      </Badge>
    )
  },
  {
    id: 'actions',
    cell: ({ row }) => <SiteCellAction data={row.original} />
  }
];
