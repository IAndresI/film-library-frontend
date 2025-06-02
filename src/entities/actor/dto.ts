import type { IFilm } from "../film/dto";

export interface IActor {
  id: number;
  name: string;
  image: string;
  birthday: string;
  description: string;
}

export interface IActorWithMovies {
  id: number;
  name: string;
  image: string;
  birthday: string;
  description: string;
  movies: IFilm[];
}
