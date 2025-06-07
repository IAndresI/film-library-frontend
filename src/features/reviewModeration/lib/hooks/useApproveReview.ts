import { useMutation } from "@tanstack/react-query";
import { reviewModerationApi } from "../../api/reviewModerationApi";
import { queryClient } from "@/shared/api/query-client";
import type { IReview } from "@/entities/review/dto";

export const useApproveReview = (props?: {
  onSuccess?:
    | ((
        data: IReview,
        variables: { id: number },
        context: unknown,
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
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
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
