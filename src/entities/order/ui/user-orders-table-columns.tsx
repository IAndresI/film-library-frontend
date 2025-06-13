import type { ColumnDef } from '@tanstack/react-table';
import type { IOrder } from '../model';

import { Link } from 'react-router-dom';

import { DataTableRowActions } from '@/shared/components/data-table/data-table-row-actions';
import { OrderStatus } from '@/shared/components/OrderStatus';
import { formatDate } from '@/shared/lib/helpers';

import { DataTableColumnHeader } from '../../../shared/components/data-table/data-table-column-header';

export const userOrdersTableColumns: ColumnDef<IOrder>[] = [
  {
    accessorKey: 'id',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="№"
      />
    ),
    cell: ({ row }) => (
      <Link to={`/profile/orders/${row.getValue('id')}`}>
        Заказ №{row.getValue('id')}
      </Link>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'plan',
    id: 'planId',
    header: ({ column, table }) => (
      <DataTableColumnHeader
        useMetaSortName={true}
        table={table}
        column={column}
        title="План"
      />
    ),
    cell: ({ row }) => {
      const plan = row.original.plan;
      return plan ? (
        <div className="flex items-center space-x-2">
          <span className="block truncate font-medium">{plan.name}</span>
        </div>
      ) : (
        '-'
      );
    },
    meta: {
      columnLabel: 'План',
      filterField: 'planId',
      sortField: 'planName',
    },
    enableSorting: false,
  },
  {
    accessorKey: 'film',
    id: 'filmId',
    header: ({ column, table }) => (
      <DataTableColumnHeader
        useMetaSortName={true}
        table={table}
        column={column}
        title="Фильм"
      />
    ),
    cell: ({ row }) => {
      const film = row.original.film;
      return film ? (
        <div className="flex items-center space-x-2">
          <span className="block truncate font-medium">{film.name}</span>
        </div>
      ) : (
        '-'
      );
    },
    meta: {
      columnLabel: 'Фильм',
      filterField: 'filmId',
      sortField: 'filmName',
    },
    enableSorting: false,
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Дата создания"
      />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          {formatDate(row.getValue('createdAt'), true)}
        </div>
      );
    },
    meta: {
      columnLabel: 'Дата создания',
    },
  },
  {
    accessorKey: 'amount',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Сумма"
      />
    ),
    cell: ({ row }) => {
      return <div className="flex space-x-2">{row.getValue('amount')} ₽</div>;
    },
    meta: {
      columnLabel: 'Сумма',
    },
  },
  {
    accessorKey: 'paidAt',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Дата оплаты"
      />
    ),
    cell: ({ row }) => {
      const paidAt = row.original.paidAt;
      return (
        <div className="flex items-center">
          {paidAt ? formatDate(paidAt) : '-'}
        </div>
      );
    },
    meta: {
      columnLabel: 'Дата оплаты',
    },
  },
  {
    accessorKey: 'orderStatus',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Статус"
      />
    ),
    cell: ({ row }) => {
      return (
        <OrderStatus
          size="small"
          status={row.getValue('orderStatus')}
        />
      );
    },
    meta: {
      columnLabel: 'Статус',
    },
    enableSorting: false,
  },
  {
    id: 'actions',
    cell: ({ row }) => (
      <DataTableRowActions
        actions={[
          {
            title: 'Подробнее',
            link: `/profile/orders/${row.original.id}`,
          },
        ]}
        row={row}
      />
    ),
  },
];
