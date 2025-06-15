import type { IUser } from '@/entities/user/model';
import type { ColumnDef } from '@tanstack/react-table';

import { Link } from 'react-router-dom';
import { toast } from 'sonner';

import { DeleteModal } from '@/widgets/deleteModal';

import { SubscriptionStatusType } from '@/entities/subscription/@x/user';

import { formatDate } from '@/shared/lib/helpers';
import { getImageUrl } from '@/shared/lib/utils';
import { DataTableColumnHeader, DataTableRowActions } from '@/shared/ui';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';

import { userApi } from '../api/user.api';

export const usersTableColumns: ColumnDef<IUser>[] = [
  {
    accessorKey: 'id',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="ID"
      />
    ),
    cell: ({ row }) => <div>{row.getValue('id')}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Пользователь"
      />
    ),
    cell: ({ row }) => {
      return (
        <Link
          to={`/admin/users/${row.original.id}`}
          className="flex items-center space-x-2"
        >
          <Avatar className="size-10">
            <AvatarImage src={getImageUrl(row.original.avatar)} />
            <AvatarFallback className="text-lg uppercase">
              {row.original.name.slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <span className="block truncate font-medium">
            {row.original.name}
          </span>
        </Link>
      );
    },
    meta: {
      columnLabel: 'Пользователь',
    },
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Зарегистрирован"
      />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          {formatDate(row.getValue('createdAt'))}
        </div>
      );
    },
    meta: {
      columnLabel: 'Зарегистрирован',
    },
  },
  {
    accessorKey: 'email',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Email"
      />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <p className="max-w-[500px] truncate font-medium">
            {row.getValue('email')}
          </p>
        </div>
      );
    },
    meta: {
      columnLabel: 'Email',
    },
  },
  {
    accessorKey: 'isAdmin',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Админ"
      />
    ),
    cell: ({ row }) => <div>{row.getValue('isAdmin') ? 'Да' : 'Нет'}</div>,
    enableSorting: false,
    meta: {
      columnLabel: 'Админ',
    },
  },
  {
    accessorKey: 'subscription',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Подписка"
      />
    ),
    cell: ({ row }) => {
      const subscription = row.original.subscription;
      return (
        <div>
          {subscription &&
            subscription.subscriptionStatus ===
              SubscriptionStatusType.EXPIRED &&
            'Истекла'}
          {subscription &&
            subscription.subscriptionStatus === SubscriptionStatusType.ACTIVE &&
            'Активна'}
          {subscription &&
            subscription.subscriptionStatus ===
              SubscriptionStatusType.CANCELLED &&
            'Отменена'}
          {!subscription && 'Нет подписки'}
        </div>
      );
    },
    meta: {
      columnLabel: 'Подписка',
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => (
      <DataTableRowActions
        actions={[
          {
            title: 'Информация',
            link: `/admin/users/${row.original.id}`,
          },
        ]}
        deleteModal={
          <DeleteModal
            title="Удаление пользователя"
            description={`Вы уверены, что хотите удалить пользователя ${row.original.name}?`}
            onDelete={() => userApi.deleteUser(row.original.id)}
            onSuccess={() => {
              toast.success(
                `Пользователь "${row.original.name}" успешно удален`
              );
            }}
            queryKey={['users']}
          />
        }
        row={row}
      />
    ),
  },
];
