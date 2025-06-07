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
  invalidateUserSubscription: (userId: number) => {
    return apiInstance.put<ISubscription>(
      `/subscriptions/invalidate/${userId}`,
    );
  },
  giveSubscriptionToUser: (data: { userId: number; planId: number }) => {
    return apiInstance.post<ISubscription>(`/subscriptions/manual`, data);
  },
};
