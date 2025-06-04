import { Link } from "react-router-dom";
import { Button } from "../../../shared/ui/button";
import { ModeToggle } from "@/shared/components/ModeToggle";
import { SidebarTrigger } from "@/shared/ui/sidebar";
import { useUser } from "@/app/providers";

export const AdminHeader = () => {
  const user = useUser();

  return (
    <header className="flex h-[56px] justify-between">
      <div className="flex items-center">
        <SidebarTrigger className="ml-4" />
      </div>
      <div className="flex items-center gap-5">
        <Button variant="secondary" asChild>
          <Link to="/">Home</Link>
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
