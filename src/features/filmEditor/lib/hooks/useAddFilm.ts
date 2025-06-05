import { useMutation } from "@tanstack/react-query";
import { filmEditorApi } from "../../api/filmEditorApi";
import { queryClient } from "@/shared/api/query-client";
import type { IFilm } from "@/entities/film/dto";

import { useNavigate } from "react-router-dom";
import type { ICreateFilmData } from "../../model";

export const useAddFilm = (props?: {
  onSuccess?:
    | ((
        data: IFilm,
        variables: ICreateFilmData,
        context: unknown,
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
      queryClient.invalidateQueries({ queryKey: ["films"] });
      onSuccess?.(data, variables, context);
      navigate(`/admin/films/${data.id}`);
    },
  });

  return {
    addFilm,
    isLoading,
    error,
    ...mutationProps,
  };
};
