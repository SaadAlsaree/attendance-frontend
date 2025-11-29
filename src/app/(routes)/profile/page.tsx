'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Lock, Loader2, Eye, EyeOff, User, Mail, Shield, Calendar, Building2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useCurrentUser } from '@/hooks/use-current-user';
import { Spinner } from '@/components/spinner';
import {
  changePasswordFormSchema,
  ChangePasswordFormValues
} from '@/features/system/users-permissions/utils/users-permissions';
import { usersPermissionsService } from '@/features/system/users-permissions/api/users-permissions.service';
import { useAuthApi } from '@/hooks/use-auth-api';
import { getRoleDisplayName } from '@/features/system/users-permissions/types/users-permissions';
import PageContainer from '@/components/layout/page-container';

export default function ProfilePage() {
  const { user, isLoading } = useCurrentUser();
  const [loading, setLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { authApiCall } = useAuthApi();

  const form = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordFormSchema),
    defaultValues: {
      userId: user?.id!,
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  });

  const onSubmit = async (data: ChangePasswordFormValues) => {
    setLoading(true);
    try {
      const result = await authApiCall(() =>
        usersPermissionsService.changePasswordClient({
          userId: user?.id!,
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
          confirmPassword: data.confirmPassword
        })
      );

      if (result) {
        toast.success('تم تغيير كلمة المرور بنجاح');
        form.reset();
      } else {
        toast.error('فشل في تغيير كلمة المرور. يرجى التحقق من كلمة المرور الحالية');
      }
    } catch (error) {
      console.error({ error });
      toast.error('حدث خطأ أثناء تغيير كلمة المرور');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'غير متاح';
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('ar-SA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    } catch {
      return 'غير متاح';
    }
  };

  if (isLoading) {
    return (
      <>
        <div className='flex items-center justify-center min-h-screen'>
          <Spinner />
        </div>
      </>
    );
  }

  if (!user) {
    return (
      <PageContainer>
        <Card className='mx-auto w-full max-w-4xl'>
          <CardContent className='pt-6'>
            <div className='text-center py-8 text-muted-foreground'>
              <User className='mx-auto h-12 w-12 mb-4' />
              <p>لا يمكن تحميل معلومات المستخدم</p>
            </div>
          </CardContent>
        </Card>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className='mx-auto w-full max-w-5xl space-y-6'>
        {/* Page Header */}
        <div className='space-y-2'>
          <h1 className='text-3xl font-bold tracking-tight'>الملف الشخصي</h1>
          <p className='text-muted-foreground'>
            عرض وتعديل معلوماتك الشخصية وكلمة المرور
          </p>
        </div>

        <div className='grid gap-6 md:grid-cols-2'>
          {/* User Information Card */}
          <Card className='w-full'>
            <CardHeader>
              <CardTitle className='text-right text-2xl font-bold flex items-center gap-2'>
                <User className='h-5 w-5' />
                معلومات المستخدم
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-6'>
              <Separator />
              
              {/* Avatar Section */}
              <div className='flex flex-col items-center gap-4 pb-4'>
                <Avatar className='h-24 w-24'>
                  <AvatarImage src='/avatar.jpg' alt={user.username || ''} />
                  <AvatarFallback className='text-2xl'>
                    {user.username?.slice(0, 2)?.toUpperCase() || 'CN'}
                  </AvatarFallback>
                </Avatar>
                <div className='text-center'>
                  <h3 className='text-xl font-semibold'>{user.username}</h3>
                  <p className='text-sm text-muted-foreground'>{user.userLogin}</p>
                </div>
              </div>

              <Separator />

              {/* User Details */}
              <div className='space-y-4'>
                <div className='flex items-start gap-3 p-3 rounded-lg bg-muted/50'>
                  <Mail className='h-5 w-5 text-muted-foreground mt-0.5' />
                  <div className='flex-1 text-right'>
                    <p className='text-sm text-muted-foreground'>اسم تسجيل الدخول</p>
                    <p className='font-medium'>{user.userLogin || 'غير متاح'}</p>
                  </div>
                </div>

                <div className='flex items-start gap-3 p-3 rounded-lg bg-muted/50'>
                  <Shield className='h-5 w-5 text-muted-foreground mt-0.5' />
                  <div className='flex-1 text-right'>
                    <p className='text-sm text-muted-foreground'>الدور</p>
                    <p className='font-medium'>
                      {user.roleName || getRoleDisplayName(user.role as any) || 'غير محدد'}
                    </p>
                  </div>
                </div>

                <div className='flex items-start gap-3 p-3 rounded-lg bg-muted/50'>
                  <Calendar className='h-5 w-5 text-muted-foreground mt-0.5' />
                  <div className='flex-1 text-right'>
                    <p className='text-sm text-muted-foreground'>آخر تسجيل دخول</p>
                    <p className='font-medium'>{formatDate(user.lastLoginDate)}</p>
                  </div>
                </div>

                <div className='flex items-start gap-3 p-3 rounded-lg bg-muted/50'>
                  <Building2 className='h-5 w-5 text-muted-foreground mt-0.5' />
                  <div className='flex-1 text-right'>
                    <p className='text-sm text-muted-foreground'>الوحدة التنظيمية</p>
                    <p className='font-medium'>
                      {user.organizationalUnitName || 'غير متاح'}
                    </p>
                  </div>
                </div>

                <div className='flex items-center gap-2 p-3 rounded-lg bg-muted/50'>
                  <div className='flex-1 text-right'>
                    <p className='text-sm text-muted-foreground'>الحالة</p>
                    <p className='font-medium'>
                      <span
                        className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${
                          user.isActive
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            user.isActive ? 'bg-green-500' : 'bg-red-500'
                          }`}
                        />
                        {user.isActive ? 'نشط' : 'غير نشط'}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Change Password Card */}
          <Card className='w-full'>
            <CardHeader>
              <CardTitle className='text-right text-2xl font-bold flex items-center gap-2'>
                <Lock className='h-5 w-5' />
                تغيير كلمة المرور
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Separator />
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className='w-full space-y-4 mt-6'
                >
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

                  <div className='pt-4'>
                    <Button
                      type='submit'
                      disabled={loading}
                      className='w-full flex items-center justify-center gap-2'
                    >
                      {loading ? (
                        <>
                          <Loader2 className='h-4 w-4 animate-spin' />
                          جاري التحديث...
                        </>
                      ) : (
                        <>
                          <Lock className='h-4 w-4' />
                          تغيير كلمة المرور
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}

