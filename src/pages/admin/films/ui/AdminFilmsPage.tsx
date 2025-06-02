import { filmsTableColumns } from "@/entities/film/ui/films-table-columns";
import { DataTable } from "@/shared/components/data-table/data-table";
import { Separator } from "@/shared/ui/separator";
import type { IFilm } from "@/entities/film/dto";
import { motion } from "framer-motion";
import { useState } from "react";
import {
  type ColumnFiltersState,
  type PaginationState,
  type SortingState,
} from "@tanstack/react-table";

const tempFilms: IFilm[] = [
  {
    id: 1,
    name: "Oppenghamer",
    rating: 9.5,
    description: "sd",
    image: "https://placehold.jp/250x333.png",
    genres: [
      { id: 2, name: "Thriller", image: "https://placehold.jp/250x333.png" },
      { id: 3, name: "Historical", image: "https://placehold.jp/250x333.png" },
      { id: 4, name: "Horror", image: "https://placehold.jp/250x333.png" },
    ],
    release_date: "2023-10-10",
    created_at: "2024-05-05",
    actors: [
      {
        id: 5,
        name: "Keanu reavse",
        image: "https://placehold.jp/250x333.png",
        description: "sdfasda",
        birthday: "1986-05-05",
      },
    ],
    trailer_link: "https://placehold.jp/250x333.png",
  },
  {
    id: 6,
    name: "Bad Boys",
    rating: 8.5,
    description: "boys",
    image: "https://placehold.jp/250x333.png",
    genres: [
      { id: 7, name: "Dramma", image: "https://placehold.jp/250x333.png" },
      { id: 8, name: "Comedy", image: "https://placehold.jp/250x333.png" },
    ],
    release_date: "2020-08-23",
    created_at: "2023-11-16",
    actors: [
      {
        id: 9,
        name: "Keanu reavse",
        image: "https://placehold.jp/250x333.png",
        description: "sdfasda",
        birthday: "1986-05-05",
      },
    ],
    trailer_link: "https://placehold.jp/250x333.png",
  },
];

export const AdminFilmsPage = () => {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  return (
    <motion.section
      className="col-span-3 lg:col-span-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.2 } }}
      exit={{ opacity: 0, transition: { duration: 0.2 } }}
      key={"admin_films"}
    >
      <div className="h-full px-4 py-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold tracking-tight">Films</h2>
          </div>
        </div>
        <Separator className="my-4" />

        <DataTable
          sorting={sorting}
          onSortingChange={setSorting}
          columnFilters={columnFilters}
          onColumnFiltersChange={setColumnFilters}
          pagination={pagination}
          onPaginationChange={setPagination}
          columns={filmsTableColumns}
          data={tempFilms}
        />
      </div>
    </motion.section>
  );
};
