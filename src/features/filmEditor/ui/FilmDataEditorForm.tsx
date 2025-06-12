import * as React from "react";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";

import { useEditFilmData } from "../lib/hooks";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { Input } from "@/shared/ui/input";
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
import { MultiSelect } from "@/shared/ui/multi-select";
import { DatePicker } from "@/shared/ui/date-picker";
import { Textarea } from "@/shared/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { ImageInput } from "@/shared/ui/image-input";
import { Switch } from "@/shared/ui/switch";
import { useAddFilm } from "../lib/hooks/useAddFilm";
import { useEffect } from "react";
import { MEDIA_URL } from "@/shared/config";
import { formatDate } from "date-fns";
import type { IFilter } from "@/features/filters/dto";

const formSchema = z
  .object({
    name: z.string({ required_error: "Название фильма обязательно" }).min(2, {
      message: "Название фильма должно быть не менее 2 символов",
    }),
    description: z.string({ required_error: "Описание обязательно" }).min(20, {
      message: "Описание должно быть не менее 20 символов",
    }),
    image: z
      .union([
        z.instanceof(File, { message: "Выберите файл изображения" }),
        z.string().url("Неверный формат URL изображения"),
      ])
      .refine((value) => {
        if (typeof value === "string") return true;
        return value.size <= 5 * 1024 * 1024;
      }, "Размер файла не должен превышать 5MB")
      .refine((value) => {
        if (typeof value === "string") return true;
        return [
          "image/jpeg",
          "image/jpg",
          "image/png",
          "image/webp",
          "image/gif",
        ].includes(value.type);
      }, "Поддерживаются только форматы: JPEG, PNG, WebP, GIF"),
    genres: z
      .array(z.string(), { message: "Выберите хотя бы один жанр" })
      .min(1),
    release_date: z.date({
      message: "Введите дату выхода фильма",
    }),
    actors: z
      .array(
        z.object({
          id: z
            .number({
              required_error: "Выберите актёра",
              message: "Выберите актёра",
            })
            .min(1, { message: "Выберите актёра" }),
          role: z.string().optional(),
        }),
      )
      .optional(),
    isVisible: z.boolean(),
    isPaid: z.boolean(),
    price: z.coerce
      .number()
      .min(1, { message: "Цена не может быть меньше 1 рубля" })
      .optional(),
  })
  .refine(
    (data) => {
      if (data.isPaid && (data.price === undefined || data.price <= 0)) {
        return false;
      }
      return true;
    },
    {
      message: "Цена обязательна для платного фильма",
      path: ["price"],
    },
  );

