'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Scan, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';

interface RfidReaderProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  className?: string;
}

export function RfidReader({
  value,
  onChange,
  placeholder = 'رمز RFID',
  label = 'رمز RFID',
  disabled = false,
  className = ''
}: RfidReaderProps) {
  const [isReading, setIsReading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Clear success/error states after delay
  useEffect(() => {
    if (isSuccess || isError) {
      timeoutRef.current = setTimeout(() => {
        setIsSuccess(false);
        setIsError(false);
      }, 2000);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isSuccess, isError]);

  const startReading = () => {
    setIsReading(true);
    setIsSuccess(false);
    setIsError(false);
    toast.info('يرجى تمرير البطاقة على القارئ...');

    // Focus on input field
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const stopReading = () => {
    setIsReading(false);
    toast.info('تم إيقاف قراءة RFID');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);

    // If we're reading and we get a value, process it
    if (isReading && newValue.length > 0) {
      processRfidValue(newValue);
    }
  };

  const processRfidValue = (rfidValue: string) => {
    // Validate RFID format (you can customize this based on your RFID format)
    if (rfidValue.length >= 8) {
      setIsReading(false);
      setIsSuccess(true);
      toast.success('تم قراءة رمز RFID بنجاح');

      // Play success sound
      playBeepSound('success');
    } else {
      setIsError(true);
      toast.error('رمز RFID غير صحيح');
      playBeepSound('error');
    }
  };

  const playBeepSound = (type: 'success' | 'error') => {
    if (typeof window !== 'undefined' && 'Audio' in window) {
      try {
        // You can add different sound files for success and error
        const audio = new Audio(
          type === 'success'
            ? '/sounds/success-beep.mp3'
            : '/sounds/error-beep.mp3'
        );
        audio.volume = 0.5;
        audio.play().catch(() => {
          // Ignore audio play errors
        });
      } catch (error) {
        // Ignore audio errors
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Auto-submit on Enter key when reading
    if (isReading && e.key === 'Enter' && value.length > 0) {
      e.preventDefault();
      processRfidValue(value);
    }
  };

  const getInputClassName = () => {
    let baseClass = 'transition-all duration-200';

    if (isReading) {
      baseClass += ' border-blue-500 bg-blue-50 dark:bg-blue-950/20';
    } else if (isSuccess) {
      baseClass += ' border-green-500 bg-green-50 dark:bg-green-950/20';
    } else if (isError) {
      baseClass += ' border-red-500 bg-red-50 dark:bg-red-950/20';
    }

    return baseClass;
  };

  const getButtonVariant = () => {
    if (isReading) return 'destructive';
    if (isSuccess) return 'default';
    if (isError) return 'destructive';
    return 'outline';
  };

  const getButtonIcon = () => {
    if (isReading) {
      return <Loader2 className='h-4 w-4 animate-spin' />;
    }
    if (isSuccess) {
      return <CheckCircle className='h-4 w-4' />;
    }
    if (isError) {
      return <XCircle className='h-4 w-4' />;
    }
    return <Scan className='h-4 w-4' />;
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <Label htmlFor='rfid-input'>{label}</Label>
      <div className='flex gap-2'>
        <Input
          ref={inputRef}
          id='rfid-input'
          value={value}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          disabled={disabled}
          className={getInputClassName()}
          autoComplete='off'
        />
        <Button
          type='button'
          variant={getButtonVariant()}
          size='icon'
          onClick={isReading ? stopReading : startReading}
          disabled={disabled}
          className='transition-all duration-200'
        >
          {getButtonIcon()}
        </Button>
      </div>

      {/* Status messages */}
      {isReading && (
        <p className='animate-pulse text-sm text-blue-600 dark:text-blue-400'>
          جاري قراءة RFID... يرجى تمرير البطاقة على القارئ
        </p>
      )}

      {isSuccess && (
        <p className='text-sm text-green-600 dark:text-green-400'>
          تم قراءة رمز RFID بنجاح ✓
        </p>
      )}

      {isError && (
        <p className='text-sm text-red-600 dark:text-red-400'>
          رمز RFID غير صحيح ✗
        </p>
      )}

      {/* Instructions */}
      {/* {!isReading && !isSuccess && !isError && (
        <p className='text-muted-foreground text-sm'>
          اضغط على زر المسح لبدء قراءة RFID
        </p>
      )} */}
    </div>
  );
}
