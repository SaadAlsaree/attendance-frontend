'use client';

import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Upload, X, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  label: string;
  accept?: string;
  maxSize?: number; // in bytes
  value?: File | null;
  onChange: (file: File | null) => void;
  error?: string;
  required?: boolean;
  preview?: boolean;
  className?: string;
}

export function FileUpload({
  label,
  accept = 'image/*',
  maxSize = 5 * 1024 * 1024, // 5MB default
  value,
  onChange,
  error,
  required = false,
  preview = true,
  className
}: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Generate preview URL when file changes
  React.useEffect(() => {
    if (value) {
      const url = URL.createObjectURL(value);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl(null);
    }
  }, [value]);

  const validateFile = (file: File): string | null => {
    // Check file size
    if (file.size > maxSize) {
      return `حجم الملف يجب أن يكون أقل من ${Math.round(maxSize / 1024 / 1024)}MB`;
    }

    // Check file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return 'نوع الملف غير مدعوم. يرجى استخدام JPG, PNG, أو WebP';
    }

    return null;
  };

  const handleFileSelect = (file: File) => {
    const error = validateFile(file);
    if (error) {
      // You might want to show this error in a toast or form message
      console.error(error);
      return;
    }
    onChange(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleRemoveFile = () => {
    onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <FormItem className={cn('space-y-2', className)}>
      <FormLabel className='text-sm font-medium'>
        {label}
        {required && <span className='ml-1 text-red-500'>*</span>}
      </FormLabel>

      <div
        className={cn(
          'rounded-lg border-2 border-dashed p-4 transition-colors',
          dragActive ? 'border-primary bg-primary/5' : 'border-border',
          error ? 'border-red-500' : '',
          'hover:border-primary/50'
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        {!value ? (
          <div className='space-y-2 text-center'>
            <Upload className='text-muted-foreground mx-auto h-8 w-8' />
            <div className='text-muted-foreground text-sm'>
              <p>اسحب الملف هنا أو</p>
              <Button
                type='button'
                variant='outline'
                size='sm'
                onClick={() => fileInputRef.current?.click()}
                className='mt-2'
              >
                اختر ملف
              </Button>
            </div>
            <p className='text-muted-foreground text-xs'>
              JPG, PNG, WebP حتى {Math.round(maxSize / 1024 / 1024)}MB
            </p>
          </div>
        ) : (
          <div className='space-y-3'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center space-x-2'>
                <div className='flex-shrink-0'>
                  {preview && previewUrl && (
                    <img
                      src={previewUrl}
                      alt='Preview'
                      className='h-12 w-12 rounded object-cover'
                    />
                  )}
                </div>
                <div className='min-w-0 flex-1'>
                  <p className='truncate text-sm font-medium'>{value.name}</p>
                  <p className='text-muted-foreground text-xs'>
                    {formatFileSize(value.size)}
                  </p>
                </div>
              </div>
              <div className='flex items-center space-x-2'>
                {preview && previewUrl && (
                  <Button
                    type='button'
                    variant='outline'
                    size='sm'
                    onClick={() => window.open(previewUrl, '_blank')}
                  >
                    <Eye className='h-4 w-4' />
                  </Button>
                )}
                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  onClick={handleRemoveFile}
                >
                  <X className='h-4 w-4' />
                </Button>
              </div>
            </div>
          </div>
        )}

        <Input
          ref={fileInputRef}
          type='file'
          accept={accept}
          onChange={handleInputChange}
          className='hidden'
        />
      </div>

      {error && <FormMessage>{error}</FormMessage>}
    </FormItem>
  );
}
