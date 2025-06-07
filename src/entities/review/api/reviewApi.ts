import type { IAllReviews, IReview } from "@/entities/review/dto";
import { apiInstance } from "@/shared/api/base";
import { queryOptions } from "@tanstack/react-query";

export const reviewApi = {
  getAllReviewsQueryOptions: () => {
    return queryOptions({
      queryKey: ["reviews"],
      queryFn: apiInstance.get<IReview[]>(`/reviews`),
    });
  },
  getAllReviewsOnApproveQueryOptions: () => {
    return queryOptions({
      queryKey: ["reviews", "pending"],
      queryFn: apiInstance.get<IReview[]>(`/reviews/pending`),
    });
  },
  createReview: (review: Omit<IAllReviews, "id">) =>
    apiInstance.post<IReview>(`/reviews`, review),
  editReview: (review: Partial<IAllReviews>) =>
    apiInstance.put<IReview>(`/reviews/${review.id}/edit`, review),
  deleteReview: (reviewId: number) =>
    apiInstance.delete<IReview>(`/reviews/${reviewId}`),
};
