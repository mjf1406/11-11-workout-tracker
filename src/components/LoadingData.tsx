"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { LOADING_MESSAGES } from "~/lib/constants";

export default function LoadingData() {
  const [randomMessage, setRandomMessage] = useState("Loading...");

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * LOADING_MESSAGES.length);
    setRandomMessage(LOADING_MESSAGES[randomIndex] ?? "Loading data...");
  }, []);

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <Loader2 className="h-20 w-20 animate-spin" />
      <div className="mt-4 max-w-md text-center text-2xl">{randomMessage}</div>
    </div>
  );
}
