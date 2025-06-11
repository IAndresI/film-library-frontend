import type { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../../../shared/components/data-table/data-table-column-header";
import { DataTableRowActions } from "../../../shared/components/data-table/data-table-row-actions";
import type { IFilm, IGenre } from "@/entities/film/dto";
import { Badge } from "@/shared/ui/badge";
import { DeleteModal } from "@/shared/components/DeleteModal";
import { filmApi } from "../api/filmApi";
import { getImageUrl } from "@/shared/lib/utils";
import { Link } from "react-router-dom";
import { formatDate } from "@/shared/lib/helpers";
import { toast } from "sonner";

export const filmsTableColumns: ColumnDef<IFilm>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
    cell: ({ row }) => <div>{row.getValue("id")}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Фильм" />
    ),
    cell: (row) => {
      const film = row.row.original as IFilm;
      return (
        <Link
          to={`/admin/films/${film.id}`}
          className="flex items-center space-x-2"
        >
          <img
            className="h-10 w-10 rounded object-cover"
            src={getImageUrl(film.image)}
          />
          <span className="block truncate font-medium">{film.name}</span>
        </Link>
      );
    },
    meta: {
      columnLabel: "Фильм",
    },
  },
  {
    accessorKey: "genres",
    enableSorting: false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Жанры" />
    ),
    cell: ({ row }) => {
      const genres = row.getValue("genres") as IGenre[];

      return (
        <div className="flex max-w-[300px] flex-wrap items-center gap-1">
          {genres.map((genre) => (
            <Badge>{genre.name}</Badge>
          ))}
        </div>
      );
    },
    filterFn: (row, __, value) => {
      return value.some((genre: number) =>
        row.original.genres.find((el) => +el.id === +genre),
      );
    },
    meta: {
      columnLabel: "Жанры",
    },
  },
  {
    accessorKey: "releaseDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Дата выхода" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          {formatDate(row.getValue("releaseDate"))}
        </div>
      );
    },
    meta: {
      columnLabel: "Дата выхода",
    },
  },
  {
    accessorKey: "rating",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Рейтинг" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center">{row.getValue("rating") || "-"}</div>
      );
    },
    meta: {
      columnLabel: "Рейтинг",
    },
  },

  {
    accessorKey: "isVisible",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Видимый" />
    ),
    cell: ({ row }) => {
      return <div>{row.getValue("isVisible") ? "Да" : "Нет"}</div>;
    },
    enableSorting: false,
    meta: {
      columnLabel: "Видимый",
    },
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <DataTableRowActions
        actions={[
          {
            title: "Редактировать",
            link: `/admin/films/${row.original.id}`,
          },
        ]}
        deleteModal={
          <DeleteModal
            title="Удаление фильма"
            description={`Вы уверены, что хотите удалить фильм ${row.original.name}?`}
            onDelete={() => filmApi.deleteFilm(row.original.id)}
            onSuccess={() => {
              toast.success(`Фильм "${row.original.name}" успешно удален`);
            }}
            queryKey={["films"]}
          />
        }
        row={row}
      />
    ),
  },
];
