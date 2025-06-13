import type { IUser } from '@/entities/user/@x/subscription';
import type { IPlan } from './plan.model';

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
