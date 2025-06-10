import { Separator } from "@/shared/ui/separator";
import { motion } from "framer-motion";
import { useInfiniteQuery } from "@tanstack/react-query";
import { reviewApi } from "@/entities/review/api/reviewApi";
import { useUser } from "@/app/providers";
import { UserReviewCard } from "./UserReviewCard";
import { Button } from "@/shared/ui/button";
import { SvgSpinner } from "@/shared/ui/svg/SvgSpinner";

export const UserReviewsPage = () => {
  const user = useUser();

  const {
    data: reviewsData,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["reviews", user.id],
    queryFn: async ({ pageParam = 0, ...meta }) => {
      const queryOptions = reviewApi.getAllUserReviewsQueryOptions({
        filters: [],
        sort: [],
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
              Ваши отзывы
            </h2>
          </div>
        </div>
        <Separator className="my-4" />

        {isLoading && !reviewsData && (
          <div className="flex justify-center py-8">
            <SvgSpinner className="h-10 w-10" />
          </div>
        )}

        <div className="grid gap-5 pb-4">
          {reviewsData && reviewsData.length === 0 && !isLoading && (
            <div className="flex items-center justify-center">
              <p className="text-muted-foreground">У вас пока нет отзывов</p>
            </div>
          )}
          {reviewsData &&
            reviewsData.length > 0 &&
            reviewsData.map((review, i, arr) => (
              <>
                <UserReviewCard key={review.id} review={review} />
                {i !== arr.length - 1 && <Separator className="mt-5" />}
              </>
            ))}
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
                "Показать ещё отзывов"
              )}
            </Button>
          </div>
        )}
      </div>
    </motion.section>
  );
};
