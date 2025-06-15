import { useMutation } from '@tanstack/react-query';

import { subscriptionPurchaseApi } from '../api/subscriptionPurchase.api';

export const useCreateSubscriptionPayment = (props?: {
  onSuccess?:
    | ((
        data: {
          success: true;
          message: string;
          paymentUrl: string;
          orderId: string;
        },
        variables: { planId: number; redirectUrl?: string },
        context: unknown
      ) => Promise<unknown> | unknown)
    | undefined;
}) => {
  const { onSuccess } = props || {};

  const {
    mutate: createPayment,
    isPending: isLoading,
    error,
    ...mutationProps
  } = useMutation({
    mutationFn: subscriptionPurchaseApi.createSubscriptionPayment,
    onSuccess: (data, variables, context) => {
      if (data.paymentUrl) {
        window.location.href = data.paymentUrl;
      }
      onSuccess?.(data, variables, context);
    },
  });

  return {
    createPayment,
    isLoading,
    error,
    ...mutationProps,
  };
};
