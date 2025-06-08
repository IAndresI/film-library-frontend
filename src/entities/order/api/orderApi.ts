import { apiInstance } from "@/shared/api/base";
import { queryOptions } from "@tanstack/react-query";
import type { IOrder } from "../dto";
import type {
  ColumnFiltersState,
  PaginationState,
  SortingState,
} from "@tanstack/react-table";
import type { IPaginationResponse } from "@/shared/model/pagination-response.model";

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
      queryKey: ["orders", userId, filters, sort, pagination],
      queryFn: apiInstance.get<IPaginationResponse<IOrder>>(
        `/orders/user/${userId}`,
        {
          params: {
            filters,
            sort,
            pageIndex: pagination.pageIndex,
            pageSize: pagination.pageSize,
          },
        },
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
      queryKey: ["orders", "admin", filters, sort, pagination],
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
};
