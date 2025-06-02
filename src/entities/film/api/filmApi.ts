import type { IFilm, IGenre } from "@/entities/film/dto";
import { apiInstance } from "@/shared/api/base";
import { queryOptions } from "@tanstack/react-query";

export const filmApi = {
  getAllGenresQueryOptions: () => {
    return queryOptions({
      queryKey: ["genres"],
      queryFn: apiInstance.get<IGenre[]>("/genre/"),
    });
  },
  getAllFilmsQueryOptions: ({ genre }: { genre?: number }) => {
    return queryOptions({
      queryKey: ["movies", genre],
      queryFn: apiInstance.get<IFilm[]>(`/movie/`, { params: { genre } }),
    });
  },
  getFilmQueryOptions: (id: number) => {
    return queryOptions({
      queryKey: ["movie", id],
      queryFn: apiInstance.get<IFilm>(`/movie/${id}/`),
    });
  },
};
