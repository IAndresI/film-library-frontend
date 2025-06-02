import type { IAllReviews, IReview } from "@/entities/review/dto";
import { apiInstance } from "@/shared/api/base";
import { queryOptions } from "@tanstack/react-query";

export const reviewApi = {
  getAllReviewsQueryOptions: () => {
    return queryOptions({
      queryKey: ["reviews"],
      queryFn: apiInstance.get<IAllReviews[]>(`/review/`),
    });
  },
  createReview: (review: Omit<IAllReviews, "id">) =>
    apiInstance.post<IReview>(`/review/`, review),
  editReview: (review: Partial<IAllReviews>) =>
    apiInstance.put<IReview>(`/review/${review.id}/edit`, review),
  deleteReview: (reviewId: number) =>
    apiInstance.delete<IReview>(`/review/${reviewId}/delete`),
};
