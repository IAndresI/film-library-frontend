import type { IPaginationResponse } from '@/shared/model/pagination-response.model';
import type {
  ColumnFiltersState,
  PaginationState,
  SortingState,
} from '@tanstack/react-table';
import type { IPlan, ISubscription } from '../dto';

import { queryOptions } from '@tanstack/react-query';

import { apiInstance } from '@/shared/api/base';

export const subscriptionApi = {
  getAllSubscriptionPlansQueryOptions: () => {
    return queryOptions({
      queryKey: ['subscriptions'],
      queryFn: apiInstance.get<IPlan[]>(`/subscriptions/plans`),
    });
  },
  getAllSubscriptionsQueryOptions: ({
    filters,
    sort,
    pagination,
  }: {
    filters: ColumnFiltersState;
    sort: SortingState;
    pagination: PaginationState;
  }) => {
    return queryOptions({
      queryKey: ['subscriptions', 'admin', filters, sort, pagination],
      queryFn: apiInstance.get<IPaginationResponse<ISubscription>>(
        `/subscriptions/all`,
        {
          params: {
            filters,
            sort,
            pageIndex: pagination.pageIndex,
            pageSize: pagination.pageSize,
          },
        }
      ),
    });
  },
  invalidateUserSubscription: (userId: number) => {
    return apiInstance.put<ISubscription>(
      `/subscriptions/invalidate/${userId}`
    );
  },
  giveSubscriptionToUser: (data: { userId: number; planId: number }) => {
    return apiInstance.post<ISubscription>(`/subscriptions/manual`, data);
  },
};
