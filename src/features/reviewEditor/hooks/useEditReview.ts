import type { IReview } from '@/entities/review/model';

import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import { queryClient } from '@/shared/api/query-client';

import { reviewEditorApi } from '../api';

export const useEditReview = (props?: {
  onSuccess?:
    | ((
        data: IReview,
        variables: {
          id: number;
          rating: number;
          text: string;
        },
        context: unknown
      ) => Promise<unknown> | unknown)
    | undefined;
}) => {
  const { onSuccess } = props || {};

  const {
    mutate: editReview,
    isPending: isLoading,
    error,
    ...mutationProps
  } = useMutation({
    mutationFn: reviewEditorApi.editReview,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      toast.success('Обзор успешно отредактирован');
      onSuccess?.(data, variables, context);
    },
  });

  return {
    editReview,
    isLoading,
    error,
    ...mutationProps,
  };
};
