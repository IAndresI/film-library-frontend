export interface IEditFilmData {
  id: number;
  actors: {
    id: number;
    role?: string;
  }[];
  name: string;
  description: string;
  image?: File;
  genres: string[];
  release_date: string;
  isVisible: boolean;
}
