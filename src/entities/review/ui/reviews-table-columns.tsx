import type { IFilm } from '@/entities/film/model';
import type { IReview } from '@/entities/review/model';
import type { IUser } from '@/entities/user/model';
import type { ColumnDef } from '@tanstack/react-table';

import { Link } from 'react-router-dom';

import { DeleteModal } from '@/widgets/deleteModal';

import { ReviewModerationModal } from '@/features/reviewModeration/ui/ReviewModerationModal';

import { formatDate } from '@/shared/lib/helpers';
import { getImageUrl } from '@/shared/lib/utils';
import { DataTableColumnHeader } from '@/shared/ui';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import { DataTableRowActions } from '@/shared/ui/data-table/data-table-row-actions';

import { reviewApi } from '../api/review.api';

export const reviewsTableColumns: ColumnDef<IReview>[] = [
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
    cell: (row) => {
      const film = row.getValue() as IFilm;
      return (
        <Link
          to={`/admin/films/${film.id}`}
          className="flex items-center space-x-2"
        >
          <img
            className="h-10 w-10 rounded"
            src={getImageUrl(film.image)}
          />
          <span className="block max-w-[150px] truncate font-medium">
            {film.name}
          </span>
        </Link>
      );
    },
    meta: {
      columnLabel: 'Фильм',
      filterField: 'filmId',
      sortField: 'filmName',
    },
  },
  {
    accessorKey: 'rating',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Рейтинг"
      />
    ),
    cell: ({ row }) => <div>{row.getValue('rating')} / 10</div>,

    meta: {
      columnLabel: 'Рейтинг',
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
          {formatDate(row.getValue('createdAt'))}
        </div>
      );
    },
    meta: {
      columnLabel: 'Дата создания',
    },
  },
  {
    accessorKey: 'text',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Отзыв"
      />
    ),
    cell: ({ row }) => {
      return (
        <p className="min-w-[500px] font-medium">{row.getValue('text')}</p>
      );
    },
  },
  {
    accessorKey: 'isApproved',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="На модерации"
      />
    ),
    cell: ({ row }) => {
      return (
        <p className="truncate font-medium">
          {row.getValue('isApproved') ? 'Нет' : 'Да'}
        </p>
      );
    },
    enableSorting: false,
    meta: {
      columnLabel: 'На модерации',
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => (
      <DataTableRowActions
        editModal={
          <ReviewModerationModal
            id={row.original.id}
            isApproved={row.original.isApproved}
          />
        }
        deleteModal={
          <DeleteModal
            title="Удаление отзыва"
            description="Вы уверены, что хотите удалить этот отзыв?"
            onDelete={() => reviewApi.deleteReview(row.original.id)}
            queryKey={['reviews']}
          />
        }
        row={row}
      />
    ),
  },
];
