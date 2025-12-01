'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Lock, X, Loader2, Eye, EyeOff } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import {
  changePasswordFormSchema,
  ChangePasswordFormValues
} from '../utils/users-permissions';
import { usersPermissionsService } from '../api/users-permissions.service';
import { useAuthApi } from '@/hooks/use-auth-api';
import { useCurrentUser } from '@/hooks/use-current-user';

interface ChangePasswordDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function ChangePasswordDialog({
  isOpen,
  onClose,
  onSuccess
}: ChangePasswordDialogProps) {
  const [loading, setLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { authApiCall } = useAuthApi();
  const { user } = useCurrentUser();
  const form = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordFormSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  });

  const onSubmit = async (data: ChangePasswordFormValues) => {
    setLoading(true);
    try {
      const result = await authApiCall(() =>
        usersPermissionsService.changePassword({
          userId: user?.id!,
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
          confirmPassword: data.confirmPassword
        })
      );

      if (result) {
        toast.success('تم تغيير كلمة المرور بنجاح');
        form.reset();
        onClose();
        onSuccess?.();
      } else {
        toast.error('فشل في تغيير كلمة المرور');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      toast.error('حدث خطأ أثناء تغيير كلمة المرور');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      form.reset();
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className='sm:max-w-[500px]'>
        <DialogHeader>
          <DialogTitle className='flex items-center justify-end gap-2'>
            <Lock className='h-5 w-5' />
            تغيير كلمة المرور
          </DialogTitle>
          <DialogDescription>
            أدخل كلمة المرور الحالية وكلمة المرور الجديدة
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='currentPassword'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>كلمة المرور الحالية</FormLabel>
                  <FormControl>
                    <div className='relative'>
                      <Input
                        {...field}
                        type={showCurrentPassword ? 'text' : 'password'}
                        placeholder='أدخل كلمة المرور الحالية'
                        className='pr-10'
                      />
                      <Button
                        type='button'
                        variant='ghost'
                        size='sm'
                        className='absolute top-0 left-0 h-full px-3 py-2 hover:bg-transparent'
                        onClick={() =>
                          setShowCurrentPassword(!showCurrentPassword)
                        }
                      >
                        {showCurrentPassword ? (
                          <EyeOff className='h-4 w-4' />
                        ) : (
                          <Eye className='h-4 w-4' />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Separator />

            <FormField
              control={form.control}
              name='newPassword'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>كلمة المرور الجديدة</FormLabel>
                  <FormControl>
                    <div className='relative'>
                      <Input
                        {...field}
                        type={showNewPassword ? 'text' : 'password'}
                        placeholder='أدخل كلمة المرور الجديدة'
                        className='pr-10'
                      />
                      <Button
                        type='button'
                        variant='ghost'
                        size='sm'
                        className='absolute top-0 left-0 h-full px-3 py-2 hover:bg-transparent'
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? (
                          <EyeOff className='h-4 w-4' />
                        ) : (
                          <Eye className='h-4 w-4' />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='confirmPassword'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>تأكيد كلمة المرور الجديدة</FormLabel>
                  <FormControl>
                    <div className='relative'>
                      <Input
                        {...field}
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder='أعد إدخال كلمة المرور الجديدة'
                        className='pr-10'
                      />
                      <Button
                        type='button'
                        variant='ghost'
                        size='sm'
                        className='absolute top-0 left-0 h-full px-3 py-2 hover:bg-transparent'
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeOff className='h-4 w-4' />
                        ) : (
                          <Eye className='h-4 w-4' />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className='gap-2'>
              <Button
                type='button'
                variant='outline'
                onClick={handleClose}
                disabled={loading}
                className='flex items-center gap-2'
              >
                <X className='h-4 w-4' />
                إلغاء
              </Button>
              <Button
                type='submit'
                disabled={loading}
                className='flex items-center gap-2'
              >
                {loading ? (
                  <Loader2 className='h-4 w-4 animate-spin' />
                ) : (
                  <Lock className='h-4 w-4' />
                )}
                تغيير كلمة المرور
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
