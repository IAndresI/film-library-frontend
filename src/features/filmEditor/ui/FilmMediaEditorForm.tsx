import type { IFilm } from '@/entities/film/model';

import * as React from 'react';
import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { filmApi } from '@/entities/film/api/film.api';

import { API_BASE_URL, MEDIA_BASE_URL } from '@/shared/config';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/ui/form';
import { VideoInput } from '@/shared/ui/video-input';

import { useEditFilmMedia } from '../hooks/useEditFilmMedia';

const formSchema = z.object({
  video: z
    .union([
      z.instanceof(File, { message: 'Выберите файл видео' }),
      z.string().url('Неверный формат URL видео'),
    ])
    .refine((value) => {
      if (typeof value === 'string') return true;
      return value.size <= 1000 * 1024 * 1024;
    }, 'Размер файла не должен превышать 1000MB')
    .refine((value) => {
      if (typeof value === 'string') return true;
      return [
        'video/mp4',
        'video/mov',
        'video/avi',
        'video/webm',
        'video/quicktime',
      ].includes(value.type);
    }, 'Поддерживаются только форматы: MP4, MOV, AVI, WebM')
    .optional(),
  trailer: z
    .union([
      z.instanceof(File, { message: 'Выберите файл трейлера' }),
      z.string().url('Неверный формат URL трейлера'),
    ])
    .refine((value) => {
      if (typeof value === 'string') return true;
      return value.size <= 500 * 1024 * 1024;
    }, 'Размер файла не должен превышать 500MB')
    .refine((value) => {
      if (typeof value === 'string') return true;
      return [
        'video/mp4',
        'video/mov',
        'video/avi',
        'video/webm',
        'video/quicktime',
      ].includes(value.type);
    }, 'Поддерживаются только форматы: MP4, MOV, AVI, WebM')
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

  const { mutate: generateFilmToken, data: filmToken } = useMutation({
    mutationFn: filmApi.generateAdminFilmToken,
  });

  const { mutate: refreshFilmToken } = useMutation({
    mutationFn: filmApi.refreshAdminFilmToken,
  });

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (filmToken) {
      interval = setInterval(
        () => {
          refreshFilmToken({
            filmId: film.id,
            tokenId: filmToken.tokenId,
          });
        },
        filmToken.expiresIn * 1000 - 5 * 60 * 1000
      );
    }
    return () => clearInterval(interval);
  }, [filmToken]);

  useEffect(() => {
    if (film?.id && film.filmUrl) {
      generateFilmToken(film?.id);
    }
  }, [film]);

  const { editFilmMedia, isLoading: isLoadingEditMedia } = useEditFilmMedia();

  useEffect(() => {
    if (film) {
      form.reset({
        video: film?.filmUrl ? `${MEDIA_BASE_URL}${film.filmUrl}` : undefined,
        trailer: film?.trailerUrl
          ? `${MEDIA_BASE_URL}${film.trailerUrl}`
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
        className={cn('grid gap-6', className)}
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
                      value={typeof value === 'string' ? null : value || null}
                      onChange={onChange}
                      existingVideoUrl={
                        typeof value === 'string' && filmToken
                          ? `${API_BASE_URL}${filmToken.streamUrl}`
                          : undefined
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
                      value={typeof value === 'string' ? null : value || null}
                      onChange={onChange}
                      existingVideoUrl={
                        typeof value === 'string' ? value : undefined
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
          disabled={isLoadingEditMedia || !form.formState.isDirty}
        >
          {isLoadingEditMedia ? 'Сохраняем...' : 'Сохранить'}
        </Button>
      </form>
    </Form>
  );
}
