import { Link, NavLink, useLocation } from "react-router-dom";

import { BookmarkIcon } from "@radix-ui/react-icons";
import { SvgFire } from "../../../shared/ui/svg/SvgFire";
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
import { SvgLoupe } from "@/shared/ui/svg/SvgLoupe";

const films = [
  {
    label: "Обзоры",
    link: "/admin",
    icon: <SvgLoupe className="mr-2 h-4 w-4" />,
    index: true,
  },
  {
    label: "Фильмы",
    link: "/admin/films",
    icon: <SvgFire className="mr-2 h-4 w-4" />,
  },
  {
    label: "Пользователи",
    link: "/admin/users",
    icon: <BookmarkIcon className="mr-2 h-4 w-4" />,
  },
  {
    label: "Актеры",
    link: "/admin/actors",
    icon: <SvgActor className="mr-2 h-4 w-4" />,
  },
  {
    label: "Отзывы",
    link: "/admin/reviews",
    icon: <SvgReview className="mr-2 h-4 w-4" />,
  },
];

export function AdminSidebar() {
  const { open } = useSidebar();
  const location = useLocation();

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarHeader className={!open ? "px-0" : "px-4"}>
          <Link to="/admin" className={!open ? "pr-0 pl-1" : ""}>
            <SvgLogo className="h-10 w-10" />
          </Link>
        </SidebarHeader>
        <SidebarGroup>
          <SidebarGroupLabel className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Данные
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {films.map((lib) => (
                <SidebarMenuItem key={lib.label}>
                  <SidebarMenuButton
                    isActive={
                      lib.index
                        ? location.pathname === lib.link
                        : location.pathname.includes(lib.link)
                    }
                    asChild
                  >
                    <NavLink
                      to={lib.link}
                      className="hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring inline-flex h-9 w-full items-center justify-start rounded-md px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
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
      </SidebarContent>
    </Sidebar>
  );
}
