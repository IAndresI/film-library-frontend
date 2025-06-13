import type { ISubscription } from '@/entities/subscription/@x/user';

export interface IUser {
  id: number;
  avatar: string;
  name: string;
  email: string;
  created_at: string;
  subscription: ISubscription;
  isAdmin: boolean;
}
