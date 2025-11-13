import PageContainer from '@/components/layout/page-container';
import { ScheduleView, scheduleService } from '@/features/schedule';

export default async function viewschedulePage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: scheduleId } = await params;

  const data = await scheduleService.getScheduleById(scheduleId);
  const schedule = data?.data;

  return (
    <PageContainer>
      <ScheduleView schedule={schedule as any} />
    </PageContainer>
  );
}
