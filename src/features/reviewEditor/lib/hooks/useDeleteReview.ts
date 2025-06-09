import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/shared/api/query-client";

import type { IReview } from "@/entities/review/dto";
import { reviewEditorApi } from "../../api";

export const useDeleteReview = (props?: {
  onSuccess?:
    | ((
        data: IReview,
        variables: number,
        context: unknown,
      ) => Promise<unknown> | unknown)
    | undefined;
}) => {
  const { onSuccess } = props || {};

  const {
    mutate: deleteReview,
    isPending: isLoading,
    error,
    ...mutationProps
  } = useMutation({
    mutationFn: reviewEditorApi.deleteReview,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      onSuccess?.(data, variables, context);
    },
  });

  return {
    deleteReview,
    isLoading,
    error,
    ...mutationProps,
  };
};
