import type { IFilm } from "../film/dto";
import type { IPlan } from "../subscription/dto";
import type { IUser } from "../user/dto";

export enum OrderStatusType {
  PENDING = "pending",
  PAID = "paid",
  FAILED = "failed",
  CANCELLED = "cancelled",
}

export enum OrderType {
  SUBSCRIPTION = "subscription",
  FILM = "film",
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
