import { DataTable } from "@/shared/components/data-table/data-table";
import { Separator } from "@/shared/ui/separator";
import { motion } from "framer-motion";
import { useState } from "react";
import {
  type ColumnFiltersState,
  type PaginationState,
  type SortingState,
} from "@tanstack/react-table";
import { usersTableColumns } from "@/entities/user/ui/users-table-columns";
import { useQuery } from "@tanstack/react-query";
import { userApi } from "@/entities/user/api/userApi";

export const AdminUsersPage = () => {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);

  const { data: users } = useQuery(userApi.getAllUsersQueryOptions());

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
            <h2 className="text-2xl font-semibold tracking-tight">
              Пользователи
            </h2>
          </div>
        </div>
        <Separator className="my-4" />

        <DataTable
          sorting={sorting}
          onSortingChange={setSorting}
          columnFilters={columnFilters}
          onColumnFiltersChange={setColumnFilters}
          pagination={pagination}
          onPaginationChange={setPagination}
          columns={usersTableColumns}
          data={users || []}
        />
      </div>
    </motion.section>
  );
};
