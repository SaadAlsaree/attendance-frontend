'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  UserCheck,
  UserX,
  Lock
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { UserPermission, Role } from '../../types/users-permissions';
import ResetPasswordDialog from '../reset-password-dialog';
import ChangePasswordDialog from '../change-password-dialog';
import { useCurrentUser } from '@/hooks/use-current-user';
import Link from 'next/link';

interface RowActionsProps {
  user: UserPermission;
  isCurrentUser?: boolean;
}

export default function RowActions({ user }: RowActionsProps) {
  const [resetPasswordOpen, setResetPasswordOpen] = useState(false);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);

  const { user: currentUser } = useCurrentUser();
  const isSelf = !!currentUser && currentUser.id === user.id;
  // Password reset of another user is restricted to Admin / SuperAdmin (feature 06).
  const canReset =
    currentUser?.role === Role.Admin || currentUser?.role === Role.SuperAdmin;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' className='h-8 w-8 p-0'>
            <span className='sr-only'>فتح القائمة</span>
            <MoreHorizontal className='h-4 w-4' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          <DropdownMenuLabel>الإجراءات</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href={`/system/users-permissions/${user.id}`}>
              <Eye className='mr-2 h-4 w-4' />
              عرض التفاصيل
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={`/system/users-permissions/${user.id}/edit`}>
              <Edit className='mr-2 h-4 w-4' />
              تعديل
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href={`/system/users-permissions/${user.id}/change-role`}>
              <UserCheck className='mr-2 h-4 w-4' />
              تغيير الدور
            </Link>
          </DropdownMenuItem>
          {isSelf ? (
            <DropdownMenuItem onClick={() => setChangePasswordOpen(true)}>
              <Lock className='mr-2 h-4 w-4' />
              تغيير كلمة المرور
            </DropdownMenuItem>
          ) : canReset ? (
            <DropdownMenuItem onClick={() => setResetPasswordOpen(true)}>
              <UserX className='mr-2 h-4 w-4' />
              إعادة تعيين كلمة المرور
            </DropdownMenuItem>
          ) : null}
          <DropdownMenuSeparator />
          <DropdownMenuItem className='text-red-600'>
            <Trash2 className='mr-2 h-4 w-4' />
            حذف
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Reset Password Dialog */}
      <ResetPasswordDialog
        isOpen={resetPasswordOpen}
        onClose={() => setResetPasswordOpen(false)}
        user={user}
        onSuccess={() => {
          // Optionally refresh the data or show success message
          console.log('Password reset successfully for user:', user.username);
        }}
      />

      {/* Change Password Dialog */}
      <ChangePasswordDialog
        isOpen={changePasswordOpen}
        onClose={() => setChangePasswordOpen(false)}
        onSuccess={() => {
          // Optionally refresh the data or show success message
          console.log('Password changed successfully');
        }}
      />
    </>
  );
}
