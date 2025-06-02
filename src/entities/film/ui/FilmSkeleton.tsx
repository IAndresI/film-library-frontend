import { cn } from "@/shared/lib/helpers";
import { Skeleton } from "../../../shared/ui/skeleton";

export function FilmSkeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("space-y-3")} {...props}>
      <Skeleton className={cn(className)} />
      <div className="flex justify-between text-sm h-max">
        <div className="space-y-1">
          <Skeleton className="w-20 h-3" />

          <Skeleton className="w-16 h-3" />
        </div>
        <Skeleton className="w-6 h-3" />
      </div>
    </div>
  );
}
