import type { IActor, IActorWithFilms } from '@/entities/actor/model';
import type { IPaginationResponse } from '@/shared/model/pagination-response.model';
import type {
  ColumnFiltersState,
  PaginationState,
  SortingState,
} from '@tanstack/react-table';

import { queryOptions } from '@tanstack/react-query';

import { apiInstance } from '@/shared/api/base';

export const actorApi = {
  getAllActorsQueryOptions: ({
    search,
    genres,
    films,
    pagination,
  }: {
    search?: string;
    genres?: string[];
    films?: string[];
    pagination: PaginationState;
  }) => {
    return queryOptions({
      queryKey: ['actors', search, genres, films, pagination],
      queryFn: apiInstance.get<IPaginationResponse<IActor>>('/actors', {
        params: {
          search,
          genres,
          films,
          pageIndex: pagination.pageIndex,
          pageSize: pagination.pageSize,
        },
      }),
    });
  },
  getAllActorsAdminQueryOptions: ({
    filters,
    sort,
    pagination,
  }: {
    filters: ColumnFiltersState;
    sort: SortingState;
    pagination: PaginationState;
  }) => {
    return queryOptions({
      queryKey: ['actors', 'admin', filters, sort, pagination],
      queryFn: apiInstance.get<IPaginationResponse<IActor>>(
        '/actors/admin/all',
        {
          params: {
            filters,
            sort,
            pageIndex: pagination.pageIndex,
            pageSize: pagination.pageSize,
          },
        }
      ),
    });
  },
  getActorQueryOptions: (id: number) => {
    return queryOptions({
      queryKey: ['actors', id],
      queryFn: apiInstance.get<IActorWithFilms>(`/actors/${id}`),
    });
  },
  getActorByIdAdminQueryOptions: (id: number) => {
    return queryOptions({
      queryKey: ['actors', 'admin', id],
      queryFn: apiInstance.get<IActor>(`/actors/admin/${id}`),
    });
  },
  deleteActor: (id: number) => apiInstance.delete<IActor>(`/actors/${id}`),
};
