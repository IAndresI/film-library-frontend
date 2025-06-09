import { orderApi } from "@/entities/order/api/orderApi";
import { ordersTableColumns } from "@/entities/order/ui/orders-table-columns";
import { SubscriptionStatus } from "@/entities/subscription/dto";
import { userApi } from "@/entities/user/api/userApi";
import { UserDataEditorForm } from "@/features/userDataEditor/ui";
import { DataTable } from "@/shared/components";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Separator } from "@/shared/ui/separator";
import { SvgCrown } from "@/shared/ui/svg/SvgCrown";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import type {
  ColumnFiltersState,
  PaginationState,
  SortingState,
} from "@tanstack/react-table";
import { motion } from "framer-motion";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { AdminUserSubscriptionEditor } from "./AdminUserSubscriptionEditor";
import { getImageUrl } from "@/shared/lib/utils";

export const AdminUserInfoPage = () => {
  const [activeTab, setActiveTab] = useState<
    "data" | "subscription" | "history"
  >("data");
  const { id } = useParams<{ id: string }>();

  const { data: user } = useQuery({
    ...userApi.getUserByIdQueryOptions(+id!),
    enabled: !!id,
  });

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);

  const isActiveSubscription =
    user?.subscription &&
    user?.subscription.subscriptionStatus === SubscriptionStatus.ACTIVE;

  const params = {
    filters: columnFilters,
    sort: sorting,
    pagination: pagination,
    userId: Number(user?.id),
  };

  const { data: orders } = useQuery({
    ...orderApi.getAllUserOrdersQueryOptions(params),
    enabled: !!user?.id,
  });

  return (
    <motion.section
      className="col-span-3 lg:col-span-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.2 } }}
      exit={{ opacity: 0, transition: { duration: 0.2 } }}
      key={"admin_film_editor"}
    >
      <div className="h-full px-4 py-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold tracking-tight">
              Информация о пользователе {user?.name}
            </h2>
          </div>
        </div>
        <Separator className="my-4" />
        {user && (
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
              value={activeTab}
              onValueChange={(value) =>
                setActiveTab(value as "data" | "subscription" | "history")
              }
              className="w-full"
            >
              <TabsList>
                <TabsTrigger value="data">Данные</TabsTrigger>
                <TabsTrigger value="subscription">Подписка</TabsTrigger>
                <TabsTrigger value="history">История оплат</TabsTrigger>
              </TabsList>
              <TabsContent value="data">
                <UserDataEditorForm userData={user} />
              </TabsContent>
              <TabsContent value="subscription">
                <AdminUserSubscriptionEditor user={user} />
              </TabsContent>
              <TabsContent value="history">
                <DataTable
                  sorting={sorting}
                  onSortingChange={setSorting}
                  columnFilters={columnFilters}
                  onColumnFiltersChange={setColumnFilters}
                  pagination={orders?.pagination}
                  onPaginationChange={setPagination}
                  columns={ordersTableColumns}
                  data={orders?.data || []}
                />
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </motion.section>
  );
};
