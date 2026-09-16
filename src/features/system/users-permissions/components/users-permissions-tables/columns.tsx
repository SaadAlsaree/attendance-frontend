'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import {
  UserPermission,
  Role,
  getRoleDisplayName
} from '../../types/users-permissions';
import RowActions from './row-actions';
import { formatDate } from '@/lib/format';
import { Search } from 'lucide-react';

// Function type to determine if a user is the current user
type IsCurrentUserFn = (user: UserPermission) => boolean;

// Create columns function that accepts isCurrentUser function
export const createColumns = (
  isCurrentUserFn?: IsCurrentUserFn
): ColumnDef<UserPermission>[] => [
  {
    // id (not the accessorKey) is what useDataTable writes to the query string, and `searchText`
    // is the key the listing reads. The filter is free text across name, login and unit — it is
    // hosted on this column only because the toolbar renders one input per filterable column.
    id: 'searchText',
    accessorKey: 'username',
    header: 'الاسم',
    meta: {
      label: 'بحث',
      placeholder: 'ابحث بالاسم أو معرف الدخول أو الجهة...',
      variant: 'text',
      icon: Search
    },
    enableColumnFilter: true
  },
  {
    accessorKey: 'userLogin',
    header: 'معرف الدخول'
  },
  {
    accessorKey: 'role',
    header: 'الدور',
    cell: ({ row }) => {
      const role = row.getValue('role') as Role;
      return <Badge variant='outline'>{getRoleDisplayName(role)}</Badge>;
    }
  },
  {
    accessorKey: 'organizationalUnitName',
    header: 'الوحدة التنظيمية'
  },
  {
    accessorKey: 'organizationalUnitCode',
    header: 'رمز الوحدة'
  },
  {
    accessorKey: 'siteName',
    header: 'الموقع',
    cell: ({ row }) => {
      const siteName = row.original.siteName;

      return siteName ? (
        <Badge variant='secondary'>{siteName}</Badge>
      ) : (
        <span className='text-muted-foreground'>—</span>
      );
    }
  },
  {
    accessorKey: 'isActive',
    header: 'الحالة',
    cell: ({ row }) => {
      const isActive = row.getValue('isActive') as boolean;
      return (
        <Badge variant={isActive ? 'default' : 'secondary'}>
          {isActive ? 'نشط' : 'غير نشط'}
        </Badge>
      );
    }
  },
  {
    accessorKey: 'lastLoginDate',
    header: 'آخر تسجيل دخول',
    cell: ({ row }) => {
      const date = row.getValue('lastLoginDate') as string;
      return date ? formatDate(date) : 'لم يسجل دخول';
    }
  },
  {
    accessorKey: 'createdAt',
    header: 'تاريخ الإنشاء',
    cell: ({ row }) => {
      const date = row.getValue('createdAt') as string;
      return formatDate(date);
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const user = row.original;
      const isCurrentUser = isCurrentUserFn ? isCurrentUserFn(user) : false;
      return <RowActions user={user} isCurrentUser={isCurrentUser} />;
    }
  }
];

// Default columns export for backward compatibility
export const columns = createColumns();
