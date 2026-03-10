import React from 'react';
import { Role } from '@/features/system/users-permissions/types/users-permissions';
import { hasAnyRole } from '@/utils/auth/auth-utils';
import { redirect } from 'next/navigation';
import { usersPermissionsService } from "@/features/system/users-permissions/api/users-permissions.service";

const page = async () => {

   const data = await usersPermissionsService.getCurrentUser();
  
    const canAdd = hasAnyRole(data, [Role.Admin, Role.Manager]);
  
  
    // redirect to home if user is not authorized
    if (!canAdd) {
        redirect('/');
    }
  return <div>page</div>;
};

export default page;
