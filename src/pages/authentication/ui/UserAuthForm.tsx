import * as React from "react";
import { Button } from "../../../shared/ui/button";
import { SignedOut, useClerk } from "@clerk/clerk-react";
import { SvgGmail } from "../../../shared/ui/svg/SvgGmail";
import { cn } from "@/shared/lib/helpers";

export function UserAuthForm({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const { openSignIn } = useClerk();

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
    openSignIn();
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form onSubmit={onSubmit}>
        <div className="grid gap-2">
          <SignedOut>
            <Button type="submit">
              <SvgGmail className="mr-2 h-4 w-4" /> Sign In with Gmail
            </Button>
          </SignedOut>
        </div>
      </form>
    </div>
  );
}
