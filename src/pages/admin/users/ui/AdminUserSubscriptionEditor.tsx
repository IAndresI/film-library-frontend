import type { IUser } from '@/entities/user/dto';

import React, { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

import { useUser } from '@/app/providers';

import { subscriptionApi } from '@/entities/subscription/api/subscriptionApi';
import { SubscriptionStatus } from '@/entities/subscription/dto';

import { queryClient } from '@/shared/api/query-client';
import { formatDate } from '@/shared/lib/helpers';
import { Button } from '@/shared/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select';

const invalidateUserSubscriptionQueryOptions = (
  userId: number,
  isCurrentUser: boolean
) => {
  queryClient.invalidateQueries({ queryKey: ['users'] });
  queryClient.invalidateQueries({ queryKey: ['users', userId] });
  queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
  if (isCurrentUser) {
    queryClient.invalidateQueries({ queryKey: ['user'] });
  }
};

export const AdminUserSubscriptionEditor = ({ user }: { user: IUser }) => {
  const currentUser = useUser();
  const [selectedPlan, setSelectedPlan] = useState<number | undefined>(
    undefined
  );
  const isActiveSubscription =
    user?.subscription &&
    user?.subscription.subscriptionStatus === SubscriptionStatus.ACTIVE;

  const { data: subscriptionPlans } = useQuery({
    ...subscriptionApi.getAllSubscriptionPlansQueryOptions(),
  });

  const {
    mutate: invalidateUserSubscription,
    isPending: isInvalidatingSubscription,
  } = useMutation({
    mutationFn: subscriptionApi.invalidateUserSubscription,
    onSuccess: (data) => {
      invalidateUserSubscriptionQueryOptions(
        data.id,
        data.userId === currentUser.id
      );
      toast.success(`Подписка пользователя "${user.name}" успешно отозвана`);
    },
    onError: (error) => {
      toast.error('Не удалось отозвать подписку', {
        description: error.message,
      });
    },
  });

  const { mutate: giveUserSubscription, isPending: isGivingSubscription } =
    useMutation({
      mutationFn: subscriptionApi.giveSubscriptionToUser,
      onSuccess: (data) => {
        invalidateUserSubscriptionQueryOptions(
          data.id,
          data.userId === currentUser.id
        );
        toast.success('Подпсика выдана', {
          description: `Пользователю "${user.name}" успешно выдана "${data.plan.name}"`,
        });
      },
      onError: (error) => {
        toast.error('Не удалось выдать подписку', {
          description: error.message,
        });
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
            <div className="text-muted-foreground text-sm">Доступен до:</div>
            {formatDate(user.subscription.expiresAt)}
          </div>
        </div>
      )}
      {!isActiveSubscription && <div>Подписка не оформлена</div>}
      <div className="mt-2 flex w-fit flex-col gap-2">
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
                  <SelectItem
                    key={plan.id}
                    value={plan.id.toString()}
                  >
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
