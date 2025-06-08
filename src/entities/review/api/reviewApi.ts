import type { IAllReviews, IReview } from "@/entities/review/dto";
import { apiInstance } from "@/shared/api/base";
import type { IPaginationResponse } from "@/shared/model/pagination-response.model";
import { queryOptions } from "@tanstack/react-query";
import type {
  ColumnFiltersState,
  PaginationState,
  SortingState,
} from "@tanstack/react-table";

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
      queryKey: ["reviews", filters, sort, pagination],
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
      queryKey: ["reviews", "pending", filters, sort, pagination],
      queryFn: apiInstance.get<IPaginationResponse<IReview>>(
        `/reviews/pending`,
        {
          params: {
            filters,
            sort,
            pageIndex: pagination.pageIndex,
            pageSize: pagination.pageSize,
          },
        },
      ),
    });
  },
  createReview: (review: Omit<IAllReviews, "id">) =>
    apiInstance.post<IReview>(`/reviews`, review),
  editReview: (review: Partial<IAllReviews>) =>
    apiInstance.put<IReview>(`/reviews/${review.id}/edit`, review),
  deleteReview: (reviewId: number) =>
    apiInstance.delete<IReview>(`/reviews/${reviewId}`),
};
