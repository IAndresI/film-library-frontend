import React from "react";
import { cn } from "@/shared/lib/utils";
import type { OrderStatusType } from "@/entities/order/dto";

const statuses = {
  pending: {
    styles: "bg-yellow-100 text-yellow-800 border-yellow-300",
    label: "Обрабатывается",
  },
  paid: {
    styles: "bg-green-100 text-green-800 border-green-300",
    label: "Оплачен",
  },
  failed: {
    styles: "bg-red-100 text-red-800 border-red-300",
    label: "Не оплачен",
  },
  cancelled: {
    styles: "bg-muted text-muted-foreground border-border",
    label: "Отменен",
  },
};

interface IOrderStatusProps extends React.ComponentProps<"div"> {
  status: OrderStatusType;
  size?: "small" | "normal";
}

export const OrderStatus = ({
  status,
  size = "normal",
  className,
  children,
  ...props
}: IOrderStatusProps) => {
  const currentStatus = statuses[status];
  return (
    <div
      {...props}
      className={cn(
        "flex items-center justify-center rounded",
        currentStatus?.styles,
        size === "small"
          ? "h-6 w-[120px] text-xs"
          : "h-10 w-[150px] border text-base",
        className,
      )}
    >
      {children || currentStatus?.label || "Неизвестный статус"}
    </div>
  );
};
