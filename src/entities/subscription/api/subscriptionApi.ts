import { apiInstance } from "@/shared/api/base";
import { queryOptions } from "@tanstack/react-query";
import type { ISubscription } from "../dto";

export const subscriptionApi = {
  getAllSubscriptionPlansQueryOptions: () => {
    return queryOptions({
      queryKey: ["subscriptions"],
      queryFn: apiInstance.get<ISubscription[]>(`/subscriptions/plans`),
    });
  },
};
