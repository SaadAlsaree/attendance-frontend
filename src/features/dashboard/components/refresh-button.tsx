'use client';

import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/spinner';
import { Activity } from 'lucide-react';
import { useState } from 'react';

export const RefreshButton = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      // Simulate refresh operation
      await new Promise((resolve) => setTimeout(resolve, 500));
      // Add your actual refresh logic here
      console.log('Refreshing dashboard data...');
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button variant='outline' onClick={handleRefresh} disabled={isLoading}>
      تحديث
      {isLoading ? (
        <Spinner className='mr-2 h-4 w-4' />
      ) : (
        <Activity className='mr-2 h-4 w-4' />
      )}
    </Button>
  );
};
