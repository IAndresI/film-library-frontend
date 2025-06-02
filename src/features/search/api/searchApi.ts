import type { IActor } from "@/entities/actor/dto";
import type { IFilm } from "@/entities/film/dto";
import { apiInstance } from "@/shared/api/base";
import { queryOptions } from "@tanstack/react-query";

export const searchApi = {
  search: (query?: string) => {
    return queryOptions({
      queryKey: ["search"],
      queryFn: apiInstance.get<{
        movies: IFilm[];
        actors: IActor[];
      }>("/search/", { params: { query } }),
    });
  },
};
