import type { IReview } from '@/entities/review/model';
import type { ComponentProps } from 'react';

import { useState } from 'react';

import { ReviewEditorForm } from '@/features/reviewEditor/ui';

import { Badge } from '@/shared/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/ui/dialog';

interface IReviewModalProps extends ComponentProps<'div'> {
  review: IReview;
}

export const ReviewModal = ({ review, ...props }: IReviewModalProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSuccessAction = () => {
    setIsOpen(false);
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <DialogTrigger asChild>{props.children}</DialogTrigger>
      <DialogContent className="max-h-[85svh] overflow-auto sm:max-w-[850px]">
        <DialogHeader>
          <DialogTitle>
            Редактировать обзор{' '}
            {review && !review.isApproved && (
              <Badge
                variant="outline"
                className="ml-2"
              >
                Ожидает модерации
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>
        <div className="px-5">
          <ReviewEditorForm
            filmId={review.film.id}
            userId={review.user.id}
            review={review}
            onDelete={handleSuccessAction}
            onSuccess={handleSuccessAction}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
