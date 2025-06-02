import { SignedIn, UserButton, useUser } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import { Button } from "../../../shared/ui/button";
import { ModeToggle } from "@/shared/components/ModeToggle";
import { SidebarTrigger } from "@/shared/ui/sidebar";

export const AdminHeader = () => {
  const { user } = useUser();

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
        <SignedIn>
          <div className="ml-auto flex h-full w-fit items-center gap-3 border-l px-5">
            <UserButton />
            <div>{`${user?.firstName} ${user?.lastName}`}</div>
          </div>
        </SignedIn>
      </div>
    </header>
  );
};
