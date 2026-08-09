import PageContainer from '@/components/layout/page-container';
import { LeaveItem } from '@/features/leave';
import { LeavesService } from '@/features/leave/api/approvereject-leaves.service';
import LeaveForm from '@/features/leave/components/leave-form';
import { usersPermissionsService } from '@/features/system/users-permissions/api/users-permissions.service';
import { canWrite } from '@/utils/auth/auth-utils';
import { redirect } from 'next/navigation';

export default async function editLeavePage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: leaveId } = await params;

  // View-only roles (e.g. security officers) cannot edit a موقف.
  const currentUser = await usersPermissionsService.getCurrentUser();
  if (!canWrite(currentUser)) {
    redirect('/leave');
  }

  const data = await LeavesService.getLeaveById(leaveId);
  const leave = data as LeaveItem;

  return (
    <PageContainer>
      <LeaveForm initialData={leave as any} pageTitle='تعديل موقف' />
    </PageContainer>
  );
}
