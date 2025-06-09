import { ScrollArea, ScrollBar } from "@/shared/ui/scroll-area";
import { Separator } from "@/shared/ui/separator";

import { motion } from "framer-motion";
import { CustomBreadcrumbs } from "@/shared/components/CustomBreadcrumbs";
import {
  BookmarkFilledIcon,
  BookmarkIcon,
  PlayIcon,
  StarFilledIcon,
} from "@radix-ui/react-icons";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/dialog";
import { ActorCard } from "@/entities/actor/ui/ActorCard";
import { Button } from "@/shared/ui/button";
import { useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { filmApi } from "@/entities/film/api/filmApi";
import { SvgSpinner } from "@/shared/ui/svg/SvgSpinner";
import { Badge } from "@/shared/ui/badge";
import { reviewApi } from "@/entities/review/api/reviewApi";
import { userApi } from "@/entities/user/api/userApi";
import { useUser } from "@/app/providers";
import { getImageUrl } from "@/shared/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { ReviewEditorForm } from "@/features/reviewEditor/ui";

export const FilmPage = () => {
  const { id } = useParams();
  const user = useUser();
  const queryClient = useQueryClient();

  const { data: isInFavoriteData, isLoading: isInFavoriteLoading } = useQuery({
    ...userApi.checkFavoriteStatusQueryOptions({
      userId: user!.id,
      filmId: +id!,
    }),
    enabled: !!user?.id && !!id,
  });

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
    }),
  );

  const { data: userReviewData } = useQuery({
    ...reviewApi.getUserFilmReviewQueryOptions({
      userId: user!.id,
      filmId: +id!,
    }),
    enabled: !!user?.id && !!id,
  });
  const { mutate: addUserFavoritesMutate, isPending: isAddingInfavorite } =
    useMutation({
      mutationFn: userApi.addUserFavorites,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["favorites"] });
      },
    });

  const { mutate: removeUserFavoritesMutate, isPending: isRemovingfavorite } =
    useMutation({
      mutationFn: userApi.removeUserFavorites,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["favorites"] });
      },
    });

  const isInFavorite = isInFavoriteData?.isFavorite;

  return (
    <motion.section
      className="col-span-3 lg:col-span-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.2 } }}
      exit={{ opacity: 0, transition: { duration: 0.2 } }}
      key={"home"}
    >
      {isFilmLoading && <SvgSpinner className="mx-auto h-10 w-10" />}
      {film && user ? (
        <div className="h-full px-4 py-6 lg:px-8">
          <CustomBreadcrumbs
            className="mb-4"
            crumbs={[{ label: "Главная", link: "/" }, { label: film.name }]}
          />
          <div className="flex items-center justify-between">
            <div className="flex gap-8">
              <img
                src={getImageUrl(film.image)}
                width={250}
                height={330}
                className={
                  "aspect-[3/4] h-fit max-w-[330px] min-w-[330px] overflow-hidden rounded-md object-cover transition-all"
                }
              />

              <div className="flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <h1 className="text-4xl font-bold tracking-tight">
                      {film.name}
                    </h1>
                  </div>
                  <div className="text-muted-foreground flex flex-wrap gap-1">
                    {new Date(film.releaseDate || "").getFullYear()} |{" "}
                    {film.genres.map((genre) => (
                      <Badge key={genre.id}>{genre.name}</Badge>
                    ))}
                  </div>
                  <p className="text-muted-foreground">{film.description}</p>
                </div>
                <div className="flex gap-5">
                  <div className="flex items-center gap-1 text-5xl font-semibold">
                    <StarFilledIcon className="h-10 w-10 text-yellow-500" />{" "}
                    {film.rating}
                  </div>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        className="text-md flex h-full w-full max-w-[250px] gap-2"
                        variant="outline"
                      >
                        <PlayIcon className="h-5 w-5" />
                        Trailer
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="flex h-full max-h-[85svh] max-w-[85vw] flex-col">
                      <DialogHeader>
                        <DialogTitle className="text-center text-3xl">
                          {film.name}
                        </DialogTitle>
                      </DialogHeader>
                      <iframe
                        className="h-full w-full"
                        src={film.trailerUrl}
                        frameBorder="0"
                        allow="clipboard-write; autoplay"
                        allowFullScreen
                      />
                    </DialogContent>
                  </Dialog>
                  <Button
                    onClick={() =>
                      isInFavorite
                        ? removeUserFavoritesMutate({
                            userId: String(user.id),
                            filmId: film.id,
                          })
                        : addUserFavoritesMutate({
                            userId: String(user.id),
                            filmId: film.id,
                          })
                    }
                    disabled={
                      isInFavoriteLoading ||
                      isAddingInfavorite ||
                      isRemovingfavorite
                    }
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
                    width={100}
                    height={100}
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
              {reviews?.data && reviews.data.length > 0 ? (
                <div className="grid h-fit border-r">
                  {reviews.data.map((review, i, arr) => (
                    <div className="grid gap-3" key={review.id}>
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
                          <StarFilledIcon className="h-4 w-4 text-yellow-500" />{" "}
                          {review.rating}
                        </div>
                      </div>
                      <p className="text-muted-foreground pr-5 text-sm">
                        {review.text}
                      </p>
                      <Separator
                        className={i !== arr.length - 1 ? "my-4" : "mt-4"}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                "Нет обзоров"
              )}
              <div className="px-5">
                <h4 className="mb-4 text-xl font-medium">
                  {userReviewData ? "Ваш обзор" : "Оставить обзор"}
                  {userReviewData && !userReviewData.isApproved && (
                    <Badge variant="outline" className="ml-2">
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
      ) : (
        <div className="col-span-2 flex h-full w-full items-center justify-center lg:col-span-4 xl:col-span-5">
          <p className="text-muted-foreground">Нет обзоров</p>
        </div>
      )}
    </motion.section>
  );
};
