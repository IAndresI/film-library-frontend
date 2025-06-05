import { apiInstance } from "@/shared/api/base";
import { queryOptions } from "@tanstack/react-query";
import type { IOrder } from "../dto";

export const orderApi = {
  getAllUserOrdersQueryOptions: (userId: number) => {
    return queryOptions({
      queryKey: ["orders", userId],
      queryFn: apiInstance.get<IOrder[]>(`/orders/user/${userId}`),
    });
  },
};
