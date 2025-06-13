import type { IReview } from '@/entities/review/model';

import { apiInstance } from '@/shared/api/base';

export const reviewModerationApi = {
  approveReview: ({ id }: { id: number }) =>
    apiInstance.put<IReview>(`/reviews/${id}/approve`),
  rejectReview: ({ id }: { id: number }) =>
    apiInstance.put<IReview>(`/reviews/${id}/reject`),
};
