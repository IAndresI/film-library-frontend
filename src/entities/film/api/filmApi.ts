import type { IFilm, IGenre } from '@/entities/film/dto';
import type { IPaginationResponse } from '@/shared/model/pagination-response.model';
import type {
  ColumnFiltersState,
  PaginationState,
  SortingState,
} from '@tanstack/react-table';

import { queryOptions } from '@tanstack/react-query';

import { apiInstance } from '@/shared/api/base';

export const filmApi = {
  getAllGenresQueryOptions: () => {
    return queryOptions({
      queryKey: ['genres'],
      queryFn: apiInstance.get<IGenre[]>('/genres'),
    });
  },
  getAvailableFilmsQueryOptions: ({
    pagination,
    genres,
    actors,
    search,
    sort,
  }: {
    pagination: PaginationState;
    genres?: string[];
    actors?: string[];
    search?: string;
    sort?: SortingState;
  }) => {
    return queryOptions({
      queryKey: ['films', 'list', genres, actors, search, pagination, sort],
      queryFn: apiInstance.get<IPaginationResponse<IFilm>>(`/films`, {
        params: {
          genres,
          actors,
          search,
          pageIndex: pagination.pageIndex,
          pageSize: pagination.pageSize,
          sort,
        },
      }),
    });
  },
  getUserPurchasedFilmsQueryOptions: ({
    pagination,
    genres,
    actors,
    search,
    sort,
  }: {
    pagination: PaginationState;
    genres?: string[];
    actors?: string[];
    search?: string;
    sort?: SortingState;
  }) => {
    return queryOptions({
      queryKey: [
        'films',
        'list',
        'user',
        genres,
        actors,
        search,
        pagination,
        sort,
      ],
      queryFn: apiInstance.get<IPaginationResponse<IFilm>>(`/films/purchased`, {
        params: {
          genres,
          actors,
          search,
          pageIndex: pagination.pageIndex,
          pageSize: pagination.pageSize,
          sort,
        },
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
      queryKey: ['films', 'list', 'admin', filters, sort, pagination],
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
      queryKey: ['films', id],
      queryFn: apiInstance.get<IFilm>(`/films/${id}`),
    });
  },
  getFilmByIdAdminQueryOptions: (id: number) => {
    return queryOptions({
      queryKey: ['films', 'admin', id],
      queryFn: apiInstance.get<IFilm>(`/films/admin/${id}`),
    });
  },
  generateFilmToken: (filmId: number) =>
    apiInstance.post<{
      token: string;
      tokenId: string;
      streamUrl: string;
      expiresIn: number;
      filmName: string;
      filmId: number;
    }>(`/videos/stream/token/${filmId}`),
  refreshFilmToken: ({
    filmId,
    tokenId,
  }: {
    filmId: number;
    tokenId: string;
  }) =>
    apiInstance.post<{
      tokenId: string;
      expiresIn: number;
      filmName: string;
      refreshed: boolean;
      message: string;
    }>(`/videos/stream/refresh/${filmId}`, { tokenId }),
  generateAdminFilmToken: (filmId: number) =>
    apiInstance.post<{
      token: string;
      tokenId: string;
      streamUrl: string;
      expiresIn: number;
      filmName: string;
      filmId: number;
    }>(`/videos/stream/admin/token/${filmId}`),
  refreshAdminFilmToken: ({
    filmId,
    tokenId,
  }: {
    filmId: number;
    tokenId: string;
  }) =>
    apiInstance.post<{
      tokenId: string;
      expiresIn: number;
      filmName: string;
      refreshed: boolean;
      message: string;
    }>(`/videos/stream/admin/refresh/${filmId}`, { tokenId }),
  deleteFilm: (id: number) => apiInstance.delete<IFilm>(`/films/${id}`),
};
