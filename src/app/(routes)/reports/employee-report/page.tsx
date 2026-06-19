import { reportsService } from '@/features/reports/api/reports.service';
import { getServerSession } from 'next-auth';
import authOption from '@/lib/auth-option';
import React from 'react';
import PageContainer from '@/components/layout/page-container';
import EmployeeReportContainer from '@/features/reports/components/employee-report/employee-report-container';
import {
  EmployeeReportData,
  EmployeeReportResponse
} from '@/features/reports/types/employee-report';
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

const EmployeeReportPage = async ({ searchParams }: Props) => {
  const session = await getServerSession(authOption);

  if (!session?.user) {
    return <div>Not authenticated</div>;
  }

  const user = await usersPermissionsService.getCurrentUser();

  // تقرير الموظف (من - إلى) متاح للأدمن فقط
  const canView = hasAnyRole(user, [Role.Admin, Role.SuperAdmin]);
  if (!canView) {
    redirect('/');
  }

  const params = await searchParams;
  const employeeId = getParam(params.employeeId);
  const fromDate = getParam(params.fromDate);
  const toDate = getParam(params.toDate);

  let report: EmployeeReportData | null = null;

  if (employeeId && fromDate && toDate) {
    const response = (await reportsService.getEmployeeReport({
      employeeId,
      fromDate,
      toDate
    })) as unknown as EmployeeReportResponse | null;

    report = response?.data ?? null;
  }

  return (
    <PageContainer>
      <EmployeeReportContainer report={report} />
    </PageContainer>
  );
};

export default EmployeeReportPage;
