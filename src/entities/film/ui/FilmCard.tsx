import { BookmarkFilledIcon, StarFilledIcon } from "@radix-ui/react-icons";

import { cn, getImageUrl } from "@/shared/lib/utils";

import { Link } from "react-router-dom";
import type { IFilm } from "@/entities/film/dto";
import { BookmarkIcon } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { useFavoritesActions } from "@/features/favoriteFilmActions/lib/hooks";

interface FilmCardProps extends React.HTMLAttributes<HTMLDivElement> {
  film: IFilm;
  aspectRatio?: "portrait" | "square";
  width?: number;
  height?: number;
}

export function FilmCard({
  film,
  aspectRatio = "portrait",
  width,
  height,
  className,
  ...props
}: FilmCardProps) {
  const { isInFavorite, toggleFavorite } = useFavoritesActions(film.id);

  return (
    <div className={cn("h-full space-y-3", className)} {...props}>
      <div className="relative block overflow-hidden rounded-md">
        <Button
          className="absolute top-2 right-2 z-10 h-10 w-9 p-0 px-4"
          onClick={toggleFavorite}
          variant="outline"
        >
          {isInFavorite ? <BookmarkFilledIcon /> : <BookmarkIcon />}
        </Button>
        <Link
          to={`/film/${film.id}`}
          className="block overflow-hidden rounded-md"
        >
          <img
            src={getImageUrl(film.image)}
            alt={film.name}
            width={width}
            height={height}
            className={cn(
              "h-auto w-auto object-cover transition-all hover:scale-105",
              aspectRatio === "portrait"
                ? "aspect-[3/4] max-h-[333px]"
                : "aspect-square",
            )}
          />
        </Link>
      </div>

      <div className="flex justify-between text-sm">
        <div className="w-full">
          <div className="flex justify-between gap-1 text-sm">
            <Link
              to="/film/1"
              className="hover:text-primary/50 flex items-center overflow-hidden transition"
            >
              <h3 className="truncate font-medium">{film.name}</h3>
            </Link>
            {film.rating && (
              <div className="flex h-fit w-8 items-center gap-1">
                <StarFilledIcon className="text-yellow-500" /> {film.rating}
              </div>
            )}
          </div>

          <p className="text-muted-foreground text-xs">
            {new Date(film.releaseDate || "").getFullYear()},{" "}
            <ul className="inline">
              {film.genres.map((genre, i, arr) => (
                <Link
                  to={`/films/genres/${genre.id}`}
                  className="hover:text-primary transition"
                >
                  {genre.name} {i !== arr.length - 1 && ", "}
                </Link>
              ))}
            </ul>
          </p>
        </div>
      </div>
    </div>
  );
}
