'use client';

import React, { forwardRef, useRef } from 'react';
import { IconDatabase, IconFaceId } from '@tabler/icons-react';
import { BorderBeam } from '@/components/ui/border-beam';

import { cn } from '@/lib/utils';
import { AnimatedBeam } from '@/components/ui/animated-beam';
import PageContainer from '@/components/layout/page-container';

const Circle = forwardRef<
  HTMLDivElement,
  { className?: string; children?: React.ReactNode }
>(({ className, children }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        'z-10 flex size-12 items-center justify-center rounded-full border-2 bg-white p-3 shadow-[0_0_20px_-12px_rgba(0,0,0,0.8)] dark:bg-zinc-700',
        className
      )}
    >
      {children}
    </div>
  );
});

Circle.displayName = 'Circle';

const DashboardPage = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const div1Ref = useRef<HTMLDivElement>(null);
  const div2Ref = useRef<HTMLDivElement>(null);
  const div3Ref = useRef<HTMLDivElement>(null);
  const div4Ref = useRef<HTMLDivElement>(null);
  const div5Ref = useRef<HTMLDivElement>(null);
  const div6Ref = useRef<HTMLDivElement>(null);
  const div7Ref = useRef<HTMLDivElement>(null);

  return (
    <div className='w-full'>
      <div className='mt-10 w-full p-4'>
        <h1 className='text-2xl font-bold'>نظام الحضور والإنصراف</h1>
        <p className='text-muted-foreground'>
          نظرة عامة على موقف الموظفين والإحصائيات
        </p>
      </div>
      <PageContainer>
        <div
          className='relative mx-5 mt-10 flex h-[400px] w-full items-center justify-center overflow-hidden rounded-lg border bg-zinc-50 p-10 dark:bg-zinc-900'
          ref={containerRef}
        >
          <div className='flex size-full max-h-[200px] max-w-lg flex-col items-stretch justify-between gap-10'>
            <div className='flex flex-row items-center justify-between'>
              <Circle ref={div1Ref}>
                <IconFaceId className='size-6 text-blue-600 dark:text-blue-400' />
              </Circle>
              <Circle ref={div5Ref}>
                <IconFaceId className='size-6 text-blue-600 dark:text-blue-400' />
              </Circle>
            </div>
            <div className='flex flex-row items-center justify-between'>
              <Circle ref={div2Ref}>
                <IconFaceId className='size-6 text-blue-600 dark:text-blue-400' />
              </Circle>
              <Circle ref={div4Ref} className='size-16'>
                <IconDatabase className='size-8 text-green-600 dark:text-green-400' />
              </Circle>
              <Circle ref={div6Ref}>
                <IconFaceId className='size-6 text-blue-600 dark:text-blue-400' />
              </Circle>
            </div>
            <div className='flex flex-row items-center justify-between'>
              <Circle ref={div3Ref}>
                <IconFaceId className='size-6 text-blue-600 dark:text-blue-400' />
              </Circle>
              <Circle ref={div7Ref}>
                <IconFaceId className='size-6 text-blue-600 dark:text-blue-400' />
              </Circle>
            </div>
          </div>

          <AnimatedBeam
            containerRef={containerRef}
            fromRef={div1Ref}
            toRef={div4Ref}
            curvature={-75}
            endYOffset={-10}
          />
          <AnimatedBeam
            containerRef={containerRef}
            fromRef={div2Ref}
            toRef={div4Ref}
          />
          <AnimatedBeam
            containerRef={containerRef}
            fromRef={div3Ref}
            toRef={div4Ref}
            curvature={75}
            endYOffset={10}
          />
          <AnimatedBeam
            containerRef={containerRef}
            fromRef={div5Ref}
            toRef={div4Ref}
            curvature={-75}
            endYOffset={-10}
            reverse
          />
          <AnimatedBeam
            containerRef={containerRef}
            fromRef={div6Ref}
            toRef={div4Ref}
            reverse
          />
          <AnimatedBeam
            containerRef={containerRef}
            fromRef={div7Ref}
            toRef={div4Ref}
            curvature={75}
            endYOffset={10}
            reverse
          />
          <BorderBeam duration={8} size={100} />
        </div>

        {/* <div className='mt-10 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4'>
          <Card>
            <CardHeader>
              <CardTitle>Total Employees</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Total Employees</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Total Employees</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Total Employees</CardTitle>
            </CardHeader>
          </Card>
        </div>
     */}
      </PageContainer>
    </div>
  );
};

export default DashboardPage;
