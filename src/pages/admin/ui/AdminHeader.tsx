import { Link } from 'react-router-dom';

import { useUser } from '@/entities/user/providers';

import { ModeToggle } from '@/shared/components/ModeToggle';
import { SidebarTrigger } from '@/shared/ui/sidebar';

import { Button } from '../../../shared/ui/button';

export const AdminHeader = () => {
  const user = useUser();

  return (
    <header className="bg-background sticky top-0 z-10 flex h-[56px] justify-between border-b">
      <div className="flex items-center">
        <SidebarTrigger className="ml-4" />
      </div>
      <div className="flex items-center gap-5">
        <Button
          variant="secondary"
          asChild
        >
          <Link to="/">Пользовательский режим</Link>
        </Button>
        <ModeToggle />
        {user && (
          <div className="ml-auto flex h-full w-fit items-center gap-3 border-l px-5">
            <div>{user?.name}</div>
          </div>
        )}
      </div>
    </header>
  );
};
