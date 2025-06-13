import { Separator } from '../../../shared/ui/separator';
import { Skeleton } from '../../../shared/ui/skeleton';

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
    <div
      className={className}
      {...props}
    >
      <div className="mb-3 flex justify-between text-xl font-semibold">
        <Skeleton className="h-[25px] w-[100px]" />
        <Skeleton className="h-[25px] w-[50px]" />
      </div>
      <div className="flex gap-5">
        <div className="flex flex-col gap-3">
          <Skeleton className="aspect-[3/4] h-[200px] w-[150px] rounded-md" />

          <div className="grid grid-cols-2 gap-3">
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-9 w-full" />
          </div>
        </div>
        <div className="text-muted-foreground grid h-fit gap-y-4 pr-5 text-sm">
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
