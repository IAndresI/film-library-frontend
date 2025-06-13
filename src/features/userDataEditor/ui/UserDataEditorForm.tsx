import * as React from "react";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";

import { useEditUserData } from "../lib/hooks";
import { useForm } from "react-hook-form";
import { z } from "zod";
import type { IUser } from "@/entities/user/dto";
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
import { ImageInput } from "@/shared/ui/image-input";
import { getImageUrl } from "@/shared/lib/utils";
import { queryClient } from "@/shared/api/query-client";
import { Switch } from "@/shared/ui/switch";
import { useUser } from "@/app/providers";

const formSchema = z.object({
  name: z.string({ required_error: "Имя обязательно" }).min(3, {
    message: "Имя должно быть не менее 3 символов",
  }),
  avatar: z
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
    }, "Поддерживаются только форматы: JPEG, PNG, WebP, GIF")
    .optional(),
  isAdmin: z.boolean().optional(),
});

export function UserDataEditorForm({
  className,
  userData,
  ...props
}: {
  userData: IUser;
} & React.HTMLAttributes<HTMLFormElement>) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  const currentUser = useUser();
  const { editUserData, isLoading } = useEditUserData({
    onSuccess: (user) => {
      if (userData.id === currentUser.id) {
        queryClient.setQueryData(["user"], user);
      }
    },
  });

  React.useEffect(() => {
    form.reset({
      name: userData.name,
      avatar: getImageUrl(userData.avatar),
      isAdmin: userData.isAdmin,
    });
  }, [userData.avatar]);

  const onSubmit = ({ avatar, ...data }: z.infer<typeof formSchema>) => {
    const editData =
      typeof avatar === "undefined"
        ? { ...data, avatar: null, id: userData.id }
        : typeof avatar === "string"
          ? { ...data, id: userData.id }
          : { ...data, avatar, id: userData.id };

    editUserData(editData as Parameters<typeof editUserData>[0]);
  };

  return (
    <Form {...form}>
      <form
        className={cn("grid gap-6", className)}
        {...props}
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="flex flex-col gap-4">
          <div className="flex w-full max-w-[300px] flex-col gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Имя</FormLabel>
                  <FormControl>
                    <Input placeholder="Введите Ваше имя..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {currentUser.isAdmin && (
              <FormField
                control={form.control}
                name="isAdmin"
                render={({ field }) => (
                  <FormItem className="flex items-end gap-2">
                    <FormLabel>Админ</FormLabel>
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
            )}
            <FormField
              control={form.control}
              name="avatar"
              render={({ field: { onChange, value } }) => {
                return (
                  <FormItem>
                    <FormLabel>Аватар</FormLabel>
                    <FormControl>
                      <ImageInput
                        value={typeof value === "string" ? null : value || null}
                        onChange={onChange}
                        existingImageUrl={
                          typeof value === "string" ? value : undefined
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <Button
              className="w-full capitalize"
              type="submit"
              disabled={isLoading || !form.formState.isDirty}
            >
              {isLoading ? "Сохраняем..." : "Сохранить"}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
