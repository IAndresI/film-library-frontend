import { subscriptionApi } from "@/entities/subscription/api/subscriptionApi";
import { SubscriptionStatus } from "@/entities/subscription/dto";
import type { IUser } from "@/entities/user/dto";
import { queryClient } from "@/shared/api/query-client";
import { formatDate } from "@/shared/lib/helpers";
import { Button } from "@/shared/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";

import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useState } from "react";

export const AdminUserSubscriptionEditor = ({ user }: { user: IUser }) => {
  const [selectedPlan, setSelectedPlan] = useState<number | undefined>(
    undefined,
  );
  const isActiveSubscription =
    user?.subscription &&
    user?.subscription.status === SubscriptionStatus.ACTIVE;

  const { data: subscriptionPlans } = useQuery({
    ...subscriptionApi.getAllSubscriptionPlansQueryOptions(),
  });

  const {
    mutate: invalidateUserSubscription,
    isPending: isInvalidatingSubscription,
    error: invalidateUserSubscriptionError,
  } = useMutation({
    mutationFn: subscriptionApi.invalidateUserSubscription,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users", user.id] });
    },
  });

  const {
    mutate: giveUserSubscription,
    isPending: isGivingSubscription,
    error: giveUserSubscriptionError,
  } = useMutation({
    mutationFn: subscriptionApi.giveSubscriptionToUser,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["users", variables.userId] });
    },
  });

  return (
    <React.Fragment>
      {isActiveSubscription && (
        <div className="flex flex-col gap-2">
          <div>
            <div>Оформлена:</div>
            <div className="flex items-center gap-2">
              <span className="rainbow-text text-xl font-bold">
                {user.subscription.name}
              </span>
            </div>
          </div>
          <div>
            <div className="text-muted-foreground text-sm">
              Дата оформления:{" "}
            </div>
            {formatDate(user.subscription.startedAt)}
          </div>
          <div>
            <div className="text-muted-foreground text-sm">Доступен до:</div>
            {formatDate(user.subscription.expiresAt)}
          </div>
        </div>
      )}
      {!isActiveSubscription && <div>Подписка не оформлена</div>}
      <div className="mt-2 flex gap-2">
        {(invalidateUserSubscriptionError || giveUserSubscriptionError) && (
          <div className="text-sm text-red-500">
            {invalidateUserSubscriptionError?.message ||
              giveUserSubscriptionError?.message}
          </div>
        )}

        {!isActiveSubscription && (
          <div className="flex flex-col gap-2">
            <Select
              value={selectedPlan ? String(selectedPlan) : undefined}
              onValueChange={(value) => setSelectedPlan(Number(value))}
            >
              <SelectTrigger className="w-[300px]">
                <SelectValue placeholder="Выберите подписку" />
              </SelectTrigger>
              <SelectContent>
                {subscriptionPlans?.map((plan) => (
                  <SelectItem key={plan.id} value={plan.id.toString()}>
                    {plan.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              disabled={isGivingSubscription || !selectedPlan}
              onClick={() =>
                giveUserSubscription({
                  userId: user.id,
                  planId: Number(selectedPlan),
                })
              }
            >
              Выдать подписку
            </Button>
          </div>
        )}
        {isActiveSubscription && (
          <Button
            disabled={isInvalidatingSubscription}
            onClick={() => invalidateUserSubscription(user.id)}
          >
            Отозвать подписку
          </Button>
        )}
      </div>
    </React.Fragment>
  );
};
