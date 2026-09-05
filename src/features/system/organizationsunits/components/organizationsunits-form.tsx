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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
} from '../types/organizationsunits';
import { organizationsUnitsService } from '../api/organizationsunits.service';
import { useAuthApi } from '@/hooks/use-auth-api';
import {
  formSchema,
  OrganizationalUnitFormValues,
  formatOrganizationalUnitPayload
} from '../utils/organizationsunits';
import { Spinner } from '@/components/spinner';
import { ArrowRight, Building, Save } from 'lucide-react';
import Link from 'next/link';

interface OrganizationsUnitsFormProps {
  initialData?: IOrganizationalUnitDetails | null;
  pageTitle: string;
  parentUnits?: IOrganizationalUnitList[];
}

export default function OrganizationsUnitsForm({
  initialData,
  pageTitle,
  parentUnits = []
}: OrganizationsUnitsFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { authApiCall } = useAuthApi();

  // Initial values
  const defaultValues: Partial<OrganizationalUnitFormValues> = initialData
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
    : {
        unitName: '',
        unitCode: '',
        unitDescription: '',
        email: '',
        phoneNumber: '',
        address: '',
        postalCode: '',
        unitLogo: ''
      };

  const form = useForm<OrganizationalUnitFormValues>({
    resolver: zodResolver(formSchema(initialData)),
    defaultValues
  });

  const onSubmit = async (data: OrganizationalUnitFormValues) => {
    try {
      setLoading(true);

      if (initialData?.id) {
        const payload = formatOrganizationalUnitPayload(data);

        const response = await authApiCall(() =>
          organizationsUnitsService.updateOrganizationalUnit(
            initialData.id,
            payload
          )
        );

        if (response) {
          toast.success('تم تعديل الوحدة التنظيمية بنجاح!');
          router.push('/system/organizationsunits');
          router.refresh();
        } else {
          toast.error('فشل في تعديل الوحدة التنظيمية!');
        }
      } else {
        const payload = formatOrganizationalUnitPayload(data);

        const response = await authApiCall(() =>
          organizationsUnitsService.createOrganizationalUnit(payload)
        );

        if (response) {
          toast.success('تم إنشاء الوحدة التنظيمية بنجاح!');
          router.push('/system/organizationsunits');
          router.refresh();
        } else {
          toast.error('فشل في إنشاء الوحدة التنظيمية!');
        }
      }
    } catch (error) {
      console.error(error);
      toast.error('حدث خطأ أثناء حفظ البيانات!');
    } finally {
      setLoading(false);
    }
  };

  // Filter out current unit from parent units in edit mode to avoid cyclic parent-child relation
  const availableParents = parentUnits.filter(
    (u) => !initialData?.id || u.id !== initialData.id
  );

  return (
    <div className='flex flex-col space-y-6'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <Link
            href='/system/organizationsunits'
            className='text-muted-foreground hover:text-foreground flex items-center gap-1 text-sm'
          >
            <ArrowRight className='h-4 w-4' />
            العودة للقائمة
          </Link>
          <Separator orientation='vertical' className='h-4' />
          <h1 className='text-2xl font-bold tracking-tight'>{pageTitle}</h1>
        </div>
      </div>

      <Card className='w-full'>
        <CardHeader>
          <CardTitle className='flex items-center gap-2 text-xl'>
            <Building className='h-5 w-5 text-primary' />
            بيانات الوحدة التنظيمية
          </CardTitle>
          <CardDescription>
            يرجى إدخال تفاصيل الوحدة أو الجهة الإدارية
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Separator className='mb-6' />
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className='w-full space-y-6'
            >
              <div className='grid gap-6 md:grid-cols-2'>
                <FormField
                  control={form.control}
                  name='unitName'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>اسم الوحدة / الجهة <span className='text-destructive'>*</span></FormLabel>
                      <FormControl>
                        <Input
                          placeholder='أدخل اسم الوحدة أو القسم...'
                          {...field}
                          value={field.value || ''}
                        />
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
                      <FormLabel>رمز الوحدة (Code) <span className='text-destructive'>*</span></FormLabel>
                      <FormControl>
                        <Input
                          placeholder='مثال: HR, FIN, IT...'
                          {...field}
                          value={field.value || ''}
                        />
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
                      <FormLabel>الجهة الأم (التسلسل الإداري)</FormLabel>
                      <Select
                        onValueChange={(val) =>
                          field.onChange(val === 'none' ? undefined : val)
                        }
                        value={field.value || 'none'}
                      >
                        <FormControl className='w-full'>
                          <SelectTrigger>
                            <SelectValue placeholder='اختر الجهة الأم (اختياري)' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value='none'>بدون جهة أم (جهة رئيسية)</SelectItem>
                          {availableParents.map((unit) => (
                            <SelectItem key={unit.id} value={unit.id}>
                              {unit.unitName} ({unit.unitCode})
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
                  name='unitLevel'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>المستوى الإداري</FormLabel>
                      <FormControl>
                        <Input
                          type='number'
                          min={1}
                          placeholder='مثال: 1, 2, 3...'
                          {...field}
                          value={field.value ?? ''}
                          onChange={(e) => {
                            const val = parseInt(e.target.value, 10);
                            field.onChange(isNaN(val) ? undefined : val);
                          }}
                        />
                      </FormControl>
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
                          placeholder='unit@organization.gov.iq'
                          {...field}
                          value={field.value || ''}
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
                        <Input
                          placeholder='أدخل رقم الهاتف للتواصل...'
                          {...field}
                          value={field.value || ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='address'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>العنوان / الموقع</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='مثال: المبنى الرئيسي - الطابق الثاني'
                          {...field}
                          value={field.value || ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='postalCode'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>الرمز البريدي</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='أدخل الرمز البريدي...'
                          {...field}
                          value={field.value || ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name='unitDescription'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الوصف والمهام</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='أدخل نبذة مختصرة عن مهام واختصاصات الوحدة التنظيمية...'
                        rows={4}
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className='flex items-center justify-end gap-3 pt-4'>
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => router.push('/system/organizationsunits')}
                  disabled={loading}
                >
                  إلغاء
                </Button>
                <Button type='submit' disabled={loading} className='gap-2'>
                  {loading ? (
                    <Spinner className='h-4 w-4' />
                  ) : (
                    <Save className='h-4 w-4' />
                  )}
                  {initialData ? 'حفظ التعديلات' : 'إنشاء الوحدة'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
