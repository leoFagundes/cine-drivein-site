"use client";

import React, { ReactNode } from "react";
import RevealOnScroll from "@/components/revealOnScroll";
import { SeasonalTitleOrnament } from "@/components/seasonal/slots";

interface SectionContainerProps {
  children: ReactNode;
  title: string;
  subtitle: string;
  id?: string;
}

export default function SectionContainer({
  children,
  title,
  subtitle,
  id = "",
}: SectionContainerProps) {
  return (
    <RevealOnScroll className="flex flex-col items-center gap-8 w-full my-8 relative">
      <section id={id} className="flex flex-col items-center gap-8 w-full">
        <div className="relative flex flex-col gap-2">
          {/* <SeasonalTitleOrnament seed={title} /> */}
          <h1 className="text-primary text-center text-4xl font-semibold">
            {title}
          </h1>
          <p className="text-center font-semibold">{subtitle}</p>
        </div>
        {children}
      </section>
    </RevealOnScroll>
  );
}
