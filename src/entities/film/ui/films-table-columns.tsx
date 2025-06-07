import type { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../../../shared/components/data-table/data-table-column-header";
import { DataTableRowActions } from "../../../shared/components/data-table/data-table-row-actions";
import type { IFilm, IGenre } from "@/entities/film/dto";
import { Badge } from "@/shared/ui/badge";
import { DeleteModal } from "@/shared/components/DeleteModal";
import { filmApi } from "../api/filmApi";
import { getImageUrl } from "@/shared/lib/utils";

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
    accessorKey: "image",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Image" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <img
            className="h-10 w-10 rounded object-cover"
            src={getImageUrl(row.getValue("image"))}
          />
        </div>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("name")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "genres",
    enableSorting: false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Genres" />
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
  },
  {
    accessorKey: "releaseDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Release date" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center">{row.getValue("releaseDate")}</div>
      );
    },
  },
  {
    accessorKey: "rating",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Rating" />
    ),
    cell: ({ row }) => {
      return <div className="flex items-center">{row.getValue("rating")}</div>;
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
            queryKey={["films"]}
          />
        }
        row={row}
      />
    ),
  },
];
