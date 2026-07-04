import Link from 'next/link';
import { cn } from '@/lib/utils';

type Props = {
  active: 'schedules' | 'fixed';
};

/**
 * Link-based tab header for /schedule — «الجداول» (date-ranged schedules)
 * vs «الدوام الثابت» (fixed weekly patterns, feature 14). Links reset
 * page/searchTerm on purpose so switching tabs never lands on a stale page.
 */
export default function ScheduleTabs({ active }: Props) {
  const tabClass = (isActive: boolean) =>
    cn(
      'rounded-md px-4 py-1.5 text-sm font-medium transition-colors',
      isActive
        ? 'bg-background text-foreground shadow-sm'
        : 'text-muted-foreground hover:text-foreground'
    );

  return (
    <div className='bg-muted text-muted-foreground inline-flex h-10 w-fit items-center justify-center gap-1 rounded-lg p-1'>
      <Link href='/schedule' className={tabClass(active === 'schedules')}>
        الجداول
      </Link>
      <Link
        href='/schedule?tab=fixed'
        className={tabClass(active === 'fixed')}
      >
        الدوام الثابت
      </Link>
    </div>
  );
}
