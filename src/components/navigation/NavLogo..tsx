import Link from "next/link";
import { APP_NAME } from "~/lib/constants";
import Logo from "../brand/Logo";

export default function NavLogo() {
  return (
    <Link className="flex flex-row gap-2 font-semibold" href="/">
      <Logo fill="hsl(var(--primary))" size="30" />
      <div className="hidden flex-row gap-1 text-2xl md:flex">
        <div>{APP_NAME}</div>
        <div className="text-top justify-start self-start text-xs">[BETA]</div>
      </div>
    </Link>
  );
}
