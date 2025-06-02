import { DataTable } from "@/shared/components/data-table/data-table";
import { Separator } from "@/shared/ui/separator";
import { motion } from "framer-motion";
import { useState } from "react";
import {
  type ColumnFiltersState,
  type PaginationState,
  type SortingState,
} from "@tanstack/react-table";
import type { IUser } from "@/entities/user/dto";
import { usersTableColumns } from "@/entities/user/ui/users-table-columns";

const tempFilms: IUser[] = [
  {
    id: "1",
    name: "Andre Spez",
    email: "andrei200277@gmail.com",
    created_at: "2024-01-12",
    avatar: "https://placehold.jp/250x333.png",
  },
  {
    id: "1",
    name: "Spez Alex",
    email: "alex@gmail.com",
    created_at: "2023-10-10",
    avatar: "https://placehold.jp/250x333.png",
  },
];

export const AdminUsersPage = () => {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
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
            <h2 className="text-2xl font-semibold tracking-tight">Users</h2>
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
          data={tempFilms}
        />
      </div>
    </motion.section>
  );
};
