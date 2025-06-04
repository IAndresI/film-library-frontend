import type { ISubscription } from "../subscription/dto";

export interface IUser {
  id: string;
  avatar: string;
  name: string;
  email: string;
  created_at: string;
  subscription: ISubscription;
}
