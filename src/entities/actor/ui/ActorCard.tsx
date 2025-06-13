import type { IActor } from '@/entities/actor/dto';

import { Link } from 'react-router-dom';

import { cn, getImageUrl } from '@/shared/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';

interface ActorCardProps extends React.HTMLAttributes<HTMLDivElement> {
  actor: IActor;
  aspectRatio?: 'portrait' | 'square';
}

export function ActorCard({
  actor,
  aspectRatio = 'portrait',
  className,
  ...props
}: ActorCardProps) {
  return (
    <div
      className={cn('space-y-3', className)}
      {...props}
    >
      <Link
        to={`/actors/${actor.id}`}
        className="flex justify-center overflow-hidden rounded-[50%]"
      >
        <Avatar
          className={cn(
            'h-full w-full object-cover transition-all hover:scale-105',
            aspectRatio === 'portrait' ? 'aspect-[3/4]' : 'aspect-square'
          )}
        >
          <AvatarImage
            alt={actor.name}
            src={getImageUrl(actor.image)}
          />
          <AvatarFallback className="text-center text-[40px] uppercase">
            {actor.name.slice(0, 2)}
          </AvatarFallback>
        </Avatar>
      </Link>

      <div className="flex h-max justify-between text-sm">
        <div className="w-full space-y-1">
          <Link
            to="/actors/1"
            className="hover:text-primary/50 block text-center leading-none font-medium transition"
          >
            {actor.name}
          </Link>
          <p className="text-muted-foreground text-center text-xs">
            {actor.role}
          </p>
        </div>
      </div>
    </div>
  );
}
