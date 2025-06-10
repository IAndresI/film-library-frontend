import { useQuery } from "@tanstack/react-query";
import { favoriteFilmActionsApi } from "../../api/favoriteFilmActionsApi";
import { useRemoveFromFavorites } from "./useRemoveFromFavorites";
import { useAddToFavorites } from "./useAddToFavorites";
import { useUser } from "@/app/providers";
import { useEffect, useRef, useState } from "react";
import axios, { type CancelTokenSource } from "axios";

export const useFavoritesActions = (filmId: number) => {
  const mutationAbortControllerRef = useRef<CancelTokenSource | null>(null);
  const [isInFavorite, setIsInFavorite] = useState<boolean>(false);
  const user = useUser();
  const {
    data: filmIds,
    isLoading,
    error,
    isSuccess,
  } = useQuery({
    ...favoriteFilmActionsApi.getUserFavoriteFilmsIdsQueryOptions({
      userId: user.id,
    }),
  });

  useEffect(() => {
    if (filmIds) {
      setIsInFavorite(filmIds.includes(filmId));
    }
  }, [isSuccess]);
  const { removeFromFavorites, isLoading: isRemovingFavorite } =
    useRemoveFromFavorites({
      mutationFn: async (data) => {
        if (mutationAbortControllerRef.current) {
          mutationAbortControllerRef.current.cancel();
        }
        const source = axios.CancelToken.source();
        mutationAbortControllerRef.current = source;

        return favoriteFilmActionsApi.removeUserFavorites({
          ...data,
          cancelToken: source.token,
        });
      },
      onMutate: () => {
        setIsInFavorite(false);
      },
    });
  const { addToFavorites, isLoading: isAddingFavorite } = useAddToFavorites({
    mutationFn: async (data) => {
      if (mutationAbortControllerRef.current) {
        mutationAbortControllerRef.current.cancel();
      }
      const source = axios.CancelToken.source();
      mutationAbortControllerRef.current = source;

      return favoriteFilmActionsApi.addUserFavorites({
        ...data,
        cancelToken: source.token,
      });
    },
    onMutate: () => {
      setIsInFavorite(true);
    },
  });

  const toggleFavorite = () => {
    if (isInFavorite) {
      removeFromFavorites({ userId: user.id, filmId: filmId });
    } else {
      addToFavorites({ userId: user.id, filmId: filmId });
    }
  };

  return {
    filmIds,
    removeFromFavorites,
    addToFavorites,
    isLoading,
    isRemovingFavorite,
    isAddingFavorite,
    error,
    isInFavorite,
    toggleFavorite,
  };
};
