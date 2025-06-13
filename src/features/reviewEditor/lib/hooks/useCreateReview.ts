import type { IReview } from '@/entities/review/dto';

import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import { queryClient } from '@/shared/api/query-client';

import { reviewEditorApi } from '../../api';

export const useCreateReview = (props?: {
  onSuccess?:
    | ((
        data: IReview,
        variables: {
          rating: number;
          text: string;
          userId: number;
          filmId: number;
        },
        context: unknown
      ) => Promise<unknown> | unknown)
    | undefined;
}) => {
  const { onSuccess } = props || {};

  const {
    mutate: createReview,
    isPending: isLoading,
    error,
    ...mutationProps
  } = useMutation({
    mutationFn: reviewEditorApi.createReview,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      toast.success('Обзор успешно создан');
      onSuccess?.(data, variables, context);
    },
  });

  return {
    createReview,
    isLoading,
    error,
    ...mutationProps,
  };
};
