import { useQuery } from '@tanstack/react-query';

import { favoriteFilmActionsApi } from '../../api/favoriteFilmActionsApi';

export const useIsFilmInFavorites = (userId: number, filmId: number) => {
  const {
    data: isFilmInFavorites,
    isLoading,
    error,
    ...queryProps
  } = useQuery(
    favoriteFilmActionsApi.checkFavoriteStatusQueryOptions({
      userId,
      filmId,
    })
  );

  return {
    isFilmInFavorites,
    isLoading,
    error,
    ...queryProps,
  };
};
