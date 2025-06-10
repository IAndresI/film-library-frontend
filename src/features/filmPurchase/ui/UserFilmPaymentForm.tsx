import * as React from "react";
import { cn } from "@/shared/lib/utils";
import { Button, type ButtonProps } from "@/shared/ui/button";
import { useCreateFilmPayment } from "../lib/hooks";
import { SvgPayment } from "@/shared/ui/svg/SvgPayment";

export function UserFilmPaymentForm({
  className,
  filmId,
  userId,
  price,
  ...props
}: Omit<ButtonProps, "children"> & {
  filmId: number;
  userId: number;
  price: number;
}) {
  const { createFilmPayment, isLoading } = useCreateFilmPayment();

  return (
    <Button
      {...props}
      className={cn("h-12 gap-1 p-0 px-5", className)}
      variant="outline"
      disabled={isLoading}
      onClick={() => {
        createFilmPayment({
          userId,
          filmId,
          redirectUrl: window.location.origin + "/profile/history",
        });
      }}
    >
      {isLoading ? (
        "Создаём платеж..."
      ) : (
        <React.Fragment>
          <SvgPayment className="mr-2 min-h-[24px] min-w-[24px]" />
          Купить <span className="rainbow-text font-bold">НАВСЕГДА</span> за
          <span className="font-bold">{price}₽</span>
        </React.Fragment>
      )}
    </Button>
  );
}
