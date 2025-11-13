'use client';
import { DataTable } from '@/components/ui/table/data-table';
import { DataTableToolbar } from '@/components/ui/table/data-table-toolbar';
import { useDataTable } from '@/hooks/use-data-table';
import { ColumnDef } from '@tanstack/react-table';
import { parseAsInteger, useQueryState } from 'nuqs';

interface AttendanceTableProps<TData, TValue> {
  data: TData[];
  columns: ColumnDef<TData, TValue>[];
  totalItems: number;
}

const AttendanceTable = <TData, TValue>({
  data,
  columns,
  totalItems
}: AttendanceTableProps<TData, TValue>) => {
  const [pageSize] = useQueryState('pageSize', parseAsInteger.withDefault(10));

  const pageCount = Math.ceil(totalItems / pageSize);

  const { table } = useDataTable({
    data, // attendance data
    columns, // attendance columns
    pageCount: pageCount,
    shallow: false, // Setting to false triggers a network request with the updated querystring
    debounceMs: 500,
    initialState: {
      columnVisibility: {
        notes: false,
        checkInMethod: false,
        checkOutMethod: false,
        // status: false,
        workingMinutes: false
      }
    }
  });

  return (
    <DataTable table={table}>
      <DataTableToolbar table={table} />
    </DataTable>
  );
};

export default AttendanceTable;
