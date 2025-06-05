import type { IFilm, IGenre } from "@/entities/film/dto";
import { apiInstance } from "@/shared/api/base";
import { queryOptions } from "@tanstack/react-query";

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
      queryFn: apiInstance.get<IFilm[]>(`/films`, {
        params: { genreId: genre },
      }),
    });
  },
  getAllFilmsQueryOptions: (genre?: number) => {
    return queryOptions({
      queryKey: ["films", "list", "admin", genre],
      queryFn: apiInstance.get<IFilm[]>(`/films/admin/all`, {
        params: { genreId: genre },
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
};
