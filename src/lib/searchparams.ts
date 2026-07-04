import {
  createSearchParamsCache,
  createSerializer,
  parseAsInteger,
  parseAsString
} from 'nuqs/server';

export const searchParams = {
  page: parseAsInteger.withDefault(1),
  pageSize: parseAsInteger.withDefault(10),
  parentUnitId: parseAsString,
  status: parseAsInteger,
  searchText: parseAsString,
  startDate: parseAsString,
  endDate: parseAsString,
  employeeId: parseAsString,
  organizationId: parseAsString,
  logType: parseAsString,
  logMethod: parseAsString,
  isVerified: parseAsString,
  workLocationId: parseAsString,
  sortBy: parseAsString,
  sortOrder: parseAsString,
  searchTerm: parseAsString,
  tab: parseAsString,
  attendanceStatus: parseAsString,
  date: parseAsString,
  attendanceDefaultsApplied: parseAsString,
  role: parseAsInteger,
  isActive: parseAsString,
  employeeSearch: parseAsString,
  direct: parseAsString,
  organizationalUnitId: parseAsString,
  shiftId: parseAsString,
  includeSubUnits: parseAsString,
  pageNumber: parseAsInteger.withDefault(1)

  // advanced filter
  // filters: getFiltersStateParser().withDefault([]),
  // joinOperator: parseAsStringEnum(['and', 'or']).withDefault('and')
};

export const searchParamsCache = createSearchParamsCache(searchParams);
export const serialize = createSerializer(searchParams);
