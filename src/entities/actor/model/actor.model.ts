import type { IFilm } from '../../film/@x/actor';

export interface IActor {
  id: number;
  name: string;
  image: string;
  birthday: string;
  description: string;
  isVisible: boolean;
  createdAt: string;
  role: string;
}

export interface IFilmActor extends IActor {
  role: string;
}

export interface IActorWithFilms extends IActor {
  films: IFilm[];
}
