import * as React from "react";
import { cn } from "@/shared/lib/helpers";
import { Button } from "@/shared/ui/button";

import { useEditActorData, useAddActor } from "../lib/hooks";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "@/shared/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FormControl,
  FormItem,
  FormField,
  FormLabel,
  FormMessage,
  Form,
} from "@/shared/ui/form";
import { DatePicker } from "@/shared/ui/date-picker";
import { Textarea } from "@/shared/ui/textarea";
import type { IActor } from "@/entities/actor/dto";
import { ImageInput } from "@/shared/ui/image-input";
import { Switch } from "@/shared/ui/switch";
import { useEffect } from "react";
import { formatDate } from "date-fns";
import { getImageUrl } from "@/shared/lib/utils";

const formSchema = z.object({
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
  birthday: z.date({
    message: "Введите дату рождения актёра",
  }),
  isVisible: z.boolean(),
});

export function ActorDataEditorForm({
  className,
  actor,
  ...props
}: {
  actor?: IActor;
} & React.HTMLAttributes<HTMLFormElement>) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      isVisible: false,
    },
  });
  const { addActor, isLoading } = useAddActor();
  const { editActor, isLoading: isLoadingEdit } = useEditActorData();

  useEffect(() => {
    if (actor) {
      form.reset({
        isVisible: actor.isVisible,
        name: actor.name,
        description: actor.description,
        image: getImageUrl(actor.image),
        birthday: actor.birthday ? new Date(actor.birthday) : undefined,
      });
    }
  }, [actor]);

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    const baseData = {
      ...data,
      birthday: formatDate(data.birthday, "yyyy-MM-dd"),
    };

    if (actor) {
      // При редактировании передаем картинку только если она новая
      const editData =
        typeof data.image === "string"
          ? { ...baseData, image: undefined, id: actor.id }
          : { ...baseData, image: data.image, id: actor.id };

      editActor(editData as Parameters<typeof editActor>[0]);
    } else {
      // При создании картинка обязательна
      addActor({ ...baseData, image: data.image as File });
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
                  <FormLabel>Имя актёра</FormLabel>
                  <FormControl>
                    <Input placeholder="Введите имя актёра..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="birthday"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Дата рождения</FormLabel>
                  <FormControl>
                    <DatePicker
                      placeholder="Выберите дату рождения"
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
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Описание</FormLabel>
                  <FormControl>
                    <Textarea
                      className="min-h-[232px]"
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
            <FormField
              control={form.control}
              name="isVisible"
              render={({ field }) => (
                <FormItem className="flex items-end gap-2">
                  <FormLabel>Видимость</FormLabel>
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
          </div>
          <Button
            className="w-full capitalize"
            type="submit"
            disabled={isLoading || isLoadingEdit}
          >
            {isLoading || isLoadingEdit ? "Сохраняем..." : "Сохранить"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
