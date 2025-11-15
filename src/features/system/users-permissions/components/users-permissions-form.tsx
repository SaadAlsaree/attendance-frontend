'use client';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState, useMemo, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import {
  UserPermission,
  Role,
  UserStatus,
  getRoleDisplayName,
  getUserStatusDisplayName,
  UpdateUserRequest
} from '../types/users-permissions';
import { usersPermissionsService } from '../api/users-permissions.service';
import { useAuthApi } from '@/hooks/use-auth-api';
import { formSchema, FormValues } from '../utils/users-permissions';
import { Spinner } from '@/components/spinner';
import { Switch } from '@/components/ui/switch';

interface UsersPermissionsFormProps {
  initialData: UserPermission | null;
  pageTitle: string;
  organizations?: Array<{ id: string; unitName: string; unitCode: string }>;
}

export default function UsersPermissionsForm({
  initialData,
  pageTitle,
  organizations = []
}: UsersPermissionsFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { authApiCall } = useAuthApi();

  // initial values
  const defaultValues = useMemo(() => {
    return initialData
      ? {
          username: initialData.username || '',
          userLogin: initialData.userLogin || '',
          password: '',
          confirmPassword: '',
          role: initialData.role?.toString() || '',
          status: initialData.status?.toString() || '',
          organizationalUnitId: initialData.organizationalUnitId || '',
          isActive: initialData.isActive ?? true
        }
      : {
          username: '',
          userLogin: '',
          password: '',
          confirmPassword: '',
          role: '',
          status: '',
          organizationalUnitId: '',
          isActive: true
        };
  }, [initialData]);

  // form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema(initialData)),
    defaultValues
  });

  // Reset form when initialData changes
  useEffect(() => {
    if (initialData) {
      form.reset({
        username: initialData.username || '',
        userLogin: initialData.userLogin || '',
        password: '',
        confirmPassword: '',
        role: initialData.role?.toString() || '',
        status: initialData.status?.toString() || '',
        organizationalUnitId: initialData.organizationalUnitId || '',
        isActive: initialData.isActive ?? true
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData]);

  // Memoize role options to prevent unnecessary re-renders
  const roleOptions = useMemo(() => {
    // Filter out numeric keys and only include valid role values
    return Object.entries(Role)
      .filter(([key]) => isNaN(Number(key))) // Filter out numeric keys
      .map(([, value]) => ({
        label: getRoleDisplayName(value as unknown as Role),
        value: value.toString()
      }))
      .filter((option) => option.label !== 'غير محدد'); // Filter out undefined roles
  }, []);

  // Memoize status options to prevent unnecessary re-renders
  const statusOptions = useMemo(() => {
    return Object.entries(UserStatus)
      .filter(([key]) => isNaN(Number(key))) // Filter out numeric keys
      .map(([, value]) => ({
        label: getUserStatusDisplayName(value as unknown as UserStatus),
        value: value.toString()
      }))
      .filter((option) => option.label !== 'غير محدد'); // Filter out undefined statuses
  }, []);

  // Memoize organization options to prevent unnecessary re-renders
  const organizationOptions = useMemo(() => {
    return organizations.map((org) => ({
      label: `${org.unitName} (${org.unitCode})`,
      value: org.id
    }));
  }, [organizations]);

  // submit
  const onSubmit = async (data: FormValues) => {
    try {
      setLoading(true);

      if (initialData?.id) {
        // Update existing user
        const updateData: UpdateUserRequest = {
          username: data.username,
          userLogin: data.userLogin,
          role: Number(data.role) as Role,
          status: data.status ? (Number(data.status) as UserStatus) : (initialData.status as UserStatus),
          isActive: data.isActive,
          organizationalUnitId: data.organizationalUnitId || undefined
        };
        
        const response = await authApiCall(async () =>
          usersPermissionsService.updateUserClient(initialData.id!, updateData)
        );

        if (response) {
          toast.success('تم تحديث المستخدم بنجاح!');
          router.push('/system/users-permissions');
        } else {
          toast.error('فشل في تحديث المستخدم');
        }
      } else {
        // Create new user
        if (!data.password || !data.confirmPassword) {
          toast.error('كلمة المرور مطلوبة');
          return;
        }
        
        const password = data.password;
        const confirmPassword = data.confirmPassword;
        
        const response = await authApiCall(async () =>
          usersPermissionsService.createUserClient({
            username: data.username,
            userLogin: data.userLogin,
            password,
            confirmPassword,
            role: Number(data.role) as Role,
            organizationalUnitId: data.organizationalUnitId
          })
        );

        if (response) {
          toast.success('تم إنشاء المستخدم بنجاح!');
          router.push('/system/users-permissions');
        } else {
          toast.error('فشل في إنشاء المستخدم');
        }
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('حدث خطأ أثناء حفظ البيانات');
    } finally {
      setLoading(false);
    }
  };

  console.log(form.formState.errors);

  return (
    <div className='space-y-6'>
      <div>
        <h2 className='text-2xl font-bold tracking-tight'>{pageTitle}</h2>
        <p className='text-muted-foreground'>
          {initialData ? 'تعديل بيانات المستخدم' : 'إضافة مستخدم جديد'}
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
          <Card>
            <CardHeader>
              <CardTitle>معلومات المستخدم الأساسية</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                <FormField
                  control={form.control}
                  name='userLogin'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>معرف الدخول</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='أدخل معرف الدخول'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='username'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>الاسم</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='أدخل الاسم'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='role'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>الدور</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className='w-full'>
                            <SelectValue placeholder='اختر الدور' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {roleOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {initialData && (
                  <FormField
                    control={form.control}
                    name='status'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>حالة المستخدم</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className='w-full'>
                              <SelectValue placeholder='اختر حالة المستخدم' />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {statusOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name='organizationalUnitId'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>الوحدة التنظيمية</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className='w-full'>
                            <SelectValue placeholder='اختر الوحدة التنظيمية' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {organizationOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='isActive'
                  render={({ field }) => (
                    <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
                      <div className='space-y-0.5'>
                        <FormLabel className='text-base'>الحالة</FormLabel>
                        <div className='text-muted-foreground text-sm'>
                          تفعيل أو إلغاء تفعيل المستخدم
                        </div>
                      </div>
                      <FormControl>
                        <Switch
                        dir='ltr'
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              {!initialData && (
                <>
                  <Separator />
                  <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                    <FormField
                      control={form.control}
                      name='password'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>كلمة المرور</FormLabel>
                          <FormControl>
                            <Input
                              type='password'
                              placeholder='أدخل كلمة المرور'
                              {...field}
                            />
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
                          <FormLabel>تأكيد كلمة المرور</FormLabel>
                          <FormControl>
                            <Input
                              type='password'
                              placeholder='أعد إدخال كلمة المرور'
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <div className='flex gap-2'>
            <Button type='submit' disabled={loading}>
              {loading && <Spinner className='mr-2' />}
              {initialData ? 'تحديث المستخدم' : 'إنشاء المستخدم'}
            </Button>
            <Button
              type='button'
              variant='outline'
              onClick={() => router.push('/system/users-permissions')}
            >
              إلغاء
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
