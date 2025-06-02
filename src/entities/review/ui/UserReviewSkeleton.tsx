import { Skeleton } from "../../../shared/ui/skeleton";
import { Separator } from "../../../shared/ui/separator";

interface IUserReviewSkeletonprops
  extends React.HTMLAttributes<HTMLDivElement> {
  bottomSeparator?: boolean;
}

export function UserReviewSkeleton({
  className,
  bottomSeparator,
  ...props
}: IUserReviewSkeletonprops) {
  return (
    <div className={className} {...props}>
      <div className="flex justify-between mb-3 text-xl font-semibold">
        <Skeleton className="h-[25px] w-[100px]" />
        <Skeleton className="h-[25px] w-[50px]" />
      </div>
      <div className="flex gap-5">
        <div className="flex flex-col gap-3">
          <Skeleton className="aspect-[3/4] h-[200px] w-[150px] rounded-md" />

          <div className="grid grid-cols-2 gap-3">
            <Skeleton className="w-full h-9" />
            <Skeleton className="w-full h-9" />
          </div>
        </div>
        <div className="grid pr-5 text-sm h-fit gap-y-4 text-muted-foreground">
          <Skeleton className="h-2 w-[600px]" />
          <Skeleton className="h-2 w-[800px]" />
          <Skeleton className="h-2 w-[450px]" />
          <Skeleton className="h-2 w-[800px]" />
          <Skeleton className="h-2 w-[650px]" />
          <Skeleton className="h-2 w-[700px]" />
        </div>
      </div>
      {bottomSeparator && <Separator className="mt-5" />}
    </div>
  );
}
