import { useState } from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import {
  type ColumnFiltersState,
  type PaginationState,
  type SortingState,
} from '@tanstack/react-table';
import { motion } from 'framer-motion';

import { userApi } from '@/entities/user/api/user.api';
import { usersTableColumns } from '@/entities/user/ui/users-table-columns';

import { DataTable } from '@/shared/ui';
import { Separator } from '@/shared/ui/separator';

export const AdminUsersPage = () => {
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

  const { data: users } = useQuery({
    ...userApi.getAllUsersQueryOptions(params),
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
            <h2 className="text-2xl font-semibold tracking-tight">
              Пользователи
            </h2>
          </div>
        </div>
        <Separator className="my-4" />

        <DataTable
          searchField="name"
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
          pagination={users?.pagination}
          onPaginationChange={setPagination}
          columns={usersTableColumns}
          data={users?.data || []}
        />
      </div>
    </motion.section>
  );
};
