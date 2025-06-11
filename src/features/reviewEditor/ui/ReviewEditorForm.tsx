import * as React from "react";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";

import { useEditReview, useCreateReview, useDeleteReview } from "../lib/hooks";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FormControl,
  FormItem,
  FormField,
  FormLabel,
  FormMessage,
  Form,
} from "@/shared/ui/form";
import { Textarea } from "@/shared/ui/textarea";
import { useEffect } from "react";
import type { IReview } from "@/entities/review/dto";
import { StarFilledIcon, StarIcon } from "@radix-ui/react-icons";
import { Rating } from "react-simple-star-rating";
import { queryClient } from "@/shared/api/query-client";

const formSchema = z.object({
  rating: z.number({ required_error: "Рейтинг обязательно" }).min(1, {
    message: "Рейтинг должен быть не менее 1",
  }),
  text: z.string({ required_error: "Текст обязательно" }).min(20, {
    message: "Текст должен быть не менее 20 символов",
  }),
});

export function ReviewEditorForm({
  className,
  review,
  filmId,
  userId,
  onDelete,
  onSuccess,
  ...props
}: {
  filmId: number;
  userId: number;
  review?: IReview;
  onDelete?: () => void;
  onSuccess?: () => void;
} & React.HTMLAttributes<HTMLFormElement>) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  const { createReview, isLoading } = useCreateReview({
    onSuccess: () => {
      onSuccess?.();
    },
  });
  const { editReview, isLoading: isLoadingEdit } = useEditReview({
    onSuccess: () => {
      onSuccess?.();
    },
  });
  const { deleteReview, isLoading: isLoadingDelete } = useDeleteReview({
    onSuccess: () => {
      queryClient.resetQueries({ queryKey: ["reviews", userId, filmId] });
      form.reset({
        rating: 0,
        text: "",
      });
      onDelete?.();
    },
  });

  useEffect(() => {
    if (review) {
      form.reset({
        rating: review.rating,
        text: review.text,
      });
    }
  }, [review]);

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    if (review) {
      editReview({ ...data, id: review.id });
    } else {
      createReview({
        ...data,
        userId,
        filmId,
      });
    }
  };

  return (
    <Form {...form}>
      <form
        className={cn("grid gap-4", className)}
        {...props}
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="flex flex-col gap-4">
          <FormField
            control={form.control}
            name="rating"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Rating
                    emptyIcon={<StarIcon className="inline-block h-8 w-8" />}
                    fillIcon={
                      <StarFilledIcon className="inline-block h-8 w-8" />
                    }
                    iconsCount={10}
                    transition
                    initialValue={field.value}
                    onClick={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="text"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Текст обзора</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    className="h-[200px] max-h-[500px]"
                    id="review"
                    placeholder="Пожалуйста, введите текст вашего обзора."
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex items-center gap-2">
            <Button
              disabled={
                isLoading ||
                isLoadingEdit ||
                isLoadingDelete ||
                !form.formState.isDirty
              }
              type="submit"
              variant="default"
              className="w-full"
            >
              {review ? "Редактировать" : "Отправить"}
            </Button>
            {review && (
              <Button
                disabled={isLoading || isLoadingEdit || isLoadingDelete}
                onClick={() => deleteReview(review.id)}
                type="button"
                variant="destructive"
                className="w-full"
              >
                Удалить
              </Button>
            )}
          </div>
        </div>
      </form>
    </Form>
  );
}
