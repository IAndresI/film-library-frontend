import * as React from "react";
import { cn } from "@/shared/lib/helpers";
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

const formSchema = z.object({
  name: z.string({ required_error: "Имя обязательно" }).min(3, {
    message: "Имя должно быть не менее 3 символов",
  }),
});

export function UserDataEditorForm({
  className,
  userData,
  ...props
}: { userData: IUser } & React.HTMLAttributes<HTMLFormElement>) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: userData.name,
    },
  });
  const { editUserData, isLoading } = useEditUserData();

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    editUserData({
      name: data.name,
      id: userData.id,
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
            <Button
              className="w-full capitalize"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Сохраняем..." : "Сохранить"}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
