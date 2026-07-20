"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";

const CLICKS_NEEDED = 5;
const CLICK_TIMEOUT_MS = 700;

/** Clique 5x rápido no logo para abrir a Snake escondida. */
export function useLogoEasterEgg() {
  const router = useRouter();
  const countRef = useRef(0);
  const lastClickRef = useRef(0);

  return function onLogoClick(): boolean {
    const now = Date.now();
    if (now - lastClickRef.current > CLICK_TIMEOUT_MS) {
      countRef.current = 0;
    }
    lastClickRef.current = now;
    countRef.current += 1;

    if (countRef.current >= CLICKS_NEEDED) {
      countRef.current = 0;
      router.push("/snake");
      return true;
    }
    return false;
  };
}
