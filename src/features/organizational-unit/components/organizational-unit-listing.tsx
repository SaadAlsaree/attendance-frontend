import OrganizationalUnitTable from './organizational-unit-tables';
import { searchParamsCache } from '@/lib/searchparams';
import { IOrganizationalUnitList } from '../types/organizational';
import { organizationalService } from '../api/organizational.service';
import { columns } from './organizational-unit-tables/columns';

export default async function OrganizationalUnitListing() {
  const page = searchParamsCache.get('page') || 1;
  const pageSize =
    searchParamsCache.get('perPage') ||
    searchParamsCache.get('pageSize') ||
    10;
  const searchText = searchParamsCache.get('searchText');
  const unitName = searchParamsCache.get('unitName');
  const unitCode = searchParamsCache.get('unitCode');
  const parentUnitId = searchParamsCache.get('parentUnitId');

  const filters = {
    page: Number(page),
    pageSize: Number(pageSize),
    ...(searchText && { searchText: String(searchText) }),
    ...(unitName && { unitName: String(unitName) }),
    ...(unitCode && { unitCode: String(unitCode) }),
    ...(parentUnitId && { parentUnitId: String(parentUnitId) })
  };

  const response = await organizationalService.getOrganizationalUnits(filters);

  // Extract array safely
  let allUnits: IOrganizationalUnitList[] = [];
  if (Array.isArray(response?.data)) {
    allUnits = response.data;
  } else if (Array.isArray(response)) {
    allUnits = response;
  }

  // Apply search filtering on the units array
  let filteredUnits = [...allUnits];

  const searchKeyword = searchText || unitName;
  if (searchKeyword) {
    const term = String(searchKeyword).toLowerCase().trim();
    filteredUnits = filteredUnits.filter(
      (unit) =>
        unit.unitName?.toLowerCase().includes(term) ||
        unit.unitCode?.toLowerCase().includes(term) ||
        unit.email?.toLowerCase().includes(term) ||
        unit.phoneNumber?.toLowerCase().includes(term) ||
        unit.parentUnitName?.toLowerCase().includes(term) ||
        unit.managerName?.toLowerCase().includes(term)
    );
  }

  if (unitCode) {
    const codeTerm = String(unitCode).toLowerCase().trim();
    filteredUnits = filteredUnits.filter((unit) =>
      unit.unitCode?.toLowerCase().includes(codeTerm)
    );
  }

  if (parentUnitId) {
    filteredUnits = filteredUnits.filter(
      (unit) => unit.parentUnitId === parentUnitId
    );
  }

  const totalItems = filteredUnits.length;

  // Apply server-side pagination for TanStack table
  const startIndex = (Number(page) - 1) * Number(pageSize);
  const paginatedUnits = filteredUnits.slice(
    startIndex,
    startIndex + Number(pageSize)
  );

  return (
    <OrganizationalUnitTable<IOrganizationalUnitList, unknown>
      data={paginatedUnits}
      totalItems={totalItems}
      columns={columns}
    />
  );
}
