import type { SortingState } from '@tanstack/react-table';

import { useEffect, useState } from 'react';
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import { keepPreviousData, useInfiniteQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';

import { actorApi } from '@/entities/actor/api/actorApi';
import { ActorCard } from '@/entities/actor/ui/ActorCard';
import { filmApi } from '@/entities/film/api/filmApi';
import { FILM_SORT_OPTIONS } from '@/entities/film/constants';
import { FilmCard } from '@/entities/film/ui/FilmCard';

import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select';
import { Separator } from '@/shared/ui/separator';
import { SvgSpinner } from '@/shared/ui/svg/SvgSpinner';

export const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchText, setSearchText] = useState(location.search);
  const [queryText, setQueryText] = useState(searchParams.get('query') || '');
  const [sort, setSort] = useState<SortingState>([
    FILM_SORT_OPTIONS[0].value[0],
  ]);

  const {
    data: filmsData,
    isLoading: isFilmsLoading,
    hasNextPage: hasNextFilmsPage,
    fetchNextPage: fetchNextFilmsPage,
    isFetchingNextPage: isFetchingNextFilmsPage,
    isFetching: isFetchingFilms,
  } = useInfiniteQuery({
    queryKey: ['films', 'search', queryText, sort],
    queryFn: async ({ pageParam = 0, ...meta }) => {
      const queryOptions = filmApi.getAvailableFilmsQueryOptions({
        search: queryText,
        pagination: {
          pageIndex: pageParam,
          pageSize: 10,
        },
        sort,
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
    placeholderData: keepPreviousData,
  });

  const {
    data: actorsData,
    isLoading: isActorsLoading,
    hasNextPage: hasNextActorsPage,
    fetchNextPage: fetchNextActorsPage,
    isFetchingNextPage: isFetchingNextActorsPage,
    isFetching: isFetchingActors,
  } = useInfiniteQuery({
    queryKey: ['actors', 'search', queryText],
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
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    const URLSearchText = searchParams.get('query');
    if (URLSearchText) {
      setSearchText(URLSearchText);
    } else {
      setSearchText('');
    }
  }, [location.search]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setQueryText(searchText);
      searchParams.set('query', searchText);
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
      key={'home'}
    >
      <div className="px-4 py-6 lg:px-8">
        <div className="mb-2 flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold tracking-tight">
              Поиск{' '}
              {searchParams.get('query') && (
                <>
                  по запросу:{' '}
                  <span className="font-normal">
                    {searchParams.get('query')}
                  </span>
                </>
              )}
            </h2>
          </div>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            searchParams.set('query', searchText);
            setSearchParams(searchParams);
          }}
          className="flex w-full max-w-[500px] items-center gap-3"
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
        {(isFilmsLoading || isActorsLoading) && (
          <SvgSpinner className="mx-auto h-10 w-10" />
        )}
        {queryText.length <= 0 && 'Начните поиск...'}
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
                <div
                  className={cn(
                    'mb-4 flex flex-wrap gap-4 transition-opacity duration-500',
                    isFetchingActors &&
                      !isFetchingNextActorsPage &&
                      'opacity-35'
                  )}
                >
                  {actorsData.map((actor) => (
                    <ActorCard
                      key={actor.name}
                      actor={actor}
                      className="w-[150px] min-w-[150px]"
                      aspectRatio="square"
                    />
                  ))}
                </div>
                {hasNextActorsPage && (
                  <div className="flex justify-center pb-4">
                    <Button
                      onClick={() => fetchNextActorsPage()}
                      disabled={isFetchingNextActorsPage || isFetchingActors}
                      variant="outline"
                    >
                      {isFetchingNextActorsPage ? (
                        <SvgSpinner className="h-4 w-4" />
                      ) : (
                        'Показать ещё актёров'
                      )}
                    </Button>
                  </div>
                )}
              </>
            )}
            {filmsData && filmsData.length > 0 && (
              <>
                <div className="mt-6 flex items-center justify-between gap-2 space-y-1">
                  <h2 className="text-2xl font-semibold tracking-tight">
                    Фильмы
                  </h2>
                  <Select
                    value={sort[0]?.id}
                    onValueChange={(value) => {
                      setSort(
                        FILM_SORT_OPTIONS.find(
                          (option) => option.value[0].id === value
                        )!.value
                      );
                    }}
                  >
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Сортировка" />
                    </SelectTrigger>
                    <SelectContent>
                      {FILM_SORT_OPTIONS.map((option) => (
                        <SelectItem
                          key={option.value[0].id}
                          value={option.value[0].id}
                        >
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Separator className="my-4" />

                <div
                  className={cn(
                    'grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] place-items-center gap-4 pb-4 transition-opacity duration-500',
                    isFetchingFilms && !isFetchingNextFilmsPage && 'opacity-35'
                  )}
                >
                  {filmsData.map((film) => (
                    <FilmCard
                      key={film.name}
                      film={film}
                      className="w-full"
                      width={150}
                      height={150}
                    />
                  ))}
                </div>
                {hasNextFilmsPage && (
                  <div className="flex justify-center pb-4">
                    <Button
                      onClick={() => fetchNextFilmsPage()}
                      disabled={isFetchingNextFilmsPage || isFetchingFilms}
                      variant="outline"
                    >
                      {isFetchingNextFilmsPage ? (
                        <SvgSpinner className="h-4 w-4" />
                      ) : (
                        'Показать ещё фильмов'
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
