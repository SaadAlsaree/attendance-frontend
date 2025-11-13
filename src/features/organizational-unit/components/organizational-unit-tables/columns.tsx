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
  Phone
} from 'lucide-react';
import { IOrganizationalUnitList } from '@/features/organizational-unit/types/organizational';
import moment from 'moment';
import { CellAction } from './cell-action';

export const columns: ColumnDef<IOrganizationalUnitList>[] = [
  {
    id: 'unitName',
    accessorKey: 'unitName',
    header: ({
      column
    }: {
      column: Column<IOrganizationalUnitList, unknown>;
    }) => <DataTableColumnHeader column={column} title='اسم الجهة' />,
    cell: ({ cell }) => <div>{cell.getValue<string>()}</div>,
    meta: {
      label: 'اسم الجهة',
      placeholder: 'ابحث عن اسم الجهة...',
      variant: 'text',
      icon: Building
    },
    enableColumnFilter: true
  },
  {
    id: 'unitCode',
    accessorKey: 'unitCode',
    header: ({
      column
    }: {
      column: Column<IOrganizationalUnitList, unknown>;
    }) => <DataTableColumnHeader column={column} title='رمز الجهة' />,
    cell: ({ cell }) => <div>{cell.getValue<string>()}</div>,
    meta: {
      label: 'رمز الجهة',
      placeholder: 'ابحث عن رمز الجهة...',
      variant: 'text',
      icon: Hash
    }
  },
  {
    id: 'parentUnitName',
    accessorKey: 'parentUnitName',
    header: ({
      column
    }: {
      column: Column<IOrganizationalUnitList, unknown>;
    }) => <DataTableColumnHeader column={column} title='الجهة الأم' />,
    cell: ({ cell }) => <div>{cell.getValue<string>() || 'جهة رئيسية'}</div>,
    meta: {
      label: 'الجهة الأم',
      icon: Building
    }
  },
  {
    id: 'unitDescription',
    accessorKey: 'unitDescription',
    header: ({
      column
    }: {
      column: Column<IOrganizationalUnitList, unknown>;
    }) => <DataTableColumnHeader column={column} title='الوصف' />,
    cell: ({ cell }) => {
      const description = cell.getValue<string>();
      return <div>{description || '-'}</div>;
    },
    meta: {
      label: 'الوصف',
      icon: FileText
    }
  },
  {
    id: 'employeeCount',
    accessorKey: 'employeeCount',
    header: ({
      column
    }: {
      column: Column<IOrganizationalUnitList, unknown>;
    }) => <DataTableColumnHeader column={column} title='عدد الموظفين' />,
    cell: ({ cell }) => {
      const count = cell.getValue<number>();
      return (
        <div className='flex items-center gap-1'>
          <Users className='h-4 w-4 text-green-600' />
          <span>{count}</span>
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
    header: ({
      column
    }: {
      column: Column<IOrganizationalUnitList, unknown>;
    }) => <DataTableColumnHeader column={column} title='الجهات الفرعية' />,
    cell: ({ cell }) => {
      const count = cell.getValue<number>();
      return (
        <div className='flex items-center gap-1'>
          <Building className='h-4 w-4 text-blue-600' />
          <span>{count}</span>
        </div>
      );
    },
    meta: {
      label: 'الجهات الفرعية',
      icon: Building
    }
  },
  {
    id: 'managerName',
    accessorKey: 'managerName',
    header: ({
      column
    }: {
      column: Column<IOrganizationalUnitList, unknown>;
    }) => <DataTableColumnHeader column={column} title='المدير' />,
    cell: ({ cell }) => {
      const managerName = cell.getValue<string>();
      return (
        <div className='flex items-center gap-1'>
          <User className='h-4 w-4 text-gray-600' />
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
    header: ({
      column
    }: {
      column: Column<IOrganizationalUnitList, unknown>;
    }) => <DataTableColumnHeader column={column} title='البريد الإلكتروني' />,
    cell: ({ cell }) => {
      const email = cell.getValue<string>();
      return email ? (
        <div className='flex items-center gap-1'>
          <Mail className='h-4 w-4 text-blue-600' />
          <span className='max-w-[200px] truncate' title={email}>
            {email}
          </span>
        </div>
      ) : (
        <div>-</div>
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
    header: ({
      column
    }: {
      column: Column<IOrganizationalUnitList, unknown>;
    }) => <DataTableColumnHeader column={column} title='رقم الهاتف' />,
    cell: ({ cell }) => {
      const phone = cell.getValue<string>();
      return phone ? (
        <div className='flex items-center gap-1'>
          <Phone className='h-4 w-4 text-green-600' />
          <span>{phone}</span>
        </div>
      ) : (
        <div>-</div>
      );
    },
    meta: {
      label: 'رقم الهاتف',
      icon: Phone
    }
  },
  {
    id: 'address',
    accessorKey: 'address',
    header: ({
      column
    }: {
      column: Column<IOrganizationalUnitList, unknown>;
    }) => <DataTableColumnHeader column={column} title='العنوان' />,
    cell: ({ cell }) => {
      const address = cell.getValue<string>();
      return address ? (
        <div className='flex items-center gap-1'>
          <MapPin className='h-4 w-4 text-red-600' />
          <span className='max-w-[200px] truncate' title={address}>
            {address}
          </span>
        </div>
      ) : (
        <div>-</div>
      );
    },
    meta: {
      label: 'العنوان',
      icon: MapPin
    }
  },
  {
    id: 'unitLevel',
    accessorKey: 'unitLevel',
    header: ({
      column
    }: {
      column: Column<IOrganizationalUnitList, unknown>;
    }) => <DataTableColumnHeader column={column} title='المستوى' />,
    cell: ({ cell }) => {
      const level = cell.getValue<number>();
      return level ? (
        <Badge variant='outline'>المستوى {level}</Badge>
      ) : (
        <div>-</div>
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
    header: ({
      column
    }: {
      column: Column<IOrganizationalUnitList, unknown>;
    }) => <DataTableColumnHeader column={column} title='تاريخ الإنشاء' />,
    cell: ({ cell }) => {
      const date = cell.getValue<string>();
      return date ? (
        <div>{moment(date).format('YYYY-MM-DD')}</div>
      ) : (
        <div>-</div>
      );
    }
  },
  {
    id: 'actions',
    header: ({
      column
    }: {
      column: Column<IOrganizationalUnitList, unknown>;
    }) => <DataTableColumnHeader column={column} title='العمليات' />,
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
