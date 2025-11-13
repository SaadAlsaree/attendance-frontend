'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Mail,
  Building2,
  User,
  BadgeCheck,
  Clock,
  Edit,
  ArrowLeft,
  Shield,
  Users,
  QrCode,
  Copy,
  Check
} from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import AddEditEmployeesListing from './employees-listing';
import { EmployeeData } from '../types/employees';

type Props = {
  employeeData: EmployeeData;
};

export default function EmployeesViewPage({ employeeData }: Props) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('view');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'Active':
        return 'green';
      case 'Inactive':
        return 'gray';
      case 'Suspended':
        return 'yellow';
      case 'Terminated':
        return 'red';
      default:
        return 'gray';
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'Admin':
        return 'purple';
      case 'Manager':
        return 'blue';
      case 'Employee':
        return 'green';
      default:
        return 'gray';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getInitials = (firstName: string, familyName: string) => {
    return `${firstName.charAt(0)}${familyName.charAt(0)}`.toUpperCase();
  };

  const copyToClipboard = async (text: string, fieldName: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('فشل في نسخ النص:', err);
    }
  };

  return (
    <div className='flex w-full flex-col gap-6 p-4'>
      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-4'>
              <Button
                variant='ghost'
                size='sm'
                onClick={() => router.back()}
                className='flex items-center gap-2'
              >
                <ArrowLeft className='h-4 w-4' />
                رجوع
              </Button>
              <div>
                <CardTitle>عرض بيانات الموظف</CardTitle>
                <CardDescription>
                  تفاصيل شاملة عن الموظف والمعلومات الأساسية
                </CardDescription>
              </div>
            </div>
            <Button
              onClick={() => router.push(`/employee?edit=${employeeData.id}`)}
              className='flex items-center gap-2'
            >
              <Edit className='h-4 w-4' />
              تعديل
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className='w-full'
          >
            <TabsList className='grid w-full grid-cols-3'>
              <TabsTrigger value='view'>عرض البيانات</TabsTrigger>
              <TabsTrigger value='list'>قائمة الموظفين</TabsTrigger>
              <TabsTrigger value='add'>إضافة موظف جديد</TabsTrigger>
            </TabsList>

            <TabsContent value='view' className='mt-6'>
              <div className='grid gap-6'>
                {/* Employee Header Card */}
                <Card className='border-primary/10 border-2'>
                  <CardContent className='p-6'>
                    <div className='flex flex-col items-start gap-6 md:flex-row md:items-center'>
                      <Avatar className='h-24 w-24'>
                        <AvatarImage
                          src={employeeData.faceImageUrl}
                          alt={employeeData.fullName}
                        />
                        <AvatarFallback className='text-lg font-semibold'>
                          {getInitials(
                            employeeData.firstName,
                            employeeData.familyName
                          )}
                        </AvatarFallback>
                      </Avatar>

                      <div className='flex-1 space-y-3'>
                        <div className='flex flex-col gap-3 md:flex-row md:items-center'>
                          <div className='flex items-center gap-2'>
                            <h2 className='text-foreground text-2xl font-bold'>
                              {employeeData.fullName}
                            </h2>
                            <Button
                              variant='ghost'
                              size='sm'
                              onClick={() =>
                                copyToClipboard(employeeData.fullName, 'name')
                              }
                              className='hover:bg-muted h-8 w-8 p-0'
                              title='نسخ الاسم الكامل'
                            >
                              {copiedField === 'name' ? (
                                <Check className='h-4 w-4 text-green-600' />
                              ) : (
                                <Copy className='text-muted-foreground h-4 w-4' />
                              )}
                            </Button>
                          </div>
                          <div className='flex gap-2'>
                            <Badge
                              variant={getStatusBadgeVariant(
                                employeeData.statusName
                              )}
                            >
                              {employeeData.statusName}
                            </Badge>
                            <Badge
                              variant={getRoleBadgeVariant(
                                employeeData.roleName
                              )}
                            >
                              {employeeData.roleName}
                            </Badge>
                            {employeeData.isManager && (
                              <Badge
                                variant='blue-outline'
                                className='flex items-center gap-1'
                              >
                                <Users className='h-3 w-3' />
                                مدير
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div className='grid grid-cols-1 gap-4 text-sm md:grid-cols-2 lg:grid-cols-4'>
                          <div className='flex items-center gap-2'>
                            <BadgeCheck className='text-muted-foreground h-4 w-4' />
                            <span className='font-medium'>الرقم الوظيفي:</span>
                            <span>{employeeData.code}</span>
                            <Button
                              variant='ghost'
                              size='sm'
                              onClick={() =>
                                copyToClipboard(employeeData.code, 'code')
                              }
                              className='hover:bg-muted h-6 w-6 p-0'
                              title='نسخ الرقم الوظيفي'
                            >
                              {copiedField === 'code' ? (
                                <Check className='h-3 w-3 text-green-600' />
                              ) : (
                                <Copy className='text-muted-foreground h-3 w-3' />
                              )}
                            </Button>
                          </div>
                          <div className='flex items-center gap-2'>
                            <Mail className='text-muted-foreground h-4 w-4' />
                            <span className='font-medium'>
                              البريد الإلكتروني:
                            </span>
                            <span>{employeeData.email}</span>
                            <Button
                              variant='ghost'
                              size='sm'
                              onClick={() =>
                                copyToClipboard(employeeData.email, 'email')
                              }
                              className='hover:bg-muted h-6 w-6 p-0'
                              title='نسخ البريد الإلكتروني'
                            >
                              {copiedField === 'email' ? (
                                <Check className='h-3 w-3 text-green-600' />
                              ) : (
                                <Copy className='text-muted-foreground h-3 w-3' />
                              )}
                            </Button>
                          </div>
                          <div className='flex items-center gap-2'>
                            <QrCode className='text-muted-foreground h-4 w-4' />
                            <span className='font-medium'>RFID:</span>
                            <span className='font-mono'>
                              {employeeData.rfid}
                            </span>
                            <Button
                              variant='ghost'
                              size='sm'
                              onClick={() =>
                                copyToClipboard(employeeData.rfid, 'rfid')
                              }
                              className='hover:bg-muted h-6 w-6 p-0'
                              title='نسخ RFID'
                            >
                              {copiedField === 'rfid' ? (
                                <Check className='h-3 w-3 text-green-600' />
                              ) : (
                                <Copy className='text-muted-foreground h-3 w-3' />
                              )}
                            </Button>
                          </div>
                          <div className='flex items-center gap-2'>
                            <Clock className='text-muted-foreground h-4 w-4' />
                            <span className='font-medium'>تاريخ الإنشاء:</span>
                            <span>{formatDate(employeeData.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Employee Details Grid */}
                <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
                  {/* Personal Information */}
                  <Card>
                    <CardHeader>
                      <CardTitle className='flex items-center gap-2'>
                        <User className='h-5 w-5' />
                        المعلومات الشخصية
                      </CardTitle>
                    </CardHeader>
                    <CardContent className='space-y-4'>
                      <div className='grid grid-cols-2 gap-4'>
                        <div>
                          <label className='text-muted-foreground text-sm font-medium'>
                            الاسم الأول
                          </label>
                          <p className='text-sm'>{employeeData.firstName}</p>
                        </div>
                        <div>
                          <label className='text-muted-foreground text-sm font-medium'>
                            اسم الأب
                          </label>
                          <p className='text-sm'>{employeeData.secondName}</p>
                        </div>
                        <div>
                          <label className='text-muted-foreground text-sm font-medium'>
                            اسم الجد
                          </label>
                          <p className='text-sm'>
                            {employeeData.thirdName || '-'}
                          </p>
                        </div>
                        <div>
                          <label className='text-muted-foreground text-sm font-medium'>
                            اسم الجد الرابع
                          </label>
                          <p className='text-sm'>
                            {employeeData.fourthName || '-'}
                          </p>
                        </div>
                        <div className='col-span-2'>
                          <label className='text-muted-foreground text-sm font-medium'>
                            اسم العائلة
                          </label>
                          <p className='text-sm'>{employeeData.familyName}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Organizational Information */}
                  <Card>
                    <CardHeader>
                      <CardTitle className='flex items-center gap-2'>
                        <Building2 className='h-5 w-5' />
                        المعلومات التنظيمية
                      </CardTitle>
                    </CardHeader>
                    <CardContent className='space-y-4'>
                      <div>
                        <label className='text-muted-foreground text-sm font-medium'>
                          الوحدة التنظيمية
                        </label>
                        <p className='text-sm font-medium'>
                          {employeeData.organizationalUnitName}
                        </p>
                      </div>

                      {employeeData.managerName && (
                        <div>
                          <label className='text-muted-foreground text-sm font-medium'>
                            المدير المباشر
                          </label>
                          <p className='text-sm font-medium'>
                            {employeeData.managerName}
                          </p>
                        </div>
                      )}

                      <div>
                        <label className='text-muted-foreground text-sm font-medium'>
                          الصلاحية
                        </label>
                        <div className='mt-1'>
                          <Badge
                            variant={getRoleBadgeVariant(employeeData.roleName)}
                          >
                            <Shield className='mr-1 h-3 w-3' />
                            {employeeData.roleName}
                          </Badge>
                        </div>
                      </div>

                      <div>
                        <label className='text-muted-foreground text-sm font-medium'>
                          حالة الحساب
                        </label>
                        <div className='mt-1'>
                          <Badge
                            variant={getStatusBadgeVariant(
                              employeeData.statusName
                            )}
                          >
                            {employeeData.statusName}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* System Information */}
                  <Card>
                    <CardHeader>
                      <CardTitle className='flex items-center gap-2'>
                        <Shield className='h-5 w-5' />
                        معلومات النظام
                      </CardTitle>
                    </CardHeader>
                    <CardContent className='space-y-4'>
                      <div>
                        <label className='text-muted-foreground text-sm font-medium'>
                          معرف المستخدم
                        </label>
                        <p className='font-mono text-sm'>
                          {employeeData.userId}
                        </p>
                      </div>
                      <div>
                        <label className='text-muted-foreground text-sm font-medium'>
                          اسم تسجيل الدخول
                        </label>
                        <p className='font-mono text-sm'>
                          {employeeData.userLogin}
                        </p>
                      </div>
                      <div>
                        <label className='text-muted-foreground text-sm font-medium'>
                          معرف الموظف
                        </label>
                        <p className='font-mono text-sm'>{employeeData.id}</p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Quick Actions */}
                  <Card>
                    <CardHeader>
                      <CardTitle className='flex items-center gap-2'>
                        <Edit className='h-5 w-5' />
                        الإجراءات السريعة
                      </CardTitle>
                    </CardHeader>
                    <CardContent className='space-y-3'>
                      <Button
                        className='w-full justify-start'
                        variant='outline'
                        onClick={() =>
                          router.push(`/employee?edit=${employeeData.id}`)
                        }
                      >
                        <Edit className='mr-2 h-4 w-4' />
                        تعديل بيانات الموظف
                      </Button>
                      <Button
                        className='w-full justify-start'
                        variant='outline'
                        onClick={() =>
                          router.push(
                            `/profile/view-profile?id=${employeeData.id}`
                          )
                        }
                      >
                        <User className='mr-2 h-4 w-4' />
                        عرض الملف الشخصي
                      </Button>
                      <Button
                        className='w-full justify-start'
                        variant='outline'
                        onClick={() =>
                          router.push(
                            `/attendance/attendance-logs?employeeId=${employeeData.id}`
                          )
                        }
                      >
                        <Clock className='mr-2 h-4 w-4' />
                        سجل الحضور والانصراف
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value='list' className='mt-6'>
              <AddEditEmployeesListing />
            </TabsContent>

            <TabsContent value='add' className='mt-6'>
              {/* Add employee form will go here */}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
