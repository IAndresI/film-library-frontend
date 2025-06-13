import type { IFilmActor } from '../../actor/@x/film';
import type { IGenre } from './genre.model';

export interface IFilm {
  id: number;
  name: string;
  description: string;
  releaseDate: string;
  createdAt: string;
  isVisible: boolean;
  genres: IGenre[];
  actors: IFilmActor[];
  isPaid: boolean;
  isPurchased: boolean;

  price?: number;
  image?: string;
  rating?: number;
  trailerUrl?: string;
  filmUrl?: string;
}
