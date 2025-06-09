import { cn, getImageUrl } from "@/shared/lib/utils";
import { Link } from "react-router-dom";
import type { IActor } from "@/entities/actor/dto";

interface ActorCardProps extends React.HTMLAttributes<HTMLDivElement> {
  actor: IActor;
  aspectRatio?: "portrait" | "square";
  width?: number;
  height?: number;
}

export function ActorCard({
  actor,
  aspectRatio = "portrait",
  width,
  height,
  className,
  ...props
}: ActorCardProps) {
  return (
    <div className={cn("space-y-3", className)} {...props}>
      <Link
        to={`/actors/${actor.id}`}
        className="block overflow-hidden rounded-[50%]"
      >
        <img
          src={getImageUrl(actor.image)}
          alt={actor.name}
          width={width}
          height={height}
          className={cn(
            "h-auto w-auto object-cover transition-all hover:scale-105",
            aspectRatio === "portrait" ? "aspect-[3/4]" : "aspect-square",
          )}
        />
      </Link>

      <div className="flex h-max justify-between text-sm">
        <div className="space-y-1">
          <Link to="/actors/1" className="hover:text-primary/50 transition">
            <h3 className="leading-none font-medium">{actor.name}</h3>
          </Link>
        </div>
      </div>
    </div>
  );
}
