'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { LogIn, X, Loader2, MapPin, Clock } from 'lucide-react';
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
import { CheckInRequest, LogMethod } from '../types/attendance';
import { checkInSchema } from '../utils/validation';
import { attendanceService } from '../api/attendance.service';
import { useAuthApi } from '@/hooks/use-auth-api';
import { AttendanceResponse } from '../types/attendance';
import moment from 'moment';

type Employee = { id: string; name: string };

interface CheckInFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  attendance: AttendanceResponse;
  onSuccess?: () => void;
  employees: Employee[];
}

// Change checkInTime to string in CheckInFormData
type CheckInFormData = {
  employeeId: string;
  location: string;
  latitude: number;
  longitude: number;
  checkInTime: string; // <-- changed from Date to string
  logMethod: LogMethod;
  notes: string;
};

export default function CheckInFormDialog({
  isOpen,
  onClose,
  attendance,
  onSuccess,
  employees
}: CheckInFormDialogProps) {
  const [loading, setLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const [locationError, setLocationError] = useState<string>('');
  const { authApiCall } = useAuthApi();
  // 1. أضف متغير حالة جديد
  const [checkInTime, setCheckInTime] = useState<string>(
    moment(new Date()).format('MM/DD/YYYY')
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch
  } = useForm<CheckInFormData>({
    resolver: zodResolver(checkInSchema),
    defaultValues: {
      employeeId: '',
      location: '',
      latitude: 0,
      longitude: 0,
      checkInTime: checkInTime, // استخدم متغير الحالة
      logMethod: LogMethod.Web,
      notes: ''
    }
  });

  // 2. عند فتح النموذج، حدّث checkInTime وأعد ضبط النموذج
  useEffect(() => {
    if (isOpen) {
      const now = moment(new Date()).format('MM/DD/YYYY');
      setCheckInTime(now);
      reset({
        employeeId: '',
        location: '',
        latitude: 0,
        longitude: 0,
        checkInTime: now,
        logMethod: LogMethod.Web,
        notes: ''
      });
    }
  }, [isOpen, reset]);

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
  }, [isOpen]);

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('متصفحك لا يدعم تحديد الموقع');
      return;
    }

    // تحقق من البروتوكول
    if (
      window.location.protocol !== 'https:' &&
      window.location.hostname !== 'localhost' &&
      window.location.hostname !== '127.0.0.1'
    ) {
      setLocationError(
        'تحديد الموقع يعمل فقط عبر HTTPS أو localhost. يرجى فتح الموقع عبر اتصال آمن.'
      );
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
        let errorMsg = 'فشل في تحديد الموقع';
        if (error.code === 1)
          errorMsg =
            'تم رفض إذن تحديد الموقع من المتصفح. يرجى السماح بالوصول للموقع.';
        if (error.code === 2)
          errorMsg =
            'تعذر تحديد الموقع. تحقق من اتصال الإنترنت أو حاول مرة أخرى.';
        if (error.code === 3)
          errorMsg = 'انتهت مهلة تحديد الموقع. حاول مجددًا.';
        setLocationError(errorMsg);
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  // 3. عند تحديث الموقع، لا تحدّث checkInTime
  useEffect(() => {
    if (location) {
      setValue('latitude', location.lat);
      setValue('longitude', location.lng);
      // لا تحدّث checkInTime هنا
    }
  }, [location, setValue]);

  // تحقق من صحة الإحداثيات
  const isValidCoordinates = (lat: number, lng: number) => {
    return (
      typeof lat === 'number' &&
      typeof lng === 'number' &&
      !isNaN(lat) &&
      !isNaN(lng) &&
      lat !== 0 &&
      lng !== 0 &&
      lat >= -90 &&
      lat <= 90 &&
      lng >= -180 &&
      lng <= 180
    );
  };

  const onSubmit = async (data: CheckInFormData) => {
    // تحقق من صحة الإحداثيات قبل الإرسال
    if (!isValidCoordinates(data.latitude, data.longitude)) {
      toast.error('إحداثيات الموقع غير صالحة. يرجى تحديد الموقع بشكل صحيح.');
      return;
    }
    if (!data.employeeId) {
      toast.error('يجب اختيار الموظف قبل تسجيل الدخول.');
      return;
    }
    try {
      setLoading(true);

      // استخدام الوقت الحالي بتنسيق ISO 8601
      const currentDateIso = new Date().toISOString();

      const checkInData: CheckInRequest = {
        employeeId: parseInt(data.employeeId),
        attendanceId: attendance.id,
        checkInTime: currentDateIso, // استخدام الوقت الحالي بتنسيق ISO
        location: data.location,
        latitude: data.latitude,
        longitude: data.longitude,
        logMethod: data.logMethod.toString(),
        notes: data.notes || undefined
      };

      const response = await authApiCall(async () =>
        attendanceService.checkInClient(checkInData)
      );

      if (response) {
        toast.success('تم تسجيل الدخول بنجاح');
        reset();
        onSuccess?.();
        onClose();
      } else {
        toast.error('فشل في تسجيل الدخول أو تم التسجيل مسبقا');
      }
    } catch (error) {
      toast.error('حدث خطأ أثناء تسجيل الدخول');
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
            تسجيل الدخول
            <LogIn className='h-5 w-5 text-blue-600' />
          </DialogTitle>
          <DialogDescription>
            تسجيل دخول الموظف مع تحديد الموقع والوقت
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
            </div>
            <Separator className='my-3' />
            <div className='flex items-center gap-2'>
              <Clock className='text-muted-foreground h-4 w-4' />
              <span className='text-sm font-medium'>
                الوقت الحالي (UTC):{' '}
                {moment(currentTime).utc().format('HH:mm:ss')}
              </span>
            </div>
            <div className='flex items-center gap-2'>
              <Clock className='text-muted-foreground h-4 w-4' />
              <span className='text-sm font-medium'>
                تاريخ التسجيل: {moment(currentTime).format('MM/DD/YYYY')}
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
                {loading ? (
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                ) : (
                  <MapPin className='mr-2 h-4 w-4' />
                )}
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
              <div className='text-destructive text-sm'>
                {locationError}
                <div className='mt-2'>
                  <Button
                    type='button'
                    size='sm'
                    variant='secondary'
                    onClick={getCurrentLocation}
                    disabled={loading}
                  >
                    {loading ? (
                      <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    ) : (
                      <MapPin className='mr-2 h-4 w-4' />
                    )}
                    إعادة المحاولة
                  </Button>
                </div>
                {/* إدخال يدوي للإحداثيات عند الفشل المتكرر */}
                <div className='mt-3 grid grid-cols-2 gap-2'>
                  <div>
                    <Label htmlFor='manual-lat'>خط العرض (يدوي)</Label>
                    <Input
                      id='manual-lat'
                      type='number'
                      step='any'
                      {...register('latitude', { valueAsNumber: true })}
                      placeholder='مثال: 24.7136'
                    />
                  </div>
                  <div>
                    <Label htmlFor='manual-lng'>خط الطول (يدوي)</Label>
                    <Input
                      id='manual-lng'
                      type='number'
                      step='any'
                      {...register('longitude', { valueAsNumber: true })}
                      placeholder='مثال: 46.6753'
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className='text-muted-foreground text-sm'>
                جاري تحديد الموقع...
              </div>
            )}
          </div>

          {/* Check-in Form */}
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
                placeholder='أضف ملاحظات حول تسجيل الدخول...'
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
                className='bg-blue-600 hover:bg-blue-700'
              >
                {loading ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    جاري التسجيل...
                  </>
                ) : (
                  <>
                    <LogIn className='mr-2 h-4 w-4' />
                    تسجيل الدخول
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
