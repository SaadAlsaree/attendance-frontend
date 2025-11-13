'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function SettingsError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className='container mx-auto p-6'>
      <div className='flex min-h-[400px] items-center justify-center'>
        <Card className='w-full max-w-md'>
          <CardHeader className='text-center'>
            <div className='bg-destructive/10 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full'>
              <AlertTriangle className='text-destructive h-6 w-6' />
            </div>
            <CardTitle className='text-xl'>Something went wrong!</CardTitle>
            <CardDescription>
              There was an error loading the settings page.
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='text-muted-foreground text-sm'>
              <p>Error: {error.message}</p>
              {error.digest && (
                <p className='mt-2 text-xs'>Error ID: {error.digest}</p>
              )}
            </div>
            <div className='flex gap-2'>
              <Button onClick={reset} className='flex-1'>
                <RefreshCw className='mr-2 h-4 w-4' />
                Try again
              </Button>
              <Button variant='outline' className='flex-1'>
                Go back
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
