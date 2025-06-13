import type { PaginationState, SortingState } from '@tanstack/react-table';

import { useState } from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';

import { UserDataEditorForm } from '@/features/userDataEditor/ui/UserDataEditorForm';

import { orderApi } from '@/entities/order/api/order.api';
import { userOrdersTableColumns } from '@/entities/order/ui/user-orders-table-columns';
import { SubscriptionStatus } from '@/entities/subscription/model';
import { useUser } from '@/entities/user/providers';

import { DataTable } from '@/shared/components';
import { formatDate } from '@/shared/lib/helpers';
import { getImageUrl } from '@/shared/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import { Button } from '@/shared/ui/button';
import { Separator } from '@/shared/ui/separator';
import { SvgCrown } from '@/shared/ui/svg/SvgCrown';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';

export const ProfilePage = () => {
  const user = useUser();
  const location = useLocation();
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([]);

  const isActiveSubscription =
    user.subscription &&
    user.subscription.subscriptionStatus === SubscriptionStatus.ACTIVE;

  const isExpiredSubscription =
    user.subscription &&
    user.subscription.subscriptionStatus === SubscriptionStatus.EXPIRED;

  const isCancelledSubscription =
    user.subscription &&
    user.subscription.subscriptionStatus === SubscriptionStatus.CANCELLED;

  const isNoSubscription = !user.subscription;

  const params = {
    filters: [],
    sort: sorting,
    pagination: pagination,
    userId: user.id,
  };

  const { data: orders } = useQuery({
    ...orderApi.getAllUserOrdersQueryOptions(params),
    placeholderData: keepPreviousData,
  });

  return (
    <motion.section
      className="col-span-3 lg:col-span-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.2 } }}
      exit={{ opacity: 0, transition: { duration: 0.2 } }}
      key={'home'}
    >
      <div className="h-full px-4 py-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight">Профиль</h1>
          </div>
        </div>
        <Separator className="my-4" />

        <div className="grid gap-4 pb-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Avatar className="size-20">
                <AvatarImage src={getImageUrl(user.avatar)} />
                <AvatarFallback className="text-[35px] uppercase">
                  {user.name.slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              {isActiveSubscription && (
                <SvgCrown
                  gradient
                  className="absolute -top-[15px] -right-[5px] size-8 rotate-[35deg]"
                />
              )}
            </div>
            <span>
              <h2 className="text-2xl font-semibold tracking-tight">
                {user.name}
              </h2>
              <p className="text-muted-foreground text-sm">{user.email}</p>
            </span>
          </div>
          <Tabs
            value={location.pathname}
            className="w-full"
          >
            <TabsList>
              <TabsTrigger
                asChild
                value="/profile"
              >
                <Link to="/profile">Данные</Link>
              </TabsTrigger>
              <TabsTrigger
                asChild
                value="/profile/subscription"
              >
                <Link to="/profile/subscription">Подписка</Link>
              </TabsTrigger>
              <TabsTrigger
                asChild
                value="/profile/history"
              >
                <Link to="/profile/history">История оплат</Link>
              </TabsTrigger>
            </TabsList>
            <TabsContent value="/profile">
              <UserDataEditorForm userData={user} />
            </TabsContent>
            <TabsContent value="/profile/subscription">
              {isActiveSubscription && (
                <div className="flex flex-col gap-2">
                  <div>
                    <div>У вас оформлена:</div>
                    <div className="flex items-center gap-2">
                      <span className="rainbow-text text-xl font-bold">
                        {user.subscription.plan.name}
                      </span>
                    </div>
                  </div>
                  <div>
                    <div className="text-muted-foreground text-sm">
                      Дата оформления:{' '}
                    </div>
                    {formatDate(user.subscription.startedAt)}
                  </div>
                  <div>
                    <div className="text-muted-foreground text-sm">
                      Безлимитный доступ к контенту будет доступен до:
                    </div>
                    {formatDate(user.subscription.expiresAt)}
                  </div>
                </div>
              )}
              {isExpiredSubscription && (
                <div className="flex flex-col gap-2">
                  <div>
                    <div>Ваша подписка истекла:</div>
                    <span className="text-muted-foreground text-sm">
                      {formatDate(user.subscription.expiresAt)}
                    </span>
                  </div>
                  <Button
                    size="lg"
                    className="w-fit"
                    asChild
                    variant="rainbow"
                  >
                    <Link to="/premium">Продлить подписку</Link>
                  </Button>
                </div>
              )}
              {isCancelledSubscription && (
                <div className="flex flex-col gap-2">
                  <div>
                    <div>Ваша подписка отменена:</div>
                    <span className="text-muted-foreground text-sm">
                      {user.subscription.plan.name}
                    </span>
                  </div>
                  <Button
                    size="lg"
                    className="w-fit"
                    asChild
                    variant="rainbow"
                  >
                    <Link to="/premium">Оформить подписку</Link>
                  </Button>
                </div>
              )}
              {isNoSubscription && (
                <div className="flex flex-col gap-2">
                  <div>
                    Оформите{' '}
                    <span className="rainbow-text font-semibold">подписку</span>{' '}
                    и получите безлимитный доступ к кино-новинкам!
                  </div>
                  <Button
                    size="lg"
                    className="w-fit"
                    asChild
                    variant="rainbow"
                  >
                    <Link to="/premium">Стать Premium</Link>
                  </Button>
                </div>
              )}
            </TabsContent>
            <TabsContent value="/profile/history">
              <DataTable
                sorting={sorting}
                onSortingChange={setSorting}
                pagination={orders?.pagination}
                onPaginationChange={setPagination}
                columns={userOrdersTableColumns}
                data={orders?.data || []}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </motion.section>
  );
};
