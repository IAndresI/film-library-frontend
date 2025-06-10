import type { IFilm } from "@/entities/film/dto";
import { apiInstance } from "@/shared/api/base";
import { queryOptions } from "@tanstack/react-query";
import type { CancelToken } from "axios";

export const favoriteFilmActionsApi = {
  getUserFavoriteFilmsIdsQueryOptions: ({ userId }: { userId: number }) => {
    return queryOptions({
      queryKey: ["favorites-ids", userId],
      queryFn: apiInstance.get<number[]>(`/users/${userId}/favorites/ids`),
    });
  },
  checkFavoriteStatusQueryOptions: ({
    userId,
    filmId,
  }: {
    userId: number;
    filmId: number;
  }) => {
    return queryOptions({
      queryKey: ["favorites", userId, filmId],
      queryFn: apiInstance.get<{
        isFavorite: boolean;
        filmId: number;
        userId: number;
      }>(`/users/${userId}/favorites/${filmId}`),
    });
  },
  addUserFavorites: ({
    userId,
    filmId,
    cancelToken,
  }: {
    userId: number;
    filmId: number;
    cancelToken?: CancelToken;
  }) =>
    apiInstance.post<IFilm>(
      `/users/${userId}/favorites`,
      { filmId },
      { cancelToken },
    ),
  removeUserFavorites: ({
    userId,
    filmId,
    cancelToken,
  }: {
    userId: number;
    filmId: number;
    cancelToken?: CancelToken;
  }) =>
    apiInstance.delete<IFilm>(`/users/${userId}/favorites/${filmId}`, {
      cancelToken,
    }),
};
