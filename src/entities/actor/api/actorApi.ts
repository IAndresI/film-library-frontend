import { apiInstance } from "@/shared/api/base";
import type { IActor, IActorWithMovies } from "@/entities/actor/dto";
import { queryOptions } from "@tanstack/react-query";

export const actorApi = {
  getAllActorsQueryOptions: () => {
    return queryOptions({
      queryKey: ["actors"],
      queryFn: apiInstance.get<IActor[]>("/actor/"),
    });
  },
  getActorQueryOptions: (id: number) => {
    return queryOptions({
      queryKey: ["actor", id],
      queryFn: apiInstance.get<IActorWithMovies>(`/actor/${id}/`),
    });
  },
};
