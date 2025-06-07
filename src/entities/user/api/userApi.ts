import type { IFilm } from "@/entities/film/dto";
import { apiInstance } from "@/shared/api/base";
import { queryOptions } from "@tanstack/react-query";
import type { IUser } from "../dto";

export const userApi = {
  getAllUsersQueryOptions: () => {
    return queryOptions({
      queryKey: ["users"],
      queryFn: apiInstance.get<IUser[]>("/users"),
    });
  },
  getAllUserFavoritesQueryOptions: (userId: string) => {
    return queryOptions({
      queryKey: ["favorites", userId],
      queryFn: apiInstance.get<IFilm[]>(`/favorite/${userId}/list`),
    });
  },
  getUserByIdQueryOptions: (id: number) => {
    return queryOptions({
      queryKey: ["users", id],
      queryFn: apiInstance.get<IUser>(`/users/${id}`),
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
  deleteUser: (id: number) => apiInstance.delete(`/users/${id}`),
};
