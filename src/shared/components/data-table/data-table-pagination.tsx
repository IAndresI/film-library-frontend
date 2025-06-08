import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from "@radix-ui/react-icons";
import type { Table } from "@tanstack/react-table";

import { Button } from "../../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import type { IPagination } from "@/shared/model/pagination-response.model";

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
  pagination?: IPagination;
}

export function DataTablePagination<TData>({
  table,
  pagination,
}: DataTablePaginationProps<TData>) {
  const hasNextPage = pagination
    ? pagination?.hasNextPage
    : table.getCanNextPage();
  const hasPreviousPage = pagination
    ? pagination?.hasPreviousPage
    : table.getCanPreviousPage();

  const currentPage =
    pagination && pagination?.totalPages === 0
      ? 0
      : pagination?.totalPages
        ? pagination?.pageIndex + 1
        : table.getState().pagination.pageIndex + 1;

  return (
    <div className="flex justify-end px-2">
      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Показывать</p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[3, 10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex w-[120px] items-center justify-center text-sm font-medium">
          Страница {currentPage} из{" "}
          {pagination?.totalPages || table.getPageCount()}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => table.setPageIndex(0)}
            disabled={!hasPreviousPage}
          >
            <span className="sr-only">На первую страницу</span>
            <DoubleArrowLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.previousPage()}
            disabled={!hasPreviousPage}
          >
            <span className="sr-only">На предыдущую страницу</span>
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.nextPage()}
            disabled={!hasNextPage}
          >
            <span className="sr-only">На следующую страницу</span>
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() =>
              table.setPageIndex(
                pagination?.totalPages
                  ? pagination?.totalPages - 1
                  : table.getPageCount() - 1,
              )
            }
            disabled={!hasNextPage}
          >
            <span className="sr-only">На последнюю страницу</span>
            <DoubleArrowRightIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
