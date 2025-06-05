import type { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../../../shared/components/data-table/data-table-column-header";
import type { IOrder } from "../dto";
import { formatDate } from "@/shared/lib/helpers";
import { OrderStatus } from "@/shared/components/OrderStatus";

export const ordersTableColumns: ColumnDef<IOrder>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
    cell: ({ row }) => <div>{row.getValue("id")}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Дата создания" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          {formatDate(row.getValue("createdAt"))}
        </div>
      );
    },
  },
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Сумма" />
    ),
    cell: ({ row }) => {
      return <div className="flex space-x-2">{row.getValue("amount")} ₽</div>;
    },
  },
  {
    accessorKey: "paymentMethod",
    enableSorting: false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Метод оплаты" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">{row.getValue("paymentMethod")}</div>
      );
    },
  },
  {
    accessorKey: "paidAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Дата оплаты" />
    ),
    cell: ({ row }) => {
      const paidAt = row.original.paidAt;
      return (
        <div className="flex items-center">
          {paidAt ? formatDate(paidAt) : "-"}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Статус" />
    ),
    cell: ({ row }) => {
      return <OrderStatus size="small" status={row.getValue("status")} />;
    },
  },
];
