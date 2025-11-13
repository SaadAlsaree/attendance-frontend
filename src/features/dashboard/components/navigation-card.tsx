'use client';

import React from 'react';
import { motion } from 'motion/react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Navigation,
  Zap,
  FileText,
  Settings,
  Users,
  BarChart3,
  Calendar,
  Clock,
  Shield,
  Building2,
  Map,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface NavItem {
  title: string;
  description: string;
  route: string;
  icon: string;
  requiresPermission: boolean;
  permission: string | null;
}

interface Navigation {
  quickActions: NavItem[];
  reports: NavItem[];
  management: NavItem[];
}

interface NavigationCardProps {
  navigation: Navigation;
  isLoading?: boolean;
}

const getIconComponent = (iconName: string) => {
  const icons: Record<string, React.ComponentType<{ className?: string }>> = {
    users: Users,
    'bar-chart': BarChart3,
    calendar: Calendar,
    clock: Clock,
    shield: Shield,
    building: Building2,
    map: Map,
    'file-text': FileText,
    settings: Settings,
    zap: Zap
  };

  return icons[iconName] || FileText;
};

const ActionItem: React.FC<{
  item: NavItem;
  index: number;
  category: string;
}> = ({ item, index, category }) => {
  const IconComponent = getIconComponent(item.icon);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'quickActions':
        return 'text-blue-600 bg-blue-50 dark:bg-blue-950';
      case 'reports':
        return 'text-green-600 bg-green-50 dark:bg-green-950';
      case 'management':
        return 'text-purple-600 bg-purple-50 dark:bg-purple-950';
      default:
        return 'text-gray-600 bg-gray-50 dark:bg-gray-950';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <Link href={item.route} className='block'>
        <div className='group hover:border-primary/50 cursor-pointer rounded-lg border p-4 transition-all duration-200 hover:shadow-md'>
          <div className='flex items-center gap-3'>
            <div className={cn('rounded-md p-2', getCategoryColor(category))}>
              <IconComponent className='h-4 w-4' />
            </div>
            <div className='min-w-0 flex-1'>
              <h4 className='group-hover:text-primary text-sm font-medium transition-colors'>
                {item.title}
              </h4>
              <p className='text-muted-foreground truncate text-xs'>
                {item.description}
              </p>
            </div>
            <ChevronRight className='text-muted-foreground group-hover:text-primary h-4 w-4 transition-colors' />
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export function NavigationCard({
  navigation,
  isLoading = false
}: NavigationCardProps) {
  if (isLoading) {
    return (
      <Card className='w-full'>
        <CardHeader>
          <div className='flex items-center gap-2'>
            <Skeleton className='h-5 w-5' />
            <Skeleton className='h-6 w-32' />
          </div>
          <Skeleton className='h-4 w-48' />
        </CardHeader>
        <CardContent>
          <div className='space-y-6'>
            {Array.from({ length: 3 }).map((_, categoryIndex) => (
              <div key={categoryIndex} className='space-y-3'>
                <Skeleton className='h-4 w-24' />
                <div className='space-y-2'>
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className='rounded-lg border p-4'>
                      <div className='flex items-center gap-3'>
                        <Skeleton className='h-8 w-8 rounded-md' />
                        <div className='flex-1 space-y-1'>
                          <Skeleton className='h-4 w-24' />
                          <Skeleton className='h-3 w-32' />
                        </div>
                        <Skeleton className='h-4 w-4' />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const hasActions = navigation.quickActions?.length > 0;
  const hasReports = navigation.reports?.length > 0;
  const hasManagement = navigation.management?.length > 0;

  if (!hasActions && !hasReports && !hasManagement) {
    return (
      <Card className='w-full'>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Navigation className='h-5 w-5' />
            التنقل السريع
          </CardTitle>
          <CardDescription>الوصول السريع للوظائف المهمة</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='text-muted-foreground flex h-[200px] items-center justify-center'>
            لا تتوفر خيارات تنقل
          </div>
        </CardContent>
      </Card>
    );
  }

  const totalItems =
    (navigation.quickActions?.length || 0) +
    (navigation.reports?.length || 0) +
    (navigation.management?.length || 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className='w-full'>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Navigation className='h-5 w-5' />
            التنقل السريع
          </CardTitle>
          <CardDescription>
            الوصول السريع لـ {totalItems} وظيفة أساسية
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='space-y-6'>
            {/* Quick Actions */}
            {hasActions && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className='space-y-3'
              >
                <div className='flex items-center gap-2'>
                  <Zap className='h-4 w-4 text-blue-600' />
                  <h4 className='text-sm font-medium text-blue-700 dark:text-blue-300'>
                    إجراءات سريعة
                  </h4>
                </div>
                <div className='space-y-2'>
                  {navigation.quickActions.map((item, index) => (
                    <ActionItem
                      key={`quick-${index}`}
                      item={item}
                      index={index}
                      category='quickActions'
                    />
                  ))}
                </div>
              </motion.div>
            )}

            {/* Reports */}
            {hasReports && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className='space-y-3'
              >
                <div className='flex items-center gap-2'>
                  <BarChart3 className='h-4 w-4 text-green-600' />
                  <h4 className='text-sm font-medium text-green-700 dark:text-green-300'>
                    التقارير
                  </h4>
                </div>
                <div className='space-y-2'>
                  {navigation.reports.map((item, index) => (
                    <ActionItem
                      key={`report-${index}`}
                      item={item}
                      index={index}
                      category='reports'
                    />
                  ))}
                </div>
              </motion.div>
            )}

            {/* Management */}
            {hasManagement && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className='space-y-3'
              >
                <div className='flex items-center gap-2'>
                  <Settings className='h-4 w-4 text-purple-600' />
                  <h4 className='text-sm font-medium text-purple-700 dark:text-purple-300'>
                    الإدارة
                  </h4>
                </div>
                <div className='space-y-2'>
                  {navigation.management.map((item, index) => (
                    <ActionItem
                      key={`mgmt-${index}`}
                      item={item}
                      index={index}
                      category='management'
                    />
                  ))}
                </div>
              </motion.div>
            )}

            {/* Footer with Usage Stats */}
            <div className='border-t pt-4'>
              <div className='grid grid-cols-3 gap-4 text-center text-sm'>
                <div>
                  <div className='text-lg font-bold text-blue-600'>
                    {navigation.quickActions?.length || 0}
                  </div>
                  <div className='text-muted-foreground text-xs'>
                    إجراءات سريعة
                  </div>
                </div>
                <div>
                  <div className='text-lg font-bold text-green-600'>
                    {navigation.reports?.length || 0}
                  </div>
                  <div className='text-muted-foreground text-xs'>تقارير</div>
                </div>
                <div>
                  <div className='text-lg font-bold text-purple-600'>
                    {navigation.management?.length || 0}
                  </div>
                  <div className='text-muted-foreground text-xs'>إدارة</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
