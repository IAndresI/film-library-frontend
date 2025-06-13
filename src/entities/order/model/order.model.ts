import type { IFilm } from '@/entities/film/@x/order';
import type { IPlan } from '@/entities/subscription/@x/order';
import type { IUser } from '@/entities/user/@x/order';

export enum OrderStatusType {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}

export enum OrderType {
  SUBSCRIPTION = 'subscription',
  FILM = 'film',
}

export interface IOrder {
  user: IUser;
  userId: number;
  id: number;
  createdAt: string;
  expiresAt: string;
  currency: string;
  amount: string;
  orderStatus: OrderStatusType;
  paymentMethod: string;
  externalPaymentId: string;
  metadata: unknown;

  orderType: OrderType;
  plan?: IPlan;
  planId?: number;
  film?: IFilm;
  filmId?: number;
  paidAt?: string;
}
