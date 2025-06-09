import type { IFilter } from "@/features/filters/dto";
import { apiInstance } from "@/shared/api/base";
import { queryOptions } from "@tanstack/react-query";

export const filtersApi = {
  getAllFiltersQueryOptions: () => {
    return queryOptions({
      queryKey: ["filters"],
      queryFn: apiInstance.get<{
        films: IFilter[];
        genres: IFilter[];
        actors: IFilter[];
      }>("/filters/all"),
    });
  },
  getAllFiltersAdminQueryOptions: () => {
    return queryOptions({
      queryKey: ["filters", "admin"],
      queryFn: apiInstance.get<{
        films: IFilter[];
        genres: IFilter[];
        actors: IFilter[];
      }>("/filters/all/admin"),
    });
  },
};
