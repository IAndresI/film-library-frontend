import type { IReview } from '@/entities/review/dto';

import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import { queryClient } from '@/shared/api/query-client';

import { reviewEditorApi } from '../../api';

export const useDeleteReview = (props?: {
  onSuccess?:
    | ((
        data: IReview,
        variables: number,
        context: unknown
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
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      toast.success('Обзор успешно удален');
      onSuccess?.(data, variables, context);
    },
    onError: (error) => {
      toast.error('Не удалось удалить обзор', {
        description: error.message,
      });
    },
  });

  return {
    deleteReview,
    isLoading,
    error,
    ...mutationProps,
  };
};
