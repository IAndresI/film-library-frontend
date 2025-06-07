import type { IFilm } from "../film/dto";

export interface IActor {
  id: number;
  name: string;
  image: string;
  birthday: string;
  description: string;
  isVisible: boolean;
}

export interface IFilmActor extends IActor {
  role: string;
}

export interface IActorWithFilms extends IActor {
  films: IFilm[];
}
