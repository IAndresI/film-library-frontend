import type { IActor } from '@/entities/actor/dto';
import type { IFilm } from '@/entities/film/dto';

import { queryOptions } from '@tanstack/react-query';

import { apiInstance } from '@/shared/api/base';

export const searchApi = {
  search: (query?: string) => {
    return queryOptions({
      queryKey: ['search'],
      queryFn: apiInstance.get<{
        movies: IFilm[];
        actors: IActor[];
      }>('/search/', { params: { query } }),
    });
  },
};
