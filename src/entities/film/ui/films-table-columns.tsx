import type { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../../../shared/components/data-table/data-table-column-header";
import { DataTableRowActions } from "../../../shared/components/data-table/data-table-row-actions";
import type { IFilm, IGenre } from "@/entities/film/dto";
import { Badge } from "@/shared/ui/badge";
import { DeleteModal } from "@/shared/components/DeleteModal";
import { FilmEditModal } from "@/pages/admin/films/ui/FilmEditModal";

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
          <img className="h-10 w-10 rounded" src={row.getValue("image")} />
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
  // {
  //   accessorKey: "description",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Description" />
  //   ),
  //   cell: ({ row }) => {
  //     return (
  //       <div className="flex space-x-2">
  //         <p className="max-w-[300px] truncate font-medium">
  //           {row.getValue("description")}
  //         </p>
  //       </div>
  //     );
  //   },
  // },
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
        deleteModal={
          <DeleteModal
            title="Удаление фильма"
            description="Вы уверены, что хотите удалить этот фильм?"
            onDelete={() => {
              console.log("deleted");
            }}
          />
        }
        editModal={<FilmEditModal film={row.original} />}
        row={row}
      />
    ),
  },
];
