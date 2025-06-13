import { ColumnMeta as BaseColumnMeta } from '@tanstack/react-table';

declare module '@tanstack/react-table' {
  /* eslint-disable @typescript-eslint/no-unused-vars */
  interface ColumnMeta<TData extends RowData, TValue>
    extends BaseColumnMeta<TData, TValue> {
    columnLabel?: string;
    filterField?: string;
    sortField?: string;
  }
}
