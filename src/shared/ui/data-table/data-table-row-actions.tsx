import type { Row } from '@tanstack/react-table';
import type { JSX } from 'react';

import React from 'react';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { Link } from 'react-router-dom';

import { Button } from '../../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../ui/dropdown-menu';

interface Task {
  id: string;
  title: string;
  status: string;
  label: string;
  priority: string;
}

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
  deleteModal?: JSX.Element;
  editModal?: JSX.Element;
  actions?: (
    | {
        title: string;
        link: string;
      }
    | JSX.Element
  )[];
}

export function DataTableRowActions<TData>({
  row,
  editModal,
  deleteModal,
  actions,
}: DataTableRowActionsProps<TData>) {
  const task = row.original as Task;

  const allActions = [
    ...(editModal ? [editModal] : []),
    ...(deleteModal ? [deleteModal] : []),
    ...(actions || []),
  ];

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
      <DropdownMenuContent
        id={task.id}
        align="end"
        className="w-[160px]"
      >
        {allActions.map((action, i, arr) => {
          return (
            <React.Fragment key={`action_${i}_${row.id}`}>
              {typeof action === 'object' && 'link' in action ? (
                <DropdownMenuItem asChild>
                  <Link
                    className="cursor-pointer rounded-md px-4"
                    to={action.link}
                  >
                    {action.title}
                  </Link>
                </DropdownMenuItem>
              ) : (
                action
              )}
              {i !== arr.length - 1 && <DropdownMenuSeparator />}
            </React.Fragment>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
