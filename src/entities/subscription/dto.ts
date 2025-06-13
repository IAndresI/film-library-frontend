import type { IUser } from '../user/dto';

export enum SubscriptionStatus {
  ACTIVE = 'active',
  EXPIRED = 'expired',
  CANCELLED = 'cancelled',
}

export interface ISubscription {
  id: number;
  userId: number;
  planId: number;
  orderId: number;
  subscriptionStatus: SubscriptionStatus;
  startedAt: string;
  expiresAt: string;
  autoRenew: boolean;
  createdAt: string;
  user: IUser;
  plan: IPlan;
}

export interface IPlan {
  id: number;
  name: string;
  price: string;
  durationDays: number;
  description: string;
}
