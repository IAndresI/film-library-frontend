import { useMutation } from "@tanstack/react-query";
import { filmEditorApi } from "../../api/filmEditorApi";
import { queryClient } from "@/shared/api/query-client";
import type { IFilm } from "@/entities/film/dto";
import type { IEditFilmData } from "../../model";

export const useEditFilmData = (props?: {
  onSuccess?:
    | ((
        data: IFilm,
        variables: IEditFilmData,
        context: unknown,
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
      queryClient.invalidateQueries({ queryKey: ["films"] });
      queryClient.invalidateQueries({ queryKey: ["films", variables.id] });
      onSuccess?.(data, variables, context);
    },
  });

  return {
    editFilm,
    isLoading,
    error,
    ...mutationProps,
  };
};
