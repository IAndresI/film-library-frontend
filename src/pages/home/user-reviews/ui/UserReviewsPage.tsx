import { Separator } from "@/shared/ui/separator";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { UserReviewSkeleton } from "@/entities/review/ui/UserReviewSkeleton";
import { reviewApi } from "@/entities/review/api/reviewApi";
import { UserReviewCard } from "@/pages/home/user-reviews/ui/UserReviewCard";
import { useUser } from "@/app/providers";

export const UserReviewsPage = () => {
  const user = useUser();

  const { isLoading, data } = useQuery(reviewApi.getAllReviewsQueryOptions());

  const userReviews = data?.filter((review) => +review.user === user?.id);

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
              Your Reviews
            </h2>
          </div>
        </div>
        <Separator className="my-4" />

        <div className="grid gap-5 pb-4">
          {isLoading
            ? new Array(5)
                .fill(1)
                .map((_, i, arr) => (
                  <UserReviewSkeleton
                    bottomSeparator={i !== arr.length - 1}
                    key={`skeleton_${i}`}
                  />
                ))
            : userReviews?.map((review, i, arr) => (
                <>
                  <UserReviewCard key={review.id} review={review} />
                  {i !== arr.length - 1 && <Separator className="mt-5" />}
                </>
              ))}
        </div>
      </div>
    </motion.section>
  );
};
