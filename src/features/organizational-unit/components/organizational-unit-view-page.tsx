'use client';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Heading } from '@/components/ui/heading';
import { useParams, useRouter } from 'next/navigation';
import moment from 'moment';
import { Users, Building, User, Mail, Phone, MapPin, Hash } from 'lucide-react';
import { IOrganizationalUnitDetails } from '../types/organizational';

interface OrganizationalUnitViewProps {
  data: IOrganizationalUnitDetails;
}

export default function OrganizationalUnitViewPage({
  data
}: OrganizationalUnitViewProps) {
  const router = useRouter();
  const params = useParams();

  return (
    <div className='flex flex-col gap-4 p-6'>
      <div className='flex items-center justify-between'>
        <Heading
          title={data.unitName || 'الجهة'}
          description={`عرض تفاصيل الجهة  ${data.unitCode || ''}`}
        />
        <Button
          onClick={() => router.push(`/organizational-unit/${params.id}/edit`)}
        >
          تعديل
        </Button>
      </div>
      <Separator />

      <div className='mt-4 grid grid-cols-1 gap-6 md:grid-cols-2'>
        <div className='space-y-4'>
          <div>
            <h3 className='text-lg font-medium'>المعلومات الأساسية</h3>
            <Separator className='my-2' />
            <dl className='space-y-2'>
              <div className='flex justify-between py-1'>
                <dt className='font-medium text-gray-500'>الاسم:</dt>
                <dd>{data.unitName || '-'}</dd>
              </div>
              <div className='flex justify-between py-1'>
                <dt className='font-medium text-gray-500'>الكود:</dt>
                <dd>{data.unitCode || '-'}</dd>
              </div>
              <div className='flex justify-between py-1'>
                <dt className='font-medium text-gray-500'>الجهة الأم:</dt>
                <dd>{data.parentUnitName || 'جهة رئيسية'}</dd>
              </div>
              <div className='flex justify-between py-1'>
                <dt className='font-medium text-gray-500'>المستوى:</dt>
                <dd>{data.unitLevel ? `المستوى ${data.unitLevel}` : '-'}</dd>
              </div>
            </dl>
          </div>

          <div>
            <h3 className='text-lg font-medium'>إحصائيات الجهة</h3>
            <Separator className='my-2' />
            <dl className='space-y-2'>
              <div className='flex justify-between py-1'>
                <dt className='flex items-center gap-1 font-medium text-gray-500'>
                  <Users className='h-4 w-4 text-green-600' />
                  عدد الموظفين:
                </dt>
                <dd>{data.employeeCount || 0}</dd>
              </div>
              <div className='flex justify-between py-1'>
                <dt className='flex items-center gap-1 font-medium text-gray-500'>
                  <Building className='h-4 w-4 text-blue-600' />
                  الجهات الفرعية:
                </dt>
                <dd>{data.childUnitCount || 0}</dd>
              </div>
            </dl>
          </div>

          <div>
            <h3 className='text-lg font-medium'>المدير</h3>
            <Separator className='my-2' />
            <dl className='space-y-2'>
              <div className='flex justify-between py-1'>
                <dt className='flex items-center gap-1 font-medium text-gray-500'>
                  <User className='h-4 w-4 text-gray-600' />
                  المدير:
                </dt>
                <dd>{data.managerName || 'غير محدد'}</dd>
              </div>
            </dl>
          </div>
        </div>

        <div className='space-y-4'>
          <div>
            <h3 className='text-lg font-medium'>المعلومات الاتصالية</h3>
            <Separator className='my-2' />
            <dl className='space-y-2'>
              <div className='flex justify-between py-1'>
                <dt className='flex items-center gap-1 font-medium text-gray-500'>
                  <Mail className='h-4 w-4 text-blue-600' />
                  البريد الإلكتروني:
                </dt>
                <dd>{data.email || '-'}</dd>
              </div>
              <div className='flex justify-between py-1'>
                <dt className='flex items-center gap-1 font-medium text-gray-500'>
                  <Phone className='h-4 w-4 text-green-600' />
                  رقم الهاتف:
                </dt>
                <dd>{data.phoneNumber || '-'}</dd>
              </div>
            </dl>
          </div>

          <div>
            <h3 className='text-lg font-medium'>العنوان</h3>
            <Separator className='my-2' />
            <dl className='space-y-2'>
              <div className='flex justify-between py-1'>
                <dt className='flex items-center gap-1 font-medium text-gray-500'>
                  <MapPin className='h-4 w-4 text-red-600' />
                  العنوان:
                </dt>
                <dd>{data.address || '-'}</dd>
              </div>
              {data.postalCode && (
                <div className='flex justify-between py-1'>
                  <dt className='flex items-center gap-1 font-medium text-gray-500'>
                    <Hash className='h-4 w-4 text-gray-600' />
                    الرمز البريدي:
                  </dt>
                  <dd>{data.postalCode}</dd>
                </div>
              )}
            </dl>
          </div>
        </div>
      </div>

      <div className='mt-4'>
        <h3 className='text-lg font-medium'>الوصف</h3>
        <Separator className='my-2' />
        <p className='text-gray-700'>
          {data.unitDescription || 'لا يوجد وصف.'}
        </p>
      </div>

      <div className='mt-4'>
        <h3 className='text-lg font-medium'>المعلومات الإضافية</h3>
        <Separator className='my-2' />
        <dl className='space-y-2'>
          <div className='flex justify-between py-1'>
            <dt className='font-medium text-gray-500'>تاريخ الإنشاء:</dt>
            <dd>{moment(data.createdAt).format('YYYY-MM-DD')}</dd>
          </div>
          {data.updatedAt && (
            <div className='flex justify-between py-1'>
              <dt className='font-medium text-gray-500'>آخر تحديث:</dt>
              <dd>{moment(data.updatedAt).format('YYYY-MM-DD')}</dd>
            </div>
          )}
        </dl>
      </div>

      <div className='mt-6 flex justify-end gap-2'>
        <Button
          variant='outline'
          onClick={() => router.push('/organizational-unit')}
        >
          العودة للقائمة
        </Button>
        <Button
          onClick={() => router.push(`/organizational-unit/${params.id}/edit`)}
        >
          تعديل
        </Button>
      </div>
    </div>
  );
}
