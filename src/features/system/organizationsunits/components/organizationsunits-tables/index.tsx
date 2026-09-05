'use client';

import { DataTable } from '@/components/ui/table/data-table';
import { DataTableToolbar } from '@/components/ui/table/data-table-toolbar';
import { useDataTable } from '@/hooks/use-data-table';
import { ColumnDef } from '@tanstack/react-table';
import { parseAsInteger, useQueryState } from 'nuqs';

interface OrganizationsUnitsTableProps<TData, TValue> {
  data: TData[];
  columns: ColumnDef<TData, TValue>[];
  totalItems: number;
}

const OrganizationsUnitsTable = <TData, TValue>({
  data,
  columns,
  totalItems
}: OrganizationsUnitsTableProps<TData, TValue>) => {
  const [pageSize] = useQueryState('pageSize', parseAsInteger.withDefault(10));
  const [perPage] = useQueryState('perPage', parseAsInteger.withDefault(pageSize || 10));

  const effectivePageSize = perPage || pageSize || 10;
  const pageCount = Math.ceil(totalItems / effectivePageSize);

  const { table } = useDataTable({
    data,
    columns,
    pageCount: pageCount,
    shallow: false,
    debounceMs: 500,
    initialState: {
      columnVisibility: {
        unitLevel: false,
        createdAt: false,
        email: false,
        phoneNumber: false
      }
    }
  });

  return (
    <DataTable table={table}>
      <DataTableToolbar table={table} />
    </DataTable>
  );
};

export default OrganizationsUnitsTable;
