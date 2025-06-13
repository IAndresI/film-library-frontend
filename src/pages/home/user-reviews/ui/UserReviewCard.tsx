import type { IReview } from '@/entities/review/model';

import { StarFilledIcon } from '@radix-ui/react-icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';

import { filmApi } from '@/entities/film/api/film.api';
import { reviewApi } from '@/entities/review/api/review.api';

import { getImageUrl } from '@/shared/lib/utils';
import { Badge } from '@/shared/ui/badge';

import { Button } from '../../../../shared/ui/button';
import { ReviewModal } from './ReviewModal';

interface IUserReviewCardProps {
  review: IReview;
}

export const UserReviewCard = ({ review }: IUserReviewCardProps) => {
  const queryClient = useQueryClient();

  const { data: film } = useQuery(
    filmApi.getFilmByIdQueryOptions(review.film.id)
  );
  const { mutate: deleteReviewMutate, isPending: isDeletingReview } =
    useMutation({
      mutationFn: reviewApi.deleteReview,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['reviews'] });
      },
    });

  return (
    <div>
      <div className="mb-3 flex gap-5 text-xl font-semibold">
        {film?.name}
        <div className="flex items-center gap-1 font-semibold">
          <StarFilledIcon className="h-5 w-5 text-yellow-500" />
          {review.rating}
        </div>
        {!review.isApproved && (
          <Badge
            variant="outline"
            className="ml-2"
          >
            Ожидает модерации
          </Badge>
        )}
      </div>
      <div className="flex gap-5">
        <div className="flex w-[150px] min-w-[150px] flex-col gap-3">
          <Link
            to={`/film/${film?.id}`}
            className="block overflow-hidden rounded-md"
          >
            <img
              src={getImageUrl(film?.image)}
              alt={'film'}
              width={150}
              height={200}
              className={
                'block aspect-[3/4] overflow-hidden object-cover transition-all hover:scale-105'
              }
            />
          </Link>

          <div className="grid grid-cols-2 gap-3">
            <ReviewModal review={review}>
              <Button
                disabled={isDeletingReview}
                className="text-xs"
                variant="secondary"
              >
                Изменить
              </Button>
            </ReviewModal>

            <Button
              disabled={isDeletingReview}
              onClick={() => deleteReviewMutate(review.id)}
              className="text-xs"
              variant="destructive"
            >
              Удалить
            </Button>
          </div>
        </div>
        <p className="text-muted-foreground pr-5 text-sm">{review.text}</p>
      </div>
    </div>
  );
};
