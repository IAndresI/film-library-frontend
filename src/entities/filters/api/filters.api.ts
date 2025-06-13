import type { IFilter } from '@/entities/filters/model';

import { queryOptions } from '@tanstack/react-query';

import { apiInstance } from '@/shared/api/base';

export const filtersApi = {
  getAllFiltersQueryOptions: () => {
    return queryOptions({
      queryKey: ['filters'],
      queryFn: apiInstance.get<{
        films: IFilter[];
        genres: IFilter[];
        actors: IFilter[];
      }>('/filters/all'),
    });
  },
  getAllFiltersAdminQueryOptions: () => {
    return queryOptions({
      queryKey: ['filters', 'admin'],
      queryFn: apiInstance.get<{
        films: IFilter[];
        genres: IFilter[];
        actors: IFilter[];
      }>('/filters/all/admin'),
    });
  },
};
