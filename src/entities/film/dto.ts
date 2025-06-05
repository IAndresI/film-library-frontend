import type { IActor } from "../actor/dto";

export interface IGenre {
  icon: string;
  id: number;
  name: string;
}

export interface IFilm {
  id: number;
  name: string;
  description?: string;
  image?: string;
  releaseDate?: string;
  trailerUrl?: string;
  filmUrl?: string;
  createdAt?: string;
  isVisible?: boolean;
  rating?: number;
  genres: IGenre[];
  actors: IActor[];
}
