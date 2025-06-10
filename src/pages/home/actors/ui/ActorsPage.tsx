import { Separator } from "@/shared/ui/separator";

import { motion } from "framer-motion";
import { ActorCard } from "@/entities/actor/ui/ActorCard";
import { useInfiniteQuery } from "@tanstack/react-query";
import { actorApi } from "@/entities/actor/api/actorApi";

import { useDebounce } from "@/shared/lib/hooks/use-debounce";
import { useState } from "react";
import { useGetAllFilters } from "@/features/filters/lib/hooks";
import { MultiSelect } from "@/shared/ui/multi-select";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import { Cross2Icon } from "@radix-ui/react-icons";
import { SvgSpinner } from "@/shared/ui/svg/SvgSpinner";

export const ActorsPage = () => {
  const [selectedFilms, setSelectedFilms] = useState<string[]>([]);
  const [search, setSearch] = useState<string>("");
  const debouncedSearch = useDebounce(search, 500);

  const { filters } = useGetAllFilters();

  const {
    data: actorsData,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["actors", debouncedSearch, selectedFilms],
    queryFn: async ({ pageParam = 0, ...meta }) => {
      const queryOptions = actorApi.getAllActorsQueryOptions({
        search: debouncedSearch,
        films: selectedFilms,
        pagination: {
          pageIndex: pageParam,
          pageSize: 10,
        },
      });
      return queryOptions.queryFn!(meta);
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      return lastPage.pagination.hasNextPage
        ? lastPage.pagination.pageIndex + 1
        : undefined;
    },
    select: (data) => {
      return data.pages.flatMap((page) => page.data);
    },
  });

  const isFiltered = selectedFilms.length > 0 || search.length > 0;

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
            <h2 className="text-2xl font-semibold tracking-tight">Актеры</h2>
          </div>
          {isFiltered && (
            <Button
              variant="ghost"
              onClick={() => {
                setSelectedFilms([]);
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
              filters?.films.map((film) => ({
                label: film.label,
                value: film.value.toString(),
              })) || []
            }
            onValueChange={setSelectedFilms}
            defaultValue={selectedFilms}
            placeholder="Выберите фильмы"
            maxCount={4}
            modalPopover
            className="min-h-9"
          />
        </div>
        <Separator className="my-4" />

        {isLoading && !actorsData && (
          <div className="flex justify-center py-8">
            <SvgSpinner className="h-10 w-10" />
          </div>
        )}

        <div className="grid grid-cols-[repeat(auto-fit,minmax(100px,150px))] place-items-center justify-between gap-5 pb-4">
          {actorsData && actorsData.length > 0 ? (
            actorsData.map((actor) => (
              <ActorCard
                key={actor.name}
                actor={actor}
                aspectRatio="square"
                width={100}
                height={100}
              />
            ))
          ) : !isLoading ? (
            <div className="col-span-2 flex h-full w-full items-center justify-center lg:col-span-4 xl:col-span-5">
              <p className="text-muted-foreground">Ничего не найдено</p>
            </div>
          ) : null}
        </div>

        {hasNextPage && (
          <div className="flex justify-center pb-4">
            <Button
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              variant="outline"
            >
              {isFetchingNextPage ? (
                <SvgSpinner className="h-4 w-4" />
              ) : (
                "Показать ещё актёров"
              )}
            </Button>
          </div>
        )}
      </div>
    </motion.section>
  );
};
