import { apiInstance } from "@/shared/api/base";
import type { IReview } from "@/entities/review/dto";

export const reviewEditorApi = {
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
