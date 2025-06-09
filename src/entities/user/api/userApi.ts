import type { IFilm } from "@/entities/film/dto";
import { apiInstance } from "@/shared/api/base";
import { queryOptions } from "@tanstack/react-query";
import type { IUser } from "../dto";
import type {
  ColumnFiltersState,
  PaginationState,
  SortingState,
} from "@tanstack/react-table";
import type { IPaginationResponse } from "@/shared/model/pagination-response.model";

export const userApi = {
  getAllUsersQueryOptions: ({
    filters,
    sort,
    pagination,
  }: {
    filters: ColumnFiltersState;
    sort: SortingState;
    pagination: PaginationState;
  }) => {
    return queryOptions({
      queryKey: ["users", filters, sort, pagination],
      queryFn: apiInstance.get<IPaginationResponse<IUser>>("/users", {
        params: {
          filters,
          sort,
          pageIndex: pagination.pageIndex,
          pageSize: pagination.pageSize,
        },
      }),
    });
  },
  getAllUserFavoritesQueryOptions: (userId: string) => {
    return queryOptions({
      queryKey: ["favorites", userId],
      queryFn: apiInstance.get<IFilm[]>(`/users/${userId}/favorites`),
    });
  },
  getUserByIdQueryOptions: (id: number) => {
    return queryOptions({
      queryKey: ["users", id],
      queryFn: apiInstance.get<IUser>(`/users/${id}`),
    });
  },
  addUserFavorites: ({ userId, filmId }: { userId: string; filmId: number }) =>
    apiInstance.post<IFilm>(`/users/${userId}/favorites`, {
      movie_id: filmId,
      user_id: userId,
    }),
  removeUserFavorites: ({
    userId,
    filmId,
  }: {
    userId: string;
    filmId: number;
  }) => apiInstance.delete<IFilm>(`/users/${userId}/favorites/${filmId}`),
  deleteUser: (id: number) => apiInstance.delete(`/users/${id}`),
};
