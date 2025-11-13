'use client';
import { DataTable } from '@/components/ui/table/data-table';
import { DataTableToolbar } from '@/components/ui/table/data-table-toolbar';
import { useDataTable } from '@/hooks/use-data-table';
import { ColumnDef } from '@tanstack/react-table';
import { parseAsInteger, useQueryState } from 'nuqs';

interface ShiftTableProps<TData, TValue> {
  data: TData[];
  columns: ColumnDef<TData, TValue>[];
  totalItems: number;
}

const ShiftTable = <TData, TValue>({
  data,
  columns,
  totalItems
}: ShiftTableProps<TData, TValue>) => {
  const [pageSize] = useQueryState('pageSize', parseAsInteger.withDefault(10));

  const pageCount = Math.ceil(totalItems / pageSize);

  const { table } = useDataTable({
    data, // shift data
    columns, // shift columns
    pageCount: pageCount,
    shallow: false, // Setting to false triggers a network request with the updated querystring
    debounceMs: 500,
    initialState: {
      columnVisibility: {
        description: false,
        allowLateCheckOut: false,
        allowEarlyCheckIn: false,
        // isActive: false,
        maxLateMinutes: false
      }
    }
  });

  return (
    <DataTable table={table}>
      <DataTableToolbar table={table} />
    </DataTable>
  );
};

export default ShiftTable;
