import type { IFilm } from '../film/dto';
import type { IUser } from '../user/dto';

export interface IReview {
  id: number;
  rating: number;
  text: string;
  createdAt: string;
  isApproved: boolean;
  user: IUser;
  film: IFilm;
}

export interface IAllReviews {
  id: number;
  user: string;
  movie: number;
  rating: number;
  text: string;
}
