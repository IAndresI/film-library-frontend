export enum SubscriptionStatus {
  ACTIVE = "active",
  EXPIRED = "expired",
}

export interface ISubscription {
  id: number;
  status: SubscriptionStatus;
  startedAt: string;
  expiresAt: string;
  autoRenew: boolean;
  name: string;
  price: string;
}
