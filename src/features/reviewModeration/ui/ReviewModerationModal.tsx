import { useState } from 'react';

import { Button } from '@/shared/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/ui/dialog';

import { useApproveReview } from '../lib/hooks/useApproveReview';
import { useRejectReview } from '../lib/hooks/useRejectReview';

export const ReviewModerationModal = ({
  id,
  isApproved,
}: {
  id: number;
  isApproved: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { approveReview, isLoading: isApproveLoading } = useApproveReview({
    onSuccess: () => {
      setIsOpen(false);
    },
  });
  const { rejectReview, isLoading: isRejectLoading } = useRejectReview({
    onSuccess: () => {
      setIsOpen(false);
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isApproved) {
      rejectReview({ id });
    } else {
      approveReview({ id });
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <DialogTrigger asChild>
        <Button
          className="w-full justify-start"
          variant="ghost"
        >
          {isApproved ? 'На модерацию' : 'Одобрить'}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[85svh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Модерация отзыва</DialogTitle>
          <DialogDescription>Отзыв №{id}</DialogDescription>
        </DialogHeader>
        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-2"
        >
          <DialogTrigger asChild>
            <Button
              disabled={isApproveLoading || isRejectLoading}
              variant="secondary"
              className="mr-auto w-full max-w-[200px]"
              type="button"
            >
              Отмена
            </Button>
          </DialogTrigger>
          <Button
            disabled={isApproveLoading || isRejectLoading}
            className="ml-auto w-full max-w-[200px]"
            type="submit"
          >
            {isApproved ? 'Отправить на модерацию' : 'Одобрить'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
