import {
  BookmarkFilledIcon,
  BookmarkIcon,
  PlayIcon,
  StarFilledIcon,
} from '@radix-ui/react-icons';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Link, useParams } from 'react-router-dom';

import { useUser } from '@/app/providers';

import { useFavoritesActions } from '@/features/favoriteFilmActions/lib/hooks';
import { UserFilmPaymentForm } from '@/features/filmPurchase/ui';
import { ReviewEditorForm } from '@/features/reviewEditor/ui';

import { ActorCard } from '@/entities/actor/ui/ActorCard';
import { filmApi } from '@/entities/film/api/filmApi';
import { getMediaUrl } from '@/entities/film/lib/helpers';
import { reviewApi } from '@/entities/review/api/reviewApi';
import { SubscriptionStatus } from '@/entities/subscription/dto';

import { CustomBreadcrumbs } from '@/shared/components/CustomBreadcrumbs';
import { VideoPlayer } from '@/shared/components/VideoPlayer';
import { getImageUrl } from '@/shared/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/ui/dialog';
import { ScrollArea, ScrollBar } from '@/shared/ui/scroll-area';
import { Separator } from '@/shared/ui/separator';
import { SvgCrown } from '@/shared/ui/svg/SvgCrown';
import { SvgFire } from '@/shared/ui/svg/SvgFire';
import { SvgSpinner } from '@/shared/ui/svg/SvgSpinner';

