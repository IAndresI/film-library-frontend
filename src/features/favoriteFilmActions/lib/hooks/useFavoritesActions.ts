import type { CancelTokenSource } from 'axios';

import { useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';

import { useUser } from '@/app/providers';

import { queryClient } from '@/shared/api/query-client';

import { favoriteFilmActionsApi } from '../../api/favoriteFilmActionsApi';
import { useAddToFavorites } from './useAddToFavorites';
import { useRemoveFromFavorites } from './useRemoveFromFavorites';

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

  console.log(filmIds);

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
      onError: (error, variables) => {
        if (error.code !== 408) {
          toast.error('Не удалось удалить из избранного');
        }

        queryClient.setQueryData(
          ['favorites-ids', variables.userId],
          (oldData: number[]) => [...oldData, variables.filmId]
        );
        setIsInFavorite(true);
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
    onError: (error, variables) => {
      if (error.code !== 408) {
        toast.error('Не удалось добавить в избранное');
      }
      queryClient.setQueryData(
        ['favorites-ids', variables.userId],
        (oldData: number[]) => oldData.filter((id) => id !== variables.filmId)
      );
      setIsInFavorite(false);
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
