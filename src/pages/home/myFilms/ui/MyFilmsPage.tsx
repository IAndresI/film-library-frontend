import type { SortingState } from '@tanstack/react-table';

import { useState } from 'react';
import { Cross2Icon } from '@radix-ui/react-icons';
import { keepPreviousData, useInfiniteQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';

import { filmApi } from '@/entities/film/api/film.api';
import { FILM_SORT_OPTIONS } from '@/entities/film/constants';
import { FilmCard } from '@/entities/film/ui/FilmCard';
import { useGetAllFilters } from '@/entities/filters/lib/hooks';

import { useDebounce } from '@/shared/lib/hooks/use-debounce';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { MultiSelect } from '@/shared/ui/multi-select';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select';
import { Separator } from '@/shared/ui/separator';
import { SvgSpinner } from '@/shared/ui/svg/SvgSpinner';

export const MyFilmsPage = () => {
  const { categoryId } = useParams();
  const [selectedActors, setSelectedActors] = useState<string[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [search, setSearch] = useState<string>('');
  const debouncedSearch = useDebounce(search, 500);
  const [sort, setSort] = useState<SortingState>([
    FILM_SORT_OPTIONS[0].value[0],
  ]);

  const { filters } = useGetAllFilters();

  const {
    data: filmsData,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isFetching,
  } = useInfiniteQuery({
    queryKey: [
      'films',
      'list',
      'user',
      categoryId ? [categoryId] : selectedGenres,
      selectedActors,
      debouncedSearch,
      sort,
    ],
    queryFn: async ({ pageParam = 0, ...meta }) => {
      const queryOptions = filmApi.getUserPurchasedFilmsQueryOptions({
        pagination: {
          pageIndex: pageParam,
          pageSize: 10,
        },
        genres: categoryId ? [categoryId] : selectedGenres,
        actors: selectedActors,
        search: debouncedSearch,
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
    select: (data) => {
      return data.pages.flatMap((page) => page.data);
    },
    placeholderData: keepPreviousData,
  });

  const isFiltered =
    selectedActors.length > 0 || selectedGenres.length > 0 || search.length > 0;

  return (
    <motion.section
      className="col-span-3 lg:col-span-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.2 } }}
      exit={{ opacity: 0, transition: { duration: 0.2 } }}
      key={'home'}
    >
      <div className="h-full px-4 py-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex w-full items-center justify-between">
            <h2 className="text-2xl font-semibold tracking-tight">
              Мои фильмы
            </h2>
            {isFiltered && (
              <Button
                variant="ghost"
                onClick={() => {
                  setSelectedGenres([]);
                  setSelectedActors([]);
                  setSearch('');
                }}
                className="h-8 px-2 lg:px-3"
              >
                Сбросить
                <Cross2Icon className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
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
          {!categoryId && (
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
          )}
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
            <SelectTrigger>
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

        {isLoading && (
          <div className="flex justify-center py-8">
            <SvgSpinner className="h-10 w-10" />
          </div>
        )}

        <div
          className={cn(
            'grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] place-items-center gap-4 pb-4 transition-opacity duration-500',
            isFetching && !isFetchingNextPage && 'opacity-35'
          )}
        >
          {filmsData && filmsData.length > 0 ? (
            filmsData.map((film, i) => (
              <FilmCard
                key={`${i}_${film.name}`}
                film={film}
                className="w-full"
                aspectRatio="portrait"
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
              disabled={isFetchingNextPage || isFetching}
              variant="outline"
            >
              {isFetchingNextPage ? (
                <SvgSpinner className="h-4 w-4" />
              ) : (
                'Показать ещё фильмов'
              )}
            </Button>
          </div>
        )}
      </div>
    </motion.section>
  );
};
