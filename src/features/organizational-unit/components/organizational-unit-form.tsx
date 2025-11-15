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
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import {
  IOrganizationalUnitDetails,
  IOrganizationalUnitList
} from '@/features/organizational-unit/types/organizational';
import { organizationalService } from '@/features/organizational-unit/api/organizational.service';
import { useAuthApi } from '@/hooks/use-auth-api';
import {
  formSchema,
  OrganizationalUnitFormValues,
  formatOrganizationalUnitPayload
} from '../utils/organizational';
import { Spinner } from '@/components/spinner';

interface OrganizationalUnitFormProps {
  initialData: IOrganizationalUnitDetails | null;
  pageTitle: string;
  parentUnits?: IOrganizationalUnitList[];
}

export default function OrganizationalUnitForm({
  initialData,
  pageTitle,
  parentUnits = []
}: OrganizationalUnitFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { authApiCall } = useAuthApi();

  // initial values
  const defaultValues = initialData
    ? {
        unitName: initialData.unitName || '',
        unitCode: initialData.unitCode || '',
        unitDescription: initialData.unitDescription || '',
        parentUnitId: initialData.parentUnitId || undefined,
        email: initialData.email || '',
        phoneNumber: initialData.phoneNumber || '',
        address: initialData.address || '',
        postalCode: initialData.postalCode || '',
        unitLogo: initialData.unitLogo || '',
        unitLevel: initialData.unitLevel || undefined,
        managerId: initialData.managerId || undefined
      }
    : {};

  // form
  const form = useForm<OrganizationalUnitFormValues>({
    resolver: zodResolver(formSchema(initialData)),
    defaultValues
  });

  // submit
  const onSubmit = async (data: OrganizationalUnitFormValues) => {
    try {
      setLoading(true);

      if (initialData) {
        const payload = {
          ...data,
          id: initialData.id
        };


        const response = await authApiCall(() =>
          organizationalService.updateOrganizationalUnit(
            initialData.id!,
            formatOrganizationalUnitPayload(payload)
          )
        );

        if (response) {
          toast.success('تم تعديل الجهة بنجاح!');
          router.push('/organizational-unit');
          router.refresh();
        } else {
          toast.error('لم يتم تعديل الجهة!');
        }
      } else {
        const response = await authApiCall(() =>
          organizationalService.createOrganizationalUnit(
            formatOrganizationalUnitPayload(data)
          )
        );

        if (response) {
          toast.success('تم إنشاء الجهة بنجاح!');
          router.push('/organizational-unit');
          router.refresh();
        } else {
          toast.error('لم يتم إنشاء الجهة!');
        }
      }
    } catch (error) {
      console.error(error);
      toast.error('حدث خطأ!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className='mx-auto w-full'>
      <CardHeader>
        <CardTitle className='text-left text-2xl font-bold'>
          {pageTitle}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Separator />
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='w-full space-y-4'
          >
            <div className='grid gap-4 md:grid-cols-2'>
              <FormField
                control={form.control}
                name='unitName'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الاسم</FormLabel>
                    <FormControl>
                      <Input placeholder='أدخل الاسم' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='unitCode'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الترميز</FormLabel>
                    <FormControl>
                      <Input placeholder='أدخل الترميز' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='parentUnitId'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الجهة الأم</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl className='w-full'>
                        <SelectTrigger>
                          <SelectValue placeholder='اختر الجهة الأم' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {parentUnits?.map((unit) => (
                          <SelectItem key={unit.id} value={unit.id}>
                            {unit.unitName}
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
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>البريد الإلكتروني</FormLabel>
                    <FormControl>
                      <Input
                        type='email'
                        placeholder='أدخل البريد'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='phoneNumber'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>رقم الهاتف</FormLabel>
                    <FormControl>
                      <Input placeholder='أدخل رقم الهاتف' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='unitLogo'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>شعار الوحدة</FormLabel>
                    <FormControl>
                      <Input placeholder='أدخل رابط الشعار' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className='grid gap-4 md:grid-cols-2'>
              <FormField
                control={form.control}
                name='address'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>العنوان</FormLabel>
                    <FormControl>
                      <Input placeholder='أدخل العنوان' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='unitLevel'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>المستوى</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        min={1}
                        placeholder='أدخل المستوى'
                        {...field}
                        onChange={(e) => {
                          const value = parseInt(e.target.value);
                          field.onChange(isNaN(value) ? undefined : value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className='space-y-4'>
              <FormField
                control={form.control}
                name='unitDescription'
                render={({ field }) => (
                  <FormItem className='col-span-2'>
                    <FormLabel>الوصف</FormLabel>
                    <FormControl>
                      <Textarea placeholder='أدخل الوصف' {...field} rows={3} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button disabled={loading} type='submit' className='ml-auto'>
              {initialData ? 'تعديل' : 'إنشاء'}
              {loading && (
                <Spinner variant='default' className='ml-2 h-4 w-4' />
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
