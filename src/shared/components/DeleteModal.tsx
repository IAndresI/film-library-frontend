import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/dialog";
import { queryClient } from "../api/query-client";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

export const DeleteModal = ({
  title,
  description,
  onDelete,
  queryKey,
  children,
  open,
  setOpen,
  buttonText = "Удалить",
}: {
  title: string;
  description: string;
  onDelete: () => Promise<unknown>;
  queryKey: (string | number)[];
  buttonText?: string;
  children?: React.ReactNode;
  open?: boolean;
  setOpen?: (open: boolean) => void;
}) => {
  const [initialOpen, setInitialOpen] = useState(open);
  const isModalOpen = open ?? initialOpen;
  const setIsModalOpen = setOpen ?? setInitialOpen;

  const {
    mutate: handleDelete,
    isPending,
    error,
  } = useMutation({
    mutationFn: onDelete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      setIsModalOpen(false);
    },
    onError: (error) => {
      console.error(error);
    },
  });

  return (
    <Dialog open={isModalOpen} onOpenChange={setOpen || setInitialOpen}>
      <DialogTrigger asChild>
        {children ? (
          children
        ) : (
          <Button className="w-full justify-start" variant="ghost">
            Удалить
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
          {error && (
            <p className="text-critic mt-3 text-sm">Ошибка: {error.message}</p>
          )}
        </DialogHeader>
        <DialogFooter>
          <Button
            onClick={() => handleDelete()}
            type="submit"
            disabled={isPending}
          >
            {buttonText}
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={isPending}
            onClick={() => {
              setIsModalOpen(false);
            }}
          >
            Закрыть
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
