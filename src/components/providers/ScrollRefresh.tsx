"use client";

import { useEffect } from "react";
import { ScrollTrigger } from "@/lib/gsap";

/** Rendered last: once every chapter has created its pins, order and measure them. */
export function ScrollRefresh() {
  useEffect(() => {
    ScrollTrigger.sort();
    ScrollTrigger.refresh();
  }, []);
  return null;
}
