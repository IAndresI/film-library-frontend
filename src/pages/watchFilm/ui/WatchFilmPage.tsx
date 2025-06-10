import { useUser } from "@/app/providers";
import { filmApi } from "@/entities/film/api/filmApi";
import { SubscriptionStatus } from "@/entities/subscription/dto";
import { UserFilmPaymentForm } from "@/features/filmPurchase/ui";
import { VideoPlayer } from "@/shared/components/VideoPlayer";
import { API_URL } from "@/shared/config";
import { Button } from "@/shared/ui/button";
import { SvgCrown } from "@/shared/ui/svg/SvgCrown";
import { SvgLogo } from "@/shared/ui/svg/SvgLogo";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";

export const WatchFilmPage = () => {
  const { id } = useParams();
  const user = useUser();

  const { data: film, isLoading } = useQuery({
    ...filmApi.getFilmByIdQueryOptions(Number(id)),
    enabled: !!id,
  });

  const {
    mutate: generateFilmToken,
    data: filmToken,
    isPending,
  } = useMutation({
    mutationFn: filmApi.generateFilmToken,
  });

  const { mutate: refreshFilmToken } = useMutation({
    mutationFn: filmApi.refreshFilmToken,
  });

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (filmToken) {
      interval = setInterval(
        () => {
          refreshFilmToken({
            filmId: filmToken.filmId,
            tokenId: filmToken.tokenId,
          });
        },
        filmToken.expiresIn * 1000 - 5 * 60 * 1000,
      );
    }
    return () => clearInterval(interval);
  }, [filmToken]);

  useEffect(() => {
    if (film?.id) {
      generateFilmToken(film?.id);
    }
  }, [film]);

  if (isLoading || isPending) {
    return (
      <motion.div
        className="bg-background fixed inset-0 z-10 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <SvgLogo className="animate-pulse" />
        папрап
      </motion.div>
    );
  }

  if (!film || !film?.filmUrl) {
    return (
      <div className="flex h-[100svh] w-[100vw] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <p className="text-2xl font-bold">К сожалению, фильм не найден</p>
          <Button size="lg" asChild>
            <Link to="/">На главную</Link>
          </Button>
        </div>
      </div>
    );
  }

  const isSubsciptionInActive =
    !user.subscription ||
    (user.subscription &&
      user.subscription.subscriptionStatus === SubscriptionStatus.CANCELLED) ||
    (user.subscription &&
      user.subscription.subscriptionStatus === SubscriptionStatus.EXPIRED);

  const isFilmPurchased = film.isPurchased;

  const isFilmPaid = film.isPaid;

  if (isSubsciptionInActive && !isFilmPurchased && isFilmPaid) {
    return (
      <div className="flex h-[100svh] w-[100vw] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          {!isFilmPurchased && isFilmPaid && (
            <Button asChild className="h-12 p-0 px-5" variant="rainbow">
              <Link to={"/premium"}>
                <SvgCrown className="mr-2 min-h-[24px] min-w-[24px]" />
                Смотреть вместе с подпиской
              </Link>
            </Button>
          )}

          {!isFilmPurchased && isFilmPaid && film.price && (
            <div className="grid gap-3 text-center">
              <span className="text-muted-foreground font-bold">Или</span>
              <UserFilmPaymentForm
                filmId={film.id}
                userId={user.id}
                price={film.price}
              />
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      {film && filmToken && (
        <React.Fragment>
          {filmToken && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="flex h-[100svh] w-[100vw] overflow-hidden">
                <div className="player">
                  <VideoPlayer
                    src={`${API_URL}${filmToken.streamUrl}`}
                    title={film.name}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </React.Fragment>
      )}
    </AnimatePresence>
  );
};
