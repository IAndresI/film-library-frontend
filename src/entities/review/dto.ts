import type { IFilm } from "../film/dto";
import type { IUser } from "../user/dto";

export interface IReview {
  id: number;
  user: IUser;
  movie: IFilm;
  rating: number;
  text: string;
}

export interface IAllReviews {
  id: number;
  user: string;
  movie: number;
  rating: number;
  text: string;
}
