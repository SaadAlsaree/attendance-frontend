'use client';

import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import { Column, ColumnDef } from '@tanstack/react-table';
import {
  Building,
  Hash,
  Mail,
  FileText,
  Users,
  User,
  MapPin,
  Phone,
  Calendar
} from 'lucide-react';
import { IOrganizationalUnitList } from '../../types/organizationsunits';
import { formatDate } from '../../utils/organizationsunits';
import { CellAction } from './cell-action';

export const columns: ColumnDef<IOrganizationalUnitList>[] = [
  {
    id: 'unitName',
    accessorKey: 'unitName',
    header: ({ column }: { column: Column<IOrganizationalUnitList, unknown> }) => (
      <DataTableColumnHeader column={column} title='اسم الوحدة / الجهة' />
    ),
    cell: ({ cell }) => {
      const name = cell.getValue<string>();
      return (
        <div className='flex items-center gap-2 font-medium'>
          <Building className='h-4 w-4 text-blue-600' />
          <span>{name || '-'}</span>
        </div>
      );
    },
    meta: {
      label: 'اسم الوحدة / الجهة',
      placeholder: 'ابحث عن اسم الوحدة...',
      variant: 'text',
      icon: Building
    },
    enableColumnFilter: true
  },
  {
    id: 'unitCode',
    accessorKey: 'unitCode',
    header: ({ column }: { column: Column<IOrganizationalUnitList, unknown> }) => (
      <DataTableColumnHeader column={column} title='الرمز' />
    ),
    cell: ({ cell }) => (
      <div className='font-mono text-sm font-semibold'>
        <Badge variant='outline'>{cell.getValue<string>() || '-'}</Badge>
      </div>
    ),
    meta: {
      label: 'رمز الوحدة',
      placeholder: 'ابحث بالرمز...',
      variant: 'text',
      icon: Hash
    },
    enableColumnFilter: true
  },
  {
    id: 'parentUnitName',
    accessorKey: 'parentUnitName',
    header: ({ column }: { column: Column<IOrganizationalUnitList, unknown> }) => (
      <DataTableColumnHeader column={column} title='الجهة الأم' />
    ),
    cell: ({ cell }) => {
      const parentName = cell.getValue<string>();
      return (
        <div className='text-sm text-muted-foreground'>
          {parentName ? (
            <span className='font-medium text-foreground'>{parentName}</span>
          ) : (
            <Badge variant='secondary'>جهة رئيسية</Badge>
          )}
        </div>
      );
    },
    meta: {
      label: 'الجهة الأم',
      icon: Building
    }
  },
  {
    id: 'employeeCount',
    accessorKey: 'employeeCount',
    header: ({ column }: { column: Column<IOrganizationalUnitList, unknown> }) => (
      <DataTableColumnHeader column={column} title='عدد الموظفين' />
    ),
    cell: ({ cell }) => {
      const count = cell.getValue<number>();
      return (
        <div className='flex items-center gap-1.5'>
          <Users className='h-4 w-4 text-emerald-600' />
          <span className='font-medium'>{count ?? 0}</span>
        </div>
      );
    },
    meta: {
      label: 'عدد الموظفين',
      icon: Users
    }
  },
  {
    id: 'childUnitCount',
    accessorKey: 'childUnitCount',
    header: ({ column }: { column: Column<IOrganizationalUnitList, unknown> }) => (
      <DataTableColumnHeader column={column} title='الوحدات الفرعية' />
    ),
    cell: ({ cell }) => {
      const count = cell.getValue<number>();
      return (
        <div className='flex items-center gap-1.5'>
          <Building className='h-4 w-4 text-indigo-600' />
          <span className='font-medium'>{count ?? 0}</span>
        </div>
      );
    },
    meta: {
      label: 'الوحدات الفرعية',
      icon: Building
    }
  },
  {
    id: 'managerName',
    accessorKey: 'managerName',
    header: ({ column }: { column: Column<IOrganizationalUnitList, unknown> }) => (
      <DataTableColumnHeader column={column} title='المدير' />
    ),
    cell: ({ cell }) => {
      const managerName = cell.getValue<string>();
      return (
        <div className='flex items-center gap-1.5'>
          <User className='h-4 w-4 text-muted-foreground' />
          <span>{managerName || 'غير محدد'}</span>
        </div>
      );
    },
    meta: {
      label: 'المدير',
      icon: User
    }
  },
  {
    id: 'email',
    accessorKey: 'email',
    header: ({ column }: { column: Column<IOrganizationalUnitList, unknown> }) => (
      <DataTableColumnHeader column={column} title='البريد الإلكتروني' />
    ),
    cell: ({ cell }) => {
      const email = cell.getValue<string>();
      return email ? (
        <div className='flex items-center gap-1.5 text-xs'>
          <Mail className='h-3.5 w-3.5 text-sky-600' />
          <span className='max-w-[180px] truncate' title={email}>
            {email}
          </span>
        </div>
      ) : (
        <span className='text-muted-foreground'>-</span>
      );
    },
    meta: {
      label: 'البريد الإلكتروني',
      icon: Mail
    }
  },
  {
    id: 'phoneNumber',
    accessorKey: 'phoneNumber',
    header: ({ column }: { column: Column<IOrganizationalUnitList, unknown> }) => (
      <DataTableColumnHeader column={column} title='رقم الهاتف' />
    ),
    cell: ({ cell }) => {
      const phone = cell.getValue<string>();
      return phone ? (
        <div className='flex items-center gap-1.5 text-xs font-mono'>
          <Phone className='h-3.5 w-3.5 text-emerald-600' />
          <span>{phone}</span>
        </div>
      ) : (
        <span className='text-muted-foreground'>-</span>
      );
    },
    meta: {
      label: 'رقم الهاتف',
      icon: Phone
    }
  },
  {
    id: 'unitLevel',
    accessorKey: 'unitLevel',
    header: ({ column }: { column: Column<IOrganizationalUnitList, unknown> }) => (
      <DataTableColumnHeader column={column} title='المستوى' />
    ),
    cell: ({ cell }) => {
      const level = cell.getValue<number>();
      return level ? (
        <Badge variant='secondary'>المستوى {level}</Badge>
      ) : (
        <span className='text-muted-foreground'>-</span>
      );
    },
    meta: {
      label: 'المستوى',
      icon: Building
    }
  },
  {
    id: 'createdAt',
    accessorKey: 'createdAt',
    header: ({ column }: { column: Column<IOrganizationalUnitList, unknown> }) => (
      <DataTableColumnHeader column={column} title='تاريخ الإنشاء' />
    ),
    cell: ({ cell }) => {
      const date = cell.getValue<string>();
      return (
        <div className='flex items-center gap-1 text-xs text-muted-foreground'>
          <Calendar className='h-3.5 w-3.5' />
          <span>{formatDate(date)}</span>
        </div>
      );
    },
    meta: {
      label: 'تاريخ الإنشاء',
      icon: Calendar
    }
  },
  {
    id: 'actions',
    header: ({ column }: { column: Column<IOrganizationalUnitList, unknown> }) => (
      <DataTableColumnHeader column={column} title='العمليات' />
    ),
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
