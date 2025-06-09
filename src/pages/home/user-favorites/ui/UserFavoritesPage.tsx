import { Separator } from "@/shared/ui/separator";

import { FilmCard } from "@/entities/film/ui/FilmCard";

import { motion } from "framer-motion";
import { Button } from "@/shared/ui/button";
import { BookmarkFilledIcon } from "@radix-ui/react-icons";
import { userApi } from "@/entities/user/api/userApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FilmSkeleton } from "@/entities/film/ui/FilmSkeleton";
import { useUser } from "@/app/providers";

export const UserFavoritesPage = () => {
  const user = useUser();
  const queryClient = useQueryClient();
  const { isLoading: isUserFavoritesLoading, data: userFavorites } = useQuery({
    ...userApi.getAllUserFavoritesQueryOptions(String(user!.id)),
    enabled: !!user?.id,
  });

  const { mutate: removeUserFavoritesMutate, isPending: isRemovingfavorite } =
    useMutation({
      mutationFn: userApi.removeUserFavorites,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["favorites"] });
      },
    });

  return (
    <motion.section
      className="col-span-3 lg:col-span-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.2 } }}
      exit={{ opacity: 0, transition: { duration: 0.2 } }}
      key={"home"}
    >
      <div className="h-full px-4 py-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold tracking-tight">
              Ваши любимые фильмы
            </h2>
          </div>
        </div>
        <Separator className="my-4" />

        <div className="grid grid-cols-2 place-items-center gap-4 pb-4 lg:grid-cols-4 xl:grid-cols-5">
          {isUserFavoritesLoading &&
            new Array(5)
              .fill(1)
              .map((_, i) => (
                <FilmSkeleton
                  className="h-[233px] w-[180px] 2xl:h-[266px] 2xl:w-[200px]"
                  key={`skeleton_${i}`}
                />
              ))}
          {userFavorites && userFavorites.length > 0
            ? userFavorites?.map((film, i) => (
                <div className="relative" key={`${i}_${film.name}`}>
                  <Button
                    disabled={isRemovingfavorite}
                    onClick={() =>
                      user
                        ? removeUserFavoritesMutate({
                            userId: String(user.id),
                            filmId: film.id,
                          })
                        : undefined
                    }
                    className="absolute top-2 right-2 z-10 h-10 w-10 p-0"
                    variant="outline"
                  >
                    <BookmarkFilledIcon className={`h-5 w-5`} />
                  </Button>
                  <FilmCard
                    key={`${i}_${film.name}`}
                    film={film}
                    className="w-[180px] 2xl:w-[200px]"
                    aspectRatio="portrait"
                  />
                </div>
              ))
            : "Nothings found"}
        </div>
      </div>
    </motion.section>
  );
};
