import type { IFilm } from '@/entities/film/@x/review';
import type { IUser } from '@/entities/user/@x/review';

export interface IReview {
  id: number;
  rating: number;
  text: string;
  createdAt: string;
  isApproved: boolean;
  user: IUser;
  film: IFilm;
}
