import { useMutation, type MutationFunction } from "@tanstack/react-query";
import { queryClient } from "@/shared/api/query-client";
import type { IFilm } from "@/entities/film/dto";

export const useAddToFavorites = (props?: {
  mutationFn:
    | MutationFunction<
        IFilm,
        {
          userId: number;
          filmId: number;
        }
      >
    | undefined;
  onSettled?:
    | ((
        data: IFilm | undefined,
        error: Error | null,
        variables: {
          userId: number;
          filmId: number;
        },
        context: void | undefined,
      ) => Promise<unknown> | unknown)
    | undefined;
  onMutate?:
    | ((variables: {
        userId: number;
        filmId: number;
      }) => void | Promise<void | undefined> | undefined)
    | undefined;
  onSuccess?:
    | ((
        data: IFilm,
        variables: { filmId: number },
        context: unknown,
      ) => Promise<unknown> | unknown)
    | undefined;
}) => {
  const { onSuccess, onMutate, onSettled, mutationFn } = props || {};

  const {
    mutate: addToFavorites,
    isPending: isLoading,
    error,
    ...mutationProps
  } = useMutation({
    mutationFn: mutationFn,
    onMutate: (variables) => {
      queryClient.setQueryData(
        ["favorites-ids", variables.userId],
        (oldData: number[]) => [...oldData, variables.filmId],
      );
      onMutate?.(variables);
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: ["favorites"],
      });

      onSuccess?.(data, variables, context);
    },
    onSettled: (data, error, variables) => {
      onSettled?.(data, error, variables);
    },
    retry: false,
  });

  return {
    addToFavorites,
    isLoading,
    error,
    ...mutationProps,
  };
};
