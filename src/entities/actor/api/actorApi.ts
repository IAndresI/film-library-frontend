import { apiInstance } from "@/shared/api/base";
import type { IActor, IActorWithMovies } from "@/entities/actor/dto";
import { queryOptions } from "@tanstack/react-query";

export const actorApi = {
  getAllActorsQueryOptions: () => {
    return queryOptions({
      queryKey: ["actors"],
      queryFn: apiInstance.get<IActor[]>("/actors"),
    });
  },
  getActorQueryOptions: (id: number) => {
    return queryOptions({
      queryKey: ["actors", id],
      queryFn: apiInstance.get<IActorWithMovies>(`/actors/${id}`),
    });
  },
};
