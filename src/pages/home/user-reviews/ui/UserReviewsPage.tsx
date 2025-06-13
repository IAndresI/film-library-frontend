import type { SortingState } from '@tanstack/react-table';

import { useState } from 'react';
import { keepPreviousData, useInfiniteQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';

import { useUser } from '@/app/providers';

import { reviewApi } from '@/entities/review/api/reviewApi';
import { REVIEW_SORT_OPTIONS } from '@/entities/review/constants';

import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select';
import { Separator } from '@/shared/ui/separator';
import { SvgSpinner } from '@/shared/ui/svg/SvgSpinner';

import { UserReviewCard } from './UserReviewCard';

export const UserReviewsPage = () => {
  const user = useUser();
  const [sort, setSort] = useState<SortingState>([
    REVIEW_SORT_OPTIONS[0].value[0],
  ]);

  const {
    data: reviewsData,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isFetching,
  } = useInfiniteQuery({
    queryKey: ['reviews', user.id, sort],
    queryFn: async ({ pageParam = 0, ...meta }) => {
      const queryOptions = reviewApi.getAllUserReviewsQueryOptions({
        filters: [],
        sort,
        pagination: {
          pageIndex: pageParam,
          pageSize: 10,
        },
        userId: user.id,
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
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold tracking-tight">
              Ваши отзывы
            </h2>
          </div>
          <Select
            value={sort[0]?.id}
            onValueChange={(value) => {
              setSort(
                REVIEW_SORT_OPTIONS.find(
                  (option) => option.value[0].id === value
                )!.value
              );
            }}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Сортировка" />
            </SelectTrigger>
            <SelectContent>
              {REVIEW_SORT_OPTIONS.map((option) => (
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

        {isLoading && !reviewsData && (
          <div className="flex justify-center py-8">
            <SvgSpinner className="h-10 w-10" />
          </div>
        )}

        <div
          className={cn(
            'grid gap-5 pb-4 transition-opacity duration-500',
            isFetching && !isFetchingNextPage && 'opacity-35'
          )}
        >
          {reviewsData && reviewsData.length === 0 && !isLoading && (
            <div className="flex items-center justify-center">
              <p className="text-muted-foreground">У вас пока нет отзывов</p>
            </div>
          )}
          {reviewsData &&
            reviewsData.length > 0 &&
            reviewsData.map((review, i, arr) => (
              <>
                <UserReviewCard
                  key={review.id}
                  review={review}
                />
                {i !== arr.length - 1 && <Separator className="mt-5" />}
              </>
            ))}
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
                'Показать ещё отзывов'
              )}
            </Button>
          </div>
        )}
      </div>
    </motion.section>
  );
};
