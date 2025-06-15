import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';

import { queryClient } from '@/shared/api/query-client';
import { Button } from '@/shared/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/ui/dialog';

export const DeleteModal = ({
  title,
  description,
  onDelete,
  queryKey,
  children,
  open,
  setOpen,
  buttonText = 'Удалить',
  onSuccess,
}: {
  title: string;
  description: string;
  onDelete: () => Promise<unknown>;
  onSuccess?: () => void;
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
      onSuccess?.();
      setIsModalOpen(false);
    },
    onError: (error) => {
      console.error(error);
    },
  });

  return (
    <Dialog
      open={isModalOpen}
      onOpenChange={setOpen || setInitialOpen}
    >
      <DialogTrigger asChild>
        {children ? (
          children
        ) : (
          <Button
            className="w-full justify-start"
            variant="ghost"
          >
            Удалить
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
          {error && (
            <p className="mt-3 text-sm text-red-500">Ошибка: {error.message}</p>
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
