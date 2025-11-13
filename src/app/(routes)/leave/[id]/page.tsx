import PageContainer from '@/components/layout/page-container';
import { LeaveItem, LeaveViewPage } from '@/features/leave';
import { LeavesService } from '@/features/leave/api/approvereject-leaves.service';

export default async function viewLeavePage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: leaveId } = await params;

  const data = await LeavesService.getLeaveById(leaveId);
  const leave = data as LeaveItem;

  return (
    <PageContainer>
      <LeaveViewPage data={leave as any} />
    </PageContainer>
  );
}
