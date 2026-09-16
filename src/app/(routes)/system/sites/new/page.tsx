import PageContainer from "@/components/layout/page-container";
import SiteViewPage from "@/features/system/sites/components/sites-view-page";
import { Role } from "@/features/system/users-permissions/types/users-permissions";
import { hasAnyRole } from "@/utils/auth/auth-utils";
import { redirect } from "next/navigation";
import { usersPermissionsService } from "@/features/system/users-permissions/api/users-permissions.service";

export const metadata = {
  title: 'إضافة موقع'
};

export default async function NewSitePage() {
  const data = await usersPermissionsService.getCurrentUser();

  if (!hasAnyRole(data, [Role.Admin, Role.SuperAdmin])) {
    redirect('/');
  }

  return (
    <PageContainer scrollable>
      <div className='flex-1 space-y-4'>
        <SiteViewPage siteId='new' />
      </div>
    </PageContainer>
  );
}
