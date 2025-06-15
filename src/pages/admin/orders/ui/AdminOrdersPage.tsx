import { useState } from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import {
  type ColumnFiltersState,
  type PaginationState,
  type SortingState,
} from '@tanstack/react-table';
import { motion } from 'framer-motion';

import { orderApi } from '@/entities/order/api/order.api';
import { ordersTableColumns } from '@/entities/order/ui/orders-table-columns';

import { DataTable } from '@/shared/ui';
import { Separator } from '@/shared/ui/separator';

export const AdminOrdersPage = () => {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnSorting, setColumnSorting] = useState<SortingState>([]);

  const params = {
    filters: columnFilters,
    sort: columnSorting,
    pagination,
  };

  const { data: subscriptions } = useQuery({
    ...orderApi.getAllOrdersQueryOptions(params),
    placeholderData: keepPreviousData,
  });
  return (
    <motion.section
      className="col-span-3 lg:col-span-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.2 } }}
      exit={{ opacity: 0, transition: { duration: 0.2 } }}
      key={'admin_users'}
    >
      <div className="h-full px-4 py-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold tracking-tight">Заказы</h2>
          </div>
        </div>
        <Separator className="my-4" />

        <DataTable
          sorting={columnSorting}
          onSortingChange={setColumnSorting}
          columnFilters={columnFilters}
          onColumnFiltersChange={(filters) => {
            setColumnFilters(filters);
            setPagination((prev) => ({
              ...prev,
              pageIndex: 0,
            }));
          }}
          pagination={subscriptions?.pagination}
          onPaginationChange={setPagination}
          columns={ordersTableColumns}
          data={subscriptions?.data || []}
        />
      </div>
    </motion.section>
  );
};
