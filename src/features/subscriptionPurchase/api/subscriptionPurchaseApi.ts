import { apiInstance } from "@/shared/api/base";

export const subscriptionPurchaseApi = {
  createSubscriptionPayment: (data: { planId: number; redirectUrl: string }) =>
    apiInstance.post<{
      success: true;
      message: string;
      paymentUrl: string;
      orderId: string;
    }>("/payments/subscription/create", data),
};
