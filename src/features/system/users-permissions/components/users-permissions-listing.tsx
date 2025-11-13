import UsersPermissionsTable from './users-permissions-tables';
import { searchParamsCache } from '@/lib/searchparams';
import { UserPermission } from '../types/users-permissions';
import { usersPermissionsService } from '../api/users-permissions.service';
import { columns } from './users-permissions-tables/columns';

export default async function UsersPermissionsListing() {
  const page = searchParamsCache.get('page');
  const searchText = searchParamsCache.get('searchText');
  const pageSize = searchParamsCache.get('pageSize');
  const role = searchParamsCache.get('role');
  const isActive = searchParamsCache.get('isActive');

  const filters = {
    page: page ? parseInt(String(page)) : undefined,
    pageSize: pageSize ? parseInt(String(pageSize)) : undefined,
    ...(searchText && { search: searchText }),
    ...(role && { role: parseInt(String(role)) }),
    ...(isActive && { isActive: isActive === 'true' })
  };

  const data = await usersPermissionsService.getUsersPermissionsList(filters);
  const totalUsers = data?.totalCount || 0;
  const users = data?.data || [];

  return (
    <UsersPermissionsTable<UserPermission, unknown>
      data={users}
      totalItems={totalUsers}
      columns={columns}
    />
  );
}
