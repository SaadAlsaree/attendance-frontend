'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  User,
  Shield,
  Building,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  Key
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { UserPermission, getRoleDisplayName } from '../types/users-permissions';
import { formatDate } from '@/lib/format';

interface UsersPermissionsViewPageProps {
  data: UserPermission;
}

export default function UsersPermissionsViewPage({
  data
}: UsersPermissionsViewPageProps) {
  const router = useRouter();

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>تفاصيل المستخدم</h2>
          <p className='text-muted-foreground'>
            عرض تفاصيل المستخدم: {data.userLogin}
          </p>
        </div>
        <div className='flex gap-2'>
          <Button
            onClick={() =>
              router.push(`/system/users-permissions/${data.id}/edit`)
            }
          >
            تعديل المستخدم
          </Button>
          <Button
            variant='outline'
            onClick={() =>
              router.push(`/system/users-permissions/${data.id}/change-role`)
            }
          >
            تغيير الدور
          </Button>
        </div>
      </div>

      <div className='grid gap-4 md:grid-cols-2'>
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <User className='h-5 w-5' />
              معلومات المستخدم الأساسية
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <p className='text-muted-foreground text-sm font-medium'>
                  اسم المستخدم
                </p>
                <p className='text-sm'>{data.userLogin}</p>
              </div>
              <div>
                <p className='text-muted-foreground text-sm font-medium'>
                  معرف المستخدم
                </p>
                <p className='font-mono text-sm'>{data.id}</p>
              </div>
              <div>
                <p className='text-muted-foreground text-sm font-medium'>
                  الحالة
                </p>
                <Badge variant={data.isActive ? 'default' : 'secondary'}>
                  {data.isActive ? 'نشط' : 'غير نشط'}
                </Badge>
              </div>
              <div>
                <p className='text-muted-foreground text-sm font-medium'>
                  الحالة العامة
                </p>
                <Badge variant='outline'>
                  {data.status === 1 ? 'مفعل' : 'غير مفعل'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Shield className='h-5 w-5' />
              معلومات الصلاحيات
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <p className='text-muted-foreground text-sm font-medium'>
                  الدور
                </p>
                <Badge variant='outline'>{getRoleDisplayName(data.role)}</Badge>
              </div>
              <div>
                <p className='text-muted-foreground text-sm font-medium'>
                  رمز الدور
                </p>
                <p className='text-sm'>{data.role}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Building className='h-5 w-5' />
              معلومات الوحدة التنظيمية
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <p className='text-muted-foreground text-sm font-medium'>
                  اسم الوحدة
                </p>
                <p className='text-sm'>{data.organizationalUnitName}</p>
              </div>
              <div>
                <p className='text-muted-foreground text-sm font-medium'>
                  رمز الوحدة
                </p>
                <p className='text-sm'>{data.organizationalUnitCode}</p>
              </div>
              <div>
                <p className='text-muted-foreground text-sm font-medium'>
                  معرف الوحدة
                </p>
                <p className='font-mono text-sm'>{data.organizationalUnitId}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Clock className='h-5 w-5' />
              معلومات النشاط
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <p className='text-muted-foreground text-sm font-medium'>
                  تاريخ الإنشاء
                </p>
                <p className='text-sm'>{formatDate(data.createdAt)}</p>
              </div>
              <div>
                <p className='text-muted-foreground text-sm font-medium'>
                  آخر تسجيل دخول
                </p>
                <p className='text-sm'>
                  {data.lastLoginDate
                    ? formatDate(data.lastLoginDate)
                    : 'لم يسجل دخول'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Key className='h-5 w-5' />
              إجراءات إضافية
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='flex flex-col gap-2'>
              <Button
                variant='outline'
                className='justify-start'
                onClick={() =>
                  router.push(
                    `/system/users-permissions/${data.id}/reset-password`
                  )
                }
              >
                <Key className='mr-2 h-4 w-4' />
                إعادة تعيين كلمة المرور
              </Button>
              <Button
                variant='outline'
                className='justify-start'
                onClick={() =>
                  router.push(
                    `/system/users-permissions/${data.id}/change-role`
                  )
                }
              >
                <Shield className='mr-2 h-4 w-4' />
                تغيير الدور
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
