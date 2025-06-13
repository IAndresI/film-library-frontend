import type { IFilm } from '@/entities/film/dto';
import type { IPaginationResponse } from '@/shared/model/pagination-response.model';
import type {
  ColumnFiltersState,
  PaginationState,
  SortingState,
} from '@tanstack/react-table';
import type { IUser } from '../dto';

import { queryOptions } from '@tanstack/react-query';

import { apiInstance } from '@/shared/api/base';

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
      queryKey: ['users', filters, sort, pagination],
      queryFn: apiInstance.get<IPaginationResponse<IUser>>('/users', {
        params: {
          filters,
          sort,
          pageIndex: pagination.pageIndex,
          pageSize: pagination.pageSize,
        },
      }),
    });
  },
  getAllUserFavoritesQueryOptions: ({
    userId,
    genres,
    actors,
    search,
    pagination,
    sort,
  }: {
    userId: number;
    genres?: string[];
    actors?: string[];
    search?: string;
    pagination: PaginationState;
    sort: SortingState;
  }) => {
    return queryOptions({
      queryKey: ['favorites', userId, genres, actors, search, pagination, sort],
      queryFn: apiInstance.get<IPaginationResponse<IFilm>>(
        `/users/${userId}/favorites`,
        {
          params: {
            genres,
            actors,
            search,
            pageIndex: pagination.pageIndex,
            pageSize: pagination.pageSize,
            sort,
          },
        }
      ),
    });
  },
  getUserByIdQueryOptions: (id: number) => {
    return queryOptions({
      queryKey: ['users', id],
      queryFn: apiInstance.get<IUser>(`/users/${id}`),
    });
  },
  deleteUser: (id: number) => apiInstance.delete(`/users/${id}`),
};
