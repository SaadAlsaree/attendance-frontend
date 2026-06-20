import { reportsService } from '@/features/reports/api/reports.service';
import { getServerSession } from 'next-auth';
import authOption from '@/lib/auth-option';
import React from 'react';
import PageContainer from '@/components/layout/page-container';
import OvertimeReportContainer from '@/features/reports/components/overtime-report/overtime-report-container';
import { OvertimeReportResponse } from '@/features/reports/types/overtime-report';
import { usersPermissionsService } from '@/features/system/users-permissions/api/users-permissions.service';
import { Role } from '@/features/system/users-permissions/types/users-permissions';
import { hasAnyRole } from '@/utils/auth/auth-utils';
import { redirect } from 'next/navigation';

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const getParam = (
  value: string | string[] | undefined
): string | undefined => (typeof value === 'string' && value ? value : undefined);

const OvertimeReportPage = async ({ searchParams }: Props) => {
  const session = await getServerSession(authOption);

  if (!session?.user) {
    return <div>Not authenticated</div>;
  }

  const user = await usersPermissionsService.getCurrentUser();

  // تقرير العمل الإضافي متاح للأدمن والمدير (عارضي التقارير)
  const canView = hasAnyRole(user, [Role.Admin, Role.SuperAdmin, Role.Manager]);
  if (!canView) {
    redirect('/');
  }

  const params = await searchParams;
  const startDate = getParam(params.startDate);
  const endDate = getParam(params.endDate);
  const employeeId = getParam(params.employeeId);

  let report: OvertimeReportResponse | null = null;

  if (startDate && endDate) {
    report = await reportsService.getOvertimeReport({
      StartDate: startDate,
      EndDate: endDate,
      ...(employeeId ? { EmployeeId: employeeId } : {})
    });
  }

  return (
    <PageContainer>
      <OvertimeReportContainer report={report} />
    </PageContainer>
  );
};

export default OvertimeReportPage;