export const FilmPage = () => {
  const { id } = useParams();
  const user = useUser();

  const { isInFavorite, toggleFavorite } = useFavoritesActions(+id!);

  const { isLoading: isFilmLoading, data: film } = useQuery({
    ...filmApi.getFilmByIdQueryOptions(+id!),
    enabled: !!id,
  });

  const { isLoading: isReviewsLoading, data: reviews } = useQuery(
    reviewApi.getFilmReviewsQueryOptions({
      filmId: +id!,
      pagination: {
        pageIndex: 0,
        pageSize: 10,
      },
    })
  );

  const { data: userReviewData } = useQuery({
    ...reviewApi.getUserFilmReviewQueryOptions({
      userId: user!.id,
      filmId: +id!,
    }),
    enabled: !!user?.id && !!id,
    retry: false,
    refetchOnWindowFocus: false,
  });

  const isSubsciptionActive =
    user.subscription &&
    user.subscription.subscriptionStatus === SubscriptionStatus.ACTIVE;

  const isFilmPurchased = film?.isPurchased;

  return (
    <motion.section
      className="col-span-3 lg:col-span-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.2 } }}
      exit={{ opacity: 0, transition: { duration: 0.2 } }}
      key={'home'}
    >
      {isFilmLoading && <SvgSpinner className="mx-auto h-10 w-10" />}
      {film && (
        <div className="h-full px-4 py-6 lg:px-8">
          <CustomBreadcrumbs
            className="mb-4"
            crumbs={[
              { label: 'Главная', link: '/' },
              { label: 'Фильмы', link: '/films' },
              { label: film.name },
            ]}
          />
          <div className="flex items-center justify-between">
            <div className="flex gap-8">
              <div className="grid gap-5">
                <img
                  src={getImageUrl(film.image)}
                  width={250}
                  height={330}
                  className={
                    'aspect-[3/4] h-fit max-w-[330px] min-w-[330px] overflow-hidden rounded-md object-cover transition-all'
                  }
                />
                <div>
                  {film.filmUrl ? (
                    <div className="grid gap-3">
                      {isFilmPurchased && (
                        <Button
                          asChild
                          className="h-12 p-0 px-5"
                          variant="rainbow"
                        >
                          <Link to={`/film/${film.id}/watch`}>
                            <SvgCrown className="mr-2 min-h-[24px] min-w-[24px]" />
                            Смотреть
                          </Link>
                        </Button>
                      )}

                      {!isFilmPurchased && film.isPaid && (
                        <Button
                          asChild
                          className="h-12 p-0 px-5"
                          variant="rainbow"
                        >
                          <Link
                            to={
                              isSubsciptionActive
                                ? `/film/${film.id}/watch`
                                : '/premium'
                            }
                          >
                            <SvgCrown className="mr-2 min-h-[24px] min-w-[24px]" />
                            {isSubsciptionActive
                              ? 'Смотреть'
                              : 'Смотреть вместе с подпиской'}
                          </Link>
                        </Button>
                      )}

                      {!isFilmPurchased && !film.isPaid && (
                        <Button
                          asChild
                          className="h-12 p-0 px-5"
                        >
                          <Link to={`/film/${film.id}/watch`}>
                            <SvgFire className="mr-2 min-h-[24px] min-w-[24px]" />
                            Смотреть
                          </Link>
                        </Button>
                      )}

                      {!isFilmPurchased && film.isPaid && film.price && (
                        <div className="grid gap-3 text-center">
                          <span className="text-muted-foreground font-bold">
                            Или
                          </span>
                          <UserFilmPaymentForm
                            filmId={film.id}
                            userId={user.id}
                            price={film.price}
                          />
                        </div>
                      )}
                    </div>
                  ) : (
                    <Button
                      variant="secondary"
                      onClick={toggleFavorite}
                      className="h-12 w-full p-0 px-5"
                    >
                      {isInFavorite ? (
                        <BookmarkFilledIcon className={`h-6 w-6`} />
                      ) : (
                        <BookmarkIcon className={`h-6 w-6`} />
                      )}{' '}
                      Буду смотреть
                    </Button>
                  )}
                </div>
              </div>

              <div className="flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <h1 className="text-4xl font-bold tracking-tight">
                      {film.name}
                    </h1>
                  </div>
                  <div className="text-muted-foreground flex flex-wrap gap-1">
                    {new Date(film.releaseDate || '').getFullYear()} |{' '}
                    {film.genres.map((genre) => (
                      <Link
                        to={`/films/genres/${genre.id}`}
                        key={genre.id}
                      >
                        <Badge key={genre.id}>{genre.name}</Badge>
                      </Link>
                    ))}
                  </div>
                  <p className="text-muted-foreground">{film.description}</p>
                </div>
                <div className="flex gap-5">
                  <div className="flex items-center gap-1 text-5xl font-semibold">
                    {film.rating || '-'}{' '}
                    <StarFilledIcon className="h-10 w-10 text-yellow-500" />
                  </div>
                  {film.trailerUrl && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          className="text-md flex h-full w-full max-w-[250px] gap-2"
                          variant="outline"
                        >
                          <PlayIcon className="h-5 w-5" />
                          Трейлер
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="flex h-fit max-h-[85svh] max-w-max flex-col">
                        <DialogHeader>
                          <DialogTitle className="text-center text-3xl">
                            {film.name}
                          </DialogTitle>
                        </DialogHeader>
                        <div className="trailer grid justify-center overflow-hidden rounded-lg">
                          <VideoPlayer
                            id={`trailer-${film.id}-time`}
                            src={getMediaUrl(film.trailerUrl)}
                            title={`${film.name} - Трейлер`}
                            className="mx-auto"
                          />
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}

                  <Button
                    onClick={toggleFavorite}
                    className="h-full w-12 p-0 px-5"
                    variant="outline"
                  >
                    {isInFavorite ? (
                      <BookmarkFilledIcon className={`h-6 w-6`} />
                    ) : (
                      <BookmarkIcon className={`h-6 w-6`} />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <Separator className="my-4" />
          <div className="mb-4 space-y-1">
            <h2 className="text-2xl font-semibold tracking-tight">Актеры</h2>
          </div>
          <div className="relative">
            <ScrollArea>
              <div className="flex space-x-4 pb-4">
                {film.actors.map((actor) => (
                  <ActorCard
                    key={actor.name}
                    actor={actor}
                    className="w-[100px]"
                    aspectRatio="square"
                  />
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>
          <Separator className="my-4" />
          <div className="mb-4 space-y-1">
            <h2 className="mb-4 text-2xl font-semibold tracking-tight">
              Обзоры
            </h2>
            {isReviewsLoading && <SvgSpinner className="mx-auto h-10 w-10" />}

            <div className="grid grid-cols-[1fr_360px]">
              {!isReviewsLoading && reviews?.data && reviews.data.length > 0 ? (
                <div className="grid h-fit border-r">
                  {reviews.data.map((review, i, arr) => (
                    <div
                      className="grid gap-3"
                      key={review.id}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar className="size-10">
                            <AvatarImage
                              src={getImageUrl(review.user.avatar)}
                            />
                            <AvatarFallback className="text-lg uppercase">
                              {review.user.name.slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="font-medium">{review.user.name}</div>
                        </div>
                        <div className="flex items-center gap-1 pr-5 font-semibold">
                          <StarFilledIcon className="h-4 w-4 text-yellow-500" />{' '}
                          {review.rating}
                        </div>
                      </div>
                      <p className="text-muted-foreground pr-5 text-sm">
                        {review.text}
                      </p>
                      <Separator
                        className={i !== arr.length - 1 ? 'my-4' : 'mt-4'}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="">
                  <p className="text-muted-foreground">Нет обзоров</p>
                </div>
              )}
              <div className="px-5">
                <h4 className="mb-4 text-xl font-medium">
                  {userReviewData ? 'Ваш обзор' : 'Оставить обзор'}
                  {userReviewData && !userReviewData.isApproved && (
                    <Badge
                      variant="outline"
                      className="ml-2"
                    >
                      Ожидает модерации
                    </Badge>
                  )}
                </h4>
                <ReviewEditorForm
                  filmId={film.id}
                  userId={user.id}
                  review={userReviewData}
                />
              </div>
            </div>
          </div>
        </div>
      )}
      {!film && !isFilmLoading && (
        <div className="col-span-2 flex h-full w-full items-center justify-center lg:col-span-4 xl:col-span-5">
          <p className="text-muted-foreground">Фильм не найден</p>
        </div>
      )}
    </motion.section>
  );
};
