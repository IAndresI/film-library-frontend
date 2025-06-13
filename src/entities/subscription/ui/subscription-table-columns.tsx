import type { IUser } from '@/entities/user/dto';
import type { ColumnDef } from '@tanstack/react-table';
import type { IPlan, ISubscription } from '../dto';

import { Link } from 'react-router-dom';

import { SubscriptionStatus } from '@/shared/components/SubscriptionStatus';
import { formatDate } from '@/shared/lib/helpers';
import { getImageUrl } from '@/shared/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';

import { DataTableColumnHeader } from '../../../shared/components/data-table/data-table-column-header';

export const subscriptionsTableColumns: ColumnDef<ISubscription>[] = [
  {
    accessorKey: 'id',
    header: ({ column }) => (
      <DataTableColumnHeader
        className="pl-3"
        column={column}
        title="ID"
      />
    ),
    cell: ({ row }) => <div className="px-3">{row.getValue('id')}</div>,
    enableSorting: false,
    enableHiding: false,
    meta: {
      columnLabel: 'ID',
    },
  },
  {
    accessorKey: 'user',
    id: 'userId',
    header: ({ column, table }) => (
      <DataTableColumnHeader
        useMetaSortName={true}
        table={table}
        column={column}
        title="Пользователь"
      />
    ),
    cell: (row) => {
      const user = row.getValue() as IUser;
      return (
        <Link
          to={`/admin/users/${user.id}`}
          className="flex items-center space-x-2"
        >
          <Avatar className="size-10">
            <AvatarImage src={getImageUrl(user.avatar)} />
            <AvatarFallback className="text-lg uppercase">
              {user.name.slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <span className="block truncate font-medium">{user.name}</span>
        </Link>
      );
    },
    meta: {
      columnLabel: 'Пользователь',
      filterField: 'userId',
      sortField: 'userName',
    },
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
    cell: (row) => {
      const plan = row.getValue() as IPlan;
      return (
        <div className="flex items-center space-x-2">
          <span className="block truncate font-medium">{plan.name}</span>
        </div>
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
    accessorKey: 'startedAt',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Начало"
      />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {formatDate(row.getValue('startedAt'))}
          </span>
        </div>
      );
    },
    meta: {
      columnLabel: 'Начало',
    },
  },
  {
    accessorKey: 'expiresAt',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Конец"
      />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {formatDate(row.getValue('expiresAt'))}
          </span>
        </div>
      );
    },
    meta: {
      columnLabel: 'Конец',
    },
  },
  {
    accessorKey: 'subscriptionStatus',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Статус"
      />
    ),
    cell: ({ row }) => {
      return (
        <SubscriptionStatus
          size="small"
          status={row.getValue('subscriptionStatus')}
        />
      );
    },
    enableSorting: false,
    meta: {
      columnLabel: 'Статус',
    },
  },
  // {
  //   accessorKey: "text",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Отзыв" />
  //   ),
  //   cell: ({ row }) => {
  //     return (
  //       <p className="max-w-[300px] truncate font-medium">
  //         {row.getValue("text")}
  //       </p>
  //     );
  //   },
  // },
  // {
  //   id: "actions",
  //   cell: ({ row }) => (
  //     <DataTableRowActions
  //       editModal={
  //         <ReviewModerationModal
  //           id={row.original.id}
  //           isApproved={row.original.isApproved}
  //         />
  //       }
  //       row={row}
  //     />
  //   ),
  // },
];
