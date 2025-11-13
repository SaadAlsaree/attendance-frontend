'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { LogOut, X, Loader2, MapPin, Clock } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { CheckOutRequest, LogMethod } from '../types/attendance';
import { checkOutSchema } from '../utils/validation';
import { attendanceService } from '../api/attendance.service';
import { useAuthApi } from '@/hooks/use-auth-api';
import { AttendanceResponse } from '../types/attendance';
import { formatTime } from '../utils/attendance';
import moment from 'moment';

type Employee = { id: string; name: string };

interface CheckOutFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  attendance: AttendanceResponse;
  onSuccess?: () => void;
  employees: Employee[];
}

type CheckOutFormData = {
  employeeId: string;
  location: string;
  latitude: number;
  checkOutTime: string;
  longitude: number;
  logMethod: LogMethod;
  attendanceId: string;
  notes: string;
};

export default function CheckOutFormDialog({
  isOpen,
  onClose,
  attendance,
  onSuccess,
  employees
}: CheckOutFormDialogProps) {
  const [loading, setLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const [locationError, setLocationError] = useState<string>('');
  const { authApiCall } = useAuthApi();
  // 1. أضف متغير حالة جديد
  const [checkOutTime, setCheckOutTime] = useState<string>(
    new Date().toISOString()
  );

  console.log(employees);

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 10000);

    return () => clearInterval(timer);
  }, []);

  // Get current location when dialog opens
  useEffect(() => {
    if (isOpen && !location) {
      getCurrentLocation();
    }
  }, [isOpen, location]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch
  } = useForm<CheckOutFormData>({
    resolver: zodResolver(checkOutSchema),
    defaultValues: {
      employeeId: attendance.employeeId.toString(),
      location: '',
      latitude: 0,
      longitude: 0,
      checkOutTime: checkOutTime, // استخدم متغير الحالة
      logMethod: LogMethod.Web,
      notes: ''
    }
  });

  // 2. عند فتح النموذج، حدّث checkOutTime وأعد ضبط النموذج
  useEffect(() => {
    if (isOpen) {
      const now = new Date().toISOString();
      setCheckOutTime(now);
      reset({
        employeeId: attendance.employeeId.toString(),
        location: '',
        latitude: 0,
        longitude: 0,
        checkOutTime: now,
        logMethod: LogMethod.Web,
        notes: ''
      });
    }
  }, [isOpen, reset, attendance.employeeId]);

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('متصفحك لا يدعم تحديد الموقع');
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        setLocationError('');
        setLoading(false);
      },
      (error) => {
        console.error('Error getting location:', error);
        setLocationError('فشل في تحديد الموقع');
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  // 3. عند تحديث الموقع، لا تحدّث checkOutTime
  useEffect(() => {
    if (location) {
      setValue('latitude', location.lat);
      setValue('longitude', location.lng);
      setValue('checkOutTime', new Date().toISOString());
      setValue('attendanceId', attendance.id);
      // لا تحدّث checkOutTime هنا
    }
  }, [location, setValue, attendance.id]);

  const onSubmit = async (data: CheckOutFormData) => {
    if (!data.employeeId) {
      toast.error('يجب اختيار الموظف قبل تسجيل الخروج.');
      return;
    }
    try {
      setLoading(true);

      const checkOutData: CheckOutRequest = {
        employeeId: parseInt(data.employeeId),
        attendanceId: attendance.id,
        checkOutTime: data.checkOutTime, // استخدم القيمة من النموذج
        location: data.location,
        latitude: data.latitude,
        longitude: data.longitude,
        logMethod: data.logMethod.toString(),
        notes: data.notes || undefined
      };

      const response = await authApiCall(async () =>
        attendanceService.checkOutClient(checkOutData)
      );

      if (response) {
        toast.success('تم تسجيل الخروج بنجاح');
        reset();
        onSuccess?.();
        onClose();
      } else {
        toast.error('فشل في تسجيل الخروج');
      }
    } catch (error) {
      toast.error('حدث خطأ أثناء تسجيل الخروج');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      reset();
      setLocation(null);
      setLocationError('');
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className='sm:max-w-[500px]'>
        <DialogHeader>
          <DialogTitle className='flex items-center justify-end gap-2'>
            تسجيل الخروج
            <LogOut className='h-5 w-5 text-red-600' />
          </DialogTitle>
          <DialogDescription>
            تسجيل خروج الموظف مع تحديد الموقع والوقت
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-4'>
          {/* Attendance Summary */}
          <div className='bg-muted/50 rounded-lg border p-4'>
            <h4 className='mb-3 font-medium'>تفاصيل الحضور</h4>
            <div className='grid grid-cols-2 gap-3 text-sm'>
              <div>
                <span className='text-muted-foreground'>الموظف:</span>
                <p className='font-medium'>
                  {attendance.employeeName || 'غير محدد'}
                </p>
              </div>
              <div>
                <span className='text-muted-foreground'>التاريخ:</span>
                <p className='font-medium'>
                  {moment(attendance.date).utc().format('YYYY-MM-DD')}
                </p>
              </div>
              <div>
                <span className='text-muted-foreground'>وقت الدخول:</span>
                <p className='font-medium'>
                  {attendance.checkInTime
                    ? formatTime(attendance.checkInTime)
                    : 'لم يسجل'}
                </p>
              </div>
              <div>
                <span className='text-muted-foreground'>مدة العمل:</span>
                <p className='font-medium'>
                  {attendance.workingMinutes
                    ? `${Math.floor(attendance.workingMinutes / 60)} ساعة و ${attendance.workingMinutes % 60} دقيقة`
                    : 'غير محدد'}
                </p>
              </div>
            </div>
            <Separator className='my-3' />
            <div className='flex items-center gap-2'>
              <Clock className='text-muted-foreground h-4 w-4' />
              <span className='text-sm font-medium'>
                الوقت الحالي (UTC):{' '}
                {moment(currentTime).utc().format('HH:mm:ss')}
              </span>
            </div>
          </div>

          {/* Location Status */}
          <div className='rounded-lg border p-4'>
            <div className='mb-3 flex items-center justify-between'>
              <h4 className='font-medium'>معلومات الموقع</h4>
              <Button
                type='button'
                variant='outline'
                size='sm'
                onClick={getCurrentLocation}
                disabled={loading}
              >
                <MapPin className='mr-2 h-4 w-4' />
                تحديث الموقع
              </Button>
            </div>

            {location ? (
              <div className='space-y-2'>
                <div className='flex items-center gap-2'>
                  <Badge
                    variant='default'
                    className='bg-green-100 text-green-800'
                  >
                    تم تحديد الموقع
                  </Badge>
                </div>
                <div className='grid grid-cols-2 gap-2 text-sm'>
                  <div>
                    <span className='text-muted-foreground'>خط العرض:</span>
                    <p className='font-mono'>{location.lat.toFixed(6)}</p>
                  </div>
                  <div>
                    <span className='text-muted-foreground'>خط الطول:</span>
                    <p className='font-mono'>{location.lng.toFixed(6)}</p>
                  </div>
                </div>
              </div>
            ) : locationError ? (
              <div className='text-destructive text-sm'>{locationError}</div>
            ) : (
              <div className='text-muted-foreground text-sm'>
                جاري تحديد الموقع...
              </div>
            )}
          </div>

          {/* Check-out Form */}
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
            {/* اختيار الموظف */}
            <div className='space-y-2'>
              <Label htmlFor='employeeId'>الموظف</Label>
              <Select
                value={watch('employeeId')}
                onValueChange={(value) => setValue('employeeId', value)}
              >
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder='اختر الموظف' />
                </SelectTrigger>
                <SelectContent>
                  {employees.map((emp) => (
                    <SelectItem key={emp.id} value={emp.id}>
                      {emp.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.employeeId && (
                <p className='text-destructive text-sm'>يجب اختيار الموظف</p>
              )}
            </div>

            <div className='space-y-2'>
              <Label htmlFor='location'>الموقع</Label>
              <Input
                id='location'
                placeholder='أدخل اسم الموقع أو العنوان...'
                {...register('location')}
              />
              {errors.location && (
                <p className='text-destructive text-sm'>
                  {errors.location.message}
                </p>
              )}
            </div>

            <div className='space-y-2'>
              <Label htmlFor='logMethod'>طريقة التسجيل</Label>
              <Select value={LogMethod.Web.toString()} disabled>
                <SelectTrigger className='w-full'>
                  <SelectValue>ويب</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={LogMethod.Web.toString()}>ويب</SelectItem>
                </SelectContent>
              </Select>
              {errors.logMethod && (
                <p className='text-destructive text-sm'>
                  {errors.logMethod.message}
                </p>
              )}
            </div>

            <div className='space-y-2'>
              <Label htmlFor='notes'>ملاحظات (اختياري)</Label>
              <Textarea
                id='notes'
                placeholder='أضف ملاحظات حول تسجيل الخروج...'
                className='min-h-[80px]'
                {...register('notes')}
              />
              {errors.notes && (
                <p className='text-destructive text-sm'>
                  {errors.notes.message}
                </p>
              )}
            </div>

            <DialogFooter className='gap-2'>
              <Button
                type='button'
                variant='outline'
                onClick={handleClose}
                disabled={loading}
              >
                <X className='mr-2 h-4 w-4' />
                إلغاء
              </Button>
              <Button
                type='submit'
                disabled={loading || !location}
                className='bg-red-600 hover:bg-red-700'
              >
                {loading ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    جاري التسجيل...
                  </>
                ) : (
                  <>
                    <LogOut className='mr-2 h-4 w-4' />
                    تسجيل الخروج
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
