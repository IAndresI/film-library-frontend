import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { filtersApi } from '../../api/reviewModerationApi';

export const useGetAllFilters = (isAdmin: boolean = false) => {
  const { data: filters, ...queryProps } = useQuery({
    ...(isAdmin
      ? filtersApi.getAllFiltersAdminQueryOptions()
      : filtersApi.getAllFiltersQueryOptions()),
    staleTime: 0,
    gcTime: 0,
    placeholderData: keepPreviousData,
  });

  return {
    filters,
    ...queryProps,
  };
};
