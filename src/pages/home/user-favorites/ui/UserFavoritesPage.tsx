import { Separator } from "@/shared/ui/separator";

import { FilmCard } from "@/entities/film/ui/FilmCard";

import { motion } from "framer-motion";
import { Button } from "@/shared/ui/button";
import { BookmarkFilledIcon, Cross2Icon } from "@radix-ui/react-icons";
import { userApi } from "@/entities/user/api/userApi";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { FilmSkeleton } from "@/entities/film/ui/FilmSkeleton";
import { useUser } from "@/app/providers";
import { MultiSelect } from "@/shared/ui/multi-select";
import { useState } from "react";
import { useGetAllFilters } from "@/features/filters/lib/hooks";
import { Input } from "@/shared/ui/input";
import { useDebounce } from "@/shared/lib/hooks/use-debounce";

export const UserFavoritesPage = () => {
  const user = useUser();
  const queryClient = useQueryClient();

  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedActors, setSelectedActors] = useState<string[]>([]);
  const [search, setSearch] = useState<string>("");
  const debouncedSearch = useDebounce(search, 500);

  const { isLoading: isUserFavoritesLoading, data: userFavorites } = useQuery({
    ...userApi.getAllUserFavoritesQueryOptions({
      userId: user!.id,
      genres: selectedGenres,
      actors: selectedActors,
      search: debouncedSearch,
    }),
    enabled: !!user?.id,
    placeholderData: keepPreviousData,
  });

  const { filters } = useGetAllFilters();

  const { mutate: removeUserFavoritesMutate, isPending: isRemovingfavorite } =
    useMutation({
      mutationFn: userApi.removeUserFavorites,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["favorites"] });
      },
    });

  const isFiltered =
    selectedGenres.length > 0 || selectedActors.length > 0 || search.length > 0;

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
          {isFiltered && (
            <Button
              variant="ghost"
              onClick={() => {
                setSelectedGenres([]);
                setSelectedActors([]);
                setSearch("");
              }}
              className="h-8 px-2 lg:px-3"
            >
              Сбросить
              <Cross2Icon className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
        <Separator className="my-4" />
        <div className="flex items-center gap-4">
          <Input
            placeholder="Поиск"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <MultiSelect
            options={
              filters?.genres.map((genre) => ({
                label: genre.label,
                value: genre.value.toString(),
              })) || []
            }
            onValueChange={setSelectedGenres}
            defaultValue={selectedGenres}
            placeholder="Выберите жанры"
            maxCount={4}
            modalPopover
            className="min-h-9"
          />
          <MultiSelect
            options={
              filters?.actors.map((actor) => ({
                label: actor.label,
                value: actor.value.toString(),
              })) || []
            }
            onValueChange={setSelectedActors}
            defaultValue={selectedActors}
            placeholder="Выберите актеров"
            maxCount={4}
            modalPopover
            className="min-h-9"
          />
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
          {userFavorites && userFavorites.length > 0 ? (
            userFavorites?.map((film, i) => (
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
          ) : (
            <div className="col-span-2 flex h-full w-full items-center justify-center lg:col-span-4 xl:col-span-5">
              <p className="text-muted-foreground">Ничего не найдено</p>
            </div>
          )}
        </div>
      </div>
    </motion.section>
  );
};
