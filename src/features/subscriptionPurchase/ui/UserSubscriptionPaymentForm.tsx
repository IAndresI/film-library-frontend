import type { IPlan } from '@/entities/subscription/model';

import * as React from 'react';
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { subscriptionApi } from '@/entities/subscription/api';

import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select';

import { useCreateSubscriptionPayment } from '../lib/hooks';

export function UserSubscriptionPaymentForm({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const [selectedPlan, setSelectedPlan] = useState<IPlan>();

  const { data: subscriptionPlans } = useQuery({
    ...subscriptionApi.getAllSubscriptionPlansQueryOptions(),
  });

  const { createPayment, isLoading } = useCreateSubscriptionPayment();

  useEffect(() => {
    if (subscriptionPlans) {
      setSelectedPlan(subscriptionPlans[0]);
    }
  }, [subscriptionPlans]);

  return (
    <div
      className={cn('grid gap-6', className)}
      {...props}
    >
      <div className="flex flex-col items-center gap-4">
        <h3 className="text-[30px] font-bold">За {selectedPlan?.price}₽</h3>
        <div className="mx-auto flex w-full max-w-[300px] flex-col items-center justify-center gap-4 px-5">
          <Select
            disabled={isLoading}
            value={selectedPlan?.id.toString()}
            onValueChange={(value) => {
              setSelectedPlan(
                subscriptionPlans?.find((plan) => plan.id.toString() === value)
              );
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Выберите план" />
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
          {selectedPlan && (
            <Button
              className="w-full text-lg capitalize"
              size="lg"
              variant={'rainbow'}
              disabled={isLoading}
              onClick={() => {
                createPayment({
                  planId: selectedPlan.id,
                });
              }}
            >
              {isLoading ? 'Создаём платеж...' : 'Стать Premium'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
