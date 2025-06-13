import type { IReview } from '@/entities/review/dto';
import type { IPaginationResponse } from '@/shared/model/pagination-response.model';
import type {
  ColumnFiltersState,
  PaginationState,
  SortingState,
} from '@tanstack/react-table';

import { queryOptions } from '@tanstack/react-query';

import { apiInstance } from '@/shared/api/base';

export const reviewApi = {
  getAllReviewsQueryOptions: ({
    filters,
    sort,
    pagination,
  }: {
    filters?: ColumnFiltersState;
    sort?: SortingState;
    pagination: PaginationState;
  }) => {
    return queryOptions({
      queryKey: ['reviews', filters, sort, pagination],
      queryFn: apiInstance.get<IPaginationResponse<IReview>>(`/reviews`, {
        params: {
          filters,
          sort,
          pageIndex: pagination.pageIndex,
          pageSize: pagination.pageSize,
        },
      }),
    });
  },
  getFilmReviewsQueryOptions: (data: {
    filmId: number;
    pagination: PaginationState;
  }) => {
    return queryOptions({
      queryKey: ['reviews', data.filmId, data.pagination],
      queryFn: apiInstance.get<IPaginationResponse<IReview>>(
        `/reviews/film/${data.filmId}`,
        {
          params: {
            pageIndex: data.pagination.pageIndex,
            pageSize: data.pagination.pageSize,
          },
        }
      ),
    });
  },
  getUserFilmReviewQueryOptions: (data: { userId: number; filmId: number }) => {
    return queryOptions({
      queryKey: ['reviews', data.userId, data.filmId],
      queryFn: apiInstance.get<IReview>(
        `/reviews/user/${data.userId}/film/${data.filmId}`
      ),
    });
  },
  getAllUserReviewsQueryOptions: ({
    filters,
    sort,
    pagination,
    userId,
  }: {
    filters?: ColumnFiltersState;
    sort?: SortingState;
    pagination: PaginationState;
    userId: number;
  }) => {
    return queryOptions({
      queryKey: ['reviews', userId, filters, sort, pagination],
      queryFn: apiInstance.get<IPaginationResponse<IReview>>(
        `/reviews/user/${userId}`,
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
  getAllReviewsOnApproveQueryOptions: ({
    filters,
    sort,
    pagination,
  }: {
    filters?: ColumnFiltersState;
    sort?: SortingState;
    pagination: PaginationState;
  }) => {
    return queryOptions({
      queryKey: ['reviews', 'pending', filters, sort, pagination],
      queryFn: apiInstance.get<IPaginationResponse<IReview>>(
        `/reviews/pending`,
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
  createReview: (review: {
    rating: number;
    text: string;
    userId: number;
    filmId: number;
  }) => apiInstance.post<IReview>(`/reviews`, review),
  editReview: (review: { id: number; rating: number; text: string }) =>
    apiInstance.put<IReview>(`/reviews/${review.id}`, review),
  deleteReview: (reviewId: number) =>
    apiInstance.delete<IReview>(`/reviews/${reviewId}`),
};
