import { Separator } from "@/shared/ui/separator";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import { SvgSpinner } from "@/shared/ui/svg/SvgSpinner";
import { useMutation, useQuery } from "@tanstack/react-query";
import { orderApi } from "@/entities/order/api/orderApi";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import {
  CalendarIcon,
  CreditCardIcon,
  UserIcon,
  CheckCircleIcon,
  XCircleIcon,
  AlertCircleIcon,
  PlayIcon,
} from "lucide-react";
import { OrderStatusType, OrderType } from "@/entities/order/dto";
import { FilmCard } from "@/entities/film/ui/FilmCard";
import { Link } from "react-router-dom";
import { SvgAnimatedClock } from "@/shared/ui/svg/SvgAnimatedClock";
import { useEffect } from "react";
import { queryClient } from "@/shared/api/query-client";

export const OrderPage = ({ isAdmin }: { isAdmin?: boolean }) => {
  const { orderId } = useParams();

  const { data: order, isLoading } = useQuery({
    ...(isAdmin
      ? orderApi.getOrderByIdAdminQueryOptions({ orderId: Number(orderId) })
      : orderApi.getOrderByIdQueryOptions({ orderId: Number(orderId) })),
  });

  const { mutate: checkOrderStatus } = useMutation({
    mutationFn: orderApi.checkOrderStatus,
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({
          queryKey: ["order"],
        });
        queryClient.invalidateQueries({
          queryKey: ["orders"],
        });
        if (
          data.order.orderStatus === OrderStatusType.PAID &&
          data.order.orderType === OrderType.FILM
        ) {
          queryClient.invalidateQueries({
            queryKey: ["films"],
          });
        }
        if (
          data.order.orderStatus === OrderStatusType.PAID &&
          data.order.orderType === OrderType.SUBSCRIPTION
        ) {
          queryClient.invalidateQueries({
            queryKey: ["user"],
          });
        }
      }
    },
  });

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (order?.orderStatus === OrderStatusType.PENDING) {
      interval = setInterval(() => {
        checkOrderStatus(order?.id);
      }, 3000);
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [order]);

  return (
    <motion.section
      className="col-span-3 lg:col-span-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.2 } }}
      exit={{ opacity: 0, transition: { duration: 0.2 } }}
      key={"home"}
    >
      <div className="h-full px-4 py-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex w-full items-center justify-between">
            <h2 className="text-2xl font-semibold tracking-tight">
              Заказ №{order?.id}
            </h2>
          </div>
        </div>
        <Separator className="my-4" />

        {isLoading && (
          <div className="flex justify-center py-8">
            <SvgSpinner className="h-10 w-10" />
          </div>
        )}

        <div className="space-y-6">
          {!order && !isLoading && (
            <div className="flex justify-center py-8">
              <p className="text-muted-foreground">Заказ не найден</p>
            </div>
          )}
          {order && (
            <>
              {/* Основная информация о заказе */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCardIcon className="h-5 w-5" />
                    Информация о заказе
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <div className="flex items-center gap-2">
                      <UserIcon className="text-muted-foreground h-4 w-4" />
                      <span className="text-sm">
                        <span className="font-medium">Заказчик:</span>{" "}
                        {order.user.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="text-muted-foreground h-4 w-4" />
                      <span className="text-sm">
                        <span className="font-medium">Создан:</span>{" "}
                        {new Date(order.createdAt).toLocaleDateString("ru-RU")}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CreditCardIcon className="text-muted-foreground h-4 w-4" />
                      <span className="text-sm">
                        <span className="font-medium">Сумма:</span>{" "}
                        {order.amount} {order.currency}₽
                      </span>
                    </div>
                  </div>

                  {/* Статус заказа */}
                  <div className="flex items-center gap-2">
                    {order.orderStatus === OrderStatusType.PAID && (
                      <CheckCircleIcon className="h-6 w-6 text-green-500" />
                    )}
                    {order.orderStatus === OrderStatusType.PENDING && (
                      <SvgAnimatedClock />
                    )}
                    {order.orderStatus === OrderStatusType.FAILED && (
                      <XCircleIcon className="h-6 w-6 text-red-500" />
                    )}
                    {order.orderStatus === OrderStatusType.CANCELLED && (
                      <AlertCircleIcon className="h-6 w-6 text-gray-500" />
                    )}
                    <Badge
                      variant={
                        order.orderStatus === OrderStatusType.PAID
                          ? "default"
                          : order.orderStatus === OrderStatusType.PENDING
                            ? "secondary"
                            : order.orderStatus === OrderStatusType.FAILED
                              ? "destructive"
                              : "outline"
                      }
                    >
                      {order.orderStatus === OrderStatusType.PAID && "Оплачен"}
                      {order.orderStatus === OrderStatusType.PENDING &&
                        "Обрабатывается"}
                      {order.orderStatus === OrderStatusType.FAILED &&
                        "Ошибка оплаты"}
                      {order.orderStatus === OrderStatusType.CANCELLED &&
                        "Отменён"}
                    </Badge>
                  </div>

                  {order.paidAt && (
                    <div className="text-muted-foreground text-sm">
                      <span className="font-medium">Оплачен:</span>{" "}
                      {new Date(order.paidAt).toLocaleString("ru-RU")}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Контент в зависимости от типа заказа и статуса */}
              {order.orderStatus === OrderStatusType.PAID && (
                <>
                  {order.orderType === OrderType.SUBSCRIPTION && order.plan && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Подписка</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <h3 className="rainbow-text text-xl font-bold">
                            {order.plan.name}
                          </h3>
                          <p className="text-muted-foreground">
                            {order.plan.description}
                          </p>
                        </div>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          <div>
                            <span className="font-medium">Длительность:</span>{" "}
                            {order.plan.durationDays} дней
                          </div>
                          <div>
                            <span className="font-medium">Действует до:</span>{" "}
                            {new Date(order.expiresAt).toLocaleDateString(
                              "ru-RU",
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {order.orderType === OrderType.FILM && order.film && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Купленный фильм</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex flex-col gap-6 lg:flex-row">
                          <div className="w-[250px]">
                            <FilmCard
                              film={order.film}
                              aspectRatio="portrait"
                            />
                          </div>
                          <div className="flex-1 space-y-4">
                            <div>
                              <h3 className="text-2xl font-bold">
                                {order.film.name}
                              </h3>
                              <p className="text-muted-foreground">
                                {new Date(
                                  order.film.releaseDate || "",
                                ).getFullYear()}
                              </p>
                            </div>
                            {!isAdmin && (
                              <Link to={`/film/${order.film.id}/watch`}>
                                <Button size="lg" className="w-full lg:w-auto">
                                  <PlayIcon className="mr-2 h-5 w-5" />
                                  Смотреть фильм
                                </Button>
                              </Link>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </motion.section>
  );
};
