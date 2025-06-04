import { apiInstance } from "@/shared/api/base";

export const userSubscription = {
  createPayment: (data: { planId: number; redirectUrl: string }) =>
    apiInstance.post<{
      success: true;
      message: string;
      paymentUrl: string;
      orderId: string;
    }>("/payments/create", data),
};
