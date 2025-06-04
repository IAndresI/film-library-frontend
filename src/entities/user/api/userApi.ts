import type { IFilm } from "@/entities/film/dto";
import { apiInstance } from "@/shared/api/base";
import { queryOptions } from "@tanstack/react-query";

export const userApi = {
  getAllUserFavoritesQueryOptions: (userId: string) => {
    return queryOptions({
      queryKey: ["favorites", userId],
      queryFn: apiInstance.get<IFilm[]>(`/favorite/${userId}/list`),
    });
  },
  addUserFavorites: ({ userId, filmId }: { userId: string; filmId: number }) =>
    apiInstance.post<IFilm>(`/favorite/${userId}/add`, {
      movie_id: filmId,
      user_id: userId,
    }),
  removeUserFavorites: ({
    userId,
    filmId,
  }: {
    userId: string;
    filmId: number;
  }) => apiInstance.delete<IFilm>(`/favorite/${userId}/remove${filmId}`),
};
