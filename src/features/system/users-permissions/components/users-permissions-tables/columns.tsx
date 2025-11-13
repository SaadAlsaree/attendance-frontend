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

// Function type to determine if a user is the current user
type IsCurrentUserFn = (user: UserPermission) => boolean;

// Create columns function that accepts isCurrentUser function
export const createColumns = (
  isCurrentUserFn?: IsCurrentUserFn
): ColumnDef<UserPermission>[] => [
  {
    accessorKey: 'username',
    header: 'الاسم'
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
