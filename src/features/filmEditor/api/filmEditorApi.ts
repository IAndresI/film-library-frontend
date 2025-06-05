import type { IFilm } from "@/entities/film/dto";
import { apiInstance } from "@/shared/api/base";
import type { ICreateFilmData, IEditFilmData } from "../model";

export const filmEditorApi = {
  addFilm: (film: ICreateFilmData) => {
    const formData = new FormData();
    formData.append("name", film.name);
    formData.append("description", film.description);
    formData.append("releaseDate", film.release_date);
    film.genres.forEach((genre, index) => {
      formData.append(`genres[${index}]`, genre);
    });
    film.actors.forEach((actor, index) => {
      formData.append(`actors[${index}][id]`, actor.id.toString());
      formData.append(`actors[${index}][role]`, actor.role || "");
    });
    formData.append("image", film.image);
    formData.append("isVisible", film.isVisible.toString());

    return apiInstance.post<IFilm>("/films", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  editFilmData: ({ id, ...film }: IEditFilmData) => {
    const formData = new FormData();
    formData.append("name", film.name);
    formData.append("description", film.description);
    formData.append("releaseDate", film.release_date);
    film.genres.forEach((genre, index) => {
      formData.append(`genres[${index}]`, genre);
    });
    film.actors.forEach((actor, index) => {
      formData.append(`actors[${index}][id]`, actor.id.toString());
      formData.append(`actors[${index}][role]`, actor.role || "");
    });
    if (film.image) {
      formData.append("image", film.image);
    }
    formData.append("isVisible", film.isVisible.toString());

    return apiInstance.put<IFilm>(`/films/${id}/data`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  editFilmMedia: ({ id, media }: { id: number; media: FormData }) =>
    apiInstance.put<IFilm>(`/films/${id}/media`, media),
};
