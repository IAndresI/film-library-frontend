import type { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../../../shared/components/data-table/data-table-column-header";
import type { IReview } from "@/entities/review/dto";
import type { IFilm } from "@/entities/film/dto";
import { formatDate } from "@/shared/lib/helpers";
import type { IUser } from "@/entities/user/dto";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { DeleteModal } from "@/shared/components/DeleteModal";
import { DataTableRowActions } from "@/shared/components/data-table/data-table-row-actions";
import { ReviewModerationModal } from "@/features/reviewModeration/ui/ReviewModerationModal";
import { reviewApi } from "../api/reviewApi";

export const reviewsTableColumns: ColumnDef<IReview>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader className="pl-3" column={column} title="ID" />
    ),
    cell: ({ row }) => <div className="px-3">{row.getValue("id")}</div>,
    enableSorting: false,
    enableHiding: false,
    meta: {
      columnLabel: "ID",
    },
  },
  {
    accessorKey: "film",
    id: "filmId",
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
        <div className="flex items-center space-x-2">
          <img className="h-10 w-10 rounded" src={film.image} />
          <span className="block truncate font-medium">{film.name}</span>
        </div>
      );
    },
    meta: {
      columnLabel: "Фильм",
      filterField: "filmId",
      sortField: "filmName",
    },
  },
  {
    accessorKey: "rating",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Рейтинг" />
    ),
    cell: ({ row }) => <div>{row.getValue("rating")}</div>,

    meta: {
      columnLabel: "Рейтинг",
    },
  },
  {
    accessorKey: "user",
    id: "userId",
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
        <div className="flex items-center space-x-2">
          <Avatar className="size-10">
            <AvatarImage src={user.avatar} />
            <AvatarFallback className="text-lg uppercase">
              {user.name.slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <span className="block truncate font-medium">{user.name}</span>
        </div>
      );
    },
    meta: {
      columnLabel: "Пользователь",
      filterField: "userId",
      sortField: "userName",
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Дата создания" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {formatDate(row.getValue("createdAt"))}
          </span>
        </div>
      );
    },
    meta: {
      columnLabel: "Дата создания",
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
  {
    accessorKey: "isApproved",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="На модерации" />
    ),
    cell: ({ row }) => {
      return (
        <p className="truncate font-medium">
          {row.getValue("isApproved") ? "Нет" : "Да"}
        </p>
      );
    },
    enableSorting: false,
    meta: {
      columnLabel: "На модерации",
    },
  },
  {
    id: "actions",
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
            queryKey={["reviews"]}
          />
        }
        row={row}
      />
    ),
  },
];
