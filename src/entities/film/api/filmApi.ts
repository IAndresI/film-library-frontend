import type { IFilm, IGenre } from "@/entities/film/dto";
import { apiInstance } from "@/shared/api/base";
import type { IPaginationResponse } from "@/shared/model/pagination-response.model";
import { queryOptions } from "@tanstack/react-query";
import type {
  ColumnFiltersState,
  PaginationState,
  SortingState,
} from "@tanstack/react-table";

export const filmApi = {
  getAllGenresQueryOptions: () => {
    return queryOptions({
      queryKey: ["genres"],
      queryFn: apiInstance.get<IGenre[]>("/genres"),
    });
  },
  getAvailableFilmsQueryOptions: (genre?: number) => {
    return queryOptions({
      queryKey: ["films", "list", genre],
      queryFn: apiInstance.get<IPaginationResponse<IFilm>>(`/films`, {
        params: { genreId: genre },
      }),
    });
  },
  getAllFilmsQueryOptions: ({
    filters,
    sort,
    pagination,
  }: {
    filters: ColumnFiltersState;
    sort: SortingState;
    pagination: PaginationState;
  }) => {
    return queryOptions({
      queryKey: ["films", "list", "admin", filters, sort, pagination],
      queryFn: apiInstance.get<IPaginationResponse<IFilm>>(`/films/admin/all`, {
        params: {
          filters,
          sort,
          pageIndex: pagination.pageIndex,
          pageSize: pagination.pageSize,
        },
      }),
    });
  },
  getFilmByIdQueryOptions: (id: number) => {
    return queryOptions({
      queryKey: ["films", id],
      queryFn: apiInstance.get<IFilm>(`/films/${id}`),
    });
  },
  getFilmByIdAdminQueryOptions: (id: number) => {
    return queryOptions({
      queryKey: ["films", "admin", id],
      queryFn: apiInstance.get<IFilm>(`/films/admin/${id}`),
    });
  },
  deleteFilm: (id: number) => apiInstance.delete<IFilm>(`/films/${id}`),
};
