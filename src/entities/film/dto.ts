import type { IActor } from "../actor/dto";

export interface IGenre {
  id: number;
  name: string;
  image: string;
}

export interface IFilm {
  id: number;
  name: string;
  description: string;
  image: string;
  genres: IGenre[];
  release_date: string;
  created_at: string;
  rating: number;
  actors: IActor[];
  trailer_link: string;
}
