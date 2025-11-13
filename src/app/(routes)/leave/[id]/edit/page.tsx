import PageContainer from '@/components/layout/page-container';
import { LeaveItem } from '@/features/leave';
import { LeavesService } from '@/features/leave/api/approvereject-leaves.service';
import LeaveForm from '@/features/leave/components/leave-form';

export default async function editLeavePage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: leaveId } = await params;

  const data = await LeavesService.getLeaveById(leaveId);
  const leave = data as LeaveItem;

  return (
    <PageContainer>
      <LeaveForm initialData={leave as any} pageTitle='تعديل موقف' />
    </PageContainer>
  );
}
