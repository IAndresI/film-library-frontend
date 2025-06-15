import type { IReview } from '@/entities/review/model';

import { useMutation } from '@tanstack/react-query';

import { queryClient } from '@/shared/api/query-client';

import { reviewModerationApi } from '../api/reviewModeration.api';

export const useApproveReview = (props?: {
  onSuccess?:
    | ((
        data: IReview,
        variables: { id: number },
        context: unknown
      ) => Promise<unknown> | unknown)
    | undefined;
}) => {
  const { onSuccess } = props || {};

  const {
    mutate: approveReview,
    isPending: isLoading,
    error,
    ...mutationProps
  } = useMutation({
    mutationFn: reviewModerationApi.approveReview,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      onSuccess?.(data, variables, context);
    },
  });

  return {
    approveReview,
    isLoading,
    error,
    ...mutationProps,
  };
};
