import * as React from "react";
import { cn } from "@/shared/lib/utils";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { IFilm } from "@/entities/film/dto";
import {
  FormControl,
  FormItem,
  FormField,
  FormLabel,
  FormMessage,
  Form,
} from "@/shared/ui/form";

import { VideoInput } from "@/shared/ui/video-input";
import { useEffect } from "react";
import { MEDIA_URL } from "@/shared/config";
import { Button } from "@/shared/ui/button";
import { useEditFilmMedia } from "../lib/hooks/useEditFilmMedia";

const formSchema = z.object({
  video: z
    .union([
      z.instanceof(File, { message: "Выберите файл видео" }),
      z.string().url("Неверный формат URL видео"),
    ])
    .refine((value) => {
      if (typeof value === "string") return true;
      return value.size <= 1000 * 1024 * 1024;
    }, "Размер файла не должен превышать 1000MB")
    .refine((value) => {
      if (typeof value === "string") return true;
      return [
        "video/mp4",
        "video/mov",
        "video/avi",
        "video/webm",
        "video/quicktime",
      ].includes(value.type);
    }, "Поддерживаются только форматы: MP4, MOV, AVI, WebM")
    .optional(),
  trailer: z
    .union([
      z.instanceof(File, { message: "Выберите файл трейлера" }),
      z.string().url("Неверный формат URL трейлера"),
    ])
    .refine((value) => {
      if (typeof value === "string") return true;
      return value.size <= 500 * 1024 * 1024;
    }, "Размер файла не должен превышать 500MB")
    .refine((value) => {
      if (typeof value === "string") return true;
      return [
        "video/mp4",
        "video/mov",
        "video/avi",
        "video/webm",
        "video/quicktime",
      ].includes(value.type);
    }, "Поддерживаются только форматы: MP4, MOV, AVI, WebM")
    .optional(),
});

export function FilmMediaEditorForm({
  className,
  film,
  ...props
}: {
  film: IFilm;
} & React.HTMLAttributes<HTMLFormElement>) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const { editFilmMedia, isLoading: isLoadingEditMedia } = useEditFilmMedia();

  useEffect(() => {
    if (film) {
      form.reset({
        video: film?.filmUrl ? `${MEDIA_URL}${film.filmUrl}` : undefined,
        trailer: film?.trailerUrl
          ? `${MEDIA_URL}${film.trailerUrl}`
          : undefined,
      });
    }
  }, [film]);

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    editFilmMedia({
      id: film.id,
      trailerFile: data.trailer,
      filmFile: data.video,
    });
  };

  return (
    <Form {...form}>
      <form
        className={cn("grid gap-6", className)}
        {...props}
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="flex flex-col gap-4">
          <div className="grid w-full grid-cols-1 gap-4">
            <FormField
              control={form.control}
              name="video"
              render={({ field: { onChange, value } }) => (
                <FormItem>
                  <FormLabel>Фильм</FormLabel>
                  <FormControl>
                    <VideoInput
                      className="min-h-[391.25px]"
                      value={typeof value === "string" ? null : value || null}
                      onChange={onChange}
                      existingVideoUrl={
                        typeof value === "string" ? value : undefined
                      }
                      label="видео фильма"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="trailer"
              render={({ field: { onChange, value } }) => (
                <FormItem>
                  <FormLabel>Трейлер</FormLabel>
                  <FormControl>
                    <VideoInput
                      value={typeof value === "string" ? null : value || null}
                      onChange={onChange}
                      existingVideoUrl={
                        typeof value === "string" ? value : undefined
                      }
                      label="трейлер фильма"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <Button
          className="w-full capitalize"
          type="submit"
          disabled={isLoadingEditMedia}
        >
          {isLoadingEditMedia ? "Сохраняем..." : "Сохранить"}
        </Button>
      </form>
    </Form>
  );
}
