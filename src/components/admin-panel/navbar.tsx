import { ModeToggle } from "~/components/mode-toggle";
import { SheetMenu } from "~/components/admin-panel/sheet-menu";
import { APP_NAME } from "~/lib/constants";
import NavLogo from "../navigation/NavLogo";
import { ClientAuthButton } from "../navigation/ClientAuthButton";

interface NavbarProps {
  title: string;
}

export function Navbar({ title }: NavbarProps) {
  return (
    <header className="sticky top-0 z-10 w-full bg-background/95 shadow backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:shadow-secondary">
      <div className="mx-4 flex h-14 items-center sm:mx-8">
        <div className="flex items-center space-x-4 lg:space-x-0">
          <SheetMenu />
          {title === APP_NAME ? (
            <NavLogo />
          ) : (
            <h1 className="font-bold">{title}</h1>
          )}
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <div className="grid grid-cols-2 gap-2">
            <div className="col-span-1 flex items-center justify-end">
              <ModeToggle />
            </div>
            <div className="col-span-1 flex items-center justify-end">
              <ClientAuthButton />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
