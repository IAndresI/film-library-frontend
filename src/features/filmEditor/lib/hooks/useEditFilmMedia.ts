import { useMutation } from "@tanstack/react-query";
import { filmEditorApi } from "../../api/filmEditorApi";
import { queryClient } from "@/shared/api/query-client";
import type { IFilm } from "@/entities/film/dto";
import { toast } from "sonner";

export const useEditFilmMedia = (props?: {
  onSuccess?:
    | ((
        data: IFilm,
        variables: {
          id: number;
          trailerFile?: string | File;
          filmFile?: string | File;
        },
        context: unknown,
      ) => Promise<unknown> | unknown)
    | undefined;
}) => {
  const { onSuccess } = props || {};

  const {
    mutate: editFilmMedia,
    isPending: isLoading,
    error,
    ...mutationProps
  } = useMutation({
    mutationFn: filmEditorApi.editFilmMedia,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ["films"] });
      queryClient.invalidateQueries({ queryKey: ["films", variables.id] });
      toast.success(`Медиа файлы фильма "${data.name}" успешно обновлены`);
      onSuccess?.(data, variables, context);
    },
    onError: (error) => {
      toast.error(`Не удалось обновить медиа файлы фильма`, {
        description: error.message,
      });
    },
  });

  return {
    editFilmMedia,
    isLoading,
    error,
    ...mutationProps,
  };
};
