import type { IActor } from '@/entities/actor/dto';
import type { IActorEditorForm } from '../../model';

import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { queryClient } from '@/shared/api/query-client';

import { actorEditorApi } from '../../api';

export const useAddActor = (props?: {
  onSuccess?:
    | ((
        data: IActor,
        variables: IActorEditorForm,
        context: unknown
      ) => Promise<unknown> | unknown)
    | undefined;
}) => {
  const { onSuccess } = props || {};

  const navigate = useNavigate();

  const {
    mutate: addActor,
    isPending: isLoading,
    error,
    ...mutationProps
  } = useMutation({
    mutationFn: actorEditorApi.addActor,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ['actors'] });
      onSuccess?.(data, variables, context);
      toast.success(`Актёр "${data.name}" успешно добавлен`);
      navigate(`/admin/actors/${data.id}`);
    },
    onError: (error) => {
      toast.error('Не удалось добавить актёра', {
        description: error.message,
      });
    },
  });

  return {
    addActor,
    isLoading,
    error,
    ...mutationProps,
  };
};
