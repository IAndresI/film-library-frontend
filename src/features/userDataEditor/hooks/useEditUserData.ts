import type { IUser } from '@/entities/user/model';

import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import { queryClient } from '@/shared/api/query-client';

import { userDataEditorApi } from '../api/userDataEditor.api';

export const useEditUserData = (props?: {
  onSuccess?:
    | ((
        data: IUser,
        variables: { name: string; id: number },
        context: unknown
      ) => Promise<unknown> | unknown)
    | undefined;
}) => {
  const { onSuccess } = props || {};

  const {
    mutate: editUserData,
    isPending: isLoading,
    error,
    ...mutationProps
  } = useMutation({
    mutationFn: userDataEditorApi.editUserData,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: ['users', variables.id],
      });
      queryClient.invalidateQueries({
        queryKey: ['users'],
      });
      toast.success('Данные успешно обновлены');
      onSuccess?.(data, variables, context);
    },
    onError: (error) => {
      toast.error('Не удалось обновить данные', {
        description: error.message,
      });
    },
  });

  return {
    editUserData,
    isLoading,
    error,
    ...mutationProps,
  };
};
