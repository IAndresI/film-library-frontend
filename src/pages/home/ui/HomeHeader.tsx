import { useEffect, useState } from 'react';
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from 'react-router-dom';

import { authApi } from '@/features/auth/api';

import { SubscriptionStatus } from '@/entities/subscription/model';
import { useUser } from '@/entities/user/providers';

import { ModeToggle } from '@/shared/components/ModeToggle';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/shared/ui/drawer';
import { SidebarTrigger } from '@/shared/ui/sidebar';
import { SvgCrown } from '@/shared/ui/svg/SvgCrown';
import { SvgLogout } from '@/shared/ui/svg/SvgLogout';

import { Button } from '../../../shared/ui/button';
import { Input } from '../../../shared/ui/input';

export const HomeHeader = () => {
  const user = useUser();

  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    const URLSearchText = searchParams.get('query');
    if (URLSearchText) {
      setSearchText(URLSearchText);
    } else {
      setSearchText('');
    }
  }, [location.search]);

  return (
    <header className="bg-background sticky top-0 z-20 flex h-[56px] justify-between border-b">
      <div className="flex items-center">
        <SidebarTrigger className="ml-4" />
      </div>
      <div className="flex items-center gap-5">
        {user.isAdmin && (
          <Button
            variant="secondary"
            asChild
          >
            <Link to="/admin">Панель администратора</Link>
          </Button>
        )}
        <Drawer
          direction="top"
          open={isOpen}
          onOpenChange={(isOpen) => setIsOpen(isOpen)}
        >
          <DrawerTrigger asChild>
            <Button
              className="flex items-center gap-2 px-5"
              variant="default"
            >
              <MagnifyingGlassIcon className="h-5 w-5" />
              Поиск
            </Button>
          </DrawerTrigger>
          <DrawerContent className="rounded-none">
            <div className="mx-auto w-full max-w-sm py-5">
              <DrawerHeader>
                <DrawerTitle className="text-center text-3xl">
                  Поиск
                </DrawerTitle>
              </DrawerHeader>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  navigate(`/search?query=${searchText}`);
                  setIsOpen(false);
                  if (!searchParams.get('query')) {
                    setSearchText('');
                  }
                }}
                className="mx-auto flex w-full max-w-[500px] items-center gap-3 pb-4"
              >
                <Input
                  type="search"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  autoFocus
                />
                <Button
                  type="submit"
                  className="flex items-center gap-2 px-2"
                  variant="default"
                >
                  <MagnifyingGlassIcon className="h-6 w-6" />
                </Button>
              </form>
            </div>
          </DrawerContent>
        </Drawer>
        <ModeToggle />

        {(!user.subscription ||
          user.subscription.subscriptionStatus === SubscriptionStatus.EXPIRED ||
          user.subscription.subscriptionStatus ===
            SubscriptionStatus.CANCELLED) && (
          <Button
            asChild
            variant="rainbow"
          >
            <Link to="/premium">Premium</Link>
          </Button>
        )}

        <Link
          to={`/profile`}
          className="ml-auto flex h-full w-fit items-center gap-3 border-l pl-5"
        >
          <div className="relative">
            {user.name}
            {user.subscription &&
              user.subscription.subscriptionStatus ===
                SubscriptionStatus.ACTIVE && (
                <div className="absolute bottom-1/2 -left-[15px] -rotate-45">
                  <SvgCrown
                    className="h-5 w-5"
                    gradient
                  />
                </div>
              )}
          </div>
        </Link>
        <Button
          variant="outline"
          className="h-full rounded-none border-0 border-l-1"
          onClick={authApi.logout}
        >
          <SvgLogout className="min-h-[30px] min-w-[20px]" />
        </Button>
      </div>
    </header>
  );
};
