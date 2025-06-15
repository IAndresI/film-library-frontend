import type { IFilm } from '@/entities/film/model';
import type { IEditFilmData } from '../model';

import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import { queryClient } from '@/shared/api/query-client';

import { filmEditorApi } from '../api/filmEditor.api';

export const useEditFilmData = (props?: {
  onSuccess?:
    | ((
        data: IFilm,
        variables: IEditFilmData,
        context: unknown
      ) => Promise<unknown> | unknown)
    | undefined;
}) => {
  const { onSuccess } = props || {};

  const {
    mutate: editFilm,
    isPending: isLoading,
    error,
    ...mutationProps
  } = useMutation({
    mutationFn: filmEditorApi.editFilmData,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ['films'] });
      queryClient.invalidateQueries({ queryKey: ['films', variables.id] });
      toast.success(`Данные фильма "${data.name}" успешно обновлены`);
      onSuccess?.(data, variables, context);
    },
    onError: (error) => {
      toast.error('Не удалось обновить фильм', {
        description: error.message,
      });
    },
  });

  return {
    editFilm,
    isLoading,
    error,
    ...mutationProps,
  };
};
