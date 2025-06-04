import { useMutation } from "@tanstack/react-query";
import { userSubscription } from "../../api/userSubscription";

export const useCreatePayment = (props?: {
  onSuccess?:
    | ((
        data: {
          success: true;
          message: string;
          paymentUrl: string;
          orderId: string;
        },
        variables: { planId: number; redirectUrl: string },
        context: unknown,
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
    mutationFn: userSubscription.createPayment,
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
