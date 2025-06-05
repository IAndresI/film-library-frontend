export enum OrderStatusType {
  PENDING = "pending",
  PAID = "paid",
  FAILED = "failed",
  CANCELLED = "cancelled",
}

export interface IOrder {
  planId: number;
  userId: number;
  id: number;
  createdAt: string;
  expiresAt: string;
  currency: string;
  amount: string;
  status: OrderStatusType;
  paymentMethod: string;
  externalPaymentId: string;
  metadata: unknown;
  paidAt?: string;
}
