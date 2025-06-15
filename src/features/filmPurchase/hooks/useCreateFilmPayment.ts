import { useMutation } from '@tanstack/react-query';

import { filmPurchaseApi } from '../api/filmPurchase.api';

export const useCreateFilmPayment = (props?: {
  onSuccess?:
    | ((
        data: {
          success: true;
          message: string;
          paymentUrl: string;
          orderId: string;
        },
        variables: { userId: number; filmId: number; redirectUrl?: string },
        context: unknown
      ) => Promise<unknown> | unknown)
    | undefined;
}) => {
  const { onSuccess } = props || {};

  const {
    mutate: createFilmPayment,
    isPending: isLoading,
    error,
    ...mutationProps
  } = useMutation({
    mutationFn: filmPurchaseApi.createFilmPayment,
    onSuccess: (data, variables, context) => {
      if (data.paymentUrl) {
        window.location.href = data.paymentUrl;
      }
      onSuccess?.(data, variables, context);
    },
  });

  return {
    createFilmPayment,
    isLoading,
    error,
    ...mutationProps,
  };
};
