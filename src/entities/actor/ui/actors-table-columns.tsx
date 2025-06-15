import type { ColumnDef } from '@tanstack/react-table';
import type { IActor } from '../model';

import { Link } from 'react-router-dom';
import { toast } from 'sonner';

import { DeleteModal } from '@/widgets/deleteModal';

import { formatDate } from '@/shared/lib/helpers';
import { getImageUrl } from '@/shared/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import { DataTableColumnHeader } from '@/shared/ui/data-table/data-table-column-header';
import { DataTableRowActions } from '@/shared/ui/data-table/data-table-row-actions';

import { actorApi } from '../api/actor.api';

export const actorsTableColumns: ColumnDef<IActor>[] = [
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
  },
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Имя"
      />
    ),
    cell: ({ row }) => {
      return (
        <Link
          to={`/admin/actors/${row.original.id}`}
          className="flex items-center space-x-2"
        >
          <Avatar className="size-10">
            <AvatarImage src={getImageUrl(row.original.image)} />
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
      columnLabel: 'Имя',
    },
  },
  {
    accessorKey: 'birthday',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Дата рождения"
      />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2 truncate font-medium">
          {formatDate(row.original.birthday)}
        </div>
      );
    },
    meta: {
      columnLabel: 'Дата рождения',
    },
  },
  {
    accessorKey: 'description',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Описание"
      />
    ),
    cell: ({ row }) => {
      return (
        <p className="max-w-[300px] truncate font-medium">
          {row.getValue('description')}
        </p>
      );
    },
    meta: {
      columnLabel: 'Описание',
    },
  },
  {
    accessorKey: 'isVisible',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Видим для всех"
      />
    ),
    cell: ({ row }) => {
      return <div>{row.getValue('isVisible') ? 'Да' : 'Нет'}</div>;
    },
    enableSorting: false,
    meta: {
      columnLabel: 'Видим для всех',
    },
  },

  {
    id: 'actions',
    cell: ({ row }) => (
      <DataTableRowActions
        actions={[
          {
            title: 'Редактировать',
            link: `/admin/actors/${row.original.id}`,
          },
        ]}
        deleteModal={
          <DeleteModal
            title="Удаление актёра"
            description={`Вы уверены, что хотите удалить актёра ${row.original.name}?`}
            onDelete={() => actorApi.deleteActor(row.original.id)}
            onSuccess={() => {
              toast.success(`Актёр "${row.original.name}" успешно удален`);
            }}
            queryKey={['actors']}
          />
        }
        row={row}
      />
    ),
  },
];
