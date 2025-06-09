import { cn } from "@/shared/lib/utils";
import { Skeleton } from "../../../shared/ui/skeleton";

export function FilmSkeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("space-y-3")} {...props}>
      <Skeleton className={cn(className)} />
      <div className="flex h-max justify-between text-sm">
        <div className="space-y-1">
          <Skeleton className="h-3 w-20" />

          <Skeleton className="h-3 w-16" />
        </div>
        <Skeleton className="h-3 w-6" />
      </div>
    </div>
  );
}
