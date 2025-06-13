import type { IFilm } from '@/entities/film/dto';
import type { ICreateFilmData, IEditFilmData } from '../model';

import { apiInstance } from '@/shared/api/base';

export const filmEditorApi = {
  addFilm: (film: ICreateFilmData) => {
    const formData = new FormData();
    formData.append('name', film.name);
    formData.append('description', film.description);
    formData.append('releaseDate', film.release_date);
    film.genres.forEach((genre, index) => {
      formData.append(`genres[${index}]`, genre);
    });
    film.actors.forEach((actor, index) => {
      formData.append(`actors[${index}][id]`, actor.id.toString());
      formData.append(`actors[${index}][role]`, actor.role || '');
    });
    formData.append('image', film.image);
    formData.append('isVisible', film.isVisible.toString());
    formData.append('isPaid', film.isPaid.toString());
    if (film.price) {
      formData.append('price', film.price.toString());
    } else {
      formData.append('price', 'null');
    }

    return apiInstance.post<IFilm>('/films', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  editFilmData: ({ id, ...film }: IEditFilmData) => {
    const formData = new FormData();
    formData.append('name', film.name);
    formData.append('description', film.description);
    formData.append('releaseDate', film.release_date);
    film.genres.forEach((genre, index) => {
      formData.append(`genres[${index}]`, genre);
    });
    film.actors.forEach((actor, index) => {
      formData.append(`actors[${index}][id]`, actor.id.toString());
      formData.append(`actors[${index}][role]`, actor.role || '');
    });
    if (film.image) {
      formData.append('image', film.image);
    }
    formData.append('isVisible', film.isVisible.toString());
    formData.append('isPaid', film.isPaid.toString());
    if (film.price) {
      formData.append('price', film.price.toString());
    } else {
      formData.append('price', 'null');
    }

    return apiInstance.put<IFilm>(`/films/${id}/data`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  editFilmMedia: ({
    id,
    trailerFile,
    filmFile,
  }: {
    id: number;
    trailerFile?: string | File;
    filmFile?: string | File;
  }) => {
    const formData = new FormData();
    if (filmFile === undefined) {
      formData.append('filmFile', 'null');
    } else if (typeof filmFile === 'object') {
      formData.append('filmFile', filmFile);
    }
    if (trailerFile === undefined) {
      formData.append('trailerFile', 'null');
    } else if (typeof trailerFile === 'object') {
      formData.append('trailerFile', trailerFile);
    }

    return apiInstance.put<IFilm>(`/films/${id}/media`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};
