import { Link, NavLink, useLocation } from "react-router-dom";
import { BookmarkIcon } from "@radix-ui/react-icons";
import { SvgActor } from "../../../shared/ui/svg/SvgActor";
import { SvgReview } from "../../../shared/ui/svg/SvgReview";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/shared/ui/sidebar";
import { SvgLogo } from "@/shared/ui/svg/SvgLogo";
import { useQuery } from "@tanstack/react-query";
import { filmApi } from "@/entities/film/api/filmApi";
import { SvgCrown } from "@/shared/ui/svg/SvgCrown";
import { SvgUser } from "@/shared/ui/svg/SvgUser";
import { FilmIcon } from "lucide-react";
import { ScrollArea } from "@/shared/ui/scroll-area";
import { SvgFire } from "@/shared/ui/svg/SvgFire";

const library = [
  // {
  //   label: "New",
  //   link: "/films/new",
  //   icon: <SvgFire className="w-4 h-4 mr-2" />,
  // },
  {
    label: "Избранное",
    link: "/favorites",
    icon: <BookmarkIcon className="mr-2 h-4 w-4" />,
  },
  {
    label: "Актеры",
    link: "/actors",
    icon: <SvgActor className="mr-2 h-4 w-4" />,
  },
  {
    label: "Мои отзывы",
    link: "/reviews",
    icon: <SvgReview className="mr-2 h-4 w-4" />,
  },
  {
    label: "Профиль",
    link: "/profile",
    icon: <SvgUser className="mr-2 h-4 w-4" />,
  },
  {
    label: "Мои фильмы",
    link: "/my-films",
    icon: <SvgFire className="mr-2 h-4 w-4" />,
  },
  {
    label: "Premium",
    link: "/premium",
    icon: <SvgCrown gradient className="mr-2 h-4 w-4" />,
  },
];

export function HomeSidebar() {
  const { open } = useSidebar();
  const location = useLocation();

  const { data } = useQuery(filmApi.getAllGenresQueryOptions());

  return (
    <Sidebar collapsible="icon">
      <ScrollArea>
        <SidebarContent>
          <SidebarHeader className={!open ? "px-0" : "px-4"}>
            <Link to="/" className={!open ? "pr-0 pl-1" : ""}>
              <SvgLogo className="h-10 w-10" />
            </Link>
          </SidebarHeader>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    isActive={location.pathname === `/`}
                    asChild
                  >
                    <NavLink
                      to={`/`}
                      className={({ isActive }) =>
                        `hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring inline-flex h-9 w-full items-center justify-start rounded-md px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 ${isActive ? "bg-accent text-accent-foreground" : ""}`
                      }
                    >
                      <span className="">
                        <FilmIcon className="mr-2 h-4 w-4" />
                      </span>
                      <span>Главная</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarGroup>
            <SidebarGroupLabel className="mb-2 px-4 text-lg font-semibold tracking-tight">
              Ваши данные
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {library.map((lib) => (
                  <SidebarMenuItem key={lib.label}>
                    <SidebarMenuButton
                      isActive={location.pathname.includes(lib.link)}
                      asChild
                    >
                      <NavLink
                        to={lib.link}
                        className={({ isActive }) =>
                          `hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring inline-flex h-9 w-full items-center justify-start rounded-md px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 ${isActive ? "bg-accent text-accent-foreground" : ""}`
                        }
                      >
                        {lib.icon}
                        {lib.label}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarGroup>
            <SidebarGroupLabel className="mb-2 px-4 text-lg font-semibold tracking-tight">
              Фильмы
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    isActive={location.pathname === `/films`}
                    asChild
                  >
                    <NavLink
                      to={`/films`}
                      className={({ isActive }) =>
                        `hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring inline-flex h-9 w-full items-center justify-start rounded-md px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 ${isActive ? "bg-accent text-accent-foreground" : ""}`
                      }
                    >
                      <span className="">
                        <FilmIcon className="mr-2 h-4 w-4" />
                      </span>
                      <span>Все фильмы</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                {data?.map((genre) => (
                  <SidebarMenuItem key={genre.id}>
                    <SidebarMenuButton
                      isActive={
                        location.pathname === `/films/genres/${genre.id}`
                      }
                      asChild
                    >
                      <NavLink
                        to={`/films/genres/${genre.id}`}
                        className={({ isActive }) =>
                          `hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring inline-flex h-9 w-full items-center justify-start rounded-md px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 ${isActive ? "bg-accent text-accent-foreground" : ""}`
                        }
                      >
                        <span className="mr-2">{genre.icon}</span>
                        <span>{genre.name}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </ScrollArea>
    </Sidebar>
  );
}
