import { useState } from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import {
  type ColumnFiltersState,
  type PaginationState,
  type SortingState,
} from '@tanstack/react-table';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

import { actorApi } from '@/entities/actor/api/actorApi';
import { actorsTableColumns } from '@/entities/actor/ui/actors-table-columns';

import { DataTable } from '@/shared/components/data-table/data-table';
import { Button } from '@/shared/ui/button';
import { Separator } from '@/shared/ui/separator';

export const AdminActorsPage = () => {
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

  const {
    data: actors,
    isLoading: isActorsLoading,
    isFetching: isActorsFetching,
  } = useQuery({
    ...actorApi.getAllActorsAdminQueryOptions(params),
    placeholderData: keepPreviousData,
  });

  console.log(isActorsLoading, isActorsFetching);

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
            <h2 className="text-2xl font-semibold tracking-tight">Актёры</h2>
          </div>
          <Button asChild>
            <Link to="/admin/actors/adding">Добавить актёра</Link>
          </Button>
        </div>
        <Separator className="my-4" />

        <DataTable
          searchField="name"
          isLoading={isActorsLoading}
          isFetching={isActorsFetching}
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
          pagination={actors?.pagination}
          onPaginationChange={setPagination}
          columns={actorsTableColumns}
          data={actors?.data || []}
        />
      </div>
    </motion.section>
  );
};
