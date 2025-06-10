import { Separator } from "@/shared/ui/separator";

import { FilmCard } from "@/entities/film/ui/FilmCard";

import { motion } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { ActorCard } from "@/entities/actor/ui/ActorCard";
import { useInfiniteQuery } from "@tanstack/react-query";
import { SvgSpinner } from "@/shared/ui/svg/SvgSpinner";
import { filmApi } from "@/entities/film/api/filmApi";
import { actorApi } from "@/entities/actor/api/actorApi";

export const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchText, setSearchText] = useState(location.search);
  const [queryText, setQueryText] = useState(searchParams.get("query") || "");

  const {
    data: filmsData,
    isLoading: isFilmsLoading,
    hasNextPage: hasNextFilmsPage,
    fetchNextPage: fetchNextFilmsPage,
    isFetchingNextPage: isFetchingNextFilmsPage,
  } = useInfiniteQuery({
    queryKey: ["films", "search", queryText],
    queryFn: async ({ pageParam = 0, ...meta }) => {
      const queryOptions = filmApi.getAvailableFilmsQueryOptions({
        search: queryText,
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
    enabled: queryText.length > 0,
    select: (data) => {
      return data.pages.flatMap((page) => page.data);
    },
  });

  const {
    data: actorsData,
    isLoading: isActorsLoading,
    hasNextPage: hasNextActorsPage,
    fetchNextPage: fetchNextActorsPage,
    isFetchingNextPage: isFetchingNextActorsPage,
  } = useInfiniteQuery({
    queryKey: ["actors", "search", queryText],
    queryFn: async ({ pageParam = 0, ...meta }) => {
      const queryOptions = actorApi.getAllActorsQueryOptions({
        search: queryText,
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
    enabled: queryText.length > 0,
    select: (data) => {
      return data.pages.flatMap((page) => page.data);
    },
  });

  useEffect(() => {
    const URLSearchText = searchParams.get("query");
    if (URLSearchText) {
      setSearchText(URLSearchText);
    } else {
      setSearchText("");
    }
  }, [location.search]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setQueryText(searchText);
      searchParams.set("query", searchText);
      setSearchParams(searchParams);
    }, 500);

    return () => clearTimeout(timeout);
  }, [searchText]);

  return (
    <motion.section
      className="col-span-3 lg:col-span-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.2 } }}
      exit={{ opacity: 0, transition: { duration: 0.2 } }}
      key={"home"}
    >
      <div className="px-4 py-6 lg:px-8">
        <div className="mb-2 flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold tracking-tight">
              Поиск{" "}
              {searchParams.get("query") && (
                <>
                  по запросу:{" "}
                  <span className="font-normal">
                    {searchParams.get("query")}
                  </span>
                </>
              )}
            </h2>
          </div>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            searchParams.set("query", searchText);
            setSearchParams(searchParams);
          }}
          className="flex w-full max-w-[500px] items-center gap-3 pb-4"
        >
          <Input
            type="search"
            placeholder="Введите текст..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            autoFocus
          />
          <Button
            type="submit"
            className="flex items-center gap-2 px-3"
            variant="default"
          >
            <MagnifyingGlassIcon className="h-6 w-6" />
          </Button>
        </form>
        <Separator className="mb-4" />
        {(isFilmsLoading || isActorsLoading) && (
          <SvgSpinner className="mx-auto h-10 w-10" />
        )}
        {queryText.length <= 0 && "Начните поиск..."}
        {filmsData &&
          filmsData.length <= 0 &&
          actorsData &&
          actorsData.length <= 0 && (
            <div className="col-span-2 flex h-full w-full items-center justify-center lg:col-span-4 xl:col-span-5">
              <p className="text-muted-foreground">Ничего не найдено</p>
            </div>
          )}
        {queryText.length > 0 && (
          <>
            {actorsData && actorsData.length > 0 && (
              <>
                <div className="mt-6 space-y-1">
                  <h2 className="text-2xl font-semibold tracking-tight">
                    Актеры
                  </h2>
                </div>
                <Separator className="my-4" />
                <div className="flex flex-wrap gap-4 pb-4">
                  {actorsData.map((actor) => (
                    <ActorCard
                      key={actor.name}
                      actor={actor}
                      className="w-[150px] min-w-[150px]"
                      aspectRatio="square"
                      width={100}
                      height={100}
                    />
                  ))}
                </div>
                {hasNextActorsPage && (
                  <div className="flex justify-center pb-4">
                    <Button
                      onClick={() => fetchNextActorsPage()}
                      disabled={isFetchingNextActorsPage}
                      variant="outline"
                    >
                      {isFetchingNextActorsPage ? (
                        <SvgSpinner className="h-4 w-4" />
                      ) : (
                        "Показать ещё актёров"
                      )}
                    </Button>
                  </div>
                )}
              </>
            )}
            {filmsData && filmsData.length > 0 && (
              <>
                <div className="mt-6 space-y-1">
                  <h2 className="text-2xl font-semibold tracking-tight">
                    Фильмы
                  </h2>
                </div>
                <Separator className="my-4" />

                <div className="flex flex-wrap gap-4 pb-4">
                  {filmsData.map((film) => (
                    <FilmCard
                      key={film.name}
                      film={film}
                      className="w-[250px] min-w-[250px]"
                      width={150}
                      height={150}
                    />
                  ))}
                </div>
                {hasNextFilmsPage && (
                  <div className="flex justify-center pb-4">
                    <Button
                      onClick={() => fetchNextFilmsPage()}
                      disabled={isFetchingNextFilmsPage}
                      variant="outline"
                    >
                      {isFetchingNextFilmsPage ? (
                        <SvgSpinner className="h-4 w-4" />
                      ) : (
                        "Показать ещё фильмов"
                      )}
                    </Button>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </motion.section>
  );
};
