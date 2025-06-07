import { apiInstance } from "@/shared/api/base";
import type { IActor, IActorWithFilms } from "@/entities/actor/dto";
import { queryOptions } from "@tanstack/react-query";

export const actorApi = {
  getAllActorsQueryOptions: () => {
    return queryOptions({
      queryKey: ["actors"],
      queryFn: apiInstance.get<IActor[]>("/actors"),
    });
  },
  getAllActorsAdminQueryOptions: () => {
    return queryOptions({
      queryKey: ["actors", "admin"],
      queryFn: apiInstance.get<IActor[]>("/actors/admin/all"),
    });
  },
  getActorQueryOptions: (id: number) => {
    return queryOptions({
      queryKey: ["actors", id],
      queryFn: apiInstance.get<IActorWithFilms>(`/actors/${id}`),
    });
  },
  getActorByIdAdminQueryOptions: (id: number) => {
    return queryOptions({
      queryKey: ["actors", "admin", id],
      queryFn: apiInstance.get<IActor>(`/actors/admin/${id}`),
    });
  },
  deleteActor: (id: number) => apiInstance.delete<IActor>(`/actors/${id}`),
};
