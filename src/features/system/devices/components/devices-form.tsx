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
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { DeviceData } from '@/features/system/devices/types/devices';
import { devicesService } from '@/features/system/devices/api/devices.service';
import { useAuthApi } from '@/hooks/use-auth-api';
import {
  formSchema,
  DeviceFormValues,
  formatDevicePayload
} from '../utils/devices';
import { Spinner } from '@/components/spinner';
import { CustomSwitch } from '@/components/ui/custom-switch';
import { IOrganizationalUnitList } from '@/features/organizational-unit/types/organizational';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

interface DeviceFormProps {
  initialData: DeviceData | null;
  pageTitle?: string;
  organizations?: IOrganizationalUnitList[];
}

export default function DeviceForm({
  initialData,
  pageTitle,
  organizations
}: DeviceFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { authApiCall } = useAuthApi();

  // initial values
  const defaultValues = initialData
    ? {
        username: initialData.username || '',
        password: initialData.password || '',
        location: initialData.location || '',
        ipAddress: initialData.ipAddress || '',
        deviceId: initialData.deviceId || '',
        isupKey: initialData.isupKey || '',
        port: initialData.port || '',
        protocol: initialData.protocol || '',
        deviceModel: initialData.deviceModel || '',
        serialNumber: initialData.serialNumber || '',
        macAddress: initialData.macAddress || '',
        firmwareVersion: initialData.firmwareVersion || '',
        department: initialData.department || '',
        features: initialData.features || '',
        isActive: initialData.isActive ?? true,
        organizationId: initialData.organizationId || '',
        workLocationId: initialData.workLocationId || ''
      }
    : {};

  // form
  const form = useForm<DeviceFormValues>({
    resolver: zodResolver(formSchema(initialData)),
    defaultValues
  });

  const organizationOptions = organizations?.map((organization) => ({
    label: organization.unitName,
    value: organization.id
  }));

  // submit
  const onSubmit = async (data: DeviceFormValues) => {
    try {
      setLoading(true);

      const payload = {
        ...data,
        id: initialData?.id
      };

      if (initialData?.id) {
        const response = await authApiCall(async () =>
          devicesService.updateDevice(initialData.id!, payload)
        );
        console.log('response', response);
        if (response) {
          toast.success('تم تعديل الجهاز بنجاح!');
          router.push('/system/devices');
        } else {
          toast.error('حدث خطأ أثناء تعديل الجهاز');
        }
      } else {
        const response = await authApiCall(async () =>
          devicesService.createDevice(formatDevicePayload(data))
        );
        console.log('response', response);
        if (response) {
          toast.success('تم إنشاء الجهاز بنجاح!');
          router.push('/system/devices');
        } else {
          toast.error('حدث خطأ أثناء إنشاء الجهاز');
        }
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('حدث خطأ أثناء حفظ البيانات');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='space-y-6'>
      <div>
        <h3 className='text-lg font-medium'>{pageTitle}</h3>
        <p className='text-muted-foreground text-sm'>
          {initialData ? 'تعديل بيانات الجهاز' : 'إضافة جهاز جديد'}
        </p>
      </div>
      <Separator />
      <Card>
        <CardHeader>
          <CardTitle>معلومات الجهاز</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
              <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                <FormField
                  control={form.control}
                  name='username'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>اسم المستخدم</FormLabel>
                      <FormControl>
                        <Input placeholder='أدخل اسم المستخدم' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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
                  name='location'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>الموقع</FormLabel>
                      <FormControl>
                        <Input placeholder='أدخل موقع الجهاز' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='ipAddress'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>عنوان IP *</FormLabel>
                      <FormControl>
                        <Input placeholder='192.168.1.100' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='deviceId'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>معرف الجهاز</FormLabel>
                      <FormControl>
                        <Input placeholder='أدخل معرف الجهاز' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='isupKey'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>مفتاح ISUP</FormLabel>
                      <FormControl>
                        <Input placeholder='أدخل مفتاح ISUP' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='port'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>المنفذ</FormLabel>
                      <FormControl>
                        <Input placeholder='8080' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='protocol'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>البروتوكول</FormLabel>
                      <FormControl>
                        <Input placeholder='HTTP/HTTPS/TCP' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='deviceModel'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>موديل الجهاز</FormLabel>
                      <FormControl>
                        <Input placeholder='أدخل موديل الجهاز' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='serialNumber'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>الرقم التسلسلي</FormLabel>
                      <FormControl>
                        <Input placeholder='أدخل الرقم التسلسلي' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='macAddress'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>عنوان MAC</FormLabel>
                      <FormControl>
                        <Input placeholder='00:11:22:33:44:55' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='firmwareVersion'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>إصدار البرنامج الثابت</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='أدخل إصدار البرنامج الثابت'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='department'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>القسم</FormLabel>
                      <FormControl>
                        <Input placeholder='أدخل القسم' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='features'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>الميزات</FormLabel>
                      <FormControl>
                        <Input placeholder='أدخل الميزات المدعومة' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='organizationId'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel> الجهة</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className='w-full'>
                              <SelectValue placeholder='اختر الجهة' />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {organizationOptions?.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className='space-y-4'>
                <FormField
                  control={form.control}
                  name='isActive'
                  render={({ field }) => (
                    <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
                      <div className='space-y-0.5'>
                        <FormLabel className='text-base'>نشط</FormLabel>
                        <div className='text-muted-foreground text-sm'>
                          تحديد ما إذا كان الجهاز نشط ومتاح للاستخدام
                        </div>
                      </div>
                      <FormControl>
                        <CustomSwitch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <div className='flex justify-end space-x-2'>
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => router.push('/system/devices')}
                  disabled={loading}
                >
                  إلغاء
                </Button>
                <Button type='submit' disabled={loading}>
                  {loading && <Spinner className='mr-2 h-4 w-4' />}
                  {initialData ? 'تحديث' : 'إنشاء'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
