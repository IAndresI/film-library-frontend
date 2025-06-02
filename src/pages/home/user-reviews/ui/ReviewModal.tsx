import type { IAllReviews } from "@/entities/review/dto";
import { type ComponentProps, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/dialog";
import { Rating } from "react-simple-star-rating";
import { StarFilledIcon, StarIcon } from "@radix-ui/react-icons";
import { Label } from "@/shared/ui/label";
import { Textarea } from "@/shared/ui/textarea";
import { Button } from "@/shared/ui/button";
import { reviewApi } from "@/entities/review/api/reviewApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface IReviewModalProps extends ComponentProps<"div"> {
  review: IAllReviews;
}

export const ReviewModal = ({ review, ...props }: IReviewModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  const [reviewRating, setReviewRating] = useState(review.rating);
  const [reviewText, setReviewText] = useState(review.text);

  const { mutate: editReviewMutate, isPending: isEditingReview } = useMutation({
    mutationFn: reviewApi.editReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      setIsOpen(false);
    },
  });

  const onReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    editReviewMutate({
      ...review,
      text: reviewText,
      rating: reviewRating,
    });
  };

  const handleRating = (rate: number) => {
    setReviewRating(rate);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{props.children}</DialogTrigger>
      <DialogContent className="max-h-[85svh] overflow-auto sm:max-w-[850px]">
        <DialogHeader>
          <DialogTitle>Edit review</DialogTitle>
        </DialogHeader>
        <div className="px-5">
          <form onSubmit={onReviewSubmit} className="grid gap-4">
            <div className="flex">
              <Rating
                emptyIcon={<StarIcon className="inline-block h-8 w-8" />}
                fillIcon={<StarFilledIcon className="inline-block h-8 w-8" />}
                iconsCount={10}
                transition
                initialValue={reviewRating}
                allowFraction
                onClick={handleRating}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="review">Description</Label>
              <Textarea
                className="h-[200px] max-h-[500px]"
                id="review"
                placeholder="Please enter your review text."
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
              />
            </div>
            <Button disabled={isEditingReview} type="submit" variant="default">
              Edit review
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
