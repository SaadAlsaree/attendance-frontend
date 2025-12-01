'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuthApi } from '@/hooks/use-auth-api';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { FileUpload } from '@/components/ui/file-upload';
import { RfidReader } from '@/components/ui/rfid-reader';

import {
  EmployeeFormData,
  EmployeeData,
  EmployeeUpdateRequest,
  Role
} from '../types/employees';
import {
  employeeFormSchemaWithCustomValidations,
  newEmployeeFormSchema,
  roleOptions
} from '../utils/employees';
import { Separator } from '@/components/ui/separator';
import { IOrganizationalUnitList } from '@/features/organizational-unit/types/organizational';
import { employeeService } from '../api/employees.service';

interface AddEditEmployeesFormProps {
  initialData?: EmployeeData;
  employeeId?: string; // For editing existing employee
  onSuccess?: () => void;
  organizationalUnits: IOrganizationalUnitList[];
}

export default function AddEditEmployeesForm({
  initialData,
  employeeId,
  onSuccess,
  organizationalUnits
}: AddEditEmployeesFormProps) {
  const router = useRouter();
  const { authApiCall } = useAuthApi();
  const [isLoading, setIsLoading] = useState(false);

  // Memoize existingImages to prevent recreation on every render
  const existingImages = useMemo(
    () => ({
      faceImageUrl: initialData?.faceImageUrl || null
    }),
    [initialData?.faceImageUrl]
  );

  const form = useForm<EmployeeFormData>({
    resolver: zodResolver(
      initialData
        ? employeeFormSchemaWithCustomValidations
        : newEmployeeFormSchema
    ),
    defaultValues: {
      empId: initialData?.empId || '',
      firstName: initialData?.firstName || '',
      secondName: initialData?.secondName || '',
      thirdName: initialData?.thirdName || '',
      fourthName: initialData?.fourthName || '',
      familyName: initialData?.familyName || '',
      rfid: initialData?.rfid || '',
      organizationalUnitId: initialData?.organizationalUnitId || '',
      managerId: initialData?.managerId || '',
      isManager: initialData?.isManager || false,
      role: initialData?.role || Role.Employee,
      faceImage: null
    }
  });

  // Memoize organizational units options to prevent recreation on every render
  const organizationalUnitsOptions = useMemo(
    () =>
      organizationalUnits.map((unit) => ({
        label: unit.unitName,
        value: unit.id
      })),
    [organizationalUnits]
  );

  // Load organizational units and managers
  useEffect(() => {
    const loadDropdownData = async () => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const [unitsResponse, managersResponse] = await Promise.all([
          Promise.resolve({ data: [] }), // Placeholder for units
          Promise.resolve({ data: [] }) // Placeholder for managers
        ]);
      } catch (error) {
        console.error('Error loading dropdown data:', error);
        toast.error('حدث خطأ في تحميل البيانات');
      }
    };

    loadDropdownData();
  }, []); // Remove authApiCall from dependencies to prevent infinite loop

  const onSubmit = async (data: EmployeeFormData) => {
    setIsLoading(true);

    try {
      if (initialData) {
        const updateData: EmployeeUpdateRequest = {
          employeeId: initialData.id.toString(),
          empId: data.empId,
          firstName: data.firstName,
          secondName: data.secondName,
          thirdName: data.thirdName || '',
          fourthName: data.fourthName || '',
          familyName: data.familyName,
          rfid: data.rfid,
          organizationalUnitId: data.organizationalUnitId,
          managerIdString: data.managerId || '',
          isManager: data.isManager
        };

        const response = await authApiCall(
          async () =>
            await employeeService.updateEmployeeClient(
              initialData.id.toString(),
              updateData
            )
        );

        if (response) {
          toast.success('تم تعديل معلومات الموظف بنجاح');
          onSuccess?.();
          router.push('/employee');
        } else {
          toast.error('فشل في تعديل معلومات الموظف');
        }
      } else {
        // Prepare data for registration
        const registrationData = {
          empId: data.empId,
          firstName: data.firstName,
          secondName: data.secondName,
          thirdName: data.thirdName || '',
          fourthName: data.fourthName || '',
          familyName: data.familyName,
          rfid: data.rfid,
          organizationalUnitId: data.organizationalUnitId,
          managerId: data.managerId || undefined,
          isManager: data.isManager,
          role: data.role,
          faceImage: data.faceImage || undefined
        };

        const response = await authApiCall(
          async () =>
            await employeeService.registerEmployeeClient(registrationData)
        );

        if (response) {
          toast.success('تم تسجيل الموظف بنجاح');
          onSuccess?.();
          router.push('/employee');
        } else {
          toast.error('فشل في تسجيل الموظف');
        }
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('حدث خطأ في تسجيل الموظف');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className='mx-auto w-full'>
      <CardHeader>
        <CardTitle>{employeeId ? 'تعديل الموظف' : 'إضافة موظف جديد'}</CardTitle>
        <CardDescription>
          {employeeId ? 'تعديل معلومات الموظف' : 'إدخال معلومات الموظف الجديد'}
        </CardDescription>
        <Separator />
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
            {/* Personal Information Section */}
            <div className='space-y-6'>
              <h3 className='text-lg font-semibold'>المعلومات الشخصية</h3>

              <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
                <FormField
                  control={form.control}
                  name='empId'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>معرف الموظف من الجهاز</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder='معرف الموظف من الجهاز'
                          disabled={initialData?.id ? true : false}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='firstName'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>الاسم الأول</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder='الاسم الأول' />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='secondName'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>الاسم الثاني</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder='الاسم الثاني' />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='thirdName'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>الاسم الثالث</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder='الاسم الثالث' />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='fourthName'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>الاسم الرابع</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder='الاسم الرابع' />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='familyName'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>اسم العائلة</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder='اسم العائلة' />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='rfid'
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <RfidReader
                          value={field.value}
                          onChange={field.onChange}
                          placeholder='رمز RFID'
                          label='رمز RFID'
                          disabled={isLoading || initialData?.id ? true : false}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='organizationalUnitId'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>الجهة</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className='w-full'>
                            <SelectValue placeholder='اختر الجهة' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {organizationalUnitsOptions.map((unit) => (
                            <SelectItem key={unit.value} value={unit.value}>
                              {unit.label}
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
                  name='role'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>الدور</FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange(value as Role)}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className='w-full'>
                            <SelectValue placeholder='اختر الدور' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {roleOptions.map((role) => (
                            <SelectItem key={role.value} value={role.value}>
                              {role.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Work Information Section */}

            {/* File Uploads Section */}
            <div className='space-y-6'>
              <h3 className='text-lg font-semibold'>المرفقات</h3>

              {/* {!initialData && (
                <div className='rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950/20'>
                  <p className='text-sm text-blue-700 dark:text-blue-300'>
                    <strong>ملاحظة:</strong> يجب رفع صورة الوجه للموظف الجديد
                  </p>
                </div>
              )} */}

              {initialData && (
                <div className='rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950/20'>
                  <p className='text-sm text-amber-700 dark:text-amber-300'>
                    <strong>ملاحظة:</strong> يمكنك ترك الصورة فارغة للاحتفاظ
                    بالصورة الحالية، أو رفع صورة جديدة لاستبدالها
                  </p>
                </div>
              )}

              <div className='grid grid-cols-1 gap-6 md:grid-cols-1'>
                <FormField
                  control={form.control}
                  name='faceImage'
                  render={({ field }) => (
                    <div className='space-y-2'>
                      <FileUpload
                        label={
                          initialData ? 'صورة الوجه (اختياري)' : 'صورة الوجه (اختياري)'
                        }
                        value={field.value}
                        onChange={field.onChange}
                        required={false}
                        error={form.formState.errors.faceImage?.message}
                      />
                      {existingImages.faceImageUrl && !field.value && (
                        <div className='bg-muted/50 mt-2 rounded border p-2'>
                          <p className='text-muted-foreground mb-2 text-xs'>
                            الصورة الحالية:
                          </p>
                          <Image
                            src={existingImages.faceImageUrl!}
                            alt='صورة الوجه الحالية'
                            width={100}
                            height={100}
                            className='h-16 w-16 rounded object-cover'
                          />
                        </div>
                      )}
                    </div>
                  )}
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className='flex justify-end space-x-4'>
              <Button
                type='button'
                variant='outline'
                onClick={() => router.back()}
                disabled={isLoading}
              >
                إلغاء
              </Button>
              <Button type='submit' disabled={isLoading}>
                {isLoading ? 'جاري الحفظ...' : initialData ? 'تعديل' : 'حفظ'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
