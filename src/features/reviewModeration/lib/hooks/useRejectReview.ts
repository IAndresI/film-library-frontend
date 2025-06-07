import { useMutation } from "@tanstack/react-query";
import { reviewModerationApi } from "../../api/reviewModerationApi";
import { queryClient } from "@/shared/api/query-client";
import type { IReview } from "@/entities/review/dto";

export const useRejectReview = (props?: {
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
    mutate: rejectReview,
    isPending: isLoading,
    error,
    ...mutationProps
  } = useMutation({
    mutationFn: reviewModerationApi.rejectReview,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      onSuccess?.(data, variables, context);
    },
  });

  return {
    rejectReview,
    isLoading,
    error,
    ...mutationProps,
  };
};