export function FilmDataEditorForm({
  className,
  film,
  genresOptions,
  actorsOptions,
  ...props
}: {
  film?: IFilm;
  genresOptions: IFilter[];
  actorsOptions: IFilter[];
} & React.HTMLAttributes<HTMLFormElement>) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      isVisible: true,
      isPaid: false,
      actors: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "actors",
  });

  const { addFilm, isLoading } = useAddFilm();
  const { editFilm, isLoading: isLoadingEdit } = useEditFilmData();

  const isPaidValue = form.watch("isPaid");

  useEffect(() => {
    if (film) {
      form.reset({
        isVisible: film.isVisible,
        name: film.name,
        description: film.description,
        image: film?.image ? `${MEDIA_URL}${film.image}` : undefined,
        genres: film.genres.map((genre) => genre.id.toString()),
        release_date: new Date(film.releaseDate),
        actors: film.actors.map((actor) => ({
          id: actor.id,
          role: actor.role || undefined,
        })),
        price: film.price,
        isPaid: film.isPaid,
      });
    }
  }, [film, genresOptions]);

  useEffect(() => {
    if (!isPaidValue) {
      form.setValue("price", undefined);
    } else {
      form.setValue("price", film?.price);
    }
  }, [isPaidValue, form]);

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    const baseData = {
      ...data,
      release_date: formatDate(data.release_date, "yyyy-MM-dd"),
      actors: data.actors || [],
    };

    if (film) {
      // При редактировании передаем картинку только если она новая
      const editData =
        typeof data.image === "string"
          ? { ...baseData, image: undefined, id: film.id }
          : { ...baseData, image: data.image, id: film.id };

      editFilm(editData as Parameters<typeof editFilm>[0]);
    } else {
      // При создании картинка обязательна
      addFilm({ ...baseData, image: data.image as File });
    }
  };

  return (
    <Form {...form}>
      <form
        className={cn("grid gap-6", className)}
        {...props}
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="flex flex-col gap-4">
          <div className="grid w-full grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Название фильма</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Введите название фильма..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="genres"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Жанры</FormLabel>
                    <FormControl>
                      <MultiSelect
                        options={genresOptions}
                        onValueChange={field.onChange}
                        defaultValue={field.value?.map((el) => String(el))}
                        placeholder="Выберите жанры"
                        maxCount={4}
                        modalPopover
                        className="min-h-9"
                      />
                    </FormControl>
                    {/* <FormDescription>Choose all film genres.</FormDescription> */}
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <FormField
              control={form.control}
              name="release_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Дата выхода</FormLabel>
                  <FormControl>
                    <DatePicker
                      placeholder="Выберите дату выхода"
                      buttonClassName="flex w-full justify-start min-h-6"
                      date={field.value}
                      setDate={field.onChange}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Цена</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Введите цену..."
                      type="number"
                      disabled={!isPaidValue}
                      {...field}
                      value={isPaidValue ? field.value || "" : ""}
                      onChange={(e) => {
                        if (isPaidValue) {
                          field.onChange(e);
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isVisible"
              render={({ field }) => (
                <FormItem className="flex items-end gap-2">
                  <FormLabel>Видим для всех</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isPaid"
              render={({ field }) => (
                <FormItem className="flex items-end gap-2">
                  <FormLabel>Платный</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="actors"
              render={() => (
                <FormItem className="col-span-2">
                  <FormLabel className="mb-2 block">Актёры</FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      {fields.map((field, index) => (
                        <div
                          key={field.id}
                          className="grid grid-cols-2 items-start gap-2"
                        >
                          <FormField
                            control={form.control}
                            name={`actors.${index}.id`}
                            render={({ field }) => (
                              <FormItem className="flex flex-col">
                                <FormControl>
                                  <Select
                                    value={
                                      field.value && field.value > 0
                                        ? field.value.toString()
                                        : ""
                                    }
                                    onValueChange={(value) => {
                                      field.onChange(parseInt(value));
                                    }}
                                  >
                                    <SelectTrigger className="mb-0 max-h-[35px] min-h-[35px] flex-1">
                                      <SelectValue placeholder="Выберите актёра" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {actorsOptions.map((option) => (
                                        <SelectItem
                                          key={option.value}
                                          value={option.value}
                                        >
                                          {option.label}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <div className="flex gap-2">
                            <FormField
                              control={form.control}
                              name={`actors.${index}.role`}
                              render={({ field }) => (
                                <FormItem className="flex flex-col">
                                  <FormControl>
                                    <Input
                                      placeholder="Роль"
                                      value={field.value || ""}
                                      onChange={(e) => {
                                        field.onChange(e.target.value);
                                      }}
                                      className="flex-1"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => remove(index)}
                            >
                              Удалить
                            </Button>
                          </div>
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => append({ id: 0, role: "" })}
                      >
                        Добавить актёра
                      </Button>
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Описание</FormLabel>
                  <FormControl>
                    <Textarea
                      className="min-h-[150px]"
                      placeholder="Введите описание..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="image"
              render={({ field: { onChange, value } }) => (
                <FormItem>
                  <FormLabel>Изображение</FormLabel>
                  <FormControl>
                    <ImageInput
                      value={typeof value === "string" ? null : value}
                      onChange={onChange}
                      existingImageUrl={
                        typeof value === "string" ? value : undefined
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button
            className="w-full capitalize"
            type="submit"
            disabled={isLoading || isLoadingEdit || !form.formState.isDirty}
          >
            {isLoading || isLoadingEdit ? "Сохраняем..." : "Сохранить"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
