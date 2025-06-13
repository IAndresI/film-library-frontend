import type { IFilm } from '@/entities/film/dto';
import type { ICreateFilmData } from '../../model';

import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { queryClient } from '@/shared/api/query-client';

import { filmEditorApi } from '../../api/filmEditorApi';

export const useAddFilm = (props?: {
  onSuccess?:
    | ((
        data: IFilm,
        variables: ICreateFilmData,
        context: unknown
      ) => Promise<unknown> | unknown)
    | undefined;
}) => {
  const { onSuccess } = props || {};

  const navigate = useNavigate();

  const {
    mutate: addFilm,
    isPending: isLoading,
    error,
    ...mutationProps
  } = useMutation({
    mutationFn: filmEditorApi.addFilm,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ['films'] });
      onSuccess?.(data, variables, context);
      toast.success('Фильм успешно создан');
      navigate(`/admin/films/${data.id}`);
    },
    onError: (error) => {
      toast.error('Не удалось создать фильм', {
        description: error.message,
      });
    },
  });

  return {
    addFilm,
    isLoading,
    error,
    ...mutationProps,
  };
};
