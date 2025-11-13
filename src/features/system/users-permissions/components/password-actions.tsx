'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Lock, RefreshCw } from 'lucide-react';
import { ChangePasswordDialog, ResetPasswordDialog } from './index';
import { UserPermission } from '../types/users-permissions';

interface PasswordActionsProps {
  user?: UserPermission;
  onSuccess?: () => void;
}

export default function PasswordActions({
  user,
  onSuccess
}: PasswordActionsProps) {
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [resetPasswordOpen, setResetPasswordOpen] = useState(false);

  return (
    <div className='flex gap-2'>
      {/* Change Password Button - for current user */}
      <Button
        variant='outline'
        size='sm'
        onClick={() => setChangePasswordOpen(true)}
        className='flex items-center gap-2'
      >
        <Lock className='h-4 w-4' />
        تغيير كلمة المرور
      </Button>

      {/* Reset Password Button - for admin to reset other users' passwords */}
      {user && (
        <Button
          variant='outline'
          size='sm'
          onClick={() => setResetPasswordOpen(true)}
          className='flex items-center gap-2'
        >
          <RefreshCw className='h-4 w-4' />
          إعادة تعيين كلمة المرور
        </Button>
      )}

      {/* Change Password Dialog */}
      <ChangePasswordDialog
        isOpen={changePasswordOpen}
        onClose={() => setChangePasswordOpen(false)}
        onSuccess={onSuccess}
      />

      {/* Reset Password Dialog */}
      <ResetPasswordDialog
        isOpen={resetPasswordOpen}
        onClose={() => setResetPasswordOpen(false)}
        onSuccess={onSuccess}
        user={user}
      />
    </div>
  );
}
