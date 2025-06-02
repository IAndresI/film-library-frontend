import { cn } from "@/shared/lib/helpers";
import { Skeleton } from "../../../shared/ui/skeleton";

export function ActorSkeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("space-y-3")} {...props}>
      <Skeleton className={cn("rounded-[50%]", className)} />

      <Skeleton className="w-20 h-3" />
    </div>
  );
}
