import type { Column, Table } from '@tanstack/react-table';

import {
  ArrowDownIcon,
  ArrowUpIcon,
  CaretSortIcon,
  EyeNoneIcon,
} from '@radix-ui/react-icons';

import { cn } from '@/shared/lib/utils';

import { Button } from '../../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../ui/dropdown-menu';

interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  table?: Table<TData>;
  title: string;
  useMetaSortName?: boolean;
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  table,
  title,
  useMetaSortName = false,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <div className={cn(className)}>{title}</div>;
  }

  const sortField = useMetaSortName
    ? column.columnDef.meta?.sortField
    : undefined;
  const sortId = sortField || column.id;

  const currentSort =
    useMetaSortName && table
      ? table.getState().sorting.find((sort) => sort.id === sortId)
      : undefined;

  const isSorted =
    useMetaSortName && table
      ? currentSort?.desc === false
        ? 'asc'
        : currentSort?.desc === true
          ? 'desc'
          : false
      : column.getIsSorted();

  const handleSort = (desc: boolean) => {
    if (useMetaSortName && table && sortId) {
      const newSorting = [{ id: sortId, desc }];
      table.setSorting(newSorting);
    } else {
      column.toggleSorting(desc);
    }
  };

  return (
    <div className={cn('flex items-center space-x-2', className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="data-[state=open]:bg-accent -ml-3 h-8"
          >
            <span>{title}</span>
            {isSorted === 'asc' ? (
              <ArrowDownIcon className="ml-2 h-4 w-4" />
            ) : isSorted === 'desc' ? (
              <ArrowUpIcon className="ml-2 h-4 w-4" />
            ) : (
              <CaretSortIcon className="ml-2 h-4 w-4" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={() => handleSort(false)}>
            <ArrowUpIcon className="text-muted-foreground/70 mr-2 h-3.5 w-3.5" />
            По убыванию
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleSort(true)}>
            <ArrowDownIcon className="text-muted-foreground/70 mr-2 h-3.5 w-3.5" />
            По возрастанию
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
            <EyeNoneIcon className="text-muted-foreground/70 mr-2 h-3.5 w-3.5" />
            Скрыть
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
