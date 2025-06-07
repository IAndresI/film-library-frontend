import { Link, NavLink, useLocation } from "react-router-dom";
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
import { SvgUndeReview } from "@/shared/ui/svg/SvgUndeReview";
import { SvgUsers } from "@/shared/ui/svg/SvgUsers";

const links = [
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
    icon: <SvgUsers className="mr-2 h-4 w-4" />,
  },
  {
    label: "Актеры",
    link: "/admin/actors",
    icon: <SvgActor className="mr-2 h-4 w-4" />,
  },
  {
    label: "Все отзывы",
    link: "/admin/reviews",
    icon: <SvgReview className="mr-2 h-4 w-4" />,
    index: true,
  },
  {
    label: "Отзывы на модерации",
    link: "/admin/reviews/on-approve",
    icon: <SvgUndeReview className="mr-2 h-4 w-4" />,
    index: true,
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
              {links.map((link) => (
                <SidebarMenuItem key={link.label}>
                  <SidebarMenuButton
                    isActive={
                      link.index
                        ? location.pathname === link.link
                        : location.pathname.includes(link.link)
                    }
                    asChild
                  >
                    <NavLink
                      to={link.link}
                      className="hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring inline-flex h-9 w-full items-center justify-start rounded-md px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
                    >
                      {link.icon}
                      {link.label}
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
