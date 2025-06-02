import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import type { Row } from "@tanstack/react-table";

import { Button } from "../../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import type { JSX } from "react";

interface Task {
  id: string;
  title: string;
  status: string;
  label: string;
  priority: string;
}

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
  editModal: JSX.Element;
  deleteModal: JSX.Element;
}

export function DataTableRowActions<TData>({
  row,
  editModal,
  deleteModal,
}: DataTableRowActionsProps<TData>) {
  const task = row.original as Task;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="data-[state=open]:bg-muted flex h-8 w-8 p-0"
        >
          <DotsHorizontalIcon className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent id={task.id} align="end" className="w-[160px]">
        <DropdownMenuItem asChild>{editModal}</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>{deleteModal}</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
