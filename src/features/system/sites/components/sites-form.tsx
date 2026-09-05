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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import Link from 'next/link';
import { ArrowRight, MapPin, Save } from 'lucide-react';
import { Spinner } from '@/components/spinner';
import { ISiteDetails } from '../types/sites';
import { IOrganizationalUnitList } from '@/features/system/organizationsunits/types/organizationsunits';
import { sitesService } from '../api/sites.service';
import { siteFormSchema, SiteFormValues } from '../utils/sites';

interface SitesFormProps {
  initialData?: ISiteDetails | null;
  pageTitle: string;
  organizationalUnits?: IOrganizationalUnitList[];
}

export default function SitesForm({
  initialData,
  pageTitle,
  organizationalUnits = []
}: SitesFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [unitSearch, setUnitSearch] = useState('');

  const defaultValues: SiteFormValues = {
    siteName: initialData?.siteName ?? '',
    siteCode: initialData?.siteCode ?? '',
    description: initialData?.description ?? '',
    address: initialData?.address ?? '',
    isActive: initialData?.isActive ?? true,
    organizationalUnitIds:
      initialData?.organizationalUnits?.map((unit) => unit.id) ?? []
  };

  const form = useForm<SiteFormValues>({
    resolver: zodResolver(siteFormSchema),
    defaultValues
  });

  const selectedUnitIds = form.watch('organizationalUnitIds');

  const filteredUnits = useMemo(() => {
    const term = unitSearch.trim().toLowerCase();

    if (!term) {
      return organizationalUnits;
    }

    return organizationalUnits.filter(
      (unit) =>
        unit.unitName?.toLowerCase().includes(term) ||
        unit.unitCode?.toLowerCase().includes(term)
    );
  }, [organizationalUnits, unitSearch]);

  // Ticking a unit adds ONLY that unit. Its child units are deliberately left alone: site
  // membership is explicit and non-transitive, so no cascade selection here.
  const toggleUnit = (unitId: string, checked: boolean) => {
    const current = form.getValues('organizationalUnitIds');
    form.setValue(
      'organizationalUnitIds',
      checked
        ? [...current, unitId]
        : current.filter((id) => id !== unitId),
      { shouldDirty: true }
    );
  };

  const onSubmit = async (values: SiteFormValues) => {
    setLoading(true);

    try {
      const payload = {
        siteName: values.siteName,
        siteCode: values.siteCode,
        description: values.description || null,
        address: values.address || null,
        isActive: values.isActive
      };

      // Details and membership are two separate calls because they are two separate commands on
      // the API: a form that did not know about units must not be able to clear them.
      const siteId = initialData
        ? (await sitesService.updateSiteClient(initialData.id, payload),
          initialData.id)
        : await sitesService.createSiteClient(payload);

      if (!siteId) {
        toast.error('تعذّر حفظ الموقع');
        return;
      }

      await sitesService.setSiteUnitsClient(siteId, {
        organizationalUnitIds: values.organizationalUnitIds
      });

      toast.success(initialData ? 'تم تحديث الموقع' : 'تم إنشاء الموقع');
      router.push('/system/sites');
      router.refresh();
    } catch (error) {
      console.error('Error saving site:', error);
      toast.error('حدث خطأ أثناء حفظ الموقع');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className='mx-auto w-full'>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <MapPin className='h-5 w-5' />
            <CardTitle className='text-right text-2xl font-bold'>
              {pageTitle}
            </CardTitle>
          </div>
          <Button variant='outline' asChild>
            <Link href='/system/sites'>
              <ArrowRight className='ml-2 h-4 w-4' />
              رجوع
            </Link>
          </Button>
        </div>
        <CardDescription className='text-right'>
          الموقع يضم وحدة أو أكثر. اختيار وحدة لا يُضيف تفرعاتها تلقائياً — أضفها
          بنفسك إن أردتها ضمن الموقع.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
              <FormField
                control={form.control}
                name='siteName'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>اسم الموقع</FormLabel>
                    <FormControl>
                      <Input placeholder='مثال: موقع الشمال' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='siteCode'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>رمز الموقع</FormLabel>
                    <FormControl>
                      <Input placeholder='مثال: NORTH' {...field} />
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
                    <FormLabel>العنوان</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value ?? ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='isActive'
                render={({ field }) => (
                  <FormItem className='flex flex-row items-center justify-between rounded-lg border p-3'>
                    <FormLabel>الموقع مُفعّل</FormLabel>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>الوصف</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={3}
                      {...field}
                      value={field.value ?? ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Separator />

            <FormField
              control={form.control}
              name='organizationalUnitIds'
              render={() => (
                <FormItem>
                  <div className='mb-2 flex items-center justify-between'>
                    <FormLabel>الوحدات التابعة للموقع</FormLabel>
                    <Badge variant='secondary'>
                      {selectedUnitIds.length} وحدة مختارة
                    </Badge>
                  </div>

                  <Input
                    placeholder='ابحث باسم الوحدة أو رمزها...'
                    value={unitSearch}
                    onChange={(event) => setUnitSearch(event.target.value)}
                    className='mb-2'
                  />

                  <ScrollArea className='h-72 rounded-md border'>
                    <div className='divide-y'>
                      {filteredUnits.length === 0 ? (
                        <p className='text-muted-foreground p-4 text-sm'>
                          لا توجد وحدات مطابقة
                        </p>
                      ) : (
                        filteredUnits.map((unit) => (
                          <label
                            key={unit.id}
                            className='hover:bg-muted/50 flex cursor-pointer items-center gap-3 p-3'
                          >
                            <Checkbox
                              checked={selectedUnitIds.includes(unit.id)}
                              onCheckedChange={(checked) =>
                                toggleUnit(unit.id, checked === true)
                              }
                            />
                            <div className='flex-1'>
                              <div className='text-sm font-medium'>
                                {unit.unitName}
                                <span className='text-muted-foreground mr-2 text-xs'>
                                  ({unit.unitCode})
                                </span>
                              </div>
                              {unit.parentUnitName && (
                                <div className='text-muted-foreground text-xs'>
                                  ضمن: {unit.parentUnitName}
                                </div>
                              )}
                            </div>
                          </label>
                        ))
                      )}
                    </div>
                  </ScrollArea>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='flex justify-end gap-2'>
              <Button
                type='button'
                variant='outline'
                onClick={() => router.push('/system/sites')}
                disabled={loading}
              >
                إلغاء
              </Button>
              <Button type='submit' disabled={loading}>
                {loading ? (
                  <Spinner />
                ) : (
                  <>
                    <Save className='ml-2 h-4 w-4' />
                    حفظ
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
