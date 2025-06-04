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
  getAllFilmsQueryOptions: ({ genre }: { genre?: number }) => {
    return queryOptions({
      queryKey: ["films", genre],
      queryFn: apiInstance.get<IFilm[]>(`/films`, {
        params: { genreId: genre },
      }),
    });
  },
  getFilmQueryOptions: (id: number) => {
    return queryOptions({
      queryKey: ["films", id],
      queryFn: apiInstance.get<IFilm>(`/films/${id}/`),
    });
  },
};
