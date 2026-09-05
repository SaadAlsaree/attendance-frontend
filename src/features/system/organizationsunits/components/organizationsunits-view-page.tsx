'use client';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Heading } from '@/components/ui/heading';
import { useParams, useRouter } from 'next/navigation';
import {
  Users,
  Building,
  User,
  Mail,
  Phone,
  MapPin,
  Hash,
  ArrowRight,
  Edit,
  Calendar
} from 'lucide-react';
import { IOrganizationalUnitDetails } from '../types/organizationsunits';
import { formatDate } from '../utils/organizationsunits';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

interface OrganizationsUnitsViewProps {
  data: IOrganizationalUnitDetails;
}

export default function OrganizationsUnitsViewPage({
  data
}: OrganizationsUnitsViewProps) {
  const router = useRouter();
  const params = useParams();

  if (!data) {
    return (
      <div className='flex flex-col items-center justify-center p-12 text-center'>
        <p className='text-muted-foreground mb-4 text-lg'>
          لم يتم العثور على بيانات الوحدة التنظيمية
        </p>
        <Button
          variant='outline'
          onClick={() => router.push('/system/organizationsunits')}
        >
          العودة للقائمة
        </Button>
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-6 p-6'>
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
          <div>
            <Heading
              title={data.unitName || 'تفاصيل الوحدة'}
              description={`رمز الوحدة: ${data.unitCode || '-'}`}
            />
          </div>
        </div>
        <Button
          onClick={() =>
            router.push(`/system/organizationsunits/${params.id || data.id}/edit`)
          }
          className='gap-2'
        >
          <Edit className='h-4 w-4' />
          تعديل البيانات
        </Button>
      </div>

      <Separator />

      <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
        {/* Basic Info Card */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2 text-base'>
              <Building className='h-5 w-5 text-primary' />
              المعلومات الأساسية
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <dl className='space-y-3 text-sm'>
              <div className='flex justify-between border-b pb-2'>
                <dt className='text-muted-foreground'>اسم الوحدة / الجهة:</dt>
                <dd className='font-medium'>{data.unitName || '-'}</dd>
              </div>
              <div className='flex justify-between border-b pb-2'>
                <dt className='text-muted-foreground'>الرمز الإداري:</dt>
                <dd className='font-mono font-semibold'>
                  <Badge variant='outline'>{data.unitCode || '-'}</Badge>
                </dd>
              </div>
              <div className='flex justify-between border-b pb-2'>
                <dt className='text-muted-foreground'>الجهة الأم:</dt>
                <dd className='font-medium'>
                  {data.parentUnitName ? (
                    data.parentUnitName
                  ) : (
                    <Badge variant='secondary'>جهة رئيسية</Badge>
                  )}
                </dd>
              </div>
              <div className='flex justify-between border-b pb-2'>
                <dt className='text-muted-foreground'>المستوى الإداري:</dt>
                <dd className='font-medium'>
                  {data.unitLevel ? `المستوى ${data.unitLevel}` : '-'}
                </dd>
              </div>
              <div className='flex justify-between pb-1'>
                <dt className='text-muted-foreground'>المدير المسؤول:</dt>
                <dd className='font-medium flex items-center gap-1'>
                  <User className='h-4 w-4 text-muted-foreground' />
                  {data.managerName || 'غير محدد'}
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        {/* Contact and Location Card */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2 text-base'>
              <MapPin className='h-5 w-5 text-primary' />
              معلومات الاتصال والموقع
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <dl className='space-y-3 text-sm'>
              <div className='flex justify-between border-b pb-2'>
                <dt className='text-muted-foreground flex items-center gap-1'>
                  <Mail className='h-4 w-4 text-sky-600' />
                  البريد الإلكتروني:
                </dt>
                <dd className='font-medium'>{data.email || '-'}</dd>
              </div>
              <div className='flex justify-between border-b pb-2'>
                <dt className='text-muted-foreground flex items-center gap-1'>
                  <Phone className='h-4 w-4 text-emerald-600' />
                  رقم الهاتف:
                </dt>
                <dd className='font-mono font-medium'>{data.phoneNumber || '-'}</dd>
              </div>
              <div className='flex justify-between border-b pb-2'>
                <dt className='text-muted-foreground flex items-center gap-1'>
                  <MapPin className='h-4 w-4 text-red-600' />
                  العنوان:
                </dt>
                <dd className='font-medium'>{data.address || '-'}</dd>
              </div>
              <div className='flex justify-between pb-1'>
                <dt className='text-muted-foreground flex items-center gap-1'>
                  <Hash className='h-4 w-4 text-muted-foreground' />
                  الرمز البريدي:
                </dt>
                <dd className='font-mono font-medium'>{data.postalCode || '-'}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        {/* Statistics Card */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2 text-base'>
              <Users className='h-5 w-5 text-primary' />
              إحصائيات الهيكل
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-2 gap-4'>
              <div className='bg-muted/50 flex flex-col items-center justify-center rounded-lg p-4'>
                <Users className='mb-2 h-6 w-6 text-emerald-600' />
                <span className='text-2xl font-bold'>{data.employeeCount ?? 0}</span>
                <span className='text-muted-foreground text-xs'>إجمالي الموظفين</span>
              </div>
              <div className='bg-muted/50 flex flex-col items-center justify-center rounded-lg p-4'>
                <Building className='mb-2 h-6 w-6 text-indigo-600' />
                <span className='text-2xl font-bold'>{data.childUnitCount ?? 0}</span>
                <span className='text-muted-foreground text-xs'>الوحدات الفرعية</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Description & Metadata Card */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2 text-base'>
              <Calendar className='h-5 w-5 text-primary' />
              الوصف وسجل النظام
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4 text-sm'>
            <div>
              <span className='text-muted-foreground font-medium'>الوصف والمهام:</span>
              <p className='text-muted-foreground mt-1 rounded-md bg-muted/30 p-2.5 leading-relaxed'>
                {data.unitDescription || 'لا يوجد وصف مضاف.'}
              </p>
            </div>
            <Separator />
            <div className='flex justify-between text-xs text-muted-foreground'>
              <span>تاريخ الإنشاء: {formatDate(data.createdAt)}</span>
              {data.updatedAt && (
                <span>آخر تحديث: {formatDate(data.updatedAt)}</span>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
