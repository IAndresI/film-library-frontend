import type { IOrder } from '@/entities/order/model';
import type { IPaginationResponse } from '@/shared/model/pagination-response.model';
import type {
  ColumnFiltersState,
  PaginationState,
  SortingState,
} from '@tanstack/react-table';

import { queryOptions } from '@tanstack/react-query';

import { apiInstance } from '@/shared/api/base';

export const orderApi = {
  getAllUserOrdersQueryOptions: ({
    filters,
    sort,
    pagination,
    userId,
  }: {
    filters: ColumnFiltersState;
    sort: SortingState;
    pagination: PaginationState;
    userId: number;
  }) => {
    return queryOptions({
      queryKey: ['orders', userId, filters, sort, pagination],
      queryFn: apiInstance.get<IPaginationResponse<IOrder>>(
        `/orders/user/${userId}`,
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
  getAllOrdersQueryOptions: ({
    filters,
    sort,
    pagination,
  }: {
    filters: ColumnFiltersState;
    sort: SortingState;
    pagination: PaginationState;
  }) => {
    return queryOptions({
      queryKey: ['orders', 'admin', filters, sort, pagination],
      queryFn: apiInstance.get<IPaginationResponse<IOrder>>(`/orders`, {
        params: {
          filters,
          sort,
          pageIndex: pagination.pageIndex,
          pageSize: pagination.pageSize,
        },
      }),
    });
  },
  getOrderByIdQueryOptions: ({ orderId }: { orderId: number }) => {
    return queryOptions({
      queryKey: ['order', orderId],
      queryFn: apiInstance.get<IOrder>(`/orders/${orderId}`),
    });
  },
  getOrderByIdAdminQueryOptions: ({ orderId }: { orderId: number }) => {
    return queryOptions({
      queryKey: ['order', 'admin', orderId],
      queryFn: apiInstance.get<IOrder>(`/orders/admin/${orderId}`),
    });
  },
  checkOrderStatus: (orderId: number) =>
    apiInstance.post<{
      success: boolean;
      message: string;
      order: IOrder;
    }>(`/orders/check/${orderId}`),
};
