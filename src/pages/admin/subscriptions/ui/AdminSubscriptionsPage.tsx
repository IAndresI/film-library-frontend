import { DataTable } from "@/shared/components/data-table/data-table";
import { Separator } from "@/shared/ui/separator";
import { motion } from "framer-motion";
import { useState } from "react";
import {
  type ColumnFiltersState,
  type PaginationState,
  type SortingState,
} from "@tanstack/react-table";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { subscriptionApi } from "@/entities/subscription/api";
import { subscriptionsTableColumns } from "@/entities/subscription";

export const AdminSubscriptionsPage = () => {
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
    ...subscriptionApi.getAllSubscriptionsQueryOptions(params),
    placeholderData: keepPreviousData,
  });
  return (
    <motion.section
      className="col-span-3 lg:col-span-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.2 } }}
      exit={{ opacity: 0, transition: { duration: 0.2 } }}
      key={"admin_users"}
    >
      <div className="h-full px-4 py-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold tracking-tight">Подписки</h2>
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
          columns={subscriptionsTableColumns}
          data={subscriptions?.data || []}
        />
      </div>
    </motion.section>
  );
};
