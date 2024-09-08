"use client";

import dynamic from "next/dynamic";
import { Button } from "../ui/button";
import Link from "next/link";
import { useMemo } from "react";

const SignedIn = dynamic(
  () => import("@clerk/nextjs").then((mod) => mod.SignedIn),
  { ssr: false },
);
const SignedOut = dynamic(
  () => import("@clerk/nextjs").then((mod) => mod.SignedOut),
  { ssr: false },
);
const UserButton = dynamic(
  () => import("@clerk/nextjs").then((mod) => mod.UserButton),
  { ssr: false },
);

export function ClientAuthButton() {
  const memoizedContent = useMemo(
    () => (
      <>
        <SignedIn>
          <UserButton />
        </SignedIn>
        <SignedOut>
          <Button asChild>
            <Link href="/auth/sign-in">Sign in</Link>
          </Button>
        </SignedOut>
      </>
    ),
    [],
  );

  return memoizedContent;
}
